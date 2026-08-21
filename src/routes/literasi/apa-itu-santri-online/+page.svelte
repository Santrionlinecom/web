<script lang="ts">
	// src/routes/literasi/apa-itu-santri-online/+page.svelte
	import logo from '$lib/assets/logo.png';
	import { inview } from '$lib/actions/inview';

	const appUrl = 'https://app.santrionline.com';
	const blogUrl = `${appUrl}/blog/apa-itu-santri-online`;
	const canonicalUrl = 'https://santrionline.com/literasi/apa-itu-santri-online';

	// JSON-LD Article: halaman kunci kata kunci "santri online" dinyatakan
	// eksplisit sebagai artikel milik Organization kanonik.
	const articleSchema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Apa Itu Santri Online?',
		description:
			'Santri Online adalah semangat untuk terus mengaji, belajar, menjaga adab, dan mengikuti bimbingan ulama dengan memanfaatkan teknologi sebagai jembatan.',
		image: 'https://santrionline.com/og-santrionline.png',
		author: { '@type': 'Organization', name: 'SantriOnline', url: 'https://santrionline.com/' },
		publisher: { '@id': 'https://santrionline.com/#organization' },
		mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
		inLanguage: 'id-ID',
		articleSection: 'Literasi',
		contentLocation: {
			'@type': 'Place',
			name: 'Indonesia',
			address: { '@type': 'PostalAddress', addressCountry: 'ID' }
		},
		isAccessibleForFree: true
	};
</script>

