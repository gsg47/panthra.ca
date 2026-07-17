import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'seo/pages.json'), 'utf8'));
const { site, pages } = config;
const today = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSeoBlock(page) {
  const canonical = `${site.url}${page.path}`;
  const ogType = page.type || 'website';

  return [
    `    <meta name="robots" content="index, follow, max-image-preview:large" />`,
    `    <meta name="author" content="${escapeHtml(site.name)}" />`,
    `    <meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
    `    <meta property="og:locale" content="${site.locale}" />`,
    `    <meta property="og:type" content="${ogType}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `    <meta property="og:image" content="${site.ogImage}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `    <meta name="twitter:image" content="${site.ogImage}" />`,
  ].join('\n');
}

function buildOrganizationJsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#organization`,
        name: site.name,
        alternateName: 'Panthra Cybersecurity',
        url: `${site.url}/`,
        logo: site.ogImage,
        email: site.email,
        telephone: site.phone,
        description:
          'PANTHRA is a Calgary-based cybersecurity company providing managed security, monitoring, incident response, and compliance services across Canada.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Canada',
        },
        knowsAbout: [
          'Cybersecurity',
          'Managed Security Services',
          'Incident Response',
          'SIEM',
          'Compliance',
          'Penetration Testing',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        description:
          'Official website of PANTHRA, a Calgary cybersecurity company serving businesses across Canada.',
        publisher: {
          '@id': `${site.url}/#organization`,
        },
        inLanguage: 'en-CA',
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${site.url}/#localbusiness`,
        name: site.name,
        image: site.ogImage,
        url: `${site.url}/`,
        telephone: site.phone,
        email: site.email,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 51.0447,
          longitude: -114.0719,
        },
        areaServed: 'Canada',
        parentOrganization: {
          '@id': `${site.url}/#organization`,
        },
      },
    ],
  };

  const json = JSON.stringify(graph, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');

  return `    <script type="application/ld+json">\n${json}\n    </script>`;
}

function stripExistingSeo(html) {
  return html
    .replace(/\n?\s*<meta name="robots"[^>]*>/g, '')
    .replace(/\n?\s*<meta name="author"[^>]*>/g, '')
    .replace(/\n?\s*<meta property="og:[^"]+"[^>]*>/g, '')
    .replace(/\n?\s*<meta name="twitter:[^"]+"[^>]*>/g, '')
    .replace(/\n?\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
}

function updatePage(relativePath, page) {
  const filePath = path.join(root, relativePath);
  let html = fs.readFileSync(filePath, 'utf8');
  const canonical = `${site.url}${page.path}`;

  html = stripExistingSeo(html);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(page.description)}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonical}" />`
  );

  const seoBlock = buildSeoBlock(page);
  const jsonLd = relativePath === 'index.html' ? `\n${buildOrganizationJsonLd()}` : '';

  html = html.replace(
    /(<meta name="theme-color" content="#050507" \/>)/,
    `$1\n${seoBlock}${jsonLd}`
  );

  fs.writeFileSync(filePath, html);
}

function buildSitemap() {
  const urls = Object.entries(pages)
    .map(([, page]) => page)
    .sort((a, b) => Number(b.priority) - Number(a.priority))
    .map(
      (page) => `  <url>
    <loc>${site.url}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
}

for (const [relativePath, page] of Object.entries(pages)) {
  updatePage(relativePath, page);
}

buildSitemap();
console.log(`Updated SEO for ${Object.keys(pages).length} pages and regenerated sitemap.xml`);
