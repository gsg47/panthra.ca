# Contact Form — Cloudflare Setup

The contact form submits to `/api/contact`, handled by a **Cloudflare Pages Function** in `functions/api/contact.js`.

## Deployment order

1. **Deploy the site first** — email secrets are not required for the build.
2. **Enable Cloudflare Email Sending** for `panthra.ca`.
3. **Add secrets** in Cloudflare Pages (see below).
4. Test the contact form.

> **Important:** Cloudflare Pages does **not** support `send_email` in `wrangler.toml`. Do not add it back — the build will fail.

## Cloudflare Pages build settings

| Setting | Value |
|---------|-------|
| Framework preset | None |
| Build command | `npm run build` *(or leave empty)* |
| Build output directory | `/` |
| Node.js version | 18 or 20 |

## Enable Cloudflare Email Sending

1. Cloudflare dashboard → **Compute** → **Email Service** → **Email Sending**
2. **Onboard** `panthra.ca`
3. Verify you can send from `noreply@panthra.ca` (or your chosen sender)

## Pages secrets (required after deploy)

In **Pages → your project → Settings → Environment variables**, add:

| Variable | Type | Purpose |
|----------|------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Plaintext | Your Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | Secret | API token with **Email Sending → Send** permission |
| `CONTACT_TO_EMAIL` | Plaintext | *(optional)* Defaults to `contact@panthra.ca` |
| `CONTACT_FROM_EMAIL` | Plaintext | *(optional)* Defaults to `noreply@panthra.ca` |

To create the API token: **My Profile → API Tokens → Create Token** → use the Email Sending template or add `Account → Email Sending → Send`.

### Optional Resend fallback

If you prefer Resend instead, add `RESEND_API_KEY` as a secret. The function uses it only when Cloudflare Email API credentials are not set.

## Local testing

```bash
npm install -g wrangler
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your account ID and API token
npx wrangler pages dev .
```

Submit the form at `http://localhost:8788/contact.html`.

## Custom endpoint

```html
<script>
  window.PANTHRA_CONTACT_ENDPOINT = '/api/contact';
</script>
```
