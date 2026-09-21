import { error } from '@sveltejs/kit';
import { cariFitur, FITUR_LEMBAGA } from '$lib/fitur-lembaga';
import type { PageServerLoad, EntryGenerator } from './$types';

// Prerender keempat halaman: isinya statis, tidak menyentuh D1.
export const prerender = true;
export const entries: EntryGenerator = () => FITUR_LEMBAGA.map((f) => ({ slug: f.slug }));

export const load: PageServerLoad = ({ params }) => {
	const fitur = cariFitur(params.slug);
	if (!fitur) throw error(404, 'Halaman fitur tidak ditemukan');
	const terkait = fitur.terkait
		.map((s) => cariFitur(s))
		.filter((f): f is NonNullable<typeof f> => Boolean(f))
		.map((f) => ({ slug: f.slug, label: f.label, judul: f.judul }));
	return { fitur, terkait };
};
