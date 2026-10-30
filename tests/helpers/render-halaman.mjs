// tests/helpers/render-halaman.mjs
// Render halaman SvelteKit asli (layout + page) di Node untuk tes SEO, tanpa build
// dan tanpa server HTTP: Vite (mode middleware) + plugin Svelte, modul $app/$env
// diganti tiruan kecil, CSS dikosongkan. Loader (+page.server.ts / +page.ts)
// dipanggil sungguhan dengan `platform.env.DB` tiruan sehingga alur data ikut teruji.
import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));

const TIRUAN = {
	'$app/state': `export const page = { get url() { return globalThis.__halamanUji.url; }, get params() { return globalThis.__halamanUji.params; }, get data() { return globalThis.__halamanUji.data; }, status: 200, error: null, route: { id: null }, state: {}, form: null };
export const navigating = { from: null, to: null, type: null };
export const updated = { current: false, check: async () => false };`,
	'$app/navigation': `const n = () => {}; export const onNavigate = n; export const afterNavigate = n; export const beforeNavigate = n; export const goto = async () => {}; export const invalidate = async () => {}; export const invalidateAll = async () => {}; export const preloadData = async () => {}; export const replaceState = n; export const pushState = n;`,
	'$app/environment': `export const browser = false; export const dev = false; export const building = false; export const version = 'uji';`,
	'$env/dynamic/public': `export const env = {};`,
	'$env/dynamic/private': `export const env = {};`
};

/** Plugin: modul tiruan SvelteKit + CSS kosong (Tailwind tidak perlu untuk tes SEO). */
const tiruanKit = {
	name: 'tiruan-kit',
	enforce: /** @type {const} */ ('pre'),
	resolveId(id) {
		if (id in TIRUAN) return `\0tiruan:${id}`;
		if (/\.css(\?.*)?$/.test(id)) return '\0css-kosong';
	},
	load(id) {
		if (id.startsWith('\0tiruan:')) return TIRUAN[id.slice('\0tiruan:'.length)];
		if (id === '\0css-kosong') return 'export default "";';
	}
};

let server;
async function vite() {
	server ??= await createServer({
		configFile: false,
		root,
		logLevel: 'error',
		appType: 'custom',
		server: { middlewareMode: true, hmr: false, ws: false, watch: null },
		optimizeDeps: { noDiscovery: true, include: [] },
		resolve: { alias: { $lib: `${root}src/lib` } },
		plugins: [tiruanKit, svelte({ configFile: false, compilerOptions: { runes: true }, emitCss: false })]
	});
	return server;
}

/** Muat modul proyek lewat Vite (alias $lib, import.meta.glob, TS). @param {string} id */
export async function muatModul(id) {
	return (await vite()).ssrLoadModule(id);
}

/** Daftar rute halaman (id SvelteKit) dari src/routes, statis didahulukan saat dicocokkan. */
export function daftarRute() {
	/** @type {string[]} */
	const hasil = [];
	const jalan = (/** @type {string} */ dir) => {
		for (const e of readdirSync(`${root}${dir}`, { withFileTypes: true })) {
			if (e.isDirectory()) jalan(`${dir}/${e.name}`);
			else if (e.name === '+page.svelte') hasil.push(dir.replace(/^src\/routes/, '') || '/');
		}
	};
	jalan('src/routes');
	return hasil.sort((a, b) => (a.match(/\[/g)?.length ?? 0) - (b.match(/\[/g)?.length ?? 0));
}

/**
 * Cocokkan path nyata ke rute: '/katalog/kitab/x' → { rute: '/katalog/[jenis]/[slug]', params }.
 * @param {string} path
 */
export function cocokkanRute(path) {
	const bersih = path.replace(/[?#].*$/, '').replace(/(.)\/$/, '$1');
	for (const rute of daftarRute()) {
		/** @type {string[]} */
		const nama = [];
		const pola = rute === '/' ? '^/$' : `^${rute.replace(/\[([^\]]+)\]/g, (_, n) => (nama.push(n), '([^/]+)'))}$`;
		const m = bersih.match(new RegExp(pola));
		if (m) return { rute, params: Object.fromEntries(nama.map((n, i) => [n, decodeURIComponent(m[i + 1])])) };
	}
	return null;
}

export async function tutup() {
	await server?.close();
	server = undefined;
}

/**
 * Render satu path seperti SvelteKit: jalankan load, render layout + page.
 * @param {string} rute id rute, mis. '/katalog/[jenis]/[slug]'
 * @param {string} path path nyata, mis. '/katalog/kitab/safinah'
 * @param {{ params?: Record<string,string>, env?: Record<string, unknown>, fetch?: typeof fetch }} [opsi]
 * @returns {Promise<{ html: string, status: number }>}
 */
export async function renderHalaman(rute, path, opsi = {}) {
	const v = await vite();
	const url = new URL(`https://santrionline.com${path}`);
	const params = opsi.params ?? {};
	const dir = `src/routes${rute === '/' ? '' : rute}`;
	const event = {
		url,
		params,
		platform: { env: opsi.env ?? {} },
		fetch: opsi.fetch ?? (async () => new Response('[]', { status: 503 })),
		setHeaders() {},
		parent: async () => ({}),
		depends() {},
		untrack: (f) => f()
	};
	let data = {};
	try {
		for (const nama of ['+page.server.ts', '+page.ts']) {
			if (!existsSync(`${root}${dir}/${nama}`)) continue;
			const mod = await v.ssrLoadModule(`/${dir}/${nama}`);
			if (mod.load) data = { ...data, ...(await mod.load({ ...event, data })) };
		}
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) return { html: '', status: /** @type {any} */ (e).status };
		throw e;
	}
	globalThis.__halamanUji = { url, params, data };

	const { render } = await v.ssrLoadModule('svelte/server');
	const { createRawSnippet } = await v.ssrLoadModule('svelte');
	const Page = (await v.ssrLoadModule(`/${dir}/+page.svelte`)).default;
	const halaman = render(Page, { props: { data, params } });

	// Layout dari dalam ke luar (rute bersarang punya +layout.svelte sendiri).
	const seg = dir.split('/');
	let head = halaman.head;
	let body = halaman.body;
	for (let i = seg.length; i >= 2; i--) {
		const lay = `${seg.slice(0, i).join('/')}/+layout.svelte`;
		if (!existsSync(`${root}${lay}`)) continue;
		const Layout = (await v.ssrLoadModule(`/${lay}`)).default;
		const isi = body;
		const children = createRawSnippet(() => ({ render: () => `<div data-isi-layout>${isi}</div>` }));
		const r = render(Layout, { props: { data, children } });
		head = r.head + head;
		body = r.body;
	}
	return { html: `<!doctype html><html lang="id"><head>${head}</head><body>${body}</body></html>`, status: 200 };
}
