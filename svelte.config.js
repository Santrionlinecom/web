import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	// Di build Pages (CF_PAGES=1) tidak ada kredensial: binding AI (selalu remote)
	// membuat prerender gagal bila proxy mencoba sesi remote. Lokal tetap remote.
	kit: {
		adapter: adapter({ platformProxy: { persist: false, remoteBindings: !process.env.CF_PAGES } }),
		// CSS disisipkan langsung ke HTML (bukan <link> render-blocking). Skor mobile PageSpeed
		// turun ±1,5 dtk karena 3 berkas CSS memblokir tampilan pertama (Okt 2026).
		inlineStyleThreshold: 100_000
	}
};

export default config;
