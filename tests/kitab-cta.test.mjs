import test from 'node:test';
import assert from 'node:assert/strict';
import { slugKitabDasar, urlBacaKitab, urlDaftarKitab } from '../src/lib/kitab-cta.js';

test('CTA baca menuju pembaca app dengan slug dasar dan UTM katalog', () => {
	assert.equal(
		urlBacaKitab('syamilah-3878'),
		'https://app.santrionline.com/kitab/syamilah-3878/baca?utm_source=santrionline.com&utm_medium=katalog&utm_campaign=baca-kitab&utm_content=baca'
	);
	assert.match(urlBacaKitab('syamilah-3404-b04'), /\/kitab\/syamilah-3404\/baca\?/);
	assert.equal(urlBacaKitab('../admin'), 'https://app.santrionline.com/kitab');
});

test('CTA daftar memakai /auth?redirect= (path relatif) kembali ke pembaca', () => {
	const u = new URL(urlDaftarKitab('syamilah-3878-b02'));
	assert.equal(u.origin + u.pathname, 'https://app.santrionline.com/auth');
	assert.equal(u.searchParams.get('redirect'), '/kitab/syamilah-3878/baca');
	assert.equal(u.searchParams.get('utm_campaign'), 'baca-kitab');
	assert.equal(slugKitabDasar('A B'), null);
});
