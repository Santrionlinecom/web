<script lang="ts">
	// EtalaseAplikasi — aplikasi & alat dalam tata letak "bento": satu kartu
	// sorotan besar + kartu mendatar (ikon persegi, harga, rating). Beda bentuk
	// dengan rak sampul buku supaya beranda tidak monoton.
	import type { ItemKatalog } from '$lib/server/katalog';
	import Bintang from './Bintang.svelte';

	let { item }: { item: ItemKatalog[] } = $props();
	// Varian "Promo/Bantuan/Pro" dari produk yang sama tetap tampil, tapi sorotan = yang unggulan/berbayar pertama.
	const sorotan = $derived(item.find((i) => i.unggulan && i.jenis === 'produk') ?? item[0]);
	const sisa = $derived(item.filter((i) => i !== sorotan).slice(0, 9));
</script>

{#if item.length}
	<section id="rak-aplikasi" class="so-reveal scroll-mt-24 py-6 sm:py-9" aria-labelledby="aplikasi-judul">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
			<div class="flex items-end justify-between gap-4">
				<div>
					<h2 id="aplikasi-judul" class="font-display text-lg font-bold tracking-[-0.02em] text-so-green sm:text-2xl">Aplikasi & Alat Santri</h2>
					<p class="mt-0.5 text-xs text-so-muted sm:text-sm">Alat bantu untuk santri, guru, dan lembaga — gratis dan berbayar.</p>
				</div>
				<a class="shrink-0 text-xs font-bold text-so-green underline-offset-4 hover:underline sm:text-sm" href="/katalog/produk">Lihat Semua</a>
			</div>

			<div class="mt-4 grid gap-3 lg:grid-cols-[1.1fr_2fr] lg:gap-4">
				<a href={sorotan.detail ?? sorotan.href} class="group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-so-green-3 to-so-green-3 p-5 text-white shadow-soft sm:p-6">
					<p class="text-[11px] font-bold uppercase tracking-[0.16em] text-so-gold-2">Sorotan aplikasi</p>
					<div class="mt-3 flex items-center gap-4">
						{#if sorotan.sampul}
							<img src={sorotan.sampul} alt="" width="96" height="96" loading="lazy" decoding="async" class="size-20 shrink-0 rounded-2xl object-cover shadow-xl sm:size-24" />
						{/if}
						<div class="min-w-0">
							<h3 class="font-display text-xl font-bold leading-tight sm:text-2xl">{sorotan.judul}</h3>
							<div class="mt-1.5"><Bintang rata={sorotan.rating?.rata} jumlah={sorotan.rating?.jumlah} terang /></div>
						</div>
					</div>
					<p class="mt-3 line-clamp-3 text-sm leading-6 text-white/75">{sorotan.ringkasan}</p>
					<div class="mt-auto flex items-center justify-between gap-2 pt-4">
						<span class="text-sm font-extrabold text-so-gold-2">{sorotan.harga}</span>
						<span class="rounded-full bg-so-gold px-4 py-2 text-sm font-bold text-so-green-3 transition group-hover:translate-x-0.5">{sorotan.aksi} →</span>
					</div>
				</a>

				<div class="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
					{#each sisa as a (a.jenis + a.slug)}
						<a href={a.detail ?? a.href} class="group flex items-center gap-3 rounded-2xl border border-so-border/80 bg-white p-3 transition hover:-translate-y-0.5 hover:border-so-green/25 hover:shadow-md">
							{#if a.sampul}
								<img src={a.sampul} alt="" width="56" height="56" loading="lazy" decoding="async" class="size-14 shrink-0 rounded-xl object-cover" />
							{:else}
								<span class="grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-700 to-so-green-3 font-display text-lg font-bold text-white">{a.judul.slice(0, 2)}</span>
							{/if}
							<span class="min-w-0 flex-1">
								<span class="block truncate text-sm font-bold text-so-ink group-hover:text-so-green">{a.judul}</span>
								<span class="block"><Bintang rata={a.rating?.rata} jumlah={a.rating?.jumlah} /></span>
								<span class={`block text-xs font-extrabold ${a.gratis ? 'text-emerald-700' : 'text-so-green'}`}>{a.harga}</span>
							</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}
