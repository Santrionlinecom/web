import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bacaVektor, kandidatTeratas, rakitKeputusan, tafsirKeputusan, AMBANG_YAKIN } from '../src/lib/server/pertanyaan-mirip.ts';

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
	assert.equal(vek.model, '@cf/google/embeddinggemma-300m');
});
