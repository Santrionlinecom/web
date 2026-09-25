<script lang="ts">
	// DaftarPeringkat — "Paling Banyak Dibaca": nomor besar + sampul, pola
	// "Top 10" di toko buku digital. Urutan dari jumlah bab dibuka (buku).
	import type { ItemKatalog } from '$lib/server/katalog';
	import Bintang from './Bintang.svelte';

	let { item, judul, keterangan }: { item: ItemKatalog[]; judul: string; keterangan: string } = $props();
</script>

{#if item.length}
	<section id="rak-peringkat" class="so-reveal scroll-mt-24 py-6 sm:py-9" aria-labelledby="peringkat-judul">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
			<h2 id="peringkat-judul" class="font-display text-lg font-bold tracking-[-0.02em] text-so-green sm:text-2xl">{judul}</h2>
			<p class="mt-0.5 text-xs text-so-muted sm:text-sm">{keterangan}</p>
			<ol class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{#each item as b, i (b.slug)}
					<li>
						<a href={b.detail ?? b.href} class="group flex items-center gap-3 rounded-2xl border border-so-border/80 bg-white p-2.5 pr-3 transition hover:-translate-y-0.5 hover:shadow-md">
							<span class="nomor font-display w-9 shrink-0 text-center text-4xl font-bold leading-none" aria-hidden="true">{i + 1}</span>
							{#if b.sampul}
								<img src={b.sampul} alt="" width="56" height="84" loading="lazy" decoding="async" class="h-[84px] w-14 shrink-0 rounded-lg object-cover shadow-sm" />
							{/if}
							<span class="min-w-0">
								<span class="sr-only">Peringkat {i + 1}:</span>
								<span class="line-clamp-2 text-sm font-bold leading-5 text-so-ink group-hover:text-so-green">{b.judul}</span>
								<span class="mt-1 block"><Bintang rata={b.rating?.rata} jumlah={b.rating?.jumlah} /></span>
								{#if b.dibaca}<span class="mt-0.5 block text-[11px] text-so-muted">{b.dibaca.toLocaleString('id-ID')}× bab dibuka</span>{/if}
							</span>
						</a>
					</li>
				{/each}
			</ol>
		</div>
	</section>
{/if}

<style>
	.nomor {
		color: transparent;
		-webkit-text-stroke: 1.5px var(--color-so-green);
	}
	li:nth-child(-n + 3) .nomor {
		color: var(--color-so-gold);
		-webkit-text-stroke: 1.5px #b45309;
	}
</style>
