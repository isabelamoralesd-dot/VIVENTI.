# Viventi 🌿

**Regalos vivos que perduran.**

This is the website for **Viventi** — an online store that sells living plant
arrangements as gifts. Visitors can browse the catalog, add items to a cart,
and either pay by card or send their order through WhatsApp.

This file explains the whole project in plain language. **You do not need to
be a programmer to maintain this site.**

---

## 👋 Start here — how you'll work on this site

You'll make changes to this website with the help of **Claude**, an AI coding
assistant. The way it works:

1. **You describe** — in plain Spanish or English — what you want changed
   (for example: *"add a new product"*, *"change the WhatsApp number"*,
   *"make the header green"*).
2. **Claude finds the right spot** in the code and makes the change.
3. **You preview it**, and when you're happy, the change goes live.

So your real job is to **describe clearly what you want** and to **preview and
approve** changes. This README gives you (and Claude) the background needed to
do that well.

---

## 🗂️ What's in this project

The project is a folder of files. Here's what each one does:

| File / folder | What it is | Will you touch it? |
|---|---|---|
| `index.html` | The **entire website** — every page, picture, product, color, and button lives in this one big file. | This is where most changes happen. Ask Claude. |
| `netlify/functions/process_payment.js` | The **card payment handler**. When a customer pays by card, this code talks to MercadoPago to charge it. | Rarely — only for payment-related changes. |
| `netlify.toml` | A small **settings file** that tells the hosting service how to run the site. | Almost never. |
| `package.json` | A list of **helper tools** the project uses. | Almost never. |
| `.env` | Your **private keys** for MercadoPago. **Never share this file or post it anywhere.** | Only if your MercadoPago keys change. |
| `.env.example` | A **blank template** showing which keys go in `.env` (no real values). Safe to share. | No. |
| `.gitignore` | A list of files that must **stay private** and never be uploaded. `.env` is on this list on purpose. | No. |
| `README.md` | This file. | Update it when something important changes. |

> If you see a `node_modules` folder, ignore it — it's just downloaded helper
> tools, created automatically.

---

## 🔑 The `.env` file — your private keys

To charge cards, the site needs a secret key from MercadoPago (think of it like
the password to your payment account). That secret lives in a file called
`.env`.

**Two important rules:**

1. **Never share the `.env` file.** Don't email it, paste it into chats, or
   upload it. It's already set up to stay off the internet (it's listed in
   `.gitignore`).
2. **The real key must also be entered in Netlify** (the hosting service) for
   the *live* website to work — see "Putting changes online" below. The `.env`
   file only works on your own computer.

What's inside `.env` — just one line:

| Key | What it's for |
|---|---|
| `MP_ACCESS_TOKEN` | The **secret** key — it charges cards. This is the only thing `.env` holds, and the only true secret. |

> The MercadoPago **public** key isn't in `.env`. It's safe to expose and lives
> directly in `index.html` — nothing needs to be done with it.

Get this key from your MercadoPago account:
https://mercadopago.com.mx/developers/panel/credentials

### Test keys vs. production keys

MercadoPago gives you **two sets** of credentials: *test* (fake payments, for
previewing) and *production* (real money, for the live site). The two halves
must match — never mix test and production.

- **Your computer (`.env`):** use the **test** access token.
- **The live site (Netlify dashboard):** use the **production** access token.

The matching public key is handled for you automatically — `index.html` uses
the test public key when running on `localhost`, and the production one on the
live site.

### If something ever says a key is "missing"

The normal way to run this site (see below) loads your keys automatically. But
if you (or Claude) ever run it a different way and see an error like
*"MP_ACCESS_TOKEN is not set"*, just tell Claude:

> *"Re-add the dotenv dependency and load it in process_payment.js."*

Claude will know what to do. Under normal use, you won't hit this.

---

## 💻 Previewing the site on your own computer

Before changes go live, you can preview them privately on your own computer.

### One-time setup

1. Install **Node.js** — a free program. Download it from
   https://nodejs.org and choose the version labeled **"LTS"**.
