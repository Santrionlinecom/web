<script lang="ts">
	// src/routes/tentang/+page.svelte — halaman Tentang SantriOnline.
	// Identitas usaha (NIB/KBLI/alamat) sengaja ditulis apa adanya; tanpa nomor pajak
	// dan tanpa nomor telepon. Jangan tambahkan angka atau testimoni karangan.
	import logo from '$lib/assets/logo.png';

	const appUrl = 'https://app.santrionline.com';
	const canonicalUrl = 'https://santrionline.com/tentang';
	const email = 'masyogik@santrionline.com';
	const linkedinUrl = 'https://www.linkedin.com/in/yogik-pratama/';
	const githubUrl = 'https://github.com/santrionlinecom';
	const alamat = 'Jl Welirang No 25A, Pendem, Junrejo, Kota Batu, Jawa Timur';

	const pilar = [
		{ judul: 'Aqidah Aswaja', isi: 'Mengenal Allah dan Rasulullah ﷺ dengan pemahaman Ahlussunnah wal Jamaah yang lurus, tenang, dan bertahap.' },
		{ judul: 'Adab', isi: 'Adab kepada Allah, orang tua, guru, dan sesama — termasuk adab ketika berada di ruang digital.' },
		{ judul: 'Amal', isi: 'Ilmu yang diwujudkan dalam ibadah, amanah, dan kebiasaan baik kecil yang dijaga setiap hari.' },
		{ judul: 'Ilmu', isi: 'Kitab, sirah, fiqih praktis, dan kisah ulama yang disajikan agar dekat dengan kehidupan sehari-hari.' },
		{ judul: 'Keterampilan', isi: 'Literasi digital, memakai AI secara bijak, menulis, berkomunikasi, dan memecahkan masalah.' },
		{ judul: 'Komunitas', isi: 'Santri, orang tua, guru, dan lembaga tumbuh bersama dalam lingkungan yang saling menjaga.' }
	];

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		'@id': `${canonicalUrl}#halaman`,
		url: canonicalUrl,
		name: 'Tentang SantriOnline',
		inLanguage: 'id-ID',
		about: { '@id': 'https://santrionline.com/#organization' },
		mainEntity: {
			'@type': 'Organization',
			'@id': 'https://santrionline.com/#organization',
			name: 'SantriOnline',
			url: 'https://santrionline.com/',
			email,
			address: {
				'@type': 'PostalAddress',
				streetAddress: 'Jl Welirang No 25A, Pendem',
				addressLocality: 'Kota Batu',
				addressRegion: 'Jawa Timur',
				addressCountry: 'ID'
			},
			founder: {
				'@type': 'Person',
				'@id': 'https://masyogik.santrionline.com/#person',
				name: 'Yogik Pratama Aprilian',
				jobTitle: 'Founder & Lead Developer',
				sameAs: [linkedinUrl, githubUrl]
			}
		}
	};
</script>

<svelte:head>
	<title>Tentang SantriOnline | Misi, Pendiri, dan Identitas Usaha</title>
	<meta name="description" content="Tentang SantriOnline: misi membina generasi muslim lewat aqidah Aswaja, adab, amal, ilmu, keterampilan, dan komunitas. Pendiri, alamat, NIB, dan kontak resmi." />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" hreflang="id-ID" href={canonicalUrl} />
	<link rel="alternate" hreflang="x-default" href={canonicalUrl} />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="id-ID" />
	<meta name="geo.region" content="ID" />
	<meta name="geo.placename" content="Indonesia" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content="Tentang SantriOnline" />
	<meta property="og:description" content="Misi SantriOnline, pendiri, dan identitas usaha resmi." />
	<meta property="og:image" content="https://santrionline.com/og-santrionline.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Tentang SantriOnline" />
	<meta name="twitter:description" content="Misi SantriOnline, pendiri, dan identitas usaha resmi." />
	<meta name="twitter:image" content="https://santrionline.com/og-santrionline.png" />
	{@html `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}<\/script>`}
</svelte:head>

