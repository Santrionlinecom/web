#!/usr/bin/env node
// Bangun ulang kolam pertanyaan siap-klik (src/lib/server/pertanyaan-siap*.json)
// dari bank soal SAH di D1 `db-app`, supaya salinan statis web sama dengan yang
// dijawab app (cariBankSoal) dan tidak merujuk kitab yang sudah dikeluarkan.
//
//   env -u CLOUDFLARE_API_TOKEN node scripts/siap-dari-bank.mjs           # uji kering, cetak laporan
//   env -u CLOUDFLARE_API_TOKEN node scripts/siap-dari-bank.mjs --tulis   # tulis kedua berkas JSON
//
// Aturan:
//  - D1 hanya dibaca (SELECT). Tidak ada tulis ke D1 / Vectorize / R2.
//  - Hanya pertanyaan yang SUDAH ada di kolam yang dipertahankan, dengan isi
//    (ringkasan + rujukan) diambil ulang dari baris bank berstatus 'sah'.
//    Soal yang kini 'lolos'/'draf'/'buang' dikeluarkan: konten agama tayang
//    hanya setelah disahkan pemilik.
//  - Semua rujukan harus masih 'indexed' (sama dengan cariBankSoal: kurang satu
//    = tidak dipakai), dari kitab berlisensi sah di kitab_catalog (atau korpus
//    ayat Al-Qur'an), dan bukan kitab di src/lib/kitab-dikeluarkan.js.
//  - Ringkasan yang nomor [n]-nya tidak lagi cocok dengan rujukannya dibuang,
//    bukan dinomori ulang: sitasi di luar jumlah rujukan, atau rujukan berubah
//    sementara kalimat ringkasan tetap (id dipangkas tanpa menjawab ulang).
//  - Vektor pertanyaan dipakai ulang dari berkas lama (teks pertanyaan sama),
//    jadi tidak ada panggilan embedding.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { susunBalasan } from '../src/lib/chat-balasan.js';
import { kunciPertanyaan } from '../src/lib/pertanyaan-siap.js';
import { alasanKitabTerlarang, judulTerlarang, slugDariTautan } from '../src/lib/kitab-dikeluarkan.js';

const AKAR = fileURLToPath(new URL('..', import.meta.url));
const BERKAS_DATA = `${AKAR}src/lib/server/pertanyaan-siap.json`;
const BERKAS_VEKTOR = `${AKAR}src/lib/server/pertanyaan-siap-vektor.json`;
const LISENSI_SAH = new Set(['turats', 'milik-sendiri', 'izin']);
/** Korpus bantu ayat Al-Qur'an (slug `quran-ayat-bNN`) memang tanpa baris katalog. */
const SLUG_AYAT = 'quran-ayat';
const TULIS = process.argv.includes('--tulis');

/** Kunci bank app (bank-soal.ts kunciPertanyaan): NFKC + kunci web. @param {string} q */
const kunciBank = (q) => kunciPertanyaan(String(q).normalize('NFKC'));
/** @param {string} s */
const literal = (s) => `'${String(s).replace(/'/g, "''")}'`;
/** @param {string|null|undefined} slug */
const slugDasar = (slug) => String(slug ?? '').trim().replace(/-b\d{2}$/, '');

/** SELECT baca-saja ke D1 produksi lewat wrangler (OAuth). @param {string} sql */
const d1 = (sql) => {
	if (!/^\s*SELECT\s/i.test(sql) || /;\s*\S/.test(sql)) throw new Error('Hanya satu SELECT yang diizinkan');
	const env = { ...process.env };
	delete env.CLOUDFLARE_API_TOKEN;
	let galat = '';
	// API D1 kadang membalas 7403/jaringan putus sesaat: ulangi sampai 3 kali.
	for (let coba = 1; coba <= 3; coba++) {
		const r = spawnSync('npx', ['wrangler', 'd1', 'execute', 'db-app', '--remote', '--json', '--command', sql], {
			cwd: AKAR,
			env,
			encoding: 'utf8',
			maxBuffer: 256 * 1024 * 1024
		});
		const i = r.stdout?.indexOf('[') ?? -1;
		if (r.status === 0 && i >= 0) return JSON.parse(r.stdout.slice(i))[0].results;
		galat = `wrangler gagal (${r.status}): ${(r.stderr || r.stdout || '').slice(-1500)}`;
	}
	throw new Error(galat);
};
/** @template T @param {T[]} xs @param {number} n */
const potong = (xs, n) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n));

