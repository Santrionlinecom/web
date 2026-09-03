<script lang="ts">
	// KartuKatalog — satu sampul di rak (pola etalase: sampul portrait 2:3,
	// judul 2 baris, harga, tombol aksi). Sampul kosong → plakat warna per
	// jenis dengan inisial, supaya rak tetap rapi tanpa gambar.
	import type { ItemKatalog } from '$lib/server/katalog';

	let { item, prioritas = false }: { item: ItemKatalog; prioritas?: boolean } = $props();

	const warnaJenis: Record<string, string> = {
		kitab: 'from-so-green to-so-green-3',
		buku: 'from-amber-700 to-so-green-3',
		produk: 'from-sky-700 to-so-green-3',
		kursus: 'from-violet-700 to-so-green-3',
		game: 'from-emerald-600 to-so-green-3',
		belajar: 'from-teal-600 to-so-green-3'
	};
	const labelJenis: Record<string, string> = {
		kitab: 'Kitab',
		buku: 'Buku',
		produk: 'Aplikasi',
		kursus: 'Kursus',
		game: 'Game',
		belajar: 'Belajar'
	};
	const inisial = $derived(
		item.judul
			.split(/\s+/)
			.slice(0, 2)
			.map((k) => k[0])
			.join('')
			.toUpperCase()
	);
</script>

<a
	class="kartu group flex w-[9.25rem] shrink-0 snap-start flex-col sm:w-[10.5rem] lg:w-[11.5rem]"
	href={item.detail ?? item.href}
	aria-label={`${item.detail ? 'Lihat' : item.aksi} ${item.judul}`}
>
	<div class="relative aspect-[2/3] overflow-hidden rounded-2xl border border-so-border/80 bg-so-cream shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
		{#if item.sampul}
			<img
				src={item.sampul}
				alt=""
				width="240"
				height="360"
				loading={prioritas ? 'eager' : 'lazy'}
				decoding="async"
				class="h-full w-full object-cover"
			/>
		{:else}
			<div class={`flex h-full w-full flex-col justify-between bg-gradient-to-br p-3 text-white ${warnaJenis[item.jenis] ?? warnaJenis.kitab}`}>
				<span class="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">{labelJenis[item.jenis]}</span>
				<span class="font-display text-4xl font-bold tracking-[-0.04em]">{inisial}</span>
				<span class="line-clamp-3 text-xs font-semibold leading-4 text-white/90">{item.judul}</span>
			</div>
		{/if}
		<span class="absolute left-2 top-2 rounded-full bg-white/92 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-so-green shadow-sm backdrop-blur">
			{labelJenis[item.jenis]}
		</span>
		{#if item.gratis}
			<span class="absolute right-2 top-2 rounded-full bg-so-gold px-2 py-0.5 text-[10px] font-extrabold text-so-green-3 shadow-sm">Gratis</span>
		{/if}
	</div>
	<p class="mt-2.5 line-clamp-2 text-sm font-bold leading-5 text-so-ink">{item.judul}</p>
	<p class="mt-0.5 truncate text-xs text-so-muted">{item.kategori ?? item.harga}</p>
	<div class="mt-2 flex items-center justify-between gap-2">
		<span class="truncate text-xs font-extrabold text-so-green">{item.harga}</span>
		<span class="rounded-full bg-so-green px-3 py-1 text-[11px] font-bold text-white transition group-hover:bg-so-green-3">{item.aksi}</span>
	</div>
</a>
