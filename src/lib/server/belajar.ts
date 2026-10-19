// src/lib/server/belajar.ts
// Konten "Belajar Islam dari nol": dimuat saat build (import.meta.glob ?raw),
// jadi halaman tetap bisa prerender/SSR tanpa D1.
import { parse as parseYaml } from 'yaml';
import { Marked } from 'marked';
import dataModul from '../../content/belajar/_modul.json';

const berkas = import.meta.glob('/src/content/belajar/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export type StatusPelajaran = 'draf' | 'dicek' | 'terbit' | 'belum_ditulis';

export interface Dalil {
	jenis: string;
	rujukan: string;
	url?: string | null;
	arab: string;
	terjemah: string;
}
export interface Kuis {
	tanya: string;
	pilihan: string[];
	jawaban: number;
	penjelasan: string;
}
export interface DoaDzikir {
	arab: string;
	latin?: string | null;
	terjemah: string;
	sumber?: string | null;
}
export interface Pelajaran {
	modul: number;
	no: number;
	slug: string;
	stem: string;
	href: string;
	judul: string;
	ringkas: string;
	durasi_baca: string | null;
	status: StatusPelajaran;
	dicek_oleh: string | null;
	dalil: Dalil[];
	kuis: Kuis[];
	bawa_pulang: { inti: string; amalan_hari_ini: string | null; doa_atau_dzikir: DoaDzikir | null };
	durasi_video: number | null;
	html: string;
}

const esc = (t: string) =>
	t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// HTML mentah di markdown tidak pernah diteruskan: selalu di-escape.
const md = new Marked({
	gfm: true,
	renderer: {
		html: (t) => esc(t.text)
	}
});

/** Pisahkan frontmatter YAML dari badan markdown. */
export function pisahFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
	const teks = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
	const m = teks.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!m) throw new Error('frontmatter tidak ditemukan');
	return { data: (parseYaml(m[1]) ?? {}) as Record<string, unknown>, body: m[2] };
}

function bacaSemua(): Pelajaran[] {
	const hasil: Pelajaran[] = [];
	for (const [path, raw] of Object.entries(berkas)) {
		const stem = path.split('/').pop()!.replace(/\.md$/, '');
		const { data, body } = pisahFrontmatter(raw);
		const modul = Number(data.modul);
		const no = Number(data.no);
		const slug = String(data.slug);
		const bp = (data.bawa_pulang ?? {}) as Pelajaran['bawa_pulang'];
		const video = (data.video ?? {}) as { durasi_target_detik?: number };
		hasil.push({
			modul,
			no,
			slug,
			stem,
			href: `/belajar/${modul}/${slug}`,
			judul: String(data.judul),
			ringkas: String(data.ringkas ?? ''),
			durasi_baca: data.durasi_baca ? String(data.durasi_baca) : null,
			status: (data.status as StatusPelajaran) ?? 'draf',
			dicek_oleh: (data.dicek_oleh as string | null) ?? null,
			dalil: (data.dalil as Dalil[]) ?? [],
			kuis: (data.kuis as Kuis[]) ?? [],
			bawa_pulang: {
				inti: bp.inti ?? '',
				amalan_hari_ini: bp.amalan_hari_ini ?? null,
				doa_atau_dzikir: bp.doa_atau_dzikir ?? null
			},
			durasi_video: video.durasi_target_detik ?? null,
			html: md.parse(body, { async: false }) as string
		});
	}
	return hasil.sort((a, b) => a.modul - b.modul || a.no - b.no);
}

export const PELAJARAN: Pelajaran[] = bacaSemua();

export const cariPelajaran = (modul: number, slug: string) =>
	PELAJARAN.find((p) => p.modul === modul && p.slug === slug);

/** Hanya pelajaran berstatus 'terbit' yang boleh diindeks dan masuk sitemap. */
export const pelajaranTerbit = () => PELAJARAN.filter((p) => p.status === 'terbit');

export interface SlotPelajaran {
	modul: number;
	no: number;
	judul: string;
	status: StatusPelajaran;
	href: string | null;
	durasi_baca: string | null;
}
export interface ModulBelajar {
	modul: number;
	judul: string;
	deskripsi: string;
	pelajaran: SlotPelajaran[];
}

export const LEVEL = { kode: dataModul.level, nama: dataModul.nama_level };

export function daftarModul(): ModulBelajar[] {
	return dataModul.modul.map((m) => ({
		modul: m.modul,
		judul: m.judul,
		deskripsi: m.deskripsi,
		pelajaran: dataModul.pelajaran
			.filter((p) => p.modul === m.modul)
			.map((p) => {
				const ada = p.slug ? cariPelajaran(p.modul, p.slug) : undefined;
				return {
					modul: p.modul,
					no: p.no,
					judul: ada?.judul ?? p.judul,
					status: (ada?.status ?? p.status) as StatusPelajaran,
					href: ada?.href ?? null,
					durasi_baca: ada?.durasi_baca ?? null
				};
			})
	}));
}
