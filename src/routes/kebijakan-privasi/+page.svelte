<script lang="ts">
	// src/routes/kebijakan-privasi/+page.svelte — kebijakan privasi situs publik santrionline.com.
	// Situs tanpa iklan pihak ketiga (AdSense dicopot 20 Okt 2026).
	// Kebijakan aplikasi (app.santrionline.com) tetap di app.santrionline.com/privacy.
	import MetaGambar from '$lib/components/MetaGambar.svelte';
	import { ogWeb } from '$lib/og-gambar.js';
	import logo from '$lib/assets/logo.png';
	const email = 'masyogik@santrionline.com';
	const diperbarui = '20 Oktober 2026';
</script>

<svelte:head>
	<title>Kebijakan Privasi | SantriOnline</title>
	<meta name="description" content="Kebijakan privasi santrionline.com: data yang dikumpulkan, cookie, layanan pihak ketiga, hak Anda, dan cara menghubungi kami." />
	<link rel="canonical" href="https://santrionline.com/kebijakan-privasi" />
	<meta name="robots" content="index, follow" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:url" content="https://santrionline.com/kebijakan-privasi" />
	<meta property="og:title" content="Kebijakan Privasi | SantriOnline" />
	<meta property="og:description" content="Kebijakan privasi santrionline.com: data yang dikumpulkan, cookie, layanan pihak ketiga, hak Anda, dan cara menghubungi kami." />
	<MetaGambar src={ogWeb('/kebijakan-privasi')} alt={'Kebijakan privasi SantriOnline'} />
</svelte:head>

<div class="min-h-screen bg-so-cream text-so-ink">
	<header class="border-b border-so-border/80 bg-white">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
			<a href="/" class="inline-flex items-center gap-3 font-display text-lg font-bold text-so-green">
				<img src={logo} alt="Logo SantriOnline" class="size-10 rounded-xl object-cover" />
				SantriOnline
			</a>
			<a href="https://app.santrionline.com" class="rounded-full bg-so-green px-5 py-2.5 text-sm font-bold text-white">Buka Aplikasi</a>
		</div>
	</header>
	<main class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
		<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Kebijakan</p>
		<h1 class="font-display mt-3 text-4xl font-bold tracking-[-0.03em] text-so-green sm:text-5xl">Kebijakan Privasi</h1>
		<p class="mt-3 text-sm text-so-muted">Berlaku untuk situs santrionline.com. Terakhir diperbarui {diperbarui}.</p>

		<div class="prose-so mt-8 space-y-8 leading-7 text-so-muted">
			<section>
				<h2 class="text-xl font-extrabold text-so-green">Siapa kami</h2>
				<p class="mt-2">santrionline.com dikelola oleh SantriOnline, usaha perorangan atas nama Yogik Pratama Aprilian (NIB 0229010241784), Jl Welirang No 25A, Pendem, Junrejo, Kota Batu, Jawa Timur. Kebijakan ini menjelaskan data apa yang diproses saat Anda mengunjungi situs ini, sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.</p>
			</section>
			<section>
				<h2 class="text-xl font-extrabold text-so-green">Data yang kami kumpulkan</h2>
				<ul class="mt-2 list-disc space-y-1 pl-5">
					<li>Data teknis kunjungan: alamat IP, jenis peramban dan perangkat, halaman yang dibuka, dan waktu kunjungan. Data ini dipakai untuk keamanan, mencegah penyalahgunaan, dan memperbaiki situs.</li>
					<li>Pertanyaan yang Anda ketik di fitur Cari Isi Kitab, untuk menjawab pertanyaan tersebut.</li>
					<li>Data yang Anda kirim sendiri lewat email atau formulir, misalnya nama dan alamat email.</li>
				</ul>
				<p class="mt-2">Untuk membaca halaman di situs ini Anda tidak perlu membuat akun. Pendaftaran dan data akun diatur oleh <a class="font-semibold text-so-green underline" href="https://app.santrionline.com/privacy">kebijakan privasi aplikasi SantriOnline</a>.</p>
			</section>
			<section>
				<h2 class="text-xl font-extrabold text-so-green">Cookie</h2>
				<p class="mt-2">Cookie adalah berkas kecil yang disimpan peramban Anda. Situs ini memakai cookie yang diperlukan agar situs berjalan, bukan untuk iklan. Anda bisa menghapus atau memblokir cookie lewat pengaturan peramban; sebagian fitur mungkin tidak berjalan sempurna setelahnya.</p>
			</section>
			<section>
				<h2 class="text-xl font-extrabold text-so-green">Tanpa iklan pihak ketiga</h2>
				<p class="mt-2">santrionline.com tidak memasang iklan pihak ketiga dan tidak memakai cookie iklan atau pelacak iklan. Data kunjungan Anda tidak dijual dan tidak dipakai untuk menargetkan iklan.</p>
			</section>
			<section>
				<h2 class="text-xl font-extrabold text-so-green">Layanan pihak ketiga lain</h2>
				<p class="mt-2">Situs ini dimuat melalui jaringan pengiriman konten dan memakai huruf dari Google Fonts. Penyedia tersebut dapat menerima data teknis seperti alamat IP untuk mengirimkan berkas ke peramban Anda.</p>
			</section>
			<section>
				<h2 class="text-xl font-extrabold text-so-green">Anak-anak</h2>
				<p class="mt-2">Sebagian konten kami ditujukan untuk santri dan keluarga. Kami tidak meminta data pribadi anak di situs ini. Orang tua yang mendampingi anak dapat menghubungi kami untuk menanyakan atau meminta penghapusan data.</p>
			</section>
			<section>
				<h2 class="text-xl font-extrabold text-so-green">Hak Anda</h2>
				<p class="mt-2">Anda berhak meminta akses, perbaikan, atau penghapusan data pribadi Anda, serta menarik persetujuan. Kirim permintaan ke <a class="font-semibold text-so-green underline" href={`mailto:${email}`}>{email}</a>. Kami tidak menjual data pribadi Anda.</p>
			</section>
			<section>
				<h2 class="text-xl font-extrabold text-so-green">Perubahan kebijakan</h2>
				<p class="mt-2">Kebijakan ini dapat diperbarui. Tanggal di bagian atas halaman menunjukkan versi terbaru.</p>
			</section>
		</div>
	</main>
</div>
