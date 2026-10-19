// src/routes/belajar/[modul]/[slug]/+page.server.ts: satu pelajaran (konten dimuat saat build).
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { PELAJARAN, cariPelajaran } from '$lib/server/belajar';

export const prerender = true;

export const entries: EntryGenerator = () => PELAJARAN.map((p) => ({ modul: String(p.modul), slug: p.slug }));

export const load: PageServerLoad = ({ params }) => {
	const pelajaran = cariPelajaran(Number(params.modul), params.slug);
	if (!pelajaran) error(404, 'Pelajaran tidak ditemukan');
	const i = PELAJARAN.indexOf(pelajaran);
	const tautan = (p: (typeof PELAJARAN)[number] | undefined) =>
		p ? { href: p.href, judul: p.judul, modul: p.modul, no: p.no } : null;
	return {
		pelajaran,
		sebelumnya: tautan(PELAJARAN[i - 1]),
		berikutnya: tautan(PELAJARAN[i + 1]),
		total: 24
	};
};
