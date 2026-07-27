import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(`${root}${path}`, 'utf8');

test('homepage memiliki fondasi SEO nasional dan social preview lengkap', () => {
	const source = read('src/routes/+page.svelte');

	assert.match(source, /<title>SantriOnline \| Platform Pembinaan Santri Indonesia<\/title>/);
	assert.match(source, /rel="canonical" href="https:\/\/santrionline\.com\/"/);
	assert.match(source, /property="og:image" content="https:\/\/santrionline\.com\/og-santrionline\.png"/);
	assert.match(source, /name="twitter:card" content="summary_large_image"/);
	assert.match(source, /'@type': 'Organization'/);
	assert.match(source, /'@type': 'SoftwareApplication'/);
	assert.match(source, /'@type': 'FAQPage'/);
	assert.match(source, /const appBaseUrl = 'https:\/\/app\.santrionline\.com'/);
	assert.match(source, /const appRegisterUrl = `\$\{appBaseUrl\}\/register`/);
});

test('robots, sitemap, dan invoice menerapkan kebijakan indeks yang aman', () => {
	const robots = read('static/robots.txt');
	const sitemap = read('static/sitemap.xml');
	const invoice = read('src/routes/invoice/[kode]/+page.svelte');
	const invoiceLoader = read('src/routes/invoice/[kode]/+page.server.ts');
	const invoiceDomain = read('src/lib/server/invoice.ts');

	assert.match(robots, /Sitemap: https:\/\/santrionline\.com\/sitemap\.xml/);
	assert.doesNotMatch(robots, /Disallow: \/invoice\//);
	assert.match(sitemap, /<loc>https:\/\/santrionline\.com\/<\/loc>/);
	assert.match(invoice, /content="noindex, nofollow, noarchive"/);
	assert.doesNotMatch(invoice, /maskEmail\(invoice\.email_klien\)/);
	assert.doesNotMatch(invoice, /maskWhatsapp\(invoice\.whatsapp_klien\)/);
	assert.doesNotMatch(invoice, /meta name="description" content=\{`Tagihan/);
	assert.match(invoiceLoader, /'cache-control': 'private, no-store, max-age=0'/);
	assert.match(invoiceLoader, /'x-robots-tag': 'noindex, nofollow, noarchive'/);
	assert.doesNotMatch(invoiceLoader, /SELECT \*/);
	assert.match(invoiceLoader, /email_klien: maskEmail\(invoiceRow\.email_klien\)/);
	assert.match(invoiceLoader, /whatsapp_klien: maskWhatsapp\(invoiceRow\.whatsapp_klien\)/);
	assert.match(invoiceDomain, /crypto\.getRandomValues\(randomBytes\)/);
	assert.match(invoiceDomain, /new Uint8Array\(26\)/);
	assert.doesNotMatch(invoiceDomain, /Math\.random\(\)/);
});
