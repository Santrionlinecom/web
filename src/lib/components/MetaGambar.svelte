<script lang="ts">
	// src/lib/components/MetaGambar.svelte
	// Satu blok meta gambar pratinjau tautan: og:image 1200x630 + alt + kartu Twitter besar.
	// Sumber gambar dari ogWeb() (src/lib/og-gambar.js), bukan logo situs.
	let { src, alt }: { src: string; alt: string } = $props();
</script>

<meta property="og:image" content={src} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content={alt} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={src} />
<meta name="twitter:image:alt" content={alt} />