<div class="min-h-screen bg-so-cream text-so-ink">
	<header class="border-b border-so-border/80 bg-white">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
			<a href="/" class="inline-flex items-center gap-3 font-display text-lg font-bold text-so-green">
				<img src={logo} alt="Logo SantriOnline" class="vt-logo size-10 rounded-xl object-cover" />
				SantriOnline
			</a>
			<a href={appUrl} class="rounded-full bg-so-green px-5 py-2.5 text-sm font-bold text-white">Buka Aplikasi</a>
		</div>
	</header>

	<main>
		<section class="border-b border-so-border/70 bg-white px-4 py-14 sm:px-6 lg:py-20">
			<div class="mx-auto max-w-4xl text-center">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Tentang Kami</p>
				<h1 class="font-display mt-4 text-4xl font-bold tracking-[-0.04em] text-so-green sm:text-6xl">Tentang SantriOnline</h1>
				<p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-so-muted sm:text-xl">
					SantriOnline adalah sistem pembinaan generasi muslim. Kami ingin setiap anak dan remaja tumbuh dengan aqidah yang lurus, adab yang terjaga, amal yang nyata, ilmu yang hidup, keterampilan yang berguna, dan komunitas yang saling menguatkan.
				</p>
			</div>
		</section>

		<section class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16" aria-labelledby="misi-title">
			<h2 id="misi-title" class="font-display text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Misi kami</h2>
			<p class="mt-4 max-w-3xl text-lg leading-8 text-so-muted">
				Teknologi bukan pengganti ulama, guru, atau pesantren. Kami membangunnya sebagai jembatan: membantu santri tetap dekat dengan ilmu, membantu orang tua mendampingi, dan membantu TPQ, pondok, rumah tahfidz, masjid, serta musholla mengurus santrinya dengan lebih rapi — tanpa biaya.
			</p>
			<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each pilar as p}
					<article class="rounded-2xl border border-so-border/80 bg-white p-6">
						<h3 class="text-lg font-extrabold text-so-green">{p.judul}</h3>
						<p class="mt-2 text-sm leading-7 text-so-muted">{p.isi}</p>
					</article>
				{/each}
			</div>
		</section>

		<section class="border-y border-so-border/70 bg-white px-4 py-12 sm:px-6 lg:py-16" aria-labelledby="pendiri-title">
			<div class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
				<div>
					<h2 id="pendiri-title" class="font-display text-3xl font-bold tracking-[-0.03em] text-so-green sm:text-4xl">Pendiri</h2>
					<p class="mt-4 text-xl font-extrabold text-so-ink">Yogik Pratama Aprilian</p>
					<p class="mt-1 font-semibold text-so-muted">Founder &amp; Lead Developer</p>
					<p class="mt-4 leading-7 text-so-muted">Merancang dan membangun SantriOnline agar lembaga pendidikan Islam punya alat yang ringan, rapi, dan bisa dipakai bertahap.</p>
					<ul class="mt-5 flex flex-wrap gap-3 text-sm font-bold">
						<li><a class="inline-flex rounded-full border border-so-border px-4 py-2 text-so-green hover:border-so-green/40" href={linkedinUrl} rel="noopener me">LinkedIn</a></li>
						<li><a class="inline-flex rounded-full border border-so-border px-4 py-2 text-so-green hover:border-so-green/40" href={githubUrl} rel="noopener">GitHub</a></li>
						<li><a class="inline-flex rounded-full bg-so-green px-4 py-2 text-white hover:bg-so-green-3" href={`mailto:${email}`}>{email}</a></li>
					</ul>
				</div>
				<div class="rounded-3xl border border-so-border bg-so-cream p-6 sm:p-8">
					<h2 class="font-display text-2xl font-bold tracking-[-0.02em] text-so-green">Identitas usaha</h2>
					<dl class="mt-5 space-y-4 text-sm leading-6">
						<div><dt class="font-bold text-so-ink">Alamat</dt><dd class="text-so-muted">{alamat}</dd></div>
						<div><dt class="font-bold text-so-ink">Nomor Induk Berusaha</dt><dd class="text-so-muted">NIB 0229010241784</dd></div>
						<div><dt class="font-bold text-so-ink">Bidang usaha</dt><dd class="text-so-muted">KBLI 62199 (Aktivitas Pemrograman Komputer Lainnya)</dd></div>
						<div><dt class="font-bold text-so-ink">Email</dt><dd><a class="font-semibold text-so-green underline" href={`mailto:${email}`}>{email}</a></dd></div>
					</dl>
				</div>
			</div>
		</section>

		<section class="px-4 py-12 sm:px-6 lg:py-16">
			<div class="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
				<p class="text-lg font-bold text-so-green">Ingin mencoba bersama lembaga Anda?</p>
				<div class="flex flex-wrap gap-3">
					<a class="rounded-full bg-so-green px-6 py-3 text-sm font-bold text-white hover:bg-so-green-3" href="/lembaga">Untuk Lembaga</a>
					<a class="rounded-full border border-so-border bg-white px-6 py-3 text-sm font-bold text-so-green" href="/#tanya">Coba Tanya Kitab</a>
				</div>
			</div>
		</section>
	</main>

	<footer class="border-t border-so-border/80 bg-white px-4 py-8 text-sm text-so-muted sm:px-6">
		<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
			<p>© 2026 SantriOnline · Pendem, Batu, Jawa Timur</p>
			<nav class="flex flex-wrap gap-4 font-semibold" aria-label="Tautan terkait">
				<a class="hover:text-so-green" href="/">Beranda</a>
				<a class="hover:text-so-green" href="/katalog/semua">Katalog</a>
				<a class="hover:text-so-green" href="/lembaga">Untuk Lembaga</a>
				<a class="hover:text-so-green" href={appUrl}>Buka Aplikasi ↗</a>
			</nav>
		</div>
	</footer>
</div>
