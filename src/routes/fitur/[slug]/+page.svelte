<script lang="ts">
	// src/routes/fitur/[slug]/+page.svelte — satu halaman per kata kunci lembaga.
	// Isi dari $lib/fitur-lembaga.ts; tampilan di $lib/components/HalamanFitur.svelte
	// (dipakai bersama halaman /aplikasi-*, SEO Tahap 3).
	import HalamanFitur from '$lib/components/HalamanFitur.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const f = $derived(data.fitur);
	const terkait = $derived(data.terkait.map((t) => ({ href: `/fitur/${t.slug}`, label: t.label, judul: t.judul })));
</script>

<HalamanFitur {f} {terkait} canonicalUrl={`https://santrionline.com/fitur/${f.slug}`} />
