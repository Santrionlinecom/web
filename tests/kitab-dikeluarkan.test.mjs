import test from 'node:test';
import assert from 'node:assert/strict';
import {
	KITAB_DIKELUARKAN,
	KITAB_DITAHAN,
	alasanKitabTerlarang,
	judulTerlarang,
	slugDariTautan
} from '../src/lib/kitab-dikeluarkan.js';

test('daftar kitab dikeluarkan sama dengan peta 301 app (kitab-diganti.ts, PR app #459 + #461)', () => {
	assert.deepEqual(Object.keys(KITAB_DIKELUARKAN).sort(), [
		'bahasa-arab-dasar-1',
		'bahasa-arab-dasar-2',
		'bahasa-arab-dasar-3',
		'bahasa-arab-dasar-4',
		'ilmu-tajwid-lengkap',
		'safinatun-najah-makna-perkata',
		'syamilah-6130',
		'terjemah-aqidatul-awam',
		'terjemah-bidayatul-hidayah',
		'terjemah-syarah-arbain-nawawiyah-ibnu-daqiqil-ied'
	]);
	assert.deepEqual(Object.keys(KITAB_DITAHAN), ['syamilah-5720']);
});

test('slug dari tautan baca app, termasuk bagian -bNN dan ?kutipan=', () => {
	assert.equal(slugDariTautan('https://app.santrionline.com/kitab/terjemah-bidayatul-hidayah/baca?kutipan=x#kutipan'), 'terjemah-bidayatul-hidayah');
	assert.equal(slugDariTautan('https://app.santrionline.com/kitab/syamilah-5720-b03/baca'), 'syamilah-5720');
	assert.equal(slugDariTautan('https://app.santrionline.com/kitab/syamilah-4619'), 'syamilah-4619');
	assert.equal(slugDariTautan(null), null);
	assert.equal(slugDariTautan('https://santrionline.com/'), null);
});

test('kitab terlarang dikenali lewat slug dan judul; kitab pengganti turats tidak', () => {
	assert.equal(alasanKitabTerlarang('terjemah-aqidatul-awam'), 'dikeluarkan');
	assert.equal(alasanKitabTerlarang('syamilah-6130-b02'), 'dikeluarkan');
	assert.equal(alasanKitabTerlarang('syamilah-5720-b11'), 'ditahan');
	for (const sah of ['aqidatul-awam', 'safinatun-najah', 'arbain-nawawi', 'syamilah-4619', 'syamilah-6180', 'syamilah-61300', null]) {
		assert.equal(alasanKitabTerlarang(sah), null, String(sah));
	}
	assert.equal(judulTerlarang('Terjemah Bidayatul Hidayah'), true);
	assert.equal(judulTerlarang('مختصر تفسير ابن كثير (bagian 3/12)'), true);
	assert.equal(judulTerlarang('بداية الهداية'), false);
	assert.equal(judulTerlarang('Safinatun Najah'), false);
});
