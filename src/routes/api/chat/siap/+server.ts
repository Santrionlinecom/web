import { json, type RequestHandler } from '@sveltejs/kit';
import { siapUntukSaatIni } from '$lib/server/pertanyaan-siap';
import { sisaSlotMs } from '$lib/pertanyaan-siap.js';

/** Tiga pertanyaan siap-klik untuk slot 30 menit saat ini (dicache sampai slot berakhir). */
export const GET: RequestHandler = async () => {
	const detik = Math.max(1, Math.floor(sisaSlotMs() / 1000));
	return json(siapUntukSaatIni(), { headers: { 'cache-control': `public, max-age=${detik}, s-maxage=${detik}` } });
};
