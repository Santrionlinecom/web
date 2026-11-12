// tests/brand-discoverability.test.mjs
// Identitas merek & penemuan produk (Nov 2026): profil resmi untuk Organization.sameAs,
// llms.txt sebagai panduan sumber, robots.txt tanpa direktif non-standar dari kode sendiri,
// dan platform produk yang jujur di JSON-LD.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PROFIL_RESMI, SAME_AS_ORGANISASI } from '../src/lib/seo.js';
import { atributAplikasi, labelKategoriProduk, platformProduk } from '../src/lib/produk-platform.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(`${root}${p}`, 'utf8').replace(/\r\n/g, '\n');

test('profil resmi: https, unik, tanpa handle mati @websantri', () => {
	const url = PROFIL_RESMI.map((p) => p.url);
	assert.equal(new Set(url).size, url.length);
	for (const u of url) assert.match(u, /^https:\/\/[a-z.]+\/\S+$/, u);
	assert.ok(url.includes('https://www.youtube.com/@appsantrionline'));
	assert.ok(!SAME_AS_ORGANISASI.some((u) => /@websantri\b/.test(u)), 'kanal @websantri sudah 404');
	assert.deepEqual(SAME_AS_ORGANISASI.slice(0, 2), ['https://app.santrionline.com/', 'https://masyogik.santrionline.com/']);
	// Halaman tidak menyalin daftar sendiri: satu sumber di $lib/seo.js.
	for (const f of ['src/routes/+page.svelte', 'src/routes/tentang/+page.svelte']) {
		assert.match(read(f), /SAME_AS_ORGANISASI/, f);
		assert.doesNotMatch(read(f), /youtube\.com\/@/, f);
	}
});

test('llms.txt: format, akun resmi = PROFIL_RESMI, tautan toko, tanpa data pribadi/angka karangan', () => {
	const t = read('static/llms.txt');
	assert.match(t, /^# SantriOnline\n\n> /);
	const tautan = [...t.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
	assert.ok(tautan.length >= 40, `tautan ${tautan.length}`);
	for (const u of tautan) assert.match(u, /^https:\/\//, u);
	assert.equal(new Set(tautan).size, tautan.length, 'tautan ganda');
	for (const p of PROFIL_RESMI) assert.ok(tautan.includes(p.url), `akun resmi ${p.url} tidak ada di llms.txt`);
	for (const u of ['https://santrionline.com/katalog/produk', 'https://app.santrionline.com/digital-store', 'https://app.santrionline.com/katalog-template', 'https://santrionline.com/video'])
		assert.ok(tautan.includes(u), u);
	// Halaman login/admin/API dan URL berkas unduhan tidak boleh dirujuk.
	assert.ok(!tautan.some((u) => /\/(admin|api|auth|login|dashboard)(\/|$)|\.(zip|apk|exe)$/.test(new URL(u).pathname)), tautan.join('\n'));
	// Harga berubah-ubah: tidak ada nominal Rp yang bisa basi di berkas statis; tidak ada rating/angka pengguna.
	assert.doesNotMatch(t, /Rp ?\d/);
	assert.doesNotMatch(t, /\b\d[\d.,]*\s*(pengguna|santri aktif|unduhan|rating|bintang|ulasan)\b/i);
	// Kebijakan lama tetap ada.
	assert.match(t, /Ahlussunnah wal Jama'ah \(Aswaja\)/);
	assert.match(t, /`\/api\/` tertutup untuk perayap/);
});

test('robots.txt kode sendiri: hanya direktif standar, LLM-Guide jadi komentar, kebijakan tetap', () => {
	const r = read('static/robots.txt');
	const direktif = r.split('\n').map((b) => b.trim()).filter((b) => b && !b.startsWith('#'));
	for (const b of direktif) assert.match(b, /^(User-agent|Allow|Disallow|Sitemap|Host):\s*\S/i, b);
	assert.doesNotMatch(r, /^LLM-Guide:/m);
	assert.match(r, /^# https:\/\/santrionline\.com\/llms\.txt$/m);
	assert.deepEqual(direktif.slice(0, 3), ['User-agent: *', 'Allow: /', 'Disallow: /api/']);
	assert.match(r, /^Sitemap: https:\/\/santrionline\.com\/sitemap\.xml$/m);
	// Blok Content-Signal Cloudflare disisipkan di edge, bukan dari repo; repo tidak menimpanya.
	assert.doesNotMatch(r, /Content-Signal|GPTBot|ClaudeBot/);
});

test('platform produk dari ekstensi berkas, sama dengan aturan app', () => {
	assert.equal(platformProduk('digital-products/x/app-1.0.apk'), 'android');
	assert.equal(platformProduk('https://f.example/a/Setup.EXE?sig=1'), 'windows');
	assert.equal(platformProduk('x/installer.msi#a'), 'windows');
	assert.equal(platformProduk('x/template.zip'), 'zip');
	assert.equal(platformProduk('x/buku.pdf'), null);
	assert.equal(platformProduk(null), null);
	assert.equal(platformProduk('folder.apk/tanpa-ekstensi'), null);
	assert.equal(labelKategoriProduk('zip'), 'Paket ZIP');
	assert.equal(labelKategoriProduk(null), 'Produk digital');
	assert.deepEqual(atributAplikasi('produk', 'android'), { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Android' });
	assert.deepEqual(atributAplikasi('produk', 'windows'), { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Windows' });
	assert.deepEqual(atributAplikasi('produk', 'zip'), {});
	assert.deepEqual(atributAplikasi('alat', undefined).operatingSystem, 'Web');
	assert.deepEqual(atributAplikasi('kitab', 'windows'), {});
});

test('menu & footer: tautan penemuan produk lama tetap, toko dan demo template ditambahkan', () => {
	const menu = read('src/lib/belajar/menu.ts');
	for (const h of ["'/katalog/semua'", "'/katalog/kitab'", "'/katalog/buku'", "'/katalog/produk'", "'/katalog/kursus'"]) assert.ok(menu.includes(h), h);
	assert.match(menu, /href: `\$\{APP\}\/digital-store`, label: 'Toko Digital'/);
	assert.match(menu, /href: `\$\{APP\}\/katalog-template`, label: 'Demo Template Website'/);
});
