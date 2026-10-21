// tests/tipe-santri.test.mjs
// Penjaga Tes Tipe Santri versi cara belajar: 7 tipe, setiap tipe bisa menang, seri jujur, tautan hanya ke halaman nyata.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hitungTipe } from '../src/lib/belajar/skor-tipe.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const tes = JSON.parse(read('src/content/belajar/tipe-santri.json'));
const maskot = read('src/lib/belajar/maskot.ts');
const halaman = read('src/routes/tipe-santri/+page.svelte');
const TUJUH = ['pendengar', 'pengamat', 'pembaca', 'penghafal', 'penanya', 'pengamal', 'istiqomah'];
const PELAJARAN_TERBIT = ['0-1-kenapa-belajar-agama-sekarang', '1-1-islam-iman-ihsan', '1-2-rukun-islam', '1-3-rukun-iman'];

// Tautan "cara belajar yang cocok" hanya boleh menunjuk halaman yang sudah dicek 200 (curl, 21 Okt 2026).
// santrionline.com/video belum ada di main (PR #33), jadi video memakai app. /tanya di app butuh login (302),
// jadi Tanya Kitab diarahkan ke halaman daftar.
const TAUTAN_NYATA = new Set([
	'/belajar',
	'/belajar/3/wudhu',
	'/katalog/kitab',
	'https://app.santrionline.com/video',
	'https://app.santrionline.com/al-quran',
	'https://app.santrionline.com/kitab',
	'https://app.santrionline.com/ibadah',
	'https://app.santrionline.com/ibadah/wudhu',
	'https://app.santrionline.com/asmaul-husna',
	'https://app.santrionline.com/register?tipe=penanya'
]);

test('tujuh tipe cara belajar, urutan sama di JSON dan maskot, penyeimbang sudah tidak ada', () => {
	assert.deepEqual(tes.urutan_tipe, TUJUH);
	assert.deepEqual(Object.keys(tes.tipe), TUJUH);
	assert.match(maskot, /URUTAN_TIPE: IdTipe\[\] = \['pendengar', 'pengamat', 'pembaca', 'penghafal', 'penanya', 'pengamal', 'istiqomah'\]/);
	for (const t of TUJUH) assert.match(maskot, new RegExp(`\\t${t}: maskot\\('Si `), `maskot ${t}`);
	assert.doesNotMatch(read('src/content/belajar/tipe-santri.json') + maskot + read('src/routes/+page.svelte'), /penyeimbang|SEIMBANG/i);
	// Halaman hanya menyebut id lama di peta tautan lama (penyeimbang -> istiqomah), tidak sebagai tipe.
	assert.match(halaman, /TIPE_LAMA: Record<string, IdTipe> = \{ penyeimbang: 'istiqomah' \}/);
	assert.doesNotMatch(halaman.replace(/^.*TIPE_LAMA: Record.*$/m, '').replace(/^.*penyeimbang dibaca sebagai istiqomah.*$/m, ''), /penyeimbang/i);
	assert.equal(tes.status, 'draf');
});

test('setiap tipe: nama, emoji, deskripsi, titik mulai terbit, cara belajar ke tautan nyata', () => {
	for (const [id, t] of Object.entries(tes.tipe)) {
		assert.match(t.nama, /^Si [A-Z]/, id);
		assert.ok(t.emoji, `${id}: emoji`);
		assert.ok(t.deskripsi.length > 80, `${id}: deskripsi`);
		assert.ok(PELAJARAN_TERBIT.includes(t.titik_mulai.pelajaran), `${id}: titik mulai`);
		assert.ok(t.cara_belajar.length >= 2, `${id}: cara belajar`);
		for (const c of t.cara_belajar) assert.ok(TAUTAN_NYATA.has(c.href), `${id}: ${c.href} belum dicek`);
	}
	assert.match(tes.tipe.istiqomah.deskripsi, /Ilmu yang datang perlahan tapi diulang terus akan lebih lama tinggal di hati\./);
	assert.ok(tes.tipe.istiqomah.jadwal.length >= 3, 'istiqomah: jadwal murojaah kecil');
});

test('catatan jujur: bukan penilaian iman, pintu masuk bukan satu-satunya, tanpa klaim dalil atau kisah tokoh', () => {
	assert.match(tes.catatan_penting, /bukan penilaian keimanan, kesalehan/);
	assert.equal(tes.pintu_masuk, 'Ini pintu masuk yang paling nyaman, bukan satu-satunya cara belajar.');
	const isi = JSON.stringify({ tipe: tes.tipe, situasi: tes.situasi });
	assert.doesNotMatch(isi, /hadits|hadis|ayat|\bHR\b|Ibnu Hajar|Imam |sabda|firman/i);
	assert.match(halaman, /tes\.pintu_masuk/);
	assert.match(halaman, /tes\.catatan_penting/);
});

