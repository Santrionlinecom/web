// SEO Tahap 3 (26 Sep 2026): halaman produk /aplikasi-* dan panduan /literasi/*.
// Menjaga kata kunci di title/H1, CTA "Daftarkan Lembaga", kejujuran fitur,
// sitemap, dan templat Excel yang bisa diunduh.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(`${root}${p}`, 'utf8');
const data = read('src/lib/halaman-aplikasi.ts');
const fitur = read('src/lib/fitur-lembaga.ts');

test('tiga halaman produk ada, prerender, dan memuat kata kunci di title & judul', () => {
	for (const [path, kunci] of [
		['aplikasi-hafalan-quran', /Aplikasi Hafalan Quran/],
		['aplikasi-raport-tpq', /Raport TPQ/],
		['aplikasi-pondok-pesantren', /Aplikasi Pondok Pesantren/]
	]) {
		assert.ok(existsSync(`${root}src/routes/${path}/+page.svelte`), path);
		assert.match(read(`src/routes/${path}/+page.ts`), /prerender = true/);
		assert.match(read(`src/routes/${path}/+page.svelte`), new RegExp(`cariHalamanAplikasi\\('/${path}'\\)`));
		assert.match(data, new RegExp(`path: '/${path}'`));
	}
	assert.match(data, /title: 'Aplikasi Hafalan Quran untuk TPQ/);
	assert.match(data, /judul: 'Aplikasi hafalan Quran untuk TPQ/);
	assert.match(data, /title: 'Aplikasi Raport TPQ Gratis \+ Download Templat Raport TPQ Excel/);
	assert.match(data, /title: 'Aplikasi Pondok Pesantren Gratis/);
});

test('CTA utama "Daftarkan Lembaga" ke /lembaga/tambah di halaman produk & panduan', () => {
	for (const f of ['src/lib/components/HalamanFitur.svelte', 'src/lib/components/ArtikelLiterasi.svelte']) {
		const s = read(f);
		assert.match(s, /const daftarUrl = `\$\{appUrl\}\/lembaga\/tambah`/);
		assert.match(s, />Daftarkan Lembaga/);
	}
});

test('kejujuran fitur: klaim yang tidak didukung aplikasi tidak muncul', () => {
	const semua = `${data}\n${fitur}\n${read('src/routes/lembaga/+page.svelte')}`;
	// Audit kode 26 Sep 2026: wali belum melihat hafalan/rapor/kehadiran,
	// ujian tidak otomatis masuk rapor, tidak ada CBT/absensi.
	assert.doesNotMatch(semua, /melihat hafalan, kehadiran, dan rapor/);
	assert.doesNotMatch(semua, /rapor mengambilnya otomatis/);
	assert.doesNotMatch(semua, /Lanjut otomatis dari setoran terakhir/);
	assert.doesNotMatch(semua, /ujian CBT, dan komunikasi wali/);
	assert.doesNotMatch(semua, /aplikasi absensi santri/);
	assert.match(data, /Absensi harian santri — belum ada/);
	assert.match(data, /Hafalan di akun wali — belum tampil/);
	assert.match(data, /untuk lembaga bertipe pondok — belum/);
});

test('templat raport TPQ Excel tersedia untuk diunduh', () => {
	const f = `${root}static/unduh/templat-raport-tpq.xlsx`;
	assert.ok(existsSync(f));
	const b = readFileSync(f);
	assert.equal(b.subarray(0, 2).toString(), 'PK'); // xlsx = zip
	assert.ok(statSync(f).size > 5000);
	assert.match(read('src/routes/aplikasi-raport-tpq/+page.svelte'), /href=\{unduh\} download/);
	assert.match(read('scripts/buat-templat-raport-tpq.py'), /Mumtaz/);
});

test('panduan /literasi: pilar tahfidz & munaqosah, paragraf pertama menjawab, peninjau, sumber', () => {
	const t = read('src/routes/literasi/tahfidz-adalah/+page.svelte');
	const m = read('src/routes/literasi/munaqosah-tahfidz/+page.svelte');
	assert.match(t, /judul="Tahfidz Adalah: /);
	assert.match(t, /<p><strong>Tahfidz adalah /);
	assert.match(m, /<p><strong>Munaqosah tahfidz adalah /);
	assert.match(t, /HR al-Bukhari no\. 5027/);
	assert.match(t, /QS al-Qamar \[54\]: 17/);
	for (const s of [t, m]) {
		assert.match(s, /peninjau="Yogik Pratama Aprilian"/);
		assert.match(s, /href="\/aplikasi-hafalan-quran"/);
	}
	// ayat disalin dari mushaf repo app, bukan diketik ulang
	const app = '/home/yogik/app.santrionline/static/quran/juz-27.json';
	if (existsSync(app)) {
		const v = JSON.parse(readFileSync(app, 'utf8')).verses.find((x) => x.verse_key === '54:17');
		assert.ok(t.includes(v.text));
	}
});

test('sitemap memuat halaman produk dan panduan baru; beranda menautnya', () => {
	const sm = read('src/routes/sitemap.xml/+server.ts');
	assert.match(sm, /HALAMAN_APLIKASI\.map/);
	assert.match(sm, /\/literasi\/tahfidz-adalah/);
	assert.match(sm, /\/literasi\/munaqosah-tahfidz/);
	const home = read('src/routes/+page.svelte');
	for (const p of ['/aplikasi-hafalan-quran', '/aplikasi-raport-tpq', '/aplikasi-pondok-pesantren', '/literasi/tahfidz-adalah']) {
		assert.ok(home.includes(`href="${p}"`), p);
	}
});
