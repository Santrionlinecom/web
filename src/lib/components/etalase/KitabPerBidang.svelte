<script lang="ts">
	// KitabPerBidang — 191 kitab dikelompokkan per bidang ilmu. Tab bidang di
	// atas, grid sampul di bawah. Tanpa JS tetap tampil bidang pertama; tautan
	// "Semua kitab <bidang>" menuju halaman katalog tersaring.
	import type { BidangKitab } from '$lib/server/katalog';
	import KartuKatalog from '$lib/components/ui/KartuKatalog.svelte';

	let { bidang }: { bidang: BidangKitab[] } = $props();
	let pilih = $state(0);
	const aktif = $derived(bidang[pilih] ?? bidang[0]);
	const total = $derived(bidang.reduce((t, b) => t + b.jumlah, 0));
</script>

{#if bidang.length}
	<section id="rak-bidang" class="so-reveal scroll-mt-24 border-y border-so-border/70 bg-white py-7 sm:py-10" aria-labelledby="bidang-judul">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
			<div class="flex flex-wrap items-end justify-between gap-3">
				<div>
					<p class="text-[11px] font-bold uppercase tracking-[0.16em] text-so-accent-ink">Perpustakaan · {total} kitab</p>
					<h2 id="bidang-judul" class="font-display mt-1 text-lg font-bold tracking-[-0.02em] text-so-green sm:text-2xl">Kitab per Bidang Ilmu</h2>
				</div>
				<a class="text-xs font-bold text-so-green underline-offset-4 hover:underline sm:text-sm" href="/katalog/kitab">Semua kitab</a>
			</div>

			<div class="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Bidang ilmu" style="scrollbar-width:none">
				{#each bidang as b, i (b.id)}
					<button
						type="button"
						role="tab"
						id={`tab-bidang-${b.id}`}
						aria-selected={i === pilih}
						aria-controls="panel-bidang"
						class={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition sm:text-sm ${i === pilih ? 'border-so-green bg-so-green text-white' : 'border-so-border bg-so-cream text-so-green hover:border-so-green/40'}`}
						onclick={() => (pilih = i)}
					>
						{b.label} <span class={i === pilih ? 'text-white/70' : 'text-so-muted'}>{b.jumlah}</span>
					</button>
				{/each}
			</div>

			<div id="panel-bidang" role="tabpanel" aria-labelledby={`tab-bidang-${aktif.id}`} class="mt-4">
				<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
					{#each aktif.item as item (item.slug)}
						<KartuKatalog {item} isi />
					{/each}
				</div>
				{#if aktif.jumlah > aktif.item.length}
					<a
						class="mt-4 inline-flex items-center gap-2 rounded-full border border-so-border bg-so-cream px-4 py-2 text-sm font-bold text-so-green hover:border-so-green/40"
						href={`/katalog/kitab?q=${encodeURIComponent(aktif.label)}`}
					>
						Lihat {aktif.jumlah - aktif.item.length} kitab {aktif.label} lainnya →
					</a>
				{/if}
			</div>
		</div>
	</section>
{/if}
