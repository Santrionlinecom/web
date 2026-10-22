<script lang="ts">
	// src/routes/kontak/+page.svelte — halaman Kontak resmi santrionline.com.
	// Tanpa nomor telepon pribadi; email resmi saja.
	import MetaGambar from '$lib/components/MetaGambar.svelte';
	import { ogWeb } from '$lib/og-gambar.js';
	import logo from '$lib/assets/logo.png';
	const email = 'masyogik@santrionline.com';
	const alamat = 'Jl Welirang No 25A, Pendem, Junrejo, Kota Batu, Jawa Timur';
</script>

<svelte:head>
	<title>Kontak | SantriOnline</title>
	<meta name="description" content="Hubungi SantriOnline: email resmi, alamat usaha, dan tautan bantuan untuk santri, orang tua, dan lembaga." />
	<link rel="canonical" href="https://santrionline.com/kontak" />
	<meta name="robots" content="index, follow" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:url" content="https://santrionline.com/kontak" />
	<meta property="og:title" content="Kontak | SantriOnline" />
	<meta property="og:description" content="Hubungi SantriOnline: email resmi, alamat usaha, dan tautan bantuan untuk santri, orang tua, dan lembaga." />
	<MetaGambar src={ogWeb('/kontak')} alt={'Kontak SantriOnline'} />
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
		<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Kontak</p>
		<h1 class="font-display mt-3 text-4xl font-bold tracking-[-0.03em] text-so-green sm:text-5xl">Hubungi Kami</h1>
		<p class="mt-4 text-lg leading-8 text-so-muted">Punya pertanyaan, saran, laporan konten, atau ingin memakai SantriOnline untuk lembaga Anda? Kirim pesan, insyaAllah kami balas dalam 1–2 hari kerja.</p>

		<div class="mt-8 grid gap-4 sm:grid-cols-2">
			<article class="rounded-2xl border border-so-border/80 bg-white p-6">
				<h2 class="text-lg font-extrabold text-so-green">Email</h2>
				<a class="mt-2 inline-block font-semibold text-so-green underline" href={`mailto:${email}`}>{email}</a>
				<p class="mt-2 text-sm leading-6 text-so-muted">Untuk pertanyaan umum, kerja sama, laporan konten yang tidak pantas, dan permintaan terkait data pribadi.</p>
			</article>
			<article class="rounded-2xl border border-so-border/80 bg-white p-6">
				<h2 class="text-lg font-extrabold text-so-green">Alamat usaha</h2>
				<p class="mt-2 text-sm leading-6 text-so-muted">{alamat}</p>
				<p class="mt-2 text-sm leading-6 text-so-muted">Usaha perorangan atas nama Yogik Pratama Aprilian · NIB 0229010241784</p>
			</article>
			<article class="rounded-2xl border border-so-border/80 bg-white p-6">
				<h2 class="text-lg font-extrabold text-so-green">Untuk lembaga</h2>
				<p class="mt-2 text-sm leading-6 text-so-muted">TPQ, pondok, rumah tahfidz, masjid, dan musholla bisa langsung mendaftar gratis.</p>
				<a class="mt-3 inline-block text-sm font-bold text-so-green underline" href="/lembaga">Daftarkan lembaga</a>
			</article>
			<article class="rounded-2xl border border-so-border/80 bg-white p-6">
				<h2 class="text-lg font-extrabold text-so-green">Pengguna aplikasi</h2>
				<p class="mt-2 text-sm leading-6 text-so-muted">Sudah punya akun? Masuk ke aplikasi untuk mengelola akun dan data Anda.</p>
				<a class="mt-3 inline-block text-sm font-bold text-so-green underline" href="https://app.santrionline.com">Buka aplikasi</a>
			</article>
		</div>
		<p class="mt-8 text-sm text-so-muted">Baca juga <a class="font-semibold text-so-green underline" href="/kebijakan-privasi">Kebijakan Privasi</a> dan <a class="font-semibold text-so-green underline" href="/tentang">Tentang SantriOnline</a>.</p>
	</main>
</div>
