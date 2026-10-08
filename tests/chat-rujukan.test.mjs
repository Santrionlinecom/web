import test from 'node:test';
import assert from 'node:assert/strict';
import { pecahSitasi, susunRujukan, tautanKitab } from '../src/lib/chat-rujukan.js';

test('tautan kitab memakai slug polos (bagian -bNN dibuang) ke halaman baca app', () => {
	assert.equal(tautanKitab('syamilah-3404-b04'), 'https://app.santrionline.com/kitab/syamilah-3404/baca');
	assert.equal(tautanKitab('terjemah-bidayatul-hidayah'), 'https://app.santrionline.com/kitab/terjemah-bidayatul-hidayah/baca');
	// slug kecil yang kebetulan berakhir -b tanpa dua digit tidak dipotong
	assert.equal(tautanKitab('kitab-b1'), 'https://app.santrionline.com/kitab/kitab-b1/baca');
	for (const buruk of [null, '', 'javascript:alert(1)', '../admin', 'A B', 'x/y']) assert.equal(tautanKitab(buruk), null);
});

test('rujukan kembar digabung dan sitasi di ringkasan dinomori ulang', () => {
	const q = { judul: 'الرسالة القشيرية (bagian 1/2)', lokasi: 'hlm 445-448', slug: 'syamilah-3617-b01' };
	const b = { judul: 'Terjemah Bidayatul Hidayah', lokasi: 'hlm 140', slug: 'terjemah-bidayatul-hidayah' };
	const c = { judul: 'بداية الهداية', lokasi: 'hlm 64', slug: 'syamilah-4619' };
	const { rujukan, ringkasan } = susunRujukan([q, b, q, c, q], 'Salam [1]. Diam [3][5]. Sopan [2], tenang [4].');
	assert.deepEqual(rujukan.map((r) => r.no), [1, 2, 3]);
	assert.equal(rujukan[0].url, 'https://app.santrionline.com/kitab/syamilah-3617/baca');
	assert.equal(rujukan[0].judul, 'الرسالة القشيرية');
	assert.equal(ringkasan, 'Salam [1]. Diam [1]. Sopan [2], tenang [3].');
});

test('maksimal 6 rujukan unik; sitasi ke rujukan yang terbuang dihapus', () => {
	const refs = Array.from({ length: 8 }, (_, i) => ({ judul: `K${i}`, lokasi: null, slug: `k${i}` }));
	const { rujukan, ringkasan } = susunRujukan(refs, 'a [1] b [8].');
	assert.equal(rujukan.length, 6);
	assert.equal(ringkasan, 'a [1] b.');
	assert.equal(susunRujukan(refs, null).ringkasan, null);
});

test('pecahSitasi memisahkan [n] dari teks biasa', () => {
	assert.deepEqual(pecahSitasi('Haram [1] dan [12].'), [
		{ teks: 'Haram ', no: null },
		{ teks: '[1]', no: 1 },
		{ teks: ' dan ', no: null },
		{ teks: '[12]', no: 12 },
		{ teks: '.', no: null }
	]);
});
