// tests/seo-halaman.test.mjs
// Audit SEO teknis (Okt 2026) dikunci per jenis halaman. Halaman dirender sungguhan di Node
// (tests/helpers/render-halaman.mjs: loader + layout + page, D1 tiruan) lalu diperiksa
// src/lib/seo-audit.js: <title> unik, meta description 70–160, canonical absolut,
// og:title/description/image/url absolut, tepat satu <h1>, JSON-LD valid & ter-escape,
// schema sesuai jenis (Organization/WebSite di beranda, BreadcrumbList di halaman bertingkat,
// ItemList di daftar katalog, Book/CreativeWork di detail katalog, Article di /literasi),
// FAQPage hanya bila tanya-jawabnya terlihat, dan tidak ada tautan internal/sitemap ke 404.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cocokkanRute, muatModul, renderHalaman, tutup } from './helpers/render-halaman.mjs';
import { d1Tiruan, FIKSUR } from './helpers/d1-tiruan.mjs';
import { auditHtml, ambilJsonLd, INDEX_404, nodeSchema } from '../src/lib/seo-audit.js';
import { ASAL, DESKRIPSI_MAKS, DESKRIPSI_MIN, escapeJsonLd, rapikanDeskripsi, remah } from '../src/lib/seo.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');

/** Jenis halaman publik yang wajib tercakup audit. */
const JENIS_WAJIB = ['beranda', 'halaman', 'belajar', 'belajar-pelajaran', 'katalog-daftar', 'katalog-detail', 'fitur', 'literasi', 'aplikasi'];

const VIDEO = [
	{
		slug: 'adab-murid',
		judul: 'Adab Murid kepada Guru',
		ringkas: 'Kisah singkat.',
		kategori: 'adab',
		kategoriLabel: 'Adab',
		durasi: 77,
		tanggal: '2026-10-21',
		poster: 'https://files.santrionline.com/video/adab-murid.jpg',
		berkas: 'https://files.santrionline.com/video/adab-murid.mp4',
		embed: 'https://app.santrionline.com/video/adab-murid/embed',
		tonton: 'https://app.santrionline.com/video/adab-murid',
		artikel: null
	}
];
const fetchVideo = async () => new Response(JSON.stringify(VIDEO), { headers: { 'content-type': 'application/json' } });

/** @param {string} path @param {{ env?: object, fetch?: typeof fetch }} [opsi] */
async function render(path, opsi = {}) {
	const r = cocokkanRute(path);
	assert.ok(r, `tidak ada rute untuk ${path}`);
	const u = new URL(`${ASAL}${path}`);
	return renderHalaman(r.rute, u.pathname + u.search, { params: r.params, env: opsi.env ?? { DB: d1Tiruan() }, fetch: opsi.fetch });
}

