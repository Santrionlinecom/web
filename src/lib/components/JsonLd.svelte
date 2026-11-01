<script lang="ts">
	// src/lib/components/JsonLd.svelte — SATU-SATUNYA tempat blok JSON-LD dipasang.
	// Pakai di dalam <svelte:head>: <JsonLd data={graf(...)} />. Escape (< → <, dst.)
	// dikerjakan skripJsonLd() di $lib/seo.js; dikunci tests/seo-halaman.test.mjs.
	import { skripJsonLd } from '$lib/seo.js';

	let { data }: { data: unknown } = $props();
</script>

{@html skripJsonLd(data)}
