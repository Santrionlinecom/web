// tests/motion-css.test.mjs
// Penjaga spesifisitas CSS motion.
//
// Latar: 2026-08-21 seluruh bagian tengah beranda kosong permanen karena
// aturan penyembunyi `.js-reveal .so-reveal` (spesifisitas 0,2,0) mengalahkan
// aturan pemunculan `.so-reveal-visible` (0,1,0). JS menambahkan kelasnya
// dengan benar, tapi CSS-nya kalah — jadi konten tidak pernah terlihat.
//
// Tes ini menolak pola itu kembali: setiap aturan yang MENYEMBUNYIKAN konten
// wajib punya pasangan pemunculan yang minimal sama spesifiknya.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(fileURLToPath(new URL('../src/routes/layout.css', import.meta.url)), 'utf8');

/** Hitung spesifisitas kasar (jumlah .class, [attr], dan :pseudo-class). */
function spesifisitas(selector) {
	return (selector.match(/\.[a-zA-Z_-][\w-]*|\[[^\]]+\]/g) ?? []).length;
}

test('aturan pemunculan reveal lebih spesifik daripada aturan penyembunyi', () => {
	// Penyembunyi beranda: .js-reveal .so-reveal { opacity: 0 }
	const penyembunyi = '.js-reveal .so-reveal';
	const pemunculan = '.js-reveal .so-reveal.so-reveal-visible';

	assert.ok(
		css.includes(pemunculan),
		'Selektor pemunculan spesifik hilang — konten beranda berisiko kosong permanen.'
	);
	assert.ok(
		spesifisitas(pemunculan) > spesifisitas(penyembunyi),
		`Pemunculan (${spesifisitas(pemunculan)}) harus > penyembunyi (${spesifisitas(penyembunyi)}).`
	);
});

test('aturan pemunculan inview lebih spesifik daripada aturan penyembunyi', () => {
	const penyembunyi = '.js-inview [data-inview]';
	const pemunculan = '.js-inview [data-inview].inview-visible';

	assert.ok(css.includes(pemunculan), 'Selektor pemunculan inview hilang.');
	assert.ok(
		spesifisitas(pemunculan) > spesifisitas(penyembunyi),
		`Pemunculan (${spesifisitas(pemunculan)}) harus > penyembunyi (${spesifisitas(penyembunyi)}).`
	);
});

test('prefers-reduced-motion memaksa konten terlihat', () => {
	const blok = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
	assert.match(blok, /opacity:\s*1\s*!important/, 'reduced-motion wajib memaksa opacity terlihat.');
});
