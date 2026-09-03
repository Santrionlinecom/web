<script lang="ts">
	// RakKatalog — satu baris rak geser horizontal (judul + "Lihat Semua" +
	// deretan KartuKatalog). Murni CSS scroll-snap: tanpa JS, tanpa library,
	// ringan di HP; panah hanya tampil di layar lebar.
	import type { RakKatalog } from '$lib/server/katalog';
	import KartuKatalog from './KartuKatalog.svelte';

	let { rak, prioritas = false }: { rak: RakKatalog; prioritas?: boolean } = $props();
	let jalur = $state<HTMLDivElement>();
	const geser = (arah: number) => jalur?.scrollBy({ left: arah * jalur.clientWidth * 0.8, behavior: 'smooth' });
</script>

<section id={`rak-${rak.id}`} class="rak so-reveal scroll-mt-24 py-5 sm:py-7" aria-labelledby={`rak-${rak.id}-judul`}>
	<div class="mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
		<div class="min-w-0">
			<h2 id={`rak-${rak.id}-judul`} class="font-display text-lg font-bold tracking-[-0.02em] text-so-green sm:text-2xl">{rak.judul}</h2>
			<p class="mt-0.5 truncate text-xs text-so-muted sm:text-sm">{rak.keterangan}</p>
		</div>
		<div class="flex shrink-0 items-center gap-2">
			<div class="hidden gap-1 lg:flex">
				<button type="button" class="grid size-8 place-items-center rounded-full border border-so-border bg-white text-so-green transition hover:bg-so-cream" aria-label={`Geser ${rak.judul} ke kiri`} onclick={() => geser(-1)}>‹</button>
				<button type="button" class="grid size-8 place-items-center rounded-full border border-so-border bg-white text-so-green transition hover:bg-so-cream" aria-label={`Geser ${rak.judul} ke kanan`} onclick={() => geser(1)}>›</button>
			</div>
			<a class="text-xs font-bold text-so-green underline-offset-4 hover:underline sm:text-sm" href={rak.lihatSemua}>Lihat Semua</a>
		</div>
	</div>
	<div
		bind:this={jalur}
		class="jalur mx-auto mt-3 flex max-w-7xl snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:scroll-px-10 lg:px-10"
	>
		{#each rak.item as item, i (item.jenis + item.slug)}
			<KartuKatalog {item} prioritas={prioritas && i < 4} />
		{/each}
	</div>
</section>

<style>
	.jalur {
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.jalur::-webkit-scrollbar {
		display: none;
	}
</style>
