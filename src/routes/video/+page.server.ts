// src/routes/video/+page.server.ts
// Galeri video. Daftar dari aplikasi (APP/video/daftar.json), pemutar = iframe
// sematan aplikasi. ?v=SLUG membuka video itu (OG judul/gambar ikut video).
import type { PageServerLoad } from './$types';
import { basisApp } from '$lib/video.js';
import { muatDaftarVideo } from '$lib/server/video';

export const load: PageServerLoad = async ({ url, platform, fetch, setHeaders }) => {
	// APP_BASE hanya diisi untuk pratinjau (menunjuk pratinjau aplikasi);
	// produksi selalu app.santrionline.com.
	const app = basisApp((platform?.env as { APP_BASE?: string } | undefined)?.APP_BASE);
	const { daftar, gagal } = await muatDaftarVideo(app, fetch);
	const v = url.searchParams.get('v');
	const dipilih = v && daftar.some((d) => d.slug === v) ? v : null;
	setHeaders({ 'cache-control': gagal ? 'public, max-age=60' : 'public, max-age=300' });
	return { app, daftar, gagal, dipilih };
};
