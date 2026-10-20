// src/lib/server/video.ts
// Ambil daftar video dari aplikasi dengan cache singkat. Gagal = daftar kosong
// (halaman menampilkan keadaan kosong + tombol ke aplikasi, tidak pernah 500).
import { normalisasiDaftar, type Video } from '$lib/video.js';

const UMUR_CACHE_MS = 5 * 60 * 1000;
let simpanan: { basis: string; waktu: number; daftar: Video[] } | null = null;

export async function muatDaftarVideo(basis: string, f: typeof fetch = fetch): Promise<{ daftar: Video[]; gagal: boolean }> {
	const sekarang = Date.now();
	if (simpanan && simpanan.basis === basis && sekarang - simpanan.waktu < UMUR_CACHE_MS) {
		return { daftar: simpanan.daftar, gagal: false };
	}
	try {
		const res = await f(`${basis}/video/daftar.json`, {
			headers: { accept: 'application/json' },
			signal: AbortSignal.timeout(5000),
			// cache tepi Cloudflare (diabaikan di luar Workers)
			cf: { cacheTtl: 300, cacheEverything: true }
		} as RequestInit);
		if (!res.ok) throw new Error(`status ${res.status}`);
		const daftar = normalisasiDaftar(await res.json());
		if (daftar.length === 0) throw new Error('daftar kosong');
		simpanan = { basis, waktu: sekarang, daftar };
		return { daftar, gagal: false };
	} catch (e) {
		console.warn('[video] daftar gagal dimuat:', e instanceof Error ? e.message : e);
		// Masih punya daftar lama? Pakai saja daripada kosong.
		if (simpanan && simpanan.basis === basis) return { daftar: simpanan.daftar, gagal: false };
		return { daftar: [], gagal: true };
	}
}