<svelte:head>
	<title>Apa Itu Santri Online? | SantriOnline</title>
	<meta name="description" content="Santri Online adalah semangat untuk terus mengaji, belajar, menjaga adab, dan mengikuti bimbingan ulama dengan memanfaatkan teknologi sebagai jembatan." />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" hreflang="id-ID" href={canonicalUrl} />
	<link rel="alternate" hreflang="x-default" href={canonicalUrl} />
	<meta name="language" content="id-ID" />
	<meta name="geo.region" content="ID" />
	<meta name="geo.placename" content="Indonesia" />
	<meta property="og:title" content="Apa Itu Santri Online?" />
	<meta property="og:description" content="Teknologi bukan pengganti ulama atau pesantren. Ia adalah jembatan agar jarak dan kesibukan tidak memutus semangat mengaji." />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="SantriOnline" />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content="https://santrionline.com/og-santrionline.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Apa Itu Santri Online?" />
	<meta name="twitter:description" content="Teknologi adalah jembatan untuk terus mengaji, bukan pengganti ulama, guru, atau pesantren." />
	<meta name="twitter:image" content="https://santrionline.com/og-santrionline.png" />
	{@html `<script type="application/ld+json">${JSON.stringify(articleSchema).replace(/</g, '\\u003c')}<\/script>`}
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
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-so-accent-ink">Literasi SantriOnline</p>
				<h1 class="font-display mt-4 text-4xl font-bold tracking-[-0.04em] text-so-green sm:text-6xl">Apa Itu Santri Online?</h1>
				<p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-so-muted sm:text-xl">Dalam semangat SantriOnline, siapa saja dapat terus belajar, mengaji, menjaga adab, dan mengikuti bimbingan ulama dengan memanfaatkan teknologi digital.</p>
			</div>
		</section>

		<article class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16" use:inview>
			<div class="rounded-3xl border border-so-border bg-white p-6 shadow-soft sm:p-10">
				<div class="space-y-6 text-base leading-8 text-so-muted sm:text-lg">
					<p>Menjadi santri tidak selalu harus dimaknai secara sempit sebagai seseorang yang tinggal di pondok pesantren. Ada orang yang bekerja, menjalankan usaha, mengurus keluarga, menempuh pendidikan, atau memikul tanggung jawab lain sehingga belum memiliki kesempatan untuk menetap dan belajar langsung di pesantren.</p>
					<p>Keterbatasan tempat dan waktu tidak semestinya memutus semangat mencari ilmu. Di sinilah SantriOnline mengambil peran: membantu orang tetap dekat dengan ilmu, guru, dan lingkungan belajar yang baik.</p>

					<div class="rounded-2xl border border-so-gold/30 bg-so-gold/10 p-5 text-so-green sm:p-6">
						<p class="font-bold">Teknologi bukan pengganti ulama, guru, ataupun pesantren.</p>
						<p class="mt-2">Teknologi adalah jembatan. Ia membantu seseorang menyimak pengajian, membaca kitab dan literatur Islam, mengikuti kelas jarak jauh, berdiskusi, serta bertanya kepada ustaz atau guru melalui sarana digital.</p>
					</div>

					<h2 class="font-display pt-4 text-2xl font-bold text-so-green sm:text-3xl">Belajar tanpa terhalang jarak</h2>
					<p>Dahulu seseorang mungkin harus menempuh perjalanan jauh untuk menghadiri sebuah pengajian. Hari ini, dengan izin Allah, ilmu dari seorang guru dapat didengar oleh murid yang berada ratusan bahkan ribuan kilometer jauhnya.</p>
					<p>Video, audio, kitab digital, dan kelas daring hanyalah sarana. Esensinya tetap sama: mencari ilmu dengan niat yang baik, menjaga adab, menghormati guru, memeriksa sumber, dan berusaha mengamalkan apa yang dipelajari.</p>

					<h2 class="font-display pt-4 text-2xl font-bold text-so-green sm:text-3xl">Apakah Santri Online menggantikan pesantren?</h2>
					<p><strong class="text-so-ink">Tidak.</strong> Belajar langsung kepada guru dan kehidupan di pesantren memiliki keistimewaan yang sulit digantikan teknologi. Pesantren mendidik ilmu sekaligus adab, kedisiplinan, kebersamaan, khidmah, dan keteladanan secara langsung.</p>
					<p>SantriOnline tidak hadir untuk menyaingi pesantren. Ia hadir sebagai jembatan bagi mereka yang belum dapat tinggal di pesantren, yang sibuk bekerja, yang telah berkeluarga, maupun alumni pesantren yang ingin menjaga hubungan dengan ilmu dan para ulama.</p>

					<h2 class="font-display pt-4 text-2xl font-bold text-so-green sm:text-3xl">Semangat belajar sepanjang hayat</h2>
					<p>Istilah Santri Online bukan gelar untuk merasa lebih alim. Ia adalah sikap seorang murid: tetap mengaji meskipun sibuk, tetap belajar meskipun jauh, tetap menghormati ulama meskipun bertemu melalui layar, dan tetap menjaga adab di ruang digital.</p>
					<p>Kita tidak perlu tergesa-gesa menilai perjalanan orang lain. Ada yang bertahun-tahun tinggal di pesantren. Ada pula yang baru bisa mengikuti pengajian beberapa menit setelah pulang bekerja. Jalannya berbeda, tetapi semangat mencari ilmunya dapat sama.</p>
					<p>Santri Online adalah ikhtiar agar kesibukan, jarak, usia, pekerjaan, dan keadaan hidup tidak menjadi alasan untuk berhenti mengaji. Teknologi boleh berubah dan zaman boleh berkembang, tetapi hati seorang penuntut ilmu tetap rendah hati di hadapan ilmu, beradab kepada guru, mengikuti ulama, dan tidak merasa selesai belajar.</p>
				</div>

				<footer class="mt-10 rounded-3xl bg-so-green-3 px-6 py-8 text-center text-white sm:px-10">
					<p class="font-display text-2xl font-bold">SantriOnline</p>
					<p class="mt-2 text-lg text-white/80">Mengaji Tanpa Batas, Beradab Tanpa Sekat.</p>
					<div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
						<a href={blogUrl} class="rounded-full bg-so-gold px-6 py-3 font-bold text-so-green-3">Baca di Blog SantriOnline</a>
						<a href={appUrl} class="rounded-full border border-white/25 px-6 py-3 font-bold text-white">Mulai Belajar</a>
					</div>
				</footer>
			</div>
		</article>
	</main>
</div>
