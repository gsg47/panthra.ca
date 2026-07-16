# Contact Form — Cloudflare Setup

The contact form submits to `/api/contact`, handled by a **Cloudflare Pages Function** in `functions/api/contact.js`.

## Deploy on Cloudflare Pages

1. Connect this repo to **Cloudflare Pages**
2. Build command: *(leave empty — static site)*
3. Build output directory: `.`
4. Deploy

Cloudflare automatically picks up:

- `functions/api/contact.js` → `POST /api/contact`
- `wrangler.toml` → Email binding config

## Enable outbound email (required)

### Option A — Cloudflare Email Service (recommended)

1. In Cloudflare dashboard, open **Email** → **Email Routing** / **Email Service**
2. Enable sending from your domain (`panthra.ca`)
3. Verify the sender address used by the worker (`noreply@panthra.ca` by default)
4. Ensure the Pages project has the `send_email` binding (already defined in `wrangler.toml` as `EMAIL`)

### Option B — Resend fallback (optional)

If Email Service is not ready yet, add a **Resend** API key as a Pages secret:

- Variable name: `RESEND_API_KEY`
- Value: your Resend API key

The worker tries Cloudflare Email first, then Resend if configured.

## Optional environment variables

Set these in **Cloudflare Pages → Settings → Environment variables**:

| Variable | Default | Purpose |
|----------|---------|---------|
| `CONTACT_TO_EMAIL` | `contact@panthra.ca` | Inbox that receives submissions |
| `CONTACT_FROM_EMAIL` | `noreply@panthra.ca` | Sender address (must be verified) |
| `RESEND_API_KEY` | — | Optional Resend fallback |

## Local testing

```bash
npm install -g wrangler
cp .dev.vars.example .dev.vars
npx wrangler pages dev .
```

Submit the form at `http://localhost:8788/contact.html`.

## Custom endpoint

To override the API URL, set this before `script.js` loads:

```html
<script>
  window.PANTHRA_CONTACT_ENDPOINT = '/api/contact';
</script>
```
