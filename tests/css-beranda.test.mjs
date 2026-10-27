// Beranda tidak memakai kelas utilitas Tailwind; utilitas (±46 KB) hanya dimuat folder rute lain.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';

const baca = (p) => readFileSync(p, 'utf8');

test('layout global: tema + preflight saja, tanpa utilitas', () => {
	const css = baca('src/routes/layout.css');
	assert.doesNotMatch(css, /@import 'tailwindcss';/);
	assert.doesNotMatch(css, /utilities\.css/);
	assert.match(css, /tailwindcss\/preflight\.css/);
	assert.match(css, /@layer properties, theme, base, components, utilities;/);
});

test('setiap folder rute halaman memuat utilitas.css lewat +layout.svelte', () => {
	const akar = 'src/routes';
	for (const d of readdirSync(akar)) {
		if (d === 'api' || d === 'sitemap.xml' || !statSync(`${akar}/${d}`).isDirectory()) continue;
		const lay = `${akar}/${d}/+layout.svelte`;
		assert.ok(existsSync(lay), `${lay} belum ada: halaman di /${d} akan kehilangan kelas utilitas`);
		assert.match(baca(lay), /import '\$lib\/css\/utilitas\.css'/, lay);
	}
	assert.match(baca('src/lib/css/utilitas.css'), /tailwindcss\/utilities\.css/);
});