/** @param {{ DB?: unknown }} env */
async function lokasiSitemap(env) {
	const { GET } = await muatModul('/src/routes/sitemap.xml/+server.ts');
	const xml = await (await GET({ platform: { env } })).text();
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

/** @type {Map<string, ReturnType<typeof auditHtml> & { html: string }>} */
const hasil = new Map();

before(async () => {
	const loc = await lokasiSitemap({ DB: d1Tiruan() });
	const paths = [
		...loc.map((u) => u.slice(ASAL.length) || '/'),
		// Detail kartu tetap (tanpa DB) dan galeri video berisi — tidak di sitemap tapi publik.
		'/katalog/game/kampung-santri',
		'/katalog/belajar/ruang-belajar',
		'/katalog/alat/desain-santri'
	];
	for (const p of paths) {
		const { html, status } = await render(p);
		assert.equal(status, 200, `${p} harus 200`);
		hasil.set(p, { ...auditHtml(html, p), html });
	}
	const { html } = await render('/video', { fetch: fetchVideo });
	hasil.set('/video#berisi', { ...auditHtml(html, '/video'), html });
});

after(() => tutup());

test('helper: JSON-LD di-escape (< → \\u003c) dan tetap JSON valid', () => {
	const data = { name: '</script><script>alert(1)</script> & \u2028' };
	const s = escapeJsonLd(data);
	assert.doesNotMatch(s, /[<>&\u2028]/);
	assert.match(s, /\\u003c\/script\\u003e/);
	assert.deepEqual(JSON.parse(s), data);
});

test('helper: rapikanDeskripsi menjaga 70–160 karakter', () => {
	const panjang = 'Kalimat pertama yang cukup panjang untuk menjadi deskripsi halaman yang baik dan jelas bagi pembaca. ' + 'kata '.repeat(40);
	const a = rapikanDeskripsi(panjang);
	assert.ok(a.length >= DESKRIPSI_MIN && a.length <= DESKRIPSI_MAKS, a);
	assert.ok(a.endsWith('.'), 'dipotong di akhir kalimat');
	const b = rapikanDeskripsi('x'.repeat(30) + ' ' + 'kata '.repeat(60));
	assert.ok(b.length <= DESKRIPSI_MAKS && b.endsWith('…'), b);
	const c = rapikanDeskripsi('Pendek', 'Tambahan kalimat umum supaya deskripsi meta mencapai panjang minimal yang disarankan.');
	assert.ok(c.length >= DESKRIPSI_MIN && c.startsWith('Pendek. Tambahan'), c);
	assert.equal(rapikanDeskripsi('  spasi   ganda  '), 'spasi ganda');
});

test('helper: remah selalu mulai dari Beranda dengan URL absolut', () => {
	const r = remah([{ name: 'Katalog', path: '/katalog/semua' }]);
	assert.deepEqual(
		r.itemListElement.map((e) => [e.position, e.name, e.item]),
		[
			[1, 'Beranda', `${ASAL}/`],
			[2, 'Katalog', `${ASAL}/katalog/semua`]
		]
	);
});

test('JSON-LD hanya dipasang lewat JsonLd.svelte (helper bersama, bukan salinan per file)', () => {
	const pelanggar = [];
	const jalan = (dir) => {
		for (const e of readdirSync(join(root, dir), { withFileTypes: true })) {
			const p = `${dir}/${e.name}`;
			if (e.isDirectory()) jalan(p);
			else if (/\.(svelte|ts|js)$/.test(e.name) && !['src/lib/seo.js', 'src/lib/seo-audit.js'].includes(p) && read(p).includes('application/ld+json')) pelanggar.push(p);
		}
	};
	jalan('src');
	assert.deepEqual(pelanggar, []);
	assert.match(read('src/lib/components/JsonLd.svelte'), /\{@html skripJsonLd\(data\)\}/);
});

test('semua URL sitemap + detail katalog lolos audit SEO teknis', () => {
	const gagal = [...hasil].filter(([, h]) => h.masalah.length).map(([p, h]) => `${p}\n  - ${h.masalah.join('\n  - ')}`);
	assert.deepEqual(gagal, [], `\n${gagal.join('\n')}`);
});

test('setiap jenis halaman publik tercakup audit', () => {
	const ada = new Set([...hasil.values()].map((h) => h.jenis));
	for (const j of JENIS_WAJIB) assert.ok(ada.has(j), `jenis ${j} tidak teraudit`);
	for (const p of ['/', '/tentang', '/kontak', '/lembaga', '/belajar', '/tipe-santri', '/video', '/kebijakan-privasi', '/katalog/semua', '/katalog/kitab', '/katalog/buku', '/katalog/kursus', '/katalog/produk', '/katalog/kitab/safinatun-najah', '/katalog/buku/rumah-di-ujung-pulau', '/katalog/kursus/tajwid-dasar', '/katalog/produk/santriprint', '/fitur/ujian-tahfidz', '/literasi/tahfidz-adalah', '/literasi/apa-itu-santri-online', '/aplikasi-raport-tpq'])
		assert.ok(hasil.has(p), `${p} tidak teraudit`);
});

test('<title> unik di semua halaman', () => {
	const lihat = new Map();
	for (const [p, h] of hasil) {
		if (p.includes('#')) continue;
		assert.ok(!lihat.has(h.title), `title "${h.title}" dipakai ${lihat.get(h.title)} dan ${p}`);
		lihat.set(h.title, p);
	}
});

const schemaDari = (/** @type {string} */ p) => nodeSchema(ambilJsonLd(hasil.get(p).html).map((b) => b.data));
const cari = (/** @type {string} */ p, /** @type {string} */ tipe) => schemaDari(p).find((n) => [n['@type']].flat().includes(tipe));

test('beranda: Organization + WebSite dengan @id kanonik', () => {
	assert.equal(cari('/', 'Organization')['@id'], `${ASAL}/#organization`);
	assert.equal(cari('/', 'WebSite')['@id'], `${ASAL}/#website`);
});

test('detail katalog: Book untuk kitab/buku, harga & rating hanya bila jelas', () => {
	const kitab = cari('/katalog/kitab/safinatun-najah', 'Book');
	assert.equal(kitab.author.name, 'Salim bin Sumair al-Hadhrami');
	assert.equal(kitab.offers.price, '0');
	assert.equal(kitab.aggregateRating.ratingCount, 2);
	// Buku berbayar koin/bab: tidak ada padanan IDR → tanpa Offer (bukan Offer tanpa harga).
	assert.equal(cari('/katalog/buku/rumah-di-ujung-pulau', 'Book').offers, undefined);
	assert.equal(cari('/katalog/produk/santriprint', 'SoftwareApplication').offers.price, '49000');
	assert.ok(cari('/katalog/kursus/tajwid-dasar', 'Course'));
	assert.ok(cari('/katalog/game/kampung-santri', 'VideoGame'));
	assert.ok(cari('/katalog/belajar/ruang-belajar', 'CreativeWork'));
	// Remah detail tidak menunjuk /katalog/<jenis> yang tidak ada (game/belajar/alat).
	const remahAlat = cari('/katalog/alat/desain-santri', 'BreadcrumbList').itemListElement.map((e) => e.item);
	assert.ok(remahAlat.includes(`${ASAL}/katalog/produk`), remahAlat.join());
});

test('detail katalog: teks DB berbahaya tidak bisa keluar dari blok JSON-LD', () => {
	const { html } = hasil.get('/katalog/kitab/kitab-uji-escape');
	assert.doesNotMatch(html, /<\/script><script>alert/);
	const buku = cari('/katalog/kitab/kitab-uji-escape', 'Book');
	assert.equal(buku.name, FIKSUR.kitab_catalog[1].title);
	// Ringkasan "Pendek <b>" disambung kalimat umum sampai ≥ 70 karakter.
	assert.ok(hasil.get('/katalog/kitab/kitab-uji-escape').deskripsi.length >= DESKRIPSI_MIN);
});

test('daftar katalog: ItemList memakai URL detail (atau aplikasi), bukan beranda', () => {
	for (const p of ['/katalog/semua', '/katalog/kitab', '/katalog/produk']) {
		const list = cari(p, 'ItemList');
		assert.ok(list.itemListElement.length > 0, p);
		for (const e of list.itemListElement) assert.notEqual(e.url, `${ASAL}`, `${p}: ${e.name}`);
	}
	const urlKitab = cari('/katalog/kitab', 'ItemList').itemListElement.map((e) => e.url);
	assert.ok(urlKitab.includes(`${ASAL}/katalog/kitab/safinatun-najah`));
});

test('FAQPage hanya di halaman yang menampilkan FAQ', () => {
	const denganFaq = [...hasil].filter(([, h]) => h.tipe.includes('FAQPage')).map(([p]) => p);
	// Halaman ber-FAQ terlihat: beranda, /lembaga, /fitur/*, /aplikasi-*, panduan tahfidz.
	for (const p of ['/', '/lembaga', '/fitur/keuangan-pesantren', '/aplikasi-hafalan-quran', '/literasi/tahfidz-adalah']) assert.ok(denganFaq.includes(p), p);
	for (const p of ['/tentang', '/kontak', '/katalog/semua', '/literasi/apa-itu-santri-online']) assert.ok(!denganFaq.includes(p), p);
	// Kecocokan teks Q&A dengan isi halaman diperiksa auditHtml (lihat tes audit di atas).
});

test('/video berisi: CollectionPage + ItemList VideoObject; ?v= memakai canonical galeri', async () => {
	assert.deepEqual(hasil.get('/video#berisi').masalah, []);
	const ld = ambilJsonLd(hasil.get('/video#berisi').html).map((b) => b.data);
	assert.ok(nodeSchema(ld).some((n) => n['@type'] === 'CollectionPage'));
	assert.match(JSON.stringify(ld), /"@type":"VideoObject"/);
	const { html } = await render('/video?v=adab-murid', { fetch: fetchVideo });
	const a = auditHtml(html, '/video');
	assert.deepEqual(a.masalah, []);
	assert.match(a.title, /Adab Murid kepada Guru/);
});

test('sitemap: tanpa index 404, dan tiap entri tetap 200 walau DB kosong/gagal', async () => {
	for (const env of [{ DB: d1Tiruan() }, {}]) {
		const loc = await lokasiSitemap(env);
		for (const p of INDEX_404) assert.ok(!loc.includes(`${ASAL}${p}`), `sitemap memuat ${p}`);
		for (const u of loc) {
			const path = u.slice(ASAL.length) || '/';
			const { status } = await render(path, { env });
			assert.equal(status, 200, `${path} (DB ${env.DB ? 'ada' : 'kosong'})`);
		}
	}
});

test('tautan internal di semua halaman tidak mengarah ke URL 404', async () => {
	const tautan = new Set();
	for (const h of hasil.values())
		for (const t of h.tautan) {
			const m = t.match(/^(?:https:\/\/santrionline\.com)?(\/[^?#]*)/);
			if (m && !t.startsWith('//')) tautan.add(m[1].replace(/(.)\/$/, '$1'));
		}
	const rusak = [];
	for (const p of tautan) {
		if (INDEX_404.includes(p)) {
			rusak.push(`${p} (index 404)`);
			continue;
		}
		if (/\.[a-z0-9]{2,5}$/i.test(p)) {
			if (!existsSync(join(root, 'static', p))) rusak.push(`${p} (berkas statis tidak ada)`);
			continue;
		}
		if (!cocokkanRute(p)) {
			rusak.push(`${p} (tidak ada rute)`);
			continue;
		}
		if (p.startsWith('/invoice')) continue;
		const { status } = await render(p);
		if (status !== 200) rusak.push(`${p} (HTTP ${status})`);
	}
	assert.deepEqual(rusak, []);
});
