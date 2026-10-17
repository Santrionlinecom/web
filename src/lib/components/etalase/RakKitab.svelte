<script lang="ts">
	// RakKitab — rak sampul kitab per bidang ilmu (kerabat visual "Rak Novel":
	// kertas krem, bayangan buku, hijau SantriOnline). HP: satu baris geser per
	// bidang; desktop: kisi sampul di atas papan rak. Semua sampul menautkan ke
	// halaman detail publik (/katalog/kitab/<slug>) agar tautan internal SEO
	// tetap lengkap; sisa judul per bidang ada di <details> (tetap di HTML).
	import type { ItemKatalog } from '$lib/server/katalog';

	let { item }: { item: ItemKatalog[] } = $props();

	const TAMPIL = 14;
	// Warna pita bidang (sampul cadangan + penanda judul rak).
	const WARNA: Record<string, string> = {
		fiqih: '#1f6f54',
		hadits: '#8a5a12',
		aqidah: '#1d4e89',
		'aqidah-samiyyat': '#3b4f9c',
		'adab-tasawuf': '#6b3f8f',
		sirah: '#9b3d2e',
		'nahwu-sharaf': '#2f6f7a',
		'bahasa-arab': '#2c7a4b',
		'perbandingan-agama': '#5b5b5b',
		'ushul-musthalah': '#7a4a2a',
		'quran-tahsin': '#0f5d4a'
	};
	const warna = (b?: string | null) => WARNA[b ?? ''] ?? '#123f34';

	const kelompok = $derived.by(() => {
		const peta = new Map<string, { id: string; label: string; item: ItemKatalog[] }>();
		for (const i of item) {
			const id = i.bidang ?? 'lainnya';
			const g = peta.get(id) ?? { id, label: i.kategori ?? 'Lainnya', item: [] };
			g.item.push(i);
			peta.set(id, g);
		}
		return [...peta.values()].sort((a, b) => b.item.length - a.item.length);
	});
	// Judul "Al-Adzkar - Imam Nawawi" → judul utama tanpa nama pengarang.
	const judulUtama = (j: string) => j.split(/\s+[-–—]\s+/)[0];
</script>

