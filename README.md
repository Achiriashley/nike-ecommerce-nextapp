# AshKicks

A sneaker storefront built with Next.js (App Router), Clerk, MongoDB and Tailwind CSS.

## Features

**Storefront**
- Home page with search, category tiles, trending and sale rails, a product spotlight and recently viewed items
- Shop page with search, filters (gender, category, price, size, sale) kept in the URL, sorting and a mobile filter sheet
- Product pages with an image gallery (swipeable on mobile), colourway switcher, size picker, stock badges, sharing and related products
- Customer reviews (signed-in Clerk users can write, edit and delete one review per product)
- Bag with sizes, quantities, free-delivery progress and live re-pricing; slide-out bag drawer
- Wishlist and recently viewed history, saved in the browser
- Guest checkout with a delivery details form (name, phone, city, neighbourhood/landmark, notes), remembered in the browser and prefilled for signed-in customers
- Checkout with mobile money (Campay for MTN/Orange, or PayUnit) or optional crypto (Coinbase, hidden by default); totals are calculated on the server and Campay payments are confirmed automatically
- Order confirmation emails to customers and new-order alerts to the store (Gmail or any SMTP)
- Account page with order history for signed-in customers
- Newsletter sign-up, help centre with FAQ and contact form (EmailJS)

**Admin** (`/admin/login`)
- Overview of revenue, orders, products, subscribers, low stock and top-rated products
- Create, edit and delete products (image upload or URL), and import the starter catalog
- Order list with delivery details (who, where, phone) and status updates (pending → paid → shipped → delivered / cancelled)
- Newsletter subscribers

## Getting started

```bash
npm install
npm run dev
```

Create `.env.local`:

```bash
MONGO_DB=mongodb+srv://...                # MongoDB connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...  # Clerk
CLERK_SECRET_KEY=sk_...

# Admin dashboard (required: admin sign-in is disabled until all three are set)
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-strong-password
ADMIN_SESSION_SECRET=a-long-random-string

# Payments
SITE_URL=https://your-store.example.com # public HTTPS address; payment providers send shoppers back here
NEXT_PUBLIC_CRYPTO_PAYMENTS=off           # "on" shows "Pay with crypto" (needs a Coinbase key; see below)
COINBASE_API_KEY=...                      # NEXT_PUBLIC_COINBASE_API_KEY is also accepted
CAMPAY_USERNAME=...                       # Campay app API username + password (or CAMPAY_TOKEN)
CAMPAY_PASSWORD=...                       # When set, "Pay with mobile money" uses Campay (MTN + Orange)
CAMPAY_MODE=demo                          # demo (test payments capped at 25 XAF) or live
PAYUNIT_API_KEY=...                       # PayUnit falls back to the original sandbox credentials
PAYUNIT_API_USER=...
PAYUNIT_API_PASSWORD=...
PAYUNIT_MODE=test

# Order emails (optional; without these no emails are sent)
SMTP_USER=yourstore@gmail.com             # Gmail address that sends the emails
SMTP_PASS=abcd efgh ijkl mnop             # Gmail app password (not your normal password)
ORDER_NOTIFY_EMAIL=you@example.com        # where "new paid order" alerts go (defaults to ADMIN_EMAIL)
# SMTP_HOST=smtp.gmail.com SMTP_PORT=465 MAIL_FROM="AshKicks <orders@your-domain>"  # other providers
```

### Products

Until MongoDB has products, the store shows the 24-product starter catalog in `src/data/catalog.js`.
Import it into the database from the admin dashboard (**Import starter catalog**) or with:

```bash
npm run seed
```

Once the database has products, the store shows only those, and they can be managed from the admin dashboard.

### Crypto payments

The crypto checkout is hidden by default. It was built for Coinbase Commerce, which closed on
31 March 2026; its replacement, Coinbase Business, only onboards merchants registered in the
US or Singapore, and the checkout would need updating to Coinbase Business's Checkouts API.

### Campay webhook

In the Campay dashboard, set the webhook URL to `https://<your-site>/api/payment/campay/webhook`.
Orders are marked paid after the app confirms the payment with Campay's API (on the webhook,
when the shopper returns to the success page, and when they open their account page).

### Order emails

When an order is paid, the customer gets a confirmation email (if they gave an email address or were
signed in) and the store inbox gets a "new paid order" alert with the delivery details. Each order is
emailed once. When an admin marks an order paid by hand, only the customer is emailed.

With Gmail: turn on 2-Step Verification, create an app password at
https://myaccount.google.com/apppasswords, and use it as `SMTP_PASS`.

### Store settings

All prices are in FCFA (XAF). Delivery threshold, flat delivery fee, return window and the store name live in `src/config/store.js`.

If your database still has products priced in US dollars (imported before the switch to FCFA), convert them once:

```bash
npm run prices:fcfa            # preview
npm run prices:fcfa -- --apply # save (uses 600 FCFA per dollar; set USD_TO_FCFA to change)
```
