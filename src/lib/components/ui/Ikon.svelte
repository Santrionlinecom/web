<script lang="ts">
	// Ikon animasi Lucian Icons (MIT, static/vendor/lucian-icons). Modul dimuat di
	// klien saja; saat SSR tampil kotak kosong berukuran sama (tanpa geser tata letak).
	// Efek berjalan saat tombol/tautan terdekat disentuh, dan sekali saat ikon
	// pertama kali terlihat di layar (kartu yang bukan tautan).
	import { onMount } from 'svelte';

	let {
		nama,
		ukuran = 24,
		aksen = '',
		garis = false,
		putarSaatTampil = true
	}: { nama: string; ukuran?: number; aksen?: string; garis?: boolean; putarSaatTampil?: boolean } = $props();

	let el: HTMLElement | undefined = $state();
	let siap = $state(false);

	onMount(() => {
		let io: IntersectionObserver | undefined;
		import(/* @vite-ignore */ `/vendor/lucian-icons/${nama}.js`)
			.then(() => {
				siap = true;
				if (!putarSaatTampil || !el || !('IntersectionObserver' in window)) return;
				io = new IntersectionObserver(
					(xs) => {
						if (xs.some((x) => x.isIntersecting)) {
							(el?.firstElementChild as { play?: () => void } | null)?.play?.();
							io?.disconnect();
						}
					},
					{ threshold: 0.6 }
				);
				io.observe(el);
			})
			.catch(() => {});
		return () => io?.disconnect();
	});
</script>

<span class="ikon" bind:this={el} style="--uk:{ukuran}px" aria-hidden="true">
	{#if siap}
		<svelte:element
			this={`lucian-${nama}`}
			size={ukuran}
			tone={garis ? 'line' : 'color'}
			accent={aksen || undefined}
		></svelte:element>
	{/if}
</span>

<style>
	.ikon {
		display: inline-grid;
		place-items: center;
		width: var(--uk);
		height: var(--uk);
		flex: 0 0 auto;
	}
</style>
