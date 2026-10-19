// src/routes/belajar/+page.server.ts: daftar modul Level 01 (konten dimuat saat build).
import type { PageServerLoad } from './$types';
import { daftarModul, LEVEL } from '$lib/server/belajar';

export const prerender = true;

export const load: PageServerLoad = () => ({ level: LEVEL, modul: daftarModul() });
