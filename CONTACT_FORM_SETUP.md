# Contact Form — Cloudflare Setup

The contact form submits to `/api/contact`, handled by a **Cloudflare Pages Function**.

## Quick setup checklist

1. Deploy the site on Cloudflare Pages
2. Add **Turnstile** keys (free captcha)
3. Redeploy and test

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

## Email delivery via FormSubmit

After Turnstile passes server-side verification, the browser sends the submission directly to **FormSubmit** at `contact@panthra.ca` (same flow as before Turnstile was added). No Resend or Workers Paid plan required.

> **Note:** FormSubmit blocks server-side requests from Cloudflare Workers, so email must be sent from the visitor's browser after captcha verification.

The first FormSubmit delivery triggers a one-time activation email to `contact@panthra.ca` — click the link to start receiving submissions.

## 2. Redeploy

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
