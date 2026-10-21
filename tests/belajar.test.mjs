// tests/belajar.test.mjs
// Penjaga konten "Belajar Islam dari nol" (beranda baru, /belajar, /tipe-santri).
import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const KONTEN = 'src/content/belajar';
const STATUS = ['draf', 'dicek', 'terbit'];
const DASH = /[\u2013\u2014]/;

function frontmatter(raw) {
	const teks = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
	const m = teks.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	assert.ok(m, 'frontmatter tidak ditemukan');
	return { data: parseYaml(m[1]), body: m[2] };
}

const berkasMd = readdirSync(join(root, KONTEN)).filter((f) => f.endsWith('.md'));
const modul = JSON.parse(read(`${KONTEN}/_modul.json`));
const tes = JSON.parse(read(`${KONTEN}/tipe-santri.json`));

test('semua pelajaran: frontmatter valid, 3 kuis, jawaban valid, status ada', () => {
	assert.ok(berkasMd.length >= 4, 'minimal 4 pelajaran pilot');
	for (const f of berkasMd) {
		const { data, body } = frontmatter(read(`${KONTEN}/${f}`));
		assert.ok(STATUS.includes(data.status), `${f}: status tidak dikenal (${data.status})`);
		assert.equal(typeof data.judul, 'string', `${f}: judul`);
		assert.equal(typeof data.slug, 'string', `${f}: slug`);
		assert.ok(Number.isInteger(data.modul) && Number.isInteger(data.no), `${f}: modul/no`);
		assert.equal(f, `${data.modul}-${data.no}-${data.slug}.md`, `${f}: nama berkas = modul-no-slug`);
		assert.ok(body.trim().length > 400, `${f}: bacaan terlalu pendek`);
		assert.doesNotMatch(body, /^# /m, `${f}: badan tidak boleh punya <h1> (judul sudah h1)`);

		assert.equal(data.kuis?.length, 3, `${f}: wajib 3 kuis`);
		for (const [i, q] of data.kuis.entries()) {
			assert.ok(q.tanya && Array.isArray(q.pilihan) && q.pilihan.length >= 2, `${f} kuis ${i + 1}: pilihan`);
			assert.ok(Number.isInteger(q.jawaban) && q.jawaban >= 0 && q.jawaban < q.pilihan.length, `${f} kuis ${i + 1}: jawaban index`);
			assert.ok(q.penjelasan, `${f} kuis ${i + 1}: penjelasan`);
		}
		assert.ok(data.dalil?.length >= 1, `${f}: minimal satu dalil`);
		for (const d of data.dalil) {
			assert.ok(d.arab && d.terjemah && d.rujukan, `${f}: dalil lengkap (arab, terjemah, rujukan)`);
			if (d.url) assert.match(d.url, /^https:\/\//, `${f}: url sumber https`);
		}
		assert.ok(data.bawa_pulang?.inti, `${f}: bawa_pulang.inti`);

		const slot = modul.pelajaran.find((p) => p.file === f);
		assert.ok(slot, `${f}: terdaftar di _modul.json`);
		assert.equal(slot.slug, data.slug, `${f}: slug cocok dengan _modul.json`);
	}
});

test('_modul.json: 8 modul (0-7) dan 24 slot pelajaran', () => {
	assert.deepEqual(
		modul.modul.map((m) => m.modul),
		[0, 1, 2, 3, 4, 5, 6, 7]
	);
	assert.equal(modul.pelajaran.length, 24);
	for (const m of modul.modul) {
		assert.equal(modul.pelajaran.filter((p) => p.modul === m.modul).length, m.jumlah_pelajaran, `modul ${m.modul}`);
	}
	for (const p of modul.pelajaran.filter((p) => p.file)) assert.ok(berkasMd.includes(p.file), `${p.file} ada`);
});

test('tipe-santri.json: 10 situasi, skor ke tipe yang dikenal, titik mulai menunjuk pelajaran nyata', () => {
	const tipe = Object.keys(tes.tipe);
	assert.deepEqual(tes.urutan_tipe, tipe);
	assert.equal(tes.situasi.length, 10);
	for (const s of tes.situasi) {
		assert.equal(s.pilihan.length, 5, `situasi ${s.no}`);
		for (const o of s.pilihan) for (const k of Object.keys(o.skor)) assert.ok(tipe.includes(k), `situasi ${s.no}: ${k}`);
	}
	for (const [id, t] of Object.entries(tes.tipe)) assert.ok(berkasMd.includes(`${t.titik_mulai.pelajaran}.md`), `${id}: titik mulai`);
});

test('tanpa em-dash/en-dash di copy beranda, halaman belajar, dan konten', () => {
	const daftar = [
		'src/routes/+page.svelte',
		'src/routes/belajar/+page.svelte',
		'src/routes/belajar/[modul]/[slug]/+page.svelte',
		'src/routes/tipe-santri/+page.svelte',
		'src/lib/components/situs/HeaderSitus.svelte',
		'src/lib/components/situs/FooterSitus.svelte',
		'src/lib/belajar/menu.ts',
		`${KONTEN}/_modul.json`,
		`${KONTEN}/tipe-santri.json`,
		...berkasMd.map((f) => `${KONTEN}/${f}`)
	];
	for (const p of daftar) {
		const baris = read(p).split('\n');
		baris.forEach((b, i) => assert.doesNotMatch(b, DASH, `${p}:${i + 1}`));
	}
});

test('beranda: satu <h1>, judul baru, JSON-LD organisasi/website tetap ada', () => {
	const home = read('src/routes/+page.svelte');
	assert.equal((home.match(/<h1[\s>]/g) ?? []).length, 1);
	assert.match(home, /<title>SantriOnline \| Belajar Islam dari Nol & Aplikasi Pesantren, TPQ Gratis<\/title>/);
	assert.match(home, /'@type': 'Organization'/);
	assert.match(home, /'@type': 'WebSite'/);
	assert.match(home, /\/tipe-santri/);
	assert.match(home, /\/belajar\/0\/kenapa-belajar-agama-sekarang/);
});

test('draf: noindex + banner; sitemap hanya memuat pelajaran terbit', () => {
	const les = read('src/routes/belajar/[modul]/[slug]/+page.svelte');
	assert.match(les, /p\.status === 'terbit'/);
	assert.match(les, /<meta name="robots" content="noindex, follow" \/>/);
	assert.match(les, /Draf: belum diperiksa ustadz/);
	const sm = read('src/routes/sitemap.xml/+server.ts');
	assert.match(sm, /path: '\/belajar'/);
	assert.match(sm, /path: '\/tipe-santri'/);
	assert.match(sm, /pelajaranTerbit\(\)/);
	assert.doesNotMatch(sm, /PELAJARAN\.map/);
	const lib = read('src/lib/server/belajar.ts');
	assert.match(lib, /filter\(\(p\) => p\.status === 'terbit'\)/);
});

test('header: dropdown berupa <a href> asli untuk Katalog dan Untuk Lembaga', () => {
	const menu = read('src/lib/belajar/menu.ts');
	for (const h of ['/katalog/kitab', '/katalog/buku', '/katalog/produk', '/katalog/kursus', '/aplikasi-pondok-pesantren', '/aplikasi-raport-tpq', '/aplikasi-hafalan-quran', '/fitur/', '/literasi/', '/lembaga', '/tentang']) {
		assert.ok(menu.includes(`'${h}`), h);
	}
	const header = read('src/lib/components/situs/HeaderSitus.svelte');
	assert.match(header, /<a href=\{a\.href\}>/);
	assert.match(header, /<details class="mnav"/);
});

test('route lama tetap ada (SEO)', () => {
	const lama = [
		'tentang/+page.svelte',
		'lembaga/+page.svelte',
		'aplikasi-hafalan-quran/+page.svelte',
		'aplikasi-pondok-pesantren/+page.svelte',
		'aplikasi-raport-tpq/+page.svelte',
		'fitur/[slug]/+page.svelte',
		'katalog/[jenis]/+page.svelte',
		'katalog/[jenis]/[slug]/+page.svelte',
		'literasi/apa-itu-santri-online/+page.svelte',
		'literasi/tahfidz-adalah/+page.svelte',
		'literasi/munaqosah-tahfidz/+page.svelte',
		'invoice/[kode]/+page.svelte',
		'invoice/admin/+page.svelte',
		'opener-perpustakaan/+page.svelte',
		'sitemap.xml/+server.ts',
		'api/chat/+server.ts',
		'api/chat/siap/+server.ts',
		'api/rating/+server.ts',
		'api/midtrans/webhook/+server.ts',
		'api/admin/invoice/+server.ts'
	];
	for (const r of lama) assert.ok(existsSync(join(root, 'src/routes', r)), r);
});

// Setelah `npm run build`: periksa HTML prerender (dilewati bila belum build).
function cariHtml(dir, akhir) {
	if (!existsSync(dir)) return null;
	for (const e of readdirSync(dir)) {
		const p = join(dir, e);
		if (statSync(p).isDirectory()) {
			const r = cariHtml(p, akhir);
			if (r) return r;
		} else if (p.endsWith(akhir)) return p;
	}
	return null;
}

test('hasil build: pelajaran draf noindex, satu h1, menu ter-render di HTML', (t) => {
	const out = join(root, '.svelte-kit/cloudflare');
	const les = cariHtml(out, `${'islam-iman-ihsan'}.html`);
	const bel = cariHtml(out, 'belajar.html');
	if (!les || !bel) return t.skip('belum ada hasil build');
	const html = readFileSync(les, 'utf8');
	assert.match(html, /<meta name="robots" content="noindex, follow"/);
	assert.match(html, /Draf: belum diperiksa ustadz/);
	assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
	const daftar = readFileSync(bel, 'utf8');
	assert.equal((daftar.match(/<h1[\s>]/g) ?? []).length, 1);
	for (const h of ['/katalog/kursus', '/aplikasi-raport-tpq', '/fitur/administrasi-pesantren', '/tentang']) {
		assert.ok(daftar.includes(`href="${h}"`), `menu ${h} ada di HTML`);
	}
	assert.doesNotMatch(daftar, /noindex/);
});
