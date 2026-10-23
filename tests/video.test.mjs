// tests/video.test.mjs
// Penjaga galeri /video: daftar dari aplikasi, pemutar = iframe sematan aplikasi.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	APP_PRODUKSI,
	basisApp,
	durasiIso,
	formatDurasi,
	jsonLdVideo,
	kategoriDari,
	ldAman,
	normalisasiDaftar,
	srcPemutar
} from '../src/lib/video.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');

const APP = 'https://app.santrionline.com';
const contoh = (slug, lain = {}) => ({
	slug,
	judul: `Judul ${slug}`,
	ringkas: `Ringkas ${slug}`,
	kategori: 'kisah',
	kategoriLabel: 'Kisah Santri',
	durasi: 77,
	tanggal: '2026-10-21',
	poster: `https://files.santrionline.com/video/${slug}.jpg`,
	berkas: `https://files.santrionline.com/video/${slug}.mp4`,
	embed: `${APP}/video/${slug}/embed`,
	tonton: `${APP}/video?v=${slug}`,
	artikel: null,
	...lain
});

test('basisApp: produksi bawaan, APP_BASE hanya https yang wajar', () => {
	assert.equal(APP_PRODUKSI, 'https://app.santrionline.com');
	assert.equal(basisApp(undefined), APP_PRODUKSI);
	assert.equal(basisApp(''), APP_PRODUKSI);
	assert.equal(basisApp('http://evil.test'), APP_PRODUKSI);
	assert.equal(basisApp('https://x.test/jalan'), APP_PRODUKSI);
	assert.equal(basisApp(' https://feat-x.app-santrionline.pages.dev/ '), 'https://feat-x.app-santrionline.pages.dev');
});

test('normalisasiDaftar: buang butir rusak, duplikat, dan URL bukan https', () => {
	assert.deepEqual(normalisasiDaftar(null), []);
	assert.deepEqual(normalisasiDaftar({ a: 1 }), []);
	const hasil = normalisasiDaftar([
		contoh('a', { artikel: `${APP}/blog/x` }),
		contoh('a'),
		contoh('b', { embed: 'javascript:alert(1)' }),
		contoh('c', { poster: 'http://x/y.jpg' }),
		contoh('D besar'),
		contoh('e', { judul: '' }),
		contoh('f', { tanggal: 'kemarin', durasi: 'x', artikel: 'ftp://x', berkas: undefined }),
		42
	]);
	assert.deepEqual(hasil.map((v) => v.slug), ['a', 'f']);
	assert.equal(hasil[0].artikel, `${APP}/blog/x`);
	assert.equal(hasil[1].tanggal, null);
	assert.equal(hasil[1].durasi, 0);
	assert.equal(hasil[1].artikel, null);
	assert.equal(hasil[1].berkas, null);
});

test('kategori, durasi, dan src pemutar', () => {
	const d = normalisasiDaftar([contoh('a'), contoh('b', { kategori: 'kajian', kategoriLabel: 'Kajian' }), contoh('c')]);
	assert.deepEqual(kategoriDari(d), [
		{ id: 'kisah', label: 'Kisah Santri' },
		{ id: 'kajian', label: 'Kajian' }
	]);
	assert.equal(formatDurasi(77), '1:17');
	assert.equal(formatDurasi(447), '7:27');
	assert.equal(durasiIso(77), 'PT1M17S');
	assert.equal(durasiIso(32), 'PT32S');
	assert.equal(srcPemutar(d[0], true), `${APP}/video/a/embed?autoplay=1`);
	assert.equal(srcPemutar(d[0]), `${APP}/video/a/embed`);
});

test('JSON-LD: VideoObject lengkap, uploadDate hanya bila tanggal diketahui', () => {
	const d = normalisasiDaftar([contoh('a'), contoh('b', { tanggal: null })]);
	const ld = jsonLdVideo(d, 'https://santrionline.com/video');
	assert.equal(ld['@type'], 'ItemList');
	const [a, b] = ld.itemListElement.map((i) => i.item);
	assert.equal(a['@type'], 'VideoObject');
	for (const k of ['name', 'description', 'thumbnailUrl', 'embedUrl', 'contentUrl']) assert.ok(a[k], k);
	assert.equal(a.embedUrl, `${APP}/video/a/embed`);
	assert.equal(a.contentUrl, 'https://files.santrionline.com/video/a.mp4');
	assert.equal(a.uploadDate, '2026-10-21');
	assert.equal(a.duration, 'PT1M17S');
	assert.equal('uploadDate' in b, false);
	assert.doesNotMatch(ldAman({ x: '</script>' }), /<\/script>/);
});

test('halaman /video: iframe sematan, tombol, keadaan kosong, OG per video', () => {
	const page = read('src/routes/video/+page.svelte');
	const server = read('src/routes/video/+page.server.ts');
	const ambil = read('src/lib/server/video.ts');
	assert.match(page, /<iframe[\s\S]*allow="autoplay; fullscreen; picture-in-picture"[\s\S]*allowfullscreen/);
	assert.match(page, /title="Video: \{video\.judul\}"/);
	assert.match(page, /aspect-ratio: 9 \/ 16/);
	assert.match(page, /max-height: 80vh/);
	assert.match(page, /Baca artikelnya/);
	assert.match(page, /Tonton di aplikasi/);
	assert.match(page, /href="\{data\.app\}\/video">Tonton di aplikasi/);
	assert.match(page, /rel="canonical"/);
	assert.match(page, /<MetaGambar src=\{gambar\}/);
	assert.match(page, /ogWeb\('\/video', awal\?\.poster\)/);
	assert.match(page, /href="\/video\?v=\{v\.slug\}"/);
	assert.match(page, /<h1>Video SantriOnline<\/h1>/);
	// Gagal ambil = daftar kosong, tidak pernah melempar error/500.
	assert.doesNotMatch(server + ambil, /error\(\s*5\d\d/);
	assert.match(ambil, /catch/);
	assert.match(ambil, /\/video\/daftar\.json/);
	assert.match(server, /APP_BASE/);
});

test('/video ada di sitemap, menu utama, footer, dan memakai kerangka situs baru', () => {
	assert.match(read('src/routes/sitemap.xml/+server.ts'), /path: '\/video'/);
	const menu = read('src/lib/belajar/menu.ts');
	assert.match(menu, /\{ label: 'Video', href: '\/video', aktif: '\/video' \}/);
	assert.match(menu, /\{ href: '\/video', label: 'Video' \}/);
	assert.match(read('src/routes/+layout.svelte'), /RUTE_BARU = \[[^\]]*'\/video'/);
});
