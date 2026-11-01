import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hargaKursusKatalog } from '../src/lib/harga-kursus.js';

test('kursus belajar tetap Gratis, harga tersimpan tidak bocor ke katalog', () => {
	assert.deepEqual(hargaKursusKatalog(50000, 'Aqidah'), { harga: 'Gratis', gratis: true });
	assert.deepEqual(hargaKursusKatalog(50000, null), { harga: 'Gratis', gratis: true });
	assert.deepEqual(hargaKursusKatalog(0, 'Skill Programmer'), { harga: 'Gratis', gratis: true });
	assert.deepEqual(hargaKursusKatalog(50000, 'Skill Programmer Aqidah'), { harga: 'Gratis', gratis: true });
});

test('kelas skill berbayar tampil dengan harga Rupiah yang sama seperti di app', () => {
	const h = hargaKursusKatalog(149000, ' Skill Programmer ');
	assert.equal(h.gratis, false);
	assert.match(h.harga, /^Rp\s?149\.000$/);
});

test('katalog dan detail kursus memakai satu aturan harga', () => {
	for (const p of ['src/lib/server/katalog.ts', 'src/lib/server/katalog-detail.ts']) {
		const isi = readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
		assert.match(isi, /hargaKursusKatalog\(r\.harga_koin, r\.kategori\)/, p);
	}
});
