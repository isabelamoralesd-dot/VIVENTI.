// MercadoPago payment handler — receives a client-side card token from
// index.html's CardForm and creates the payment via the MercadoPago
// Checkout API "Orders" endpoint in automatic mode (single-step processing).
//
// Request body (POST, JSON) sent by the frontend — unchanged from the
// CardForm payload in index.html:
//   { token, issuer_id, payment_method_id, transaction_amount,
//     installments, description, payer: { email, identification: { type, number } } }
//
// Response: { id, order_id, status, status_detail }
// `status` is normalized back to the Payments-API vocabulary
// ('approved' | 'pending' | 'rejected') so index.html keeps working unchanged.

const MP_ORDERS_URL = 'https://api.mercadopago.com/v1/orders';

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

// The Orders API uses status 'processed'/'created'/'failed'/... — index.html
// only understands the Payments-API 'approved'/'pending'/'rejected', so map it.
const normalizeStatus = (orderStatus) => {
  switch (orderStatus) {
    case 'processed':
      return 'approved';
    case 'created':
    case 'action_required':
      return 'pending';
    default: // failed, canceled, etc.
      return 'rejected';
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { status: 'error', message: 'Method not allowed' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('MP_ACCESS_TOKEN is not set');
    return json(500, { status: 'error', message: 'Server misconfigured' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { status: 'error', message: 'Invalid JSON body' });
  }

  const {
    token,
    issuer_id,
    payment_method_id,
    payment_method_type, // optional — index.html's CardForm doesn't send it yet
    transaction_amount,
    installments,
    description,
    payer,
  } = payload;

  // Minimal validation — the Orders API will surface anything else as a list of errors.
  if (!token || !payment_method_id || !payer?.email) {
    return json(400, { status: 'error', message: 'Missing required payment fields' });
  }
  if (!Number.isFinite(transaction_amount) || transaction_amount <= 0) {
    return json(400, { status: 'error', message: 'Invalid transaction_amount' });
  }

  // Orders API expects amounts as strings with 2 decimals (e.g. "1000.00").
  const amount = Number(transaction_amount).toFixed(2);

  const paymentMethod = {
    id: payment_method_id,
    // The CardForm payload has no card type; default to credit_card.
    // Pass `payment_method_type: 'debit_card'` from the frontend for debit cards.
    type: payment_method_type || 'credit_card',
    token,
    installments: installments || 1,
  };
  // issuer_id isn't in the basic docs example but is accepted, and matters
  // for cards where the issuer is ambiguous — include it only when present.
  if (issuer_id) paymentMethod.issuer_id = issuer_id;

  const orderBody = {
    type: 'online',
    processing_mode: 'automatic',
    external_reference: `viventi-${crypto.randomUUID()}`,
    total_amount: amount,
    description,
    payer: { email: payer.email },
    transactions: {
      payments: [{ amount, payment_method: paymentMethod }],
    },
  };

  try {
    const mpResponse = await fetch(MP_ORDERS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        // Prevents a retried request from charging the customer twice.
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(orderBody),
    });

    const result = await mpResponse.json();

    if (!mpResponse.ok) {
      // Log the full error server-side; never echo credentials/internals to the client.
      console.error('MercadoPago Orders API error:', mpResponse.status, result);
      return json(mpResponse.status, {
        status: 'error',
        message: result.message || 'Payment could not be processed',
      });
    }

    // In automatic mode the order comes back already processed.
    const payment = result.transactions?.payments?.[0];
    return json(200, {
      id: payment?.id || result.id,
      order_id: result.id,
      status: normalizeStatus(result.status),
      status_detail: result.status_detail,
    });
  } catch (err) {
    console.error('process_payment failed:', err);
    return json(502, { status: 'error', message: 'Payment provider unreachable' });
  }
};
