// src/lib/server/statistik.ts — angka traksi beranda, hanya COUNT (tanpa data pribadi).
// Nilai status/role diverifikasi dengan SELECT DISTINCT ke db-app:
//   kitab_catalog.status = 'published'
//   organizations.status = 'active' (sama dengan direktori lembaga di app)
//   users.role = 'santri'
// Gagal apa pun -> null, sehingga blok statistik disembunyikan (tidak pernah tampil 0).
import type { StatistikPublik } from '$lib/statistik';

const SQL_KITAB = "SELECT COUNT(*) AS n FROM kitab_catalog WHERE status = 'published'";
const SQL_LEMBAGA = "SELECT COUNT(*) AS n FROM organizations WHERE status = 'active'";
const SQL_SANTRI = "SELECT COUNT(*) AS n FROM users WHERE role = 'santri'";

const angka = (r: D1Result<{ n: number }> | undefined) => {
	const v = Number(r?.results?.[0]?.n);
	return Number.isFinite(v) && v >= 0 ? v : NaN;
};

export async function muatStatistik(db: D1Database | undefined): Promise<StatistikPublik | null> {
	if (!db) return null;
	try {
		const [kitab, lembaga, santri] = await db.batch<{ n: number }>([
			db.prepare(SQL_KITAB),
			db.prepare(SQL_LEMBAGA),
			db.prepare(SQL_SANTRI)
		]);
		const hasil = { kitab: angka(kitab), lembaga: angka(lembaga), santri: angka(santri) };
		if (Object.values(hasil).some((v) => Number.isNaN(v))) return null;
		if (hasil.kitab + hasil.lembaga + hasil.santri === 0) return null;
		return hasil;
	} catch (e) {
		console.error('[statistik] gagal memuat angka traksi:', e);
		return null;
	}
}
