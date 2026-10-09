// Cocokkan pertanyaan bebas dengan bank soal siap secara MAKNA, supaya
// "hukum hasad" langsung dijawab dengan soal "Apa hukum iri dan dengki?".
//
// Dua tahap, dua-duanya harus yakin:
//  1. Saring kandidat: embedding pertanyaan vs vektor bank (dihitung saat
//     bank dibuat, disimpan int8). Ambil 8 teratas.
//  2. Putuskan: model keputusan cepat memilih SATU kandidat yang maksudnya
//     sama persis, atau "lain". Diterima hanya bila keyakinan >= AMBANG.
// Gagal/waktu habis di tahap mana pun -> null, chat jatuh ke pencarian kitab
// biasa. Lebih baik lambat daripada menjawab soal yang berbeda.

export const MODEL_EMBEDDING = '@cf/google/embeddinggemma-300m';
export const AMBANG_YAKIN = 0.85;
export const JUMLAH_KANDIDAT = 8;
export const SKOR_MIN_KANDIDAT = 0.3;
const BATAS_MS = 2500;
const ENDPOINT = 'https://api.typesafe.ai/v1/systemone';

/** base64 int8 -> Float32Array ternormalisasi. */
export const bacaVektor = (b64: string) => {
	const bin = atob(b64);
	const v = new Float32Array(bin.length);
	let n = 0;
	for (let i = 0; i < bin.length; i++) {
		const x = ((bin.charCodeAt(i) << 24) >> 24) / 127;
		v[i] = x;
		n += x * x;
	}
	n = Math.sqrt(n) || 1;
	for (let i = 0; i < v.length; i++) v[i] /= n;
	return v;
};

export const kandidatTeratas = (q: ArrayLike<number>, bank: Float32Array[], k = JUMLAH_KANDIDAT) => {
	let n = 0;
	for (let i = 0; i < q.length; i++) n += q[i] * q[i];
	n = Math.sqrt(n) || 1;
	const skor = bank.map((b, idx) => {
		let s = 0;
		for (let i = 0; i < b.length; i++) s += b[i] * q[i];
		return { idx, skor: s / n };
	});
	return skor
		.filter((s) => s.skor >= SKOR_MIN_KANDIDAT)
		.sort((a, b) => b.skor - a.skor)
		.slice(0, k);
};

/** Rakit permintaan keputusan: pilih kandidat yang maksudnya sama, atau "lain". */
export const rakitKeputusan = (pertanyaan: string, kandidat: string[]) => {
	const criteria: Record<string, string> = {};
	kandidat.forEach((c, i) => {
		criteria[`k${i}`] = `Pertanyaan pengguna menanyakan hal yang SAMA dengan: "${c}" (jawaban untuk pertanyaan itu sudah menjawab pertanyaan pengguna sepenuhnya)`;
	});
	criteria.lain = 'Tidak ada yang sama persis maksudnya; pertanyaan pengguna menanyakan hal lain, lebih khusus, atau aspek berbeda';
	return {
		state: `Pertanyaan pengguna: "${pertanyaan}"`,
		model: 'jev-latest',
		questions: {
			cocok: {
				type: 'choice',
				instructions: 'Pilih pertanyaan siap yang jawabannya PERSIS menjawab pertanyaan pengguna. Jika ragu atau aspeknya berbeda, pilih lain.',
				criteria
			}
		}
	};
};

/** Tafsirkan jawaban keputusan -> indeks kandidat, atau null. */
export const tafsirKeputusan = (res: unknown, jumlah: number): number | null => {
	const a = (res as { answers?: { cocok?: { choice?: string; confidence?: number } } })?.answers?.cocok;
	if (!a || typeof a.choice !== 'string' || a.choice === 'lain') return null;
	if (typeof a.confidence !== 'number' || a.confidence < AMBANG_YAKIN) return null;
	const m = /^k(\d+)$/.exec(a.choice);
	const i = m ? Number(m[1]) : -1;
	return i >= 0 && i < jumlah ? i : null;
};

type Env = { AI?: Ai; KEPUTUSAN_CEPAT_API_KEY?: string };

export const cariIndeksMirip = async (
	env: Env | undefined,
	pertanyaan: string,
	bankTeks: string[],
	bankVektor: () => Float32Array[],
	fetchImpl: typeof fetch = fetch
): Promise<number | null> => {
	if (!env?.AI || !env.KEPUTUSAN_CEPAT_API_KEY || !bankTeks.length) return null;
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), BATAS_MS);
	try {
		const emb = (await env.AI.run(MODEL_EMBEDDING as any, { text: [pertanyaan] } as any)) as { data?: number[][] };
		const q = emb?.data?.[0];
		if (!q?.length) return null;
		const kand = kandidatTeratas(q, bankVektor());
		if (!kand.length) return null;
		const res = await fetchImpl(ENDPOINT, {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.KEPUTUSAN_CEPAT_API_KEY}`, 'Content-Type': 'application/json' },
			body: JSON.stringify(rakitKeputusan(pertanyaan, kand.map((k) => bankTeks[k.idx]))),
			signal: ctrl.signal
		});
		if (!res.ok) return null;
		const pilih = tafsirKeputusan(await res.json(), kand.length);
		return pilih == null ? null : kand[pilih].idx;
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
};