{#snippet sampul(k: ItemKatalog, i: number)}
	<a href={k.detail ?? k.href} class="kitab group" aria-label={`${k.judul}${k.penulis ? ` — ${k.penulis}` : ''}`}>
		<div class="badan" style={`--pita:${warna(k.bidang)}`}>
			{#if k.sampul}
				<img src={k.sampul} alt={`Sampul ${k.judul}`} width="240" height="360" loading={i < 4 ? 'eager' : 'lazy'} decoding="async" class="h-full w-full object-cover" />
			{:else}
				<div class="tipografi">
					<span class="pita-atas">{k.kategori ?? 'Kitab'}</span>
					<span class="judul-sampul font-display">{judulUtama(k.judul)}</span>
					{#if k.penulis}<span class="pengarang">{k.penulis}</span>{/if}
				</div>
			{/if}
			<span class="punggung-kitab" aria-hidden="true"></span>
		</div>
		<span dir="auto" class="mt-2 line-clamp-2 text-[12px] font-bold leading-4 text-so-ink group-hover:text-so-green">{judulUtama(k.judul)}</span>
		{#if k.penulis}<span dir="auto" class="mt-0.5 line-clamp-1 text-[11px] text-so-muted">{k.penulis}</span>{/if}
	</a>
{/snippet}

<div class="space-y-8">
	{#each kelompok as g (g.id)}
		<section class="rak" aria-labelledby={`rak-${g.id}`} style={`--pita:${warna(g.id)}`}>
			<div class="flex items-end justify-between gap-3 px-1">
				<h2 id={`rak-${g.id}`} class="font-display flex items-center gap-2 text-lg font-bold text-so-green sm:text-xl">
					<span class="tanda" aria-hidden="true"></span>Kitab {g.label}
					<span class="text-xs font-semibold text-so-muted">{g.item.length}</span>
				</h2>
				<a href={`/katalog/kitab?q=${encodeURIComponent(g.label)}`} class="shrink-0 text-xs font-bold text-so-green hover:underline">Lihat semua</a>
			</div>
			<div class="papan">
				<div class="baris" style="scrollbar-width:none">
					{#each g.item.slice(0, TAMPIL) as k, i (k.slug)}{@render sampul(k, i)}{/each}
				</div>
			</div>
			{#if g.item.length > TAMPIL}
				<details class="mt-2">
					<summary class="cursor-pointer px-1 text-xs font-bold text-so-green hover:underline">Tampilkan {g.item.length - TAMPIL} kitab {g.label} lainnya</summary>
					<div class="papan mt-3">
						<div class="kisi">
							{#each g.item.slice(TAMPIL) as k, i (k.slug)}{@render sampul(k, TAMPIL + i)}{/each}
						</div>
					</div>
				</details>
			{/if}
		</section>
	{/each}
</div>

<style>
	.tanda {
		display: inline-block;
		width: 0.4rem;
		height: 1.25rem;
		border-radius: 9999px;
		background: var(--pita);
	}
	/* Papan rak: latar kertas krem + bilah kayu di bawah tiap baris. */
	.papan {
		position: relative;
		margin-top: 0.75rem;
		border-radius: 1rem;
		background: linear-gradient(180deg, #fffdf7 0%, #f6efdf 100%);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.8), 0 1px 2px rgb(12 44 37 / 0.06);
		padding: 0.9rem 0.9rem 1.4rem;
	}
	.papan::after {
		content: '';
		position: absolute;
		left: 0.5rem;
		right: 0.5rem;
		bottom: 0.45rem;
		height: 0.55rem;
		border-radius: 0.3rem;
		background: linear-gradient(180deg, #b98a55, #8a5f33);
		box-shadow: 0 6px 10px -4px rgb(60 35 10 / 0.45);
	}
	.baris {
		display: flex;
		gap: 0.85rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding-bottom: 0.4rem;
		margin: 0 -0.25rem;
		padding-inline: 0.25rem;
	}
	.baris > :global(.kitab) {
		width: 7.25rem;
		flex: 0 0 auto;
		scroll-snap-align: start;
	}
	.kisi {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.85rem;
	}
	@media (min-width: 640px) {
		.baris {
			display: grid;
			grid-template-columns: repeat(5, minmax(0, 1fr));
			overflow: visible;
		}
		.baris > :global(.kitab) {
			width: auto;
		}
		.kisi {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}
	@media (min-width: 1024px) {
		.baris,
		.kisi {
			grid-template-columns: repeat(7, minmax(0, 1fr));
			gap: 1rem;
		}
	}
	.kitab {
		display: flex;
		min-width: 0;
		flex-direction: column;
	}
	.badan {
		position: relative;
		aspect-ratio: 2 / 3;
		overflow: hidden;
		border-radius: 0.3rem 0.6rem 0.6rem 0.3rem;
		background: #fffdf7;
		box-shadow: 0 10px 14px -8px rgb(12 44 37 / 0.45), 0 2px 3px rgb(12 44 37 / 0.12);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}
	.kitab:hover .badan,
	.kitab:focus-visible .badan {
		transform: translateY(-4px) rotate(-0.6deg);
		box-shadow: 0 16px 20px -10px rgb(12 44 37 / 0.5), 0 2px 3px rgb(12 44 37 / 0.12);
	}
	/* Bayangan punggung kitab di sisi kiri sampul. */
	.punggung-kitab {
		position: absolute;
		inset: 0 auto 0 0;
		width: 9%;
		background: linear-gradient(90deg, rgb(0 0 0 / 0.28), rgb(255 255 255 / 0.12) 55%, rgb(0 0 0 / 0.06));
		pointer-events: none;
	}
	/* Sampul cadangan tipografis bila cover_url kosong. */
	.tipografi {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
		padding: 0.6rem 0.55rem 0.7rem 0.9rem;
		text-align: center;
		color: #fdf7e7;
		background:
			radial-gradient(circle at 50% 45%, rgb(255 255 255 / 0.1), transparent 60%),
			linear-gradient(160deg, var(--pita), color-mix(in srgb, var(--pita) 55%, #0b1f1a));
		outline: 2px solid rgb(232 200 120 / 0.55);
		outline-offset: -7px;
	}
	.pita-atas {
		font-size: 9px;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgb(253 247 231 / 0.75);
	}
	.judul-sampul {
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.15;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.pengarang {
		font-size: 10px;
		color: rgb(232 200 120);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	@media (prefers-reduced-motion: reduce) {
		.badan {
			transition: none;
		}
	}
</style>
