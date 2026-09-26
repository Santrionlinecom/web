<script lang="ts">
	// src/routes/aplikasi-hafalan-quran/+page.svelte — halaman produk lembaga (SEO Tahap 3).
	// Isi di $lib/halaman-aplikasi.ts; tampilan di $lib/components/HalamanFitur.svelte.
	import HalamanFitur from '$lib/components/HalamanFitur.svelte';
	import { cariHalamanAplikasi } from '$lib/halaman-aplikasi';

	const h = cariHalamanAplikasi('/aplikasi-hafalan-quran')!;
</script>

<HalamanFitur f={h} terkait={h.bacaan} canonicalUrl={`https://santrionline.com${h.path}`} />
