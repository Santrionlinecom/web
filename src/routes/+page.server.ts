// src/routes/+page.server.ts — beranda etalase: katalog dari D1 db-app.
import type { PageServerLoad } from './$types';
import { muatKatalog } from '$lib/server/katalog';

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const db = (platform?.env as { DB?: D1Database } | undefined)?.DB;
	const rak = await muatKatalog(db);
	// Katalog berubah jarang; cache tepi 5 menit supaya D1 tidak dipukul tiap kunjungan.
	setHeaders({ 'cache-control': 'public, max-age=60, s-maxage=300' });
	return { rak };
};
