import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OG_HALAMAN, OG_LOGO_LAMA, ogWeb } from '../src/lib/og-gambar.js';

// Pratinjau tautan santrionline.com tidak boleh lagi menampilkan logo bawaan (og-santrionline.png).
const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const LOGO = /og-santrionline\.png|santrionline\.png/;

test('og gambar: semua URL di sitemap mendapat gambar relevan, bukan logo', () => {
	const contoh = [
		'/', '/belajar', '/tipe-santri', '/video', '/lembaga', '/tentang', '/kontak', '/kebijakan-privasi',
		'/aplikasi-hafalan-quran', '/aplikasi-pondok-pesantren', '/aplikasi-raport-tpq',
		'/fitur/administrasi-pesantren', '/fitur/keuangan-pesantren', '/fitur/raport-madrasah', '/fitur/ujian-tahfidz',
		'/katalog/semua', '/katalog/kitab', '/katalog/buku', '/katalog/kursus', '/katalog/produk', '/katalog/kitab/syamilah-1',
		'/literasi/apa-itu-santri-online', '/literasi/tahfidz-adalah', '/literasi/munaqosah-tahfidz',
		'/belajar/3/wudhu', '/belajar/2/sifat-wajib-allah', '/belajar/9/materi-baru', '/halaman-asing'
	];
	for (const p of contoh) {
		const url = ogWeb(p);
		assert.doesNotMatch(url, LOGO, p);
		assert.match(url, /^https:\/\/files\.santrionline\.com\//, p);
	}
	for (const nama of Object.values(OG_HALAMAN)) assert.doesNotMatch(nama, LOGO);
});

test('og gambar: urutan cadangan — gambar item → halaman → bagian → beranda', () => {
	assert.equal(ogWeb('/video', 'https://files.santrionline.com/video/x.jpg'), 'https://files.santrionline.com/video/x.jpg');
	assert.equal(ogWeb('/video'), 'https://files.santrionline.com/og/halaman/web-video.jpg');
	assert.equal(ogWeb('/belajar/3/wudhu'), 'https://files.santrionline.com/video/wudhu.jpg');
	assert.equal(ogWeb('/belajar/2/iman-hari-akhir'), 'https://files.santrionline.com/og/halaman/web-belajar-iman-hari-akhir.jpg');
	assert.equal(ogWeb('/belajar/9/materi-baru'), 'https://files.santrionline.com/og/halaman/web-belajar.jpg');
	assert.equal(ogWeb('/katalog/buku/novel-baru'), 'https://files.santrionline.com/og/halaman/web-katalog-buku.jpg');
	assert.equal(ogWeb('/halaman-asing'), 'https://files.santrionline.com/og/halaman/web-beranda.jpg');
	assert.equal(ogWeb('/tentang/'), 'https://files.santrionline.com/og/halaman/web-tentang.jpg');
});

test('og gambar: tidak ada sumber yang masih memasang logo lama sebagai og:image', () => {
	const salah = [];
	const telusuri = (dir) => {
		for (const n of readdirSync(dir)) {
			const p = join(dir, n);
			if (statSync(p).isDirectory()) telusuri(p);
			else if (/\.(svelte|ts|js)$/.test(n) && !p.endsWith('og-gambar.js') && read(p.slice(root.length)).includes('og-santrionline.png')) salah.push(p.slice(root.length));
		}
	};
	telusuri(join(root, 'src'));
	assert.deepEqual(salah, []);
	assert.match(OG_LOGO_LAMA, /og-santrionline/);
});

test('og gambar: MetaGambar memasang ukuran, alt, dan kartu Twitter besar', () => {
	const c = read('src/lib/components/MetaGambar.svelte');
	for (const re of [/og:image:width" content="1200"/, /og:image:height" content="630"/, /og:image:alt/, /twitter:card" content="summary_large_image"/, /twitter:image:alt/]) assert.match(c, re);
	for (const p of ['src/routes/katalog/[jenis]/+page.svelte', 'src/lib/components/HalamanFitur.svelte', 'src/lib/components/ArtikelLiterasi.svelte', 'src/routes/belajar/[modul]/[slug]/+page.svelte']) {
		assert.match(read(p), /<MetaGambar src=\{ogWeb\(/, `${p} tanpa MetaGambar`);
	}
});
