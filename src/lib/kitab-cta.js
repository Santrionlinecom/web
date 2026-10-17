// Tautan corong santrionline.com → app.santrionline.com untuk kitab.
// Situs ini hanya etalase (cuplikan singkat); membaca utuh dan mendaftar di app.
import { slugTanpaBagian } from './chat-rujukan.js';

export const APP = 'https://app.santrionline.com';
const SLUG_RE = /^[a-z0-9-]{1,120}$/;
const UTM = 'utm_source=santrionline.com&utm_medium=katalog&utm_campaign=baca-kitab';

/** Slug dasar yang aman (bagian -bNN dibuang) atau null.
 * @param {string | null | undefined} slug */
export const slugKitabDasar = (slug) => {
	const dasar = slugTanpaBagian(slug);
	return SLUG_RE.test(dasar) ? dasar : null;
};

/** Pembaca kitab (halaman membalik) di app, ber-UTM.
 * @param {string} slug */
export const urlBacaKitab = (slug) => {
	const dasar = slugKitabDasar(slug);
	return dasar ? `${APP}/kitab/${dasar}/baca?${UTM}&utm_content=baca` : `${APP}/kitab`;
};

/**
 * Daftar/masuk gratis. /register dan /daftar di app TIDAK meneruskan tujuan,
 * sedangkan /auth membaca `?redirect=` (path relatif) dan meneruskannya ke
 * Google OAuth — akun baru Google pun kembali ke pembaca setelah mendaftar.
 * @param {string} slug
 */
export const urlDaftarKitab = (slug) => {
	const dasar = slugKitabDasar(slug);
	const tujuan = dasar ? `/kitab/${dasar}/baca` : '/kitab';
	return `${APP}/auth?redirect=${encodeURIComponent(tujuan)}&${UTM}&utm_content=daftar`;
};
