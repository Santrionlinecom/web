<script lang="ts">
	// src/routes/aplikasi-raport-tpq/+page.svelte — halaman produk + unduhan
	// templat raport TPQ Excel (SEO Tahap 3). Templat dibuat oleh
	// scripts/buat-templat-raport-tpq.py → static/unduh/templat-raport-tpq.xlsx.
	import HalamanFitur from '$lib/components/HalamanFitur.svelte';
	import { cariHalamanAplikasi } from '$lib/halaman-aplikasi';

	const h = cariHalamanAplikasi('/aplikasi-raport-tpq')!;
	const unduh = '/unduh/templat-raport-tpq.xlsx';
</script>

<HalamanFitur f={h} terkait={h.bacaan} canonicalUrl={`https://santrionline.com${h.path}`}>
	{#snippet tambahan()}
		<section id="templat-excel" class="px-4 pb-14 sm:px-6" aria-labelledby="templat-title">
			<div class="mx-auto grid max-w-6xl gap-8 rounded-3xl border border-so-green/25 bg-white p-6 shadow-soft sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Gratis · tanpa daftar</p>
					<h2 id="templat-title" class="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Download templat raport TPQ Excel</h2>
					<ul class="mt-5 space-y-2 leading-7 text-so-ink">
						<li>— Tujuh aspek: kelancaran membaca (tartil), tajwid, makharijul huruf, hafalan surat pendek, hafalan doa harian, praktik wudhu &amp; shalat, menulis huruf Arab.</li>
						<li>— Rata-rata dan predikat (Mumtaz, Jayyid Jiddan, Jayyid, Maqbul) terhitung sendiri; ambangnya bisa diubah.</li>
						<li>— Kehadiran (sakit/izin/alpa), adab, dan catatan ustadz.</li>
						<li>— Lembar rapor siap cetak A4: ketik nomor santri, cetak, ulangi. Hingga 40 santri per berkas.</li>
					</ul>
				</div>
				<div class="rounded-2xl bg-so-cream p-6 text-center">
					<p class="font-display text-xl font-bold text-so-green">templat-raport-tpq.xlsx</p>
					<p class="mt-1 text-sm text-so-muted">Excel · ±15 KB · tanpa makro</p>
					<a href={unduh} download class="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-so-green px-7 py-3 text-base font-bold text-white hover:bg-so-green-3">Download Templat Raport TPQ</a>
					<p class="mt-3 text-xs leading-5 text-so-muted">Bisa dibuka di Excel, WPS, LibreOffice, dan Google Sheets.</p>
				</div>
			</div>
		</section>
	{/snippet}
</HalamanFitur>
