# Contact Form — Cloudflare Setup

The contact form submits to `/api/contact`, handled by a **Cloudflare Pages Function**.

## Quick setup checklist

1. Deploy the site on Cloudflare Pages
2. Add **Turnstile** keys (free spam protection)
3. Add **Resend** API key (free email delivery — Email Sending requires Workers Paid)
4. Redeploy and test

> **Important:** Cloudflare Pages does **not** support `send_email` in `wrangler.toml`. Do not add it back — the build will fail.

## Cloudflare Pages build settings

| Setting | Value |
|---------|-------|
| Framework preset | None |
| Build command | `npm run build` *(or leave empty)* |
| Build output directory | `/` |
| Node.js version | 18 or 20 |

## 1. Cloudflare Turnstile (free captcha)

1. Cloudflare dashboard → **Turnstile** → **Add widget**
2. Widget mode: **Managed** (recommended)
3. Domains: `panthra.ca` and `localhost`
4. Copy the **Site Key** and **Secret Key**

Add to **Pages → Settings → Environment variables**:

| Variable | Type |
|----------|------|
| `TURNSTILE_SITE_KEY` | Plaintext |
| `TURNSTILE_SECRET_KEY` | Secret |

The site key is served to the browser via `/api/config`. The secret is verified server-side on every submission.

## 2. Email delivery via Resend (free tier)

Cloudflare Email Sending requires **Workers Paid**. Use Resend instead:

1. Sign up at [resend.com](https://resend.com)
2. Add and verify **`panthra.ca`** (DNS records in Cloudflare)
3. Create an API key

Add to Pages environment variables:

| Variable | Type | Value |
|----------|------|-------|
| `RESEND_API_KEY` | Secret | your `re_...` key |
| `CONTACT_TO_EMAIL` | Plaintext | `contact@panthra.ca` |
| `CONTACT_FROM_EMAIL` | Plaintext | `PANTHRA <noreply@panthra.ca>` |

## 3. Redeploy

After adding environment variables, trigger a new deployment so the functions pick them up.

## Local testing

```bash
npm install -g wrangler
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your keys
npx wrangler pages dev .
```

Submit the form at `http://localhost:8788/contact.html`.

## Custom overrides

```html
<script>
  window.PANTHRA_CONTACT_ENDPOINT = '/api/contact';
  window.PANTHRA_TURNSTILE_SITE_KEY = 'your_site_key';
</script>
```
