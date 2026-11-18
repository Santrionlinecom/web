#!/usr/bin/env node
// Ukur ambang SKOR_MIN_KANDIDAT (src/lib/server/pertanyaan-mirip.ts) terhadap
// vektor siap yang tersimpan. Baca-saja; memanggil REST Workers AI untuk
// embedding kueri (OAuth wrangler, token tidak dicetak; biaya < 0,01 neuron).
//
//   env -u CLOUDFLARE_API_TOKEN node scripts/ukur-ambang-mirip.mjs
//
// Melaporkan: skor parafrase ke soal targetnya (+ peringkatnya), skor tertinggi
// kueri "dekat tapi beda" dan kueri di luar topik, serta sebaran skor soal
// siap terdekat-lain (soal bank sebagai kueri vs soal bank lainnya).
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { AWALAN_KUERI, JUMLAH_KANDIDAT, MODEL_EMBEDDING, SKOR_MIN_KANDIDAT, ambilEmbedding, bacaVektor } from '../src/lib/server/pertanyaan-mirip.ts';

const AKAR = fileURLToPath(new URL('..', import.meta.url));
const data = JSON.parse(readFileSync(`${AKAR}src/lib/server/pertanyaan-siap.json`, 'utf8'));
const vek = JSON.parse(readFileSync(`${AKAR}src/lib/server/pertanyaan-siap-vektor.json`, 'utf8'));
if (vek.model !== MODEL_EMBEDDING) throw new Error(`vektor ${vek.model} != ${MODEL_EMBEDDING}`);
const bank = vek.v.map(bacaVektor);
const idx = (/** @type {string} */ q) => {
	const i = data.findIndex((d) => d.q === q);
	if (i < 0) throw new Error(`soal tidak ada: ${q}`);
	return i;
};

// Parafrase -> soal yang JAWABANNYA memang menjawabnya.
const PARAFRASE = [
	['hukum hasad', 'Apa hukum iri dan dengki?'],
	['bolehkah wanita ziarah ke makam', 'Apa hukum ziarah kubur bagi perempuan?'],
	['kelebihan orang yang belajar agama', 'Apa keutamaan menuntut ilmu?'],
	['cara berbakti pada ayah ibu yang sudah wafat', 'Bagaimana berbakti kepada orang tua yang sudah meninggal?'],
	['rukun islam ada berapa', 'Apa saja rukun Islam?'],
	['makna ikhlas', 'Apa itu ikhlas dalam beramal?'],
	['fadhilah sabar', 'Apa keutamaan sabar?'],
	['bolehkah jamak sholat waktu safar', 'Apa hukum menjamak shalat saat bepergian?'],
	['pengertian tawakkal', 'Apa itu tawakal?'],
	['cara membersihkan najis jilatan anjing', 'Bagaimana cara menyucikan najis anjing?'],
	['apa yang tidak boleh dilakukan perempuan saat menstruasi', 'Apa saja larangan bagi wanita haid?'],
	['kapan harus sujud sahwi', 'Kapan sujud sahwi dilakukan?'],
	['jam berapa mulai waktu subuh', 'Kapan waktu shalat Subuh?'],
	['cara sholat bagi orang sakit', 'Bagaimana shalat orang yang sakit?'],
	['syarat wajib puasa ramadan', 'Apa saja syarat wajib puasa Ramadhan?'],
	['bacaan doa buka puasa', 'Doa apa yang dibaca saat berbuka puasa?'],
	['musafir boleh tidak puasa?', 'Apa hukum puasa bagi musafir?'],
	['keutamaan puasa syawal 6 hari', 'Apa keutamaan puasa enam hari di bulan Syawal?'],
	['hari yang dilarang puasa', 'Hari apa saja yang diharamkan berpuasa?'],
	['siapa yang berhak menerima zakat', 'Siapa saja delapan golongan penerima zakat?'],
	['zakat fitrah berapa kilo', 'Berapa ukuran zakat fitrah?'],
	['hukum qurban', 'Apa hukum berqurban?'],
	['rukun pernikahan', 'Apa saja rukun nikah?'],
	['bedanya mukjizat dengan karomah', 'Apa perbedaan mukjizat dan karamah?'],
	['bolehkah merayakan maulid nabi', 'Apa hukum memperingati maulid Nabi?'],
	['iman naik turun', 'Apakah iman bisa bertambah dan berkurang?'],
	['membaca al kahfi hari jumat', 'Apa keutamaan surat Al-Kahfi di hari Jumat?'],
	['waktu mustajab untuk berdoa', 'Kapan waktu-waktu doa mustajab?'],
	['bacaan dzikir sesudah sholat', 'Apa dzikir setelah shalat?'],
	['doa ketika keluar dari rumah', 'Apa doa keluar rumah?'],
	['bahaya takabur', 'Apa bahaya sombong?'],
	['tips menahan emosi', 'Bagaimana cara mengendalikan amarah?'],
	['siapakah bilal', 'Siapa Bilal bin Rabah?'],
	['urutan wudhu yang benar', 'Bagaimana urutan wudhu dari niat sampai selesai?'],
	['sholat witir hukumnya apa', 'Apakah witir wajib atau sunnah?'],
	['qunut subuh menurut syafii', "Apa hukum membaca qunut pada shalat Subuh menurut mazhab Syafi'i?"],
	['ibu hamil boleh tidak puasa', 'Apa hukum puasa bagi wanita hamil dan menyusui?'],
	['aqiqah anak laki-laki berapa kambing', 'Berapa ekor kambing untuk aqiqah anak laki-laki?'],
	['ciri-ciri orang munafik', 'Apa tanda-tanda orang munafik?'],
	['syarat-syarat taubat', 'Apa syarat taubat yang diterima?'],
	['kisah nabi ibrahim dibakar', 'Bagaimana kisah Nabi Ibrahim dibakar oleh Namrud?']
].filter(([, q]) => data.some((d) => d.q === q));