2. Open the **Terminal** app, in the project folder. *(If you're not sure how,
   just ask Claude — it can do these steps for you.)*
3. Install the helper tools (only needed the first time):
   ```
   npm install
   ```
4. Make sure your `.env` file exists and has your real MercadoPago key. If it
   doesn't exist yet, create it from the template:
   ```
   cp .env.example .env
   ```
   then open `.env` and fill in your keys.

### Every time you want to preview

```
npm run dev
```

This starts the site on your computer. Open your web browser and go to:

**http://localhost:8888**

You'll see the site exactly as visitors would. When you're done, go back to the
Terminal and press `Ctrl + C` to stop it.

---

## 🌍 Putting changes online (deploying)

The live website is hosted by a service called **Netlify**. The good news:
**you never manually "upload" anything.**

Here's the flow:

1. Changes are saved to **GitHub** (online storage for the code) — Claude can
   do this for you when you ask.
2. Netlify automatically notices and **updates the live site within a minute
   or two.**

### One-time Netlify setup (if not done yet)

1. Go to https://app.netlify.com and sign in.
2. Choose **Add new site → Import from Git** and pick this project.
3. Under **Site configuration → Environment variables**, add your MercadoPago
   secret key:
   - `MP_ACCESS_TOKEN`

   This is the *"real key in Netlify"* step mentioned earlier — the live site
   reads it from here, not from `.env`.

After that, every saved change deploys automatically.

---

## 💳 How card payments work (the simple version)

```
Customer clicks "Pagar con tarjeta"
        ↓
A secure card form appears (provided by MercadoPago)
        ↓
The card details go straight to MercadoPago —
they never touch our website or our code
        ↓
MercadoPago gives us a safe, one-time "token"
        ↓
Our payment handler (process_payment.js) uses that token
to charge the card through MercadoPago
        ↓
The customer sees "payment approved" or "there was a problem"
```

The key safety point: **real card numbers never pass through our code** —
MercadoPago handles that part.

Customers can also skip card payment and **order through WhatsApp**, which just
opens a pre-filled WhatsApp message.

---

## 🆘 Common things you might want to change

Just describe these to Claude in plain words:

- *"Add a new product to the catalog"* — give the name, price, photo, and category.
- *"Change a product's price or photo."*
- *"Update the WhatsApp number."* (currently 81 2206 5292)
- *"Update the Instagram link."*
- *"Change the colors, fonts, or text on the site."*
- *"Fix something that looks broken on a phone."*

The more specific you are — which product, what new value, which page — the
better the result.

---

## 📞 Contact & links

- **Instagram:** [@viventi.mx](https://www.instagram.com/viventi.mx/)
- **WhatsApp:** [81 2206 5292](https://wa.me/5218122065292)
- **Website:** detallesviventi.com
- **MercadoPago dashboard:** https://mercadopago.com.mx/developers/panel
- **Hosting (Netlify):** https://app.netlify.com

---

## 🔧 Technical reference (for developers)

For anyone with a coding background:

- **Frontend:** single-file vanilla HTML/CSS/JS — everything is in `index.html`.
  The MercadoPago public key is selected at runtime by hostname — the `TEST-`
  key on `localhost`, the `APP_USR-` production key everywhere else (top of the
  main `<script>` block).
- **Backend:** one Netlify Function, `netlify/functions/process_payment.js`,
  using native `fetch` (Node 18+). No runtime dependencies.
- **Payments:** MercadoPago **Checkout API — Orders** endpoint
  (`POST /v1/orders`), automatic processing mode. The function normalizes the
  Orders status (`processed` → `approved`) so the frontend's existing check
  keeps working. The frontend sends `payment_method_type` (credit/debit),
  detected via the CardForm's `onPaymentMethodsReceived` callback.
- **Routing:** `netlify.toml` redirects `/process_payment` →
  `/.netlify/functions/process_payment`.
- **Local dev:** `netlify dev` (via `npm run dev`) on port 8888 — it auto-loads
  `.env`.
- **Deploy:** auto-deploys from the `main` branch on Netlify.
