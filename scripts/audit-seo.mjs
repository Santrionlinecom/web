// scripts/audit-seo.mjs — audit SEO teknis HTML hasil render (tanpa dependensi).
// Pakai: jalankan server (npm run dev / npm run preview), lalu
//   node scripts/audit-seo.mjs http://localhost:5173 [path ...]
// Tanpa daftar path: semua <loc> di /sitemap.xml + contoh detail katalog.
// Aturan yang diperiksa sama dengan tests/seo-halaman.test.mjs (lihat src/lib/seo.js).
import { auditHtml } from '../src/lib/seo-audit.js';

const asal = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
let paths = process.argv.slice(3);
if (!paths.length) {
	const sm = await (await fetch(`${asal}/sitemap.xml`)).text();
	paths = [...sm.matchAll(/<loc>https:\/\/santrionline\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
	paths.push('/katalog/game/kampung-santri');
}

const judulDipakai = new Map();
let gagal = 0;
for (const p of paths) {
	const res = await fetch(`${asal}${p}`, { redirect: 'manual' });
	if (res.status !== 200) {
		console.log(`✗ ${p} → HTTP ${res.status}`);
		gagal++;
		continue;
	}
	const hasil = auditHtml(await res.text(), p);
	if (hasil.title) judulDipakai.set(hasil.title, [...(judulDipakai.get(hasil.title) ?? []), p]);
	if (hasil.masalah.length) gagal++;
	console.log(`${hasil.masalah.length ? '✗' : '✓'} ${p}  [${hasil.tipe.join(', ')}]`);
	for (const m of hasil.masalah) console.log(`    - ${m}`);
}
for (const [t, ps] of judulDipakai) if (ps.length > 1) { gagal++; console.log(`✗ title ganda "${t}": ${ps.join(', ')}`); }
console.log(`\n${paths.length} halaman, ${gagal} bermasalah.`);
process.exitCode = gagal ? 1 : 0;
