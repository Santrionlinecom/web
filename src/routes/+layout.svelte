<script lang="ts">
	// src/routes/+layout.svelte
	import { onNavigate } from '$app/navigation';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();

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
{@render children()}
