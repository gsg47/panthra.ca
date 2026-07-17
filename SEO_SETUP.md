# SEO Setup — Getting PANTHRA on Google

Technical SEO is now built into the site (meta tags, Open Graph, JSON-LD structured data, sitemap, robots.txt). **Google still needs to discover and index the site** — that is the most common reason a brand search does not show results yet.

## 1. Google Search Console (required)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: **URL prefix** → `https://panthra.ca`
3. Verify ownership using one of:
   - **HTML tag** — add to `index.html` inside `<head>`:
     ```html
     <meta name="google-site-verification" content="YOUR_CODE_HERE" />
     ```
   - **DNS TXT record** in Cloudflare (recommended — survives redeploys)
4. After verification, go to **Sitemaps** → submit:
   ```
   https://panthra.ca/sitemap.xml
   ```
5. Use **URL Inspection** → enter `https://panthra.ca/` → **Request Indexing**

## 2. Bing Webmaster Tools (optional but quick)

1. [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add `https://panthra.ca` and verify (can import from Google Search Console)
3. Submit sitemap: `https://panthra.ca/sitemap.xml`

## 3. What was added to the site

| Item | Purpose |
|------|---------|
| Page titles & descriptions | Brand name **PANTHRA** + Calgary/Canada keywords |
| Open Graph + Twitter cards | Better sharing and crawl signals |
| JSON-LD (Organization, WebSite, LocalBusiness) | Tells Google who PANTHRA is and where you are |
| `sitemap.xml` | Lists all pages for crawlers |
| `robots.txt` | Points crawlers to the sitemap |
| Homepage H1 + structured data | Stronger brand association |

## 4. Updating SEO later

Edit page metadata in `seo/pages.json`, then run:

```bash
npm run seo
```

This updates all HTML `<head>` tags and regenerates `sitemap.xml`.

## 5. Realistic expectations

- **New sites** can take **days to several weeks** to appear for brand searches after indexing is requested.
- Searching **"panthra"** alone may show unrelated results (other companies, products). Searching **"panthra cybersecurity"** or **"panthra calgary"** will rank faster.
- For faster brand visibility, also:
  - Link to `https://panthra.ca` from LinkedIn, email signatures, and business listings
  - Create a [Google Business Profile](https://business.google.com) for the Calgary address
  - Keep publishing on the Insights/blog page

## 6. Check indexing status

In Google Search Console → **Pages** → see how many URLs are indexed.

Quick test (after a few days):

```
site:panthra.ca
```

If results appear, Google has indexed the site.