// Dekat secara topik tetapi jawabannya BERBEDA: tidak boleh dijawab soal siap mana pun.
const DEKAT_BEDA = [
	'Berapa ekor kambing untuk aqiqah anak perempuan?',
	'Kapan waktu shalat Maghrib?',
	'Apa doa masuk rumah?',
	'Apa hukum puasa hari Sabtu saja?',
	'Apa hukum ziarah kubur bagi orang yang junub?',
	'Apa saja rukun haji?',
	'Siapa Abu Bakar ash-Shiddiq?',
	'Berapa nishab zakat emas?',
	'Apa hukum riba dalam jual beli?',
	'Apa doa ketika turun salju?'
];

// Di luar topik agama.
const LUAR_TOPIK = [
	'resep rendang padang',
	'cara install python di windows',
	'harga emas hari ini',
	'jadwal kereta jakarta bandung',
	'cara membuat website toko online',
	'apa itu fotosintesis',
	'skor pertandingan sepak bola semalam',
	'cara menurunkan berat badan'
];

const d1Segar = () => {
	const env = { ...process.env };
	delete env.CLOUDFLARE_API_TOKEN;
	spawnSync('npx', ['wrangler', 'd1', 'execute', 'db-app', '--remote', '--command', 'SELECT 1'], { cwd: AKAR, env, encoding: 'utf8' });
};
const token = () => {
	const t = readFileSync(`${process.env.HOME}/.wrangler/config/default.toml`, 'utf8');
	return /^oauth_token\s*=\s*"([^"]+)"/m.exec(t)?.[1];
};

d1Segar();
const tok = token();
const api = (/** @type {string} */ jalur, /** @type {unknown} */ isi) =>
	fetch(`https://api.cloudflare.com/client/v4${jalur}`, {
		method: isi ? 'POST' : 'GET',
		headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
		body: isi ? JSON.stringify(isi) : undefined
	}).then((r) => r.json());
