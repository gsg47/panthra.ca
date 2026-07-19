# PANTHRA email signature

Themed signature block for outreach and client mail.

## Files

| File | Use |
|------|-----|
| `preview.html` | Open in a browser to see Full / Compact / Dark |
| `signature-full.html` | Copy-paste HTML for Gmail / Outlook |
| `signature-compact.html` | Shorter variant |
| `signature-plain.txt` | Plain-text fallback |
| `panthra-sig-80.png` / `112.png` / `144.png` | Retina logo assets (2× display size) |
| `panthra-sig-48.png` / `72.png` / `96.png` | Same assets (legacy filenames) |

Full signature displays at **56px** from a **112px** file; compact at **40px** from **80px**. That keeps logos sharp on Retina screens.

## Install

### 1. Host the logo

Email clients need a public image URL. Logos live in `assets/email-signature/` and resolve to:

`https://panthra.ca/assets/email-signature/panthra-sig-112.png`

(Merge/deploy this branch first, or the image won’t load in sent mail.)

### 2. Gmail

1. Open `preview.html` **in Chrome** (double-click the file, or drag it into a browser tab)
2. You should see a styled signature (logo + name), **not** raw HTML tags
3. Click-drag to select that rendered block → Copy (`Cmd/Ctrl+C`)
4. Gmail → Settings → See all settings → General → Signature → Create new
5. Paste (`Cmd/Ctrl+V`) into the signature box → Save changes

If you paste and see `&lt;table` or HTML tags, you copied the source file — go back to the browser preview and copy the visual block instead.

### 3. Outlook (desktop)

1. Open `signature-full.html` in a browser, select and copy the rendered signature  
   **or** File → Options → Mail → Signatures → New, then paste from `preview.html`
2. Confirm the logo loads (public URL required)

### 4. Apple Mail

Mail → Settings → Signatures → paste from `preview.html`. Prefer **Always match my default message font** off so purple accents keep.

## Customize

Edit these strings in the HTML before pasting:

- Name / title
- Phone / email
- Tagline

Brand colors used: purple `#9333ea`, dark text `#050507`, muted `#71717a`.