/** Sama dengan petaRef di app src/routes/api/public/tanya-kitab/+server.ts. */
const petaRef = (/** @type {Record<string, any>} */ r) => ({
	judul: String(r.judul),
	lokasi:
		r.source_ref?.trim() ||
		[r.jilid ? `jilid ${r.jilid}` : '', r.halaman ? `hlm ${r.halaman}` : '', r.chapter?.trim() ?? ''].filter(Boolean).join(', ') ||
		null,
	slug: r.kitab_slug ?? null,
	id: r.id ?? null,
	cuplikan: String(r.awal ?? '').replace(/\s+/g, ' ').trim().slice(0, 280)
});

/** Teks ringkasan dari reply (buang penutup baku chat-balasan.js). @param {string} reply */
const ringkasanDari = (reply) => String(reply).split('\n\nKlik rujukan untuk membuka kitabnya.')[0];
/** Bandingkan kalimat tanpa nomor sitasi. @param {string} t */
const tanpaSitasi = (t) =>
	String(t)
		.replace(/\[\d+\]/g, '')
		.replace(/\s+([.,;:])/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();

/** Jumlah rujukan yang menyebut kitab terlarang (judul ATAU tautan). @param {Array<{rujukan: Array<{judul: string, url: string|null}>}>} kolam */
const hitungTerlarang = (kolam) => {
	let sebutan = 0;
	let item = 0;
	for (const d of kolam) {
		const n = d.rujukan.filter((r) => judulTerlarang(r.judul) || alasanKitabTerlarang(slugDariTautan(r.url))).length;
		sebutan += n;
		if (n) item++;
	}
	return { item, sebutan };
};

const lama = /** @type {Array<{q: string, reply: string, rujukan: Array<{no: number, judul: string, lokasi: string|null, url: string|null}>}>} */ (
	JSON.parse(readFileSync(BERKAS_DATA, 'utf8'))
);
const vektorLama = JSON.parse(readFileSync(BERKAS_VEKTOR, 'utf8'));
if (vektorLama.v.length !== lama.length) throw new Error(`Vektor lama (${vektorLama.v.length}) tidak selaras dengan kolam (${lama.length})`);

// 1) Baris bank untuk tiap pertanyaan kolam, semua status (untuk laporan).
const kunciKolam = [...new Set(lama.map((d) => kunciBank(d.q)))];
/** @type {Map<string, Record<string, any>>} */
const bank = new Map();
for (const bagian of potong(kunciKolam, 60)) {
	const sql = `SELECT id, pertanyaan, kunci, status, ringkasan, referensi_ids FROM kitab_bank_soal WHERE kunci IN (${bagian.map(literal).join(',')})`;
	for (const b of d1(sql)) bank.set(b.kunci, b);
}

// 2) Rujukan (hanya yang masih indexed) + katalog lisensi.
const semuaId = [
	...new Set(
		[...bank.values()].filter((b) => b.status === 'sah').flatMap((b) => /** @type {unknown[]} */ (JSON.parse(b.referensi_ids)).map(String))
	)
];
/** @type {Map<string, Record<string, any>>} */
const rujukan = new Map();
for (const bagian of potong(semuaId, 60)) {
	const sql = `SELECT id, judul, halaman, jilid, kitab_slug, source_ref, chapter, substr(isi_teks, 1, 1500) AS awal FROM kitab_referensi WHERE status = 'indexed' AND id IN (${bagian.map(literal).join(',')})`;
	for (const r of d1(sql)) rujukan.set(String(r.id), r);
}
const katalog = new Map(d1('SELECT slug, status, lisensi FROM kitab_catalog').map((c) => [c.slug, c]));

// 3) Susun ulang.
const baru = [];
const vektorBaru = [];
/** @type {Array<{q: string, alasan: string}>} */
const dibuang = [];
let berubah = 0;
lama.forEach((d, i) => {
	const b = bank.get(kunciBank(d.q));
	if (!b) return dibuang.push({ q: d.q, alasan: 'tidak-ada-di-bank' });
	if (b.status !== 'sah') return dibuang.push({ q: d.q, alasan: `status-${b.status}` });
	const ids = /** @type {unknown[]} */ (JSON.parse(b.referensi_ids)).map(String);
	const refs = ids.map((id) => rujukan.get(id));
	const alasan = new Set();
	if (!ids.length || refs.some((r) => !r)) alasan.add('rujukan-tidak-terindeks');
	for (const r of refs) {
		if (!r) continue;
		const slug = slugDasar(r.kitab_slug);
		const larang = alasanKitabTerlarang(slug);
		if (larang) alasan.add(`kitab-${larang}:${slug}`);
		if (slug === SLUG_AYAT) continue;
		const c = katalog.get(slug);
		if (!c || c.status !== 'published' || !LISENSI_SAH.has(c.lisensi)) alasan.add(`tanpa-lisensi:${slug}`);
	}
	// Nomor [n] di ringkasan mengikuti urutan referensi_ids saat ringkasan ditulis.
	// Sitasi di luar jumlah rujukan = daftar rujukan sudah dipangkas sesudahnya.
	const sitasi = [...String(b.ringkasan).matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1]));
	if (sitasi.some((n) => n < 1 || n > ids.length)) alasan.add('sitasi-di-luar-rujukan');
	if (alasan.size) return dibuang.push({ q: d.q, alasan: [...alasan].sort().join(',') });
	const balasan = susunBalasan({ status: 'ada', ringkasan: b.ringkasan, referensi: refs.map((r) => petaRef(/** @type {any} */ (r))) });
	const item = { q: d.q, reply: balasan.reply, rujukan: balasan.rujukan };
	if (JSON.stringify(item) !== JSON.stringify(d)) {
		// Rujukan berubah tetapi kalimat ringkasan tetap = id rujukan dipangkas tanpa menulis
		// ulang ringkasan: nomor [n] bergeser ke kitab lain dan kalimat yang dulu bersandar
		// pada rujukan yang hilang masih tampil. Jangan disalin; ringkasan tidak diedit tangan.
		if (tanpaSitasi(ringkasanDari(d.reply)) === tanpaSitasi(b.ringkasan)) {
			return dibuang.push({ q: d.q, alasan: 'rujukan-dipangkas-ringkasan-lama' });
		}
		berubah++;
	}
	baru.push(item);
	vektorBaru.push(vektorLama.v[i]);
});

const laporan = {
	sebelum: { item: lama.length, vektor: vektorLama.v.length, terlarang: hitungTerlarang(lama) },
	sesudah: { item: baru.length, vektor: vektorBaru.length, terlarang: hitungTerlarang(baru), isiDiperbarui: berubah },
	dibuangPerAlasan: dibuang.reduce((/** @type {Record<string, number>} */ a, x) => ((a[x.alasan] = (a[x.alasan] ?? 0) + 1), a), {}),
	dibuang
};
console.log(JSON.stringify(laporan, null, 1));
if (laporan.sesudah.terlarang.sebutan) throw new Error('Masih ada rujukan ke kitab terlarang');

if (TULIS) {
	writeFileSync(BERKAS_DATA, JSON.stringify(baru, null, 1));
	writeFileSync(BERKAS_VEKTOR, JSON.stringify({ ...vektorLama, v: vektorBaru }));
	console.error(`ditulis: ${baru.length} item + ${vektorBaru.length} vektor`);
} else {
	console.error('uji kering: tambahkan --tulis untuk menulis berkas');
}