const akun = process.env.CLOUDFLARE_ACCOUNT_ID ?? (await api('/accounts')).result[0].id;
let neuron = 0;
/** Embed SATU kueri seperti di produksi (awalan kueri, bentuk balasan sama). @param {string} q */
const embedKueri = async (q) => {
	const r = await api(`/accounts/${akun}/ai/run/${MODEL_EMBEDDING}`, { input: [AWALAN_KUERI + q] });
	neuron += Number(r.result?.usage?.neurons ?? 0);
	const e = ambilEmbedding(r.result);
	if (!e) throw new Error('bentuk embedding tidak terduga');
	return e;
};
const semua = (/** @type {number[]} */ q) => {
	const n = Math.hypot(...q) || 1;
	return bank.map((b, i) => ({ i, s: b.reduce((a, x, k) => a + x * q[k], 0) / n })).sort((a, b) => b.s - a.s);
};
const f = (/** @type {number} */ x) => x.toFixed(3);
const sebaran = (/** @type {number[]} */ xs) => {
	const s = [...xs].sort((a, b) => a - b);
	const p = (/** @type {number} */ q) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
	return `min ${f(s[0])} p10 ${f(p(0.1))} median ${f(p(0.5))} p90 ${f(p(0.9))} maks ${f(s[s.length - 1])} (n=${s.length})`;
};

console.log(`model ${MODEL_EMBEDDING}, awalan dokumen "${vek.awalan}", awalan kueri "${AWALAN_KUERI}", SKOR_MIN_KANDIDAT ${SKOR_MIN_KANDIDAT}\n`);

console.log('== Parafrase -> target (skor target, peringkat, skor tertinggi soal lain)');
const skorTarget = [];
const peringkat = [];
for (const [q, t] of PARAFRASE) {
	const r = semua(await embedKueri(q));
	const ti = idx(t);
	const pos = r.findIndex((x) => x.i === ti);
	const lain = r.find((x) => x.i !== ti);
	skorTarget.push(r[pos].s);
	peringkat.push(pos + 1);
	console.log(`${f(r[pos].s)} #${pos + 1} lain ${f(lain.s)}  "${q}" -> ${t}${pos ? `  [teratas: ${data[r[0].i].q}]` : ''}`);
}
console.log(`sebaran skor target: ${sebaran(skorTarget)}`);
console.log(`target #1: ${peringkat.filter((p) => p === 1).length}/${PARAFRASE.length}; dalam ${JUMLAH_KANDIDAT} teratas: ${peringkat.filter((p) => p <= JUMLAH_KANDIDAT).length}/${PARAFRASE.length}; target < ambang: ${skorTarget.filter((s) => s < SKOR_MIN_KANDIDAT).length}\n`);

console.log('== Dekat tapi beda (tidak boleh dijawab): skor tertinggi + soal');
const skorDekat = [];
for (const q of DEKAT_BEDA) {
	const r = semua(await embedKueri(q));
	skorDekat.push(r[0].s);
	console.log(`${f(r[0].s)}  "${q}" -> ${data[r[0].i].q}`);
}
console.log(`sebaran: ${sebaran(skorDekat)}\n`);

console.log('== Luar topik: skor tertinggi + soal');
const skorLuar = [];
for (const q of LUAR_TOPIK) {
	const r = semua(await embedKueri(q));
	skorLuar.push(r[0].s);
	console.log(`${f(r[0].s)}  "${q}" -> ${data[r[0].i].q}`);
}
console.log(`sebaran: ${sebaran(skorLuar)}; >= ambang: ${skorLuar.filter((s) => s >= SKOR_MIN_KANDIDAT).length}/${skorLuar.length}\n`);

// Soal bank sebagai kueri (awalan kueri) vs soal bank LAIN: seberapa dekat soal terdekat-lain.
console.log('== Soal siap terdekat-lain (soal bank sebagai kueri)');
const terdekatLain = [];
/** @type {Array<[number, string, string]>} */
const pasangan = [];
for (let i = 0; i < data.length; i++) {
	const r = semua(await embedKueri(data[i].q));
	const lain = r.find((x) => x.i !== i);
	terdekatLain.push(lain.s);
	pasangan.push([lain.s, data[i].q, data[lain.i].q]);
}
console.log(`sebaran: ${sebaran(terdekatLain)}`);
console.log('10 pasangan terdekat:');
for (const [s, a, b] of pasangan.sort((x, y) => y[0] - x[0]).slice(0, 10)) console.log(`${f(s)}  ${a}  <->  ${b}`);
console.log(`\nneuron terpakai: ${neuron.toFixed(4)}`);