test('soal: 10 situasi x 5 pilihan, tiap tipe muncul minimal 6 kali, ada pilihan tempo pelan untuk istiqomah', () => {
	assert.equal(tes.situasi.length, 10);
	const muncul = Object.fromEntries(TUJUH.map((t) => [t, 0]));
	for (const s of tes.situasi) {
		assert.equal(s.pilihan.length, 5, `situasi ${s.no}`);
		const tipeSoal = s.pilihan.flatMap((o) => Object.keys(o.skor));
		assert.equal(new Set(tipeSoal).size, tipeSoal.length, `situasi ${s.no}: tipe ganda`);
		for (const t of tipeSoal) muncul[t] += 1;
	}
	for (const t of TUJUH) assert.ok(muncul[t] >= 6, `${t} hanya ${muncul[t]}x`);
	const teksIstiqomah = tes.situasi.flatMap((s) => s.pilihan.filter((o) => o.skor.istiqomah).map((o) => o.teks)).join(' ');
	assert.match(teksIstiqomah, /Belum paham\? Aku ulang lagi besok dan besoknya sampai paham/);
});

/** Pilih jawaban tipe t bila ada; selain itu tipe lain yang skornya paling rendah. */
function jalurMenang(t) {
	const skor = Object.fromEntries(TUJUH.map((x) => [x, 0]));
	return tes.situasi.map((s) => {
		let j = s.pilihan.findIndex((o) => o.skor[t]);
		if (j < 0) {
			const urut = s.pilihan.map((o, i) => [i, Object.keys(o.skor)[0]]).sort((a, b) => skor[a[1]] - skor[b[1]]);
			j = urut[0][0];
		}
		for (const [k, n] of Object.entries(s.pilihan[j].skor)) skor[k] += n;
		return j;
	});
}

test('setiap tipe bisa menang sendirian, dan cara kedua selalu ada', () => {
	for (const t of TUJUH) {
		const h = hitungTipe(TUJUH, tes.situasi, jalurMenang(t));
		assert.equal(h.utama, t, `${t} tidak bisa menang`);
		assert.equal(h.seri, false, `${t} menang tapi seri`);
		assert.ok(TUJUH.includes(h.kedua) && h.kedua !== t, `${t}: cara kedua`);
	}
});

test('seri di puncak ditampilkan jujur sebagai dua cara (urutan daftar), tanpa menyembunyikan salah satunya', () => {
	// Jawab 5 soal untuk pendengar dan 5 untuk istiqomah -> 10 : 10.
	const pilih = tes.situasi.map((s, i) => {
		const ingin = i % 2 === 0 ? ['pendengar', 'istiqomah'] : ['istiqomah', 'pendengar'];
		for (const t of ingin) {
			const j = s.pilihan.findIndex((o) => o.skor[t]);
			if (j >= 0) return j;
		}
		return 0;
	});
	const h = hitungTipe(TUJUH, tes.situasi, pilih);
	assert.equal(h.skor.pendengar, h.skor.istiqomah);
	assert.equal(h.seri, true);
	assert.deepEqual([h.utama, h.kedua], ['pendengar', 'istiqomah']);
	assert.match(halaman, /Kamu cocok dengan dua cara/);
	assert.match(halaman, /Cara keduamu/);
});

test('hitungTipe: jawaban kosong diabaikan, skor tidak dikenal diabaikan', () => {
	const h = hitungTipe(['a', 'b'], [{ pilihan: [{ skor: { b: 2, x: 9 } }] }, { pilihan: [{ skor: { a: 2 } }] }], [0, null]);
	assert.deepEqual(h, { utama: 'b', kedua: 'a', seri: false, skor: { a: 0, b: 2 } });
});

test('mockup dan dokumen tidak lagi menyebut tipe yang dihapus di sumber maskot', () => {
	const stick = read('docs/mockup/_sumber/stick.py');
	assert.doesNotMatch(stick, /penyeimbang/);
	for (const t of TUJUH) assert.match(stick, new RegExp(`"${t}"`));
	assert.ok(readdirSync(join(root, 'docs/mockup')).length > 0);
});
