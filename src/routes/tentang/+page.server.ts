// src/routes/tentang/+page.server.ts — angka traksi nyata (COUNT saja) untuk halaman Tentang.
// Gagal -> null, blok angka disembunyikan. Cache tepi 5 menit seperti beranda.
import type { PageServerLoad } from './$types';
import { muatStatistik } from '$lib/server/statistik';

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const db = (platform?.env as { DB?: D1Database } | undefined)?.DB;
	const statistik = await muatStatistik(db);
	setHeaders({ 'cache-control': 'public, max-age=60, s-maxage=300' });
	return { statistik };
};
