# PANTHRA email signatures

Use these before sending campaign mail so replies look credible.

## Files

| File | Use |
| --- | --- |
| `preview.html` | Live preview in the browser + **Copy for email** (rewrites image URLs to `https://panthra.ca/...`) |
| `signature-full.html` | Default HTML signature (logo + name + contact) |
| `signature-compact.html` | Tighter HTML signature for short replies |
| `signature-plain.txt` | Plain-text fallback |
| `panthra-sig-*.png` | Local copies of the logo (preview / offline) |

## Hosted logo URLs (for real email clients)

Email clients must load images from the live site:

- https://panthra.ca/assets/email-signature/panthra-sig-48.png
- https://panthra.ca/assets/email-signature/panthra-sig-72.png ← default in HTML signatures
- https://panthra.ca/assets/email-signature/panthra-sig-96.png

`signature-full.html` and `signature-compact.html` already use the absolute `panthra.ca` URLs.

`preview.html` uses local `/assets/email-signature/...` paths so the page works on any deploy preview; the copy button rewrites those to absolute `https://panthra.ca/...` URLs.

## Install (Gmail)

1. Open `preview.html` on the site (or locally via a static server)
2. Click **Copy for email**
3. Gmail → Settings → See all settings → General → Signature → paste (⌘/Ctrl+V)
4. Send yourself a test from an external account to confirm the logo loads

## Install (Apple Mail / Outlook)

Paste the HTML from `signature-full.html` (or use the copy button output). Prefer the 72px logo. Avoid resizing the image in the editor — that often breaks the aspect ratio.

## Notes

- Do not attach the PNG to each email; host it and reference the HTTPS URL
- Keep the purple accent (`#9333ea`) consistent with the site
- Update phone / title in the HTML if your role line changes
