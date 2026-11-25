// Beranda menjadi pintu ke produk belajar di aplikasi: tutor video + kursus gratis (Nov 2026).
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const home = read('src/routes/+page.svelte');
const menu = read('src/lib/belajar/menu.ts');

test('beranda: konten keislaman di depan, keterampilan digital setelah rak kitab sebelum FAQ', () => {
	const hero = home.indexOf('aria-labelledby="judul-beranda"');
	const pilar = home.indexOf('aria-labelledby="judul-pilar"');
	const rak = home.indexOf('aria-labelledby="judul-rak"');
	const bikin = home.indexOf('aria-labelledby="judul-bikin"');
	const faq = home.indexOf('aria-labelledby="judul-faq"');
	assert.ok(hero > 0 && hero < pilar && pilar < rak && rak < bikin && bikin < faq, 'urutan hero -> pilar -> ... -> rak -> keterampilan digital -> FAQ');
	assert.match(home, /Tonton episode 1 gratis/);
	assert.match(home, /Mulai kursus gratis/);
	assert.match(home, /Lihat semua kursus/);
	assert.match(home, /7 video pendek<\/span> · <span>2 episode gratis/);
	assert.match(home, /Gratis<\/span> · <span>11 materi/);
});

test('beranda: tautan produk membawa UTM beranda dan menuju halaman yang benar', () => {
	assert.match(home, /utm_source=santrionline&utm_medium=beranda&utm_campaign=\$\{kampanye\}/);
	assert.match(home, /\/tutor\/website-gratis-tanpa-hosting/);
	assert.match(home, /\$\{TUTOR_SERI\}\/1\?\$\{utm\('tutor-website'\)\}/);
	assert.match(home, /\/kursus\/santri-programmer-1-apps-script\?\$\{utm\('kursus'\)\}/);
	assert.match(home, /\/kursus\?\$\{utm\('kursus'\)\}/);
});

test('beranda: poster tutor lazy, berukuran, dan ber-alt', () => {
	assert.match(home, /<img src=\{tutorPoster\} alt="[^"]+" width="1080" height="1920" loading="lazy" decoding="async" \/>/);
});

test('beranda: harga tutor ditulis jujur, FAQ menyebut yang berbayar', () => {
	assert.match(home, /Rp1\.500 per episode/);
	assert.match(home, /episode lanjutan tutor video Website Gratis Tanpa Hosting/);
});

test('menu: Tutor Video dan Kursus Gratis dengan UTM menu', () => {
	assert.match(menu, /utm_source=santrionline&utm_medium=menu&utm_campaign=\$\{kampanye\}/);
	assert.match(menu, /\$\{APP\}\/tutor\?\$\{utmMenu\('tutor-website'\)\}`, label: 'Tutor Video'/);
	assert.match(menu, /\$\{APP\}\/kursus\?\$\{utmMenu\('kursus'\)\}`, label: 'Kursus Gratis'/);
});
