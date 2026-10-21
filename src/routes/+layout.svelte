<script lang="ts">
	// src/routes/+layout.svelte
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import './layout.css';
	import '$lib/belajar/situs.css';
	import favicon from '$lib/assets/favicon.png';
	import HeaderSitus from '$lib/components/situs/HeaderSitus.svelte';
	import FooterSitus from '$lib/components/situs/FooterSitus.svelte';

	let { children } = $props();

	// Header/footer situs baru dipakai beranda + /belajar + /tipe-santri + /video + /katalog
	// (katalog: audit 21 Okt 2026, 206 halaman kitab sebelumnya tanpa navigasi situs).
	// Halaman lama (lembaga, aplikasi-*, fitur, literasi, tentang, invoice)
	// masih punya header sendiri; dibiarkan utuh supaya SEO-nya tidak berubah.
	const RUTE_BARU = ['/belajar', '/tipe-santri', '/video', '/katalog'];
	const situsBaru = $derived(
		page.url.pathname === '/' || RUTE_BARU.some((r) => page.url.pathname === r || page.url.pathname.startsWith(r + '/'))
	);

	// Fase 2b: transisi antar halaman via View Transitions API.
	// Browser tanpa dukungan (Safari lama, Firefox lama) mengembalikan
	// undefined → navigasi berjalan normal tanpa animasi, tidak pernah patah.
	// prefers-reduced-motion dimatikan lewat CSS ::view-transition-* global.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />
</svelte:head>
{#if situsBaru}
	<div class="sb">
		<HeaderSitus />
		<main id="konten-utama">
			{@render children()}
		</main>
		<FooterSitus />
	</div>
{:else}
	{@render children()}
{/if}
