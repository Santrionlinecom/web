import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
	ambilEmbedding,
	bacaVektor,
	cariIndeksMirip,
	kandidatTeratas,
	rakitKeputusan,
	tafsirKeputusan,
	AMBANG_YAKIN,
	AWALAN_DOKUMEN,
	AWALAN_KUERI,
	DIM_EMBEDDING,
	MODEL_EMBEDDING
} from '../src/lib/server/pertanyaan-mirip.ts';

const keB64 = (arr) => Buffer.from(Int8Array.from(arr).buffer).toString('base64');

test('vektor int8 dibaca ulang ternormalisasi', () => {
	const v = bacaVektor(keB64([127, 0, -127, 0]));
	assert.ok(Math.abs(Math.hypot(...v) - 1) < 1e-6);
	assert.ok(v[0] > 0.7 && v[2] < -0.7);
});

test('kandidat teratas diurutkan menurut kemiripan, skor rendah dibuang', () => {
	const bank = [bacaVektor(keB64([127, 0, 0])), bacaVektor(keB64([0, 127, 0])), bacaVektor(keB64([90, 90, 0]))];
	const k = kandidatTeratas([1, 0.1, 0], bank);
	assert.deepEqual(k.map((x) => x.idx), [0, 2]);
});

test('keputusan: hanya diterima bila yakin dan bukan "lain"', () => {
	assert.equal(tafsirKeputusan({ answers: { cocok: { choice: 'k1', confidence: 0.99 } } }, 3), 1);
	assert.equal(tafsirKeputusan({ answers: { cocok: { choice: 'k1', confidence: AMBANG_YAKIN - 0.01 } } }, 3), null);
	assert.equal(tafsirKeputusan({ answers: { cocok: { choice: 'lain', confidence: 1 } } }, 3), null);
	assert.equal(tafsirKeputusan({ answers: { cocok: { choice: 'k9', confidence: 1 } } }, 3), null);
	assert.equal(tafsirKeputusan(null, 3), null);
	const r = rakitKeputusan('hukum hasad', ['Apa hukum iri dan dengki?']);
	assert.deepEqual(Object.keys(r.questions.cocok.criteria), ['k0', 'lain']);
});

test('vektor bank sejajar dengan data bank', () => {
	const data = JSON.parse(readFileSync(new URL('../src/lib/server/pertanyaan-siap.json', import.meta.url), 'utf8'));
	const vek = JSON.parse(readFileSync(new URL('../src/lib/server/pertanyaan-siap-vektor.json', import.meta.url), 'utf8'));
	assert.equal(vek.v.length, data.length);
	assert.equal(vek.model, MODEL_EMBEDDING);
});

test('berkas vektor mencatat model + awalan yang sama dengan kode (vektor beda model tidak sebanding)', () => {
	const vek = JSON.parse(readFileSync(new URL('../src/lib/server/pertanyaan-siap-vektor.json', import.meta.url), 'utf8'));
	assert.equal(MODEL_EMBEDDING, '@cf/google/embeddinggemma-2');
	assert.equal(vek.model, MODEL_EMBEDDING);
	assert.equal(vek.awalan, AWALAN_DOKUMEN);
	assert.equal(vek.dim, DIM_EMBEDDING);
	for (const v of vek.v) assert.equal(Buffer.from(v, 'base64').length, DIM_EMBEDDING);
});

test('bentuk balasan embedding: hanya data[0].embedding berdimensi benar yang diterima', () => {
	const e = Array.from({ length: DIM_EMBEDDING }, (_, i) => Math.sin(i));
	assert.deepEqual(ambilEmbedding({ data: [{ index: 0, object: 'embedding', embedding: e }] }), e);
	assert.equal(ambilEmbedding({ data: [e] }), null, 'bentuk lama embeddinggemma-300m');
	assert.equal(ambilEmbedding({ data: [{ embedding: e.slice(1) }] }), null, 'dimensi salah');
	assert.equal(ambilEmbedding({ data: [{ embedding: [...e.slice(1), NaN] }] }), null, 'bukan angka');
	assert.equal(ambilEmbedding({ data: [] }), null);
	assert.equal(ambilEmbedding({ shape: [1, 768] }), null);
	assert.equal(ambilEmbedding(null), null);
	assert.equal(ambilEmbedding('galat'), null);
});

const vektorSatuan = (k) => Array.from({ length: DIM_EMBEDDING }, (_, i) => (i === k ? 1 : 0));
const bankUji = () => [bacaVektor(keB64(vektorSatuan(0).map((x) => x * 127))), bacaVektor(keB64(vektorSatuan(1).map((x) => x * 127)))];

test('cariIndeksMirip: memakai API embeddinggemma-2 ({ input }, awalan kueri) lalu tahap keputusan', async () => {
	/** @type {any[]} */
	const panggilan = [];
	const env = {
		KEPUTUSAN_CEPAT_API_KEY: 'uji',
		AI: { run: async (model, isi) => (panggilan.push([model, isi]), { data: [{ index: 0, embedding: vektorSatuan(1) }] }) }
	};
	const fetchUji = async () => new Response(JSON.stringify({ answers: { cocok: { choice: 'k0', confidence: 0.99 } } }));
	const i = await cariIndeksMirip(env, 'hukum hasad', ['a', 'b'], bankUji, fetchUji);
	assert.equal(i, 1);
	assert.deepEqual(panggilan, [[MODEL_EMBEDDING, { input: [AWALAN_KUERI + 'hukum hasad'] }]]);
});

test('cariIndeksMirip: embedding gagal/bentuk aneh -> null diam-diam, tahap keputusan tidak dipanggil', async () => {
	let dipanggil = 0;
	const fetchUji = async () => (dipanggil++, new Response('{}'));
	const balasan = [
		async () => {
			throw new Error('404 model pensiun');
		},
		async () => ({ data: [vektorSatuan(1)] }),
		async () => ({ data: [{ embedding: [1, 0, 0] }] }),
		async () => undefined
	];
	for (const run of balasan) {
		const env = { KEPUTUSAN_CEPAT_API_KEY: 'uji', AI: { run } };
		assert.equal(await cariIndeksMirip(env, 'hukum hasad', ['a', 'b'], bankUji, fetchUji), null);
	}
	assert.equal(dipanggil, 0);
});
