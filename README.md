# Viventi 🌿
**Regalos vivos que perduran.**

E-commerce for Viventi plant arrangements — built with vanilla HTML/CSS/JS and Netlify Functions for MercadoPago payment processing.

---

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML, CSS, JavaScript (single-file SPA) |
| Backend | Netlify Functions (serverless Node.js) |
| Payments | MercadoPago API |
| Hosting | Netlify |

---

## Project Structure
```
viventi/
├── index.html                    # Full frontend SPA
├── netlify.toml                  # Netlify build + redirect config
├── package.json                  # Node dependencies
├── .env                          # Local secrets (git ignored)
├── .env.example                  # Env variable template (committed)
├── .gitignore
├── README.md
└── netlify/
    └── functions/
        └── process_payment.js    # MercadoPago payment handler
```

---

## Local Development Setup

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **npm** (comes with Node)
- **Netlify CLI** (installed via npm below)

### 1. Clone the repo
```bash
git clone https://github.com/isabelamoralesd-dot/viventi.git
cd viventi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in your MercadoPago credentials:
```env
MP_PUBLIC_KEY=your_public_key_here
MP_ACCESS_TOKEN=your_access_token_here
```
Get credentials at: https://mercadopago.com.mx/developers/panel/credentials

### 4. Run locally
```bash
npm run dev
```
Opens at **http://localhost:8888** with Netlify Functions active.

---

## Environment Variables

| Variable | Where used | Description |
|----------|-----------|-------------|
| `MP_PUBLIC_KEY` | Frontend (index.html) | MercadoPago public key — safe to expose |
| `MP_ACCESS_TOKEN` | `process_payment.js` | MercadoPago secret key — **never expose** |

> ⚠️ `.env` is git-ignored. Never commit real credentials.

---

## Payment Flow
```
Customer clicks "Pagar con tarjeta"
        ↓
MercadoPago CardForm renders (uses MP_PUBLIC_KEY)
        ↓
Card tokenized client-side (raw card data never hits our server)
        ↓
POST /process_payment  →  Netlify Function
        ↓
Function calls MP API with MP_ACCESS_TOKEN
        ↓
Payment result returned → success/error shown to user
```

---

## Deployment

### Netlify (Production)
1. Push to GitHub
2. Connect repo in Netlify dashboard → **Add new site → Import from Git**
3. Add environment variables in **Site configuration → Environment variables**:
   - `MP_PUBLIC_KEY`
   - `MP_ACCESS_TOKEN`
4. Deploy — auto-deploys on every push to `main` ✅

### Manual Deploy
Drag the entire project folder to Netlify deploy zone at **app.netlify.com**.

---

## Key Files

### `index.html`
Single-page app with all frontend logic:
- Product catalog with filtering
- Cart drawer
- MercadoPago CardForm integration
- WhatsApp order integration
- Fully responsive (mobile-first)

### `netlify/functions/process_payment.js`
Serverless function that:
- Receives tokenized card data from frontend
- Calls MercadoPago `/v1/payments` API
- Returns payment status to frontend

### `netlify.toml`
```toml
[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/process_payment"
  to = "/.netlify/functions/process_payment"
  status = 200
```

---

## Contact
- **Instagram:** [@viventi.mx](https://www.instagram.com/viventi.mx/)
- **WhatsApp:** [81 2206 5292](https://wa.me/5218122065292)
- **Website:** detallesviventi.com
