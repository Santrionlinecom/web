<script lang="ts">
	import { onMount } from 'svelte';
	import FaqItem from '$lib/components/jasa/FaqItem.svelte';
	import PricingCard from '$lib/components/jasa/PricingCard.svelte';

	type PricingPlan = {
		nama: string;
		harga: string;
		satuan?: string;
		fitur: string[];
		isPopuler?: boolean;
		ctaLink: string;
	};

	let activeTab = $state<'website' | 'tahunan'>('website');
	let activeFaq = $state(0);

	const whatsappUrl =
		'https://wa.me/6287854545274?text=Halo%2C%20saya%20ingin%20konsultasi%20jasa%20website%20SantriOnline';
	const orderUrl = '/order';

	const trustSignals = [
		{
			title: 'Website Profesional dan Modern',
			description: 'Tampilan rapi, cepat dipahami, dan siap digunakan di berbagai perangkat.',
			icon: 'layout'
		},
		{
			title: 'Teknologi AI-Powered',
			description: 'Alur kerja dibantu otomasi cerdas untuk riset, konten, dan optimasi.',
			icon: 'spark'
		},
		{
			title: 'Support dan Maintenance Terpercaya',
			description: 'Pendampingan teknis tersedia agar website tetap aktif dan terawat.',
			icon: 'support'
		}
	];

	const targetClients = [
		'Klinik dan Bidan Praktek',
		'Pesantren dan Masjid',
		'UMKM dan Toko Online',
		'Dokter dan Profesional',
		'Lembaga dan Yayasan',
		'Personal Branding'
	];

	const websitePlans: PricingPlan[] = [
		{
			nama: 'Halaman Profil',
			harga: 'Rp2.500.000',
			satuan: 'sekali proyek',
			fitur: ['Landing page 1 halaman', 'Profil usaha', 'Kontak', 'Mobile-friendly'],
			ctaLink: orderUrl
		},
		{
			nama: 'Company Profile',
			harga: 'Rp5.000.000',
			satuan: 'sekali proyek',
			fitur: ['Multi-halaman', 'Tentang kami', 'Produk atau layanan', 'Galeri'],
			isPopuler: true,
			ctaLink: orderUrl
		},
		{
			nama: 'Toko dan Layanan',
			harga: 'Rp10.000.000',
			satuan: 'sekali proyek',
			fitur: ['Katalog produk', 'Form order', 'Integrasi WhatsApp', 'Alur pemesanan jelas'],
			ctaLink: orderUrl
		},
		{
			nama: 'Aplikasi Web',
			harga: 'Rp20.000.000+',
			satuan: 'mulai dari',
			fitur: ['Dashboard', 'Login', 'Manajemen data', 'Integrasi API dan pembayaran'],
			ctaLink: orderUrl
		}
	];

	const annualPlans: PricingPlan[] = [
		{
			nama: 'Dasar',
			harga: 'Rp750.000',
			satuan: 'per tahun',
			fitur: ['Hosting', 'SSL aktif', 'Update minor 1x per bulan', 'Pemeriksaan dasar'],
			ctaLink: orderUrl
		},
		{
			nama: 'Bisnis',
			harga: 'Rp1.500.000',
			satuan: 'per tahun',
			fitur: ['Hosting plus domain .com', 'Update 3x per bulan', 'Backup', 'Dukungan prioritas'],
			isPopuler: true,
			ctaLink: orderUrl
		},
		{
			nama: 'Profesional',
			harga: 'Rp3.000.000',
			satuan: 'per tahun',
			fitur: ['Semua Bisnis', 'Update tanpa batas wajar', 'Laporan bulanan', 'Priority support'],
			ctaLink: orderUrl
		},
		{
			nama: 'Enterprise',
			harga: 'Harga Custom',
			fitur: ['SLA khusus', 'Dedicated support', 'Integrasi sistem', 'Rencana teknis lanjutan'],
			ctaLink: orderUrl
		}
	];

	const workSteps = [
		{
			title: 'Konsultasi',
			description: 'Ceritakan kebutuhan Anda via WhatsApp'
		},
		{
			title: 'Proposal',
			description: 'Kami kirim desain dan penawaran dalam 1x24 jam'
		},
		{
			title: 'Pengerjaan',
			description: 'Website dikerjakan 7 hingga 14 hari kerja'
		},
		{
			title: 'Live dan Support',
			description: 'Website aktif, kami dampingi selama kontrak'
		}
	];

	const portfolio = [
		{
			title: 'alkesduaputry.com',
			description: 'Distributor Alat Kesehatan, Depok',
			label: ''
		},
		{
			title: 'Website Klinik',
			description: 'Bidan Praktek, Depok',
			label: 'Segera'
		},
		{
			title: 'Website Lembaga',
			description: 'Dalam Pengerjaan',
			label: 'Segera'
		}
	];

	const faqs = [
		{
			pertanyaan: 'Apakah ada biaya tersembunyi?',
			jawaban:
				'Tidak. Harga yang tertera sudah final. Perpanjangan domain dan hosting kami informasikan jauh-jauh hari.'
		},
		{
			pertanyaan: 'Berapa lama proses pembuatan website?',
			jawaban:
				'Landing page 3 sampai 5 hari. Company profile 7 sampai 10 hari. Aplikasi web 14 sampai 30 hari.'
		},
		{
			pertanyaan: 'Bisa minta revisi?',
			jawaban:
				'Ya. Setiap paket sudah termasuk revisi. Kami pastikan Anda puas sebelum website live.'
		},
		{
			pertanyaan: 'Metode pembayaran apa yang tersedia?',
			jawaban: 'Transfer bank, QRIS, dan berbagai metode pembayaran online.'
		},
		{
			pertanyaan: 'Apakah website bisa dikelola sendiri setelah jadi?',
			jawaban: 'Ya, kami berikan panduan dan akses penuh.'
		},
		{
			pertanyaan: 'Apakah bisa untuk klien di luar kota?',
			jawaban: 'Ya, 100 persen remote. Klien kami tersebar di berbagai kota Indonesia.'
		}
	];

	const visiblePlans = $derived(activeTab === 'website' ? websitePlans : annualPlans);

	onMount(() => {
		const elements = Array.from(document.querySelectorAll('.fade-in-up'));
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -48px 0px' }
		);

		for (const element of elements) {
			observer.observe(element);
		}

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Jasa Website Profesional | SantriOnline Web Studio</title>
	<meta
		name="description"
		content="Jasa pembuatan website profesional untuk UMKM, klinik, pesantren, dan lembaga. Mulai Rp750.000 per tahun. AI-powered, modern, dan terpercaya."
	/>
	<meta property="og:title" content="Jasa Website Profesional | SantriOnline Web Studio" />
	<meta
		property="og:description"
		content="Jasa pembuatan website profesional untuk UMKM, klinik, pesantren, dan lembaga. Mulai Rp750.000 per tahun. AI-powered, modern, dan terpercaya."
	/>
	<meta property="og:url" content="https://santrionline.com/jasa" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="jasa-page min-h-screen bg-[#f7faf8] text-[#1b3024]">
	<section class="relative isolate overflow-hidden bg-[#0d2418] px-4 py-20 text-white sm:px-6 lg:px-10 lg:py-28">
		<div class="absolute inset-0 bg-gradient-to-br from-[#0b1f15] via-[#123923] to-[#1a5c38]"></div>
		<svg class="absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden="true">
			<defs>
				<pattern id="jasa-pattern" width="72" height="72" patternUnits="userSpaceOnUse">
					<path d="M36 2 70 36 36 70 2 36Z" fill="none" stroke="white" stroke-width="2" />
					<path d="M36 14 58 36 36 58 14 36Z" fill="none" stroke="white" stroke-width="2" />
					<path d="M2 36h68M36 2v68" stroke="white" stroke-width="1.5" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#jasa-pattern)" />
		</svg>

		<div class="relative mx-auto max-w-7xl">
			<div class="fade-in-up max-w-4xl">
				<p class="inline-flex rounded-full border border-[#f2d982]/35 bg-white/10 px-4 py-2 text-sm font-extrabold text-[#f2d982]">
					SantriOnline Web Studio
				</p>
				<h1 class="display-font mt-6 max-w-5xl text-4xl font-black leading-tight tracking-normal sm:text-6xl lg:text-7xl">
					Hadir Digital, Tumbuh Profesional
				</h1>
				<p class="mt-6 max-w-3xl text-lg leading-8 text-white/80 sm:text-xl">
					Jasa pembuatan website profesional untuk UMKM, klinik, pesantren, dan lembaga dengan teknologi
					modern dan dukungan AI-powered.
				</p>
				<div class="mt-9 flex flex-col gap-3 sm:flex-row">
					<a
						class="inline-flex items-center justify-center rounded-full bg-[#1a5c38] px-7 py-3 text-base font-extrabold text-white shadow-lg shadow-black/10 ring-1 ring-white/20 transition hover:bg-[#227a4a] focus:outline-none focus:ring-4 focus:ring-[#1a5c38]/30"
						href="#pricing"
					>
						Lihat Paket
					</a>
					<a
						class="inline-flex items-center justify-center rounded-full border border-white/45 px-7 py-3 text-base font-extrabold text-white transition hover:border-[#f2d982] hover:text-[#f2d982] focus:outline-none focus:ring-4 focus:ring-white/20"
						href={whatsappUrl}
					>
						Konsultasi via WhatsApp
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
			{#each trustSignals as signal}
				<article class="fade-in-up rounded-lg border border-[#d7e5dc] bg-white p-6 shadow-sm">
					<div class="grid size-12 place-items-center rounded-full bg-[#e8f3ed] text-[#1a5c38]">
						{#if signal.icon === 'layout'}
							<svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path d="M4 5h16v14H4zM4 9h16M9 9v10" stroke="currentColor" stroke-width="2" />
							</svg>
						{:else if signal.icon === 'spark'}
							<svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path d="M12 3l2.2 6.2L20 12l-5.8 2.8L12 21l-2.2-6.2L4 12l5.8-2.8z" stroke="currentColor" stroke-width="2" />
							</svg>
						{:else}
							<svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path d="M5 12a7 7 0 0 1 14 0v5a3 3 0 0 1-3 3h-3M5 12v4h3v-4zm11 0v4h3v-4z" stroke="currentColor" stroke-width="2" />
							</svg>
						{/if}
					</div>
					<h2 class="mt-5 text-xl font-extrabold">{signal.title}</h2>
					<p class="mt-3 leading-7 text-[#5b7665]">{signal.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in-up mx-auto max-w-3xl text-center">
				<h2 class="display-font text-3xl font-black tracking-normal sm:text-5xl">
					Cocok untuk Berbagai Kebutuhan
				</h2>
			</div>

			<div class="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
				{#each targetClients as client, index}
					<article class="fade-in-up rounded-lg border border-[#d7e5dc] bg-[#f7faf8] p-5 shadow-sm transition hover:border-[#c9a84c]">
						<span class="grid size-11 place-items-center rounded-full bg-white text-sm font-extrabold text-[#1a5c38]">
							{String(index + 1).padStart(2, '0')}
						</span>
						<h3 class="mt-5 text-base font-extrabold leading-snug sm:text-xl">{client}</h3>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="pricing" class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in-up mx-auto max-w-3xl text-center">
				<h2 class="display-font text-3xl font-black tracking-normal sm:text-5xl">
					Paket Harga Transparan
				</h2>
				<p class="mt-4 text-base leading-7 text-[#5b7665]">
					Mulai dari Rp750.000 per tahun. Tidak ada biaya tersembunyi.
				</p>
			</div>

			<div class="fade-in-up mt-8 flex justify-center">
				<div class="grid w-full max-w-xl grid-cols-2 rounded-full border border-[#d7e5dc] bg-white p-1 shadow-sm" role="tablist" aria-label="Pilihan paket">
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === 'website'}
						class={`rounded-full px-4 py-3 text-sm font-extrabold transition ${
							activeTab === 'website' ? 'bg-[#1a5c38] text-white' : 'text-[#5b7665] hover:text-[#1a5c38]'
						}`}
						onclick={() => (activeTab = 'website')}
					>
						Pembuatan Website
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === 'tahunan'}
						class={`rounded-full px-4 py-3 text-sm font-extrabold transition ${
							activeTab === 'tahunan' ? 'bg-[#1a5c38] text-white' : 'text-[#5b7665] hover:text-[#1a5c38]'
						}`}
						onclick={() => (activeTab = 'tahunan')}
					>
						Perawatan Tahunan
					</button>
				</div>
			</div>

			<div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{#each visiblePlans as plan}
					<PricingCard
						nama={plan.nama}
						harga={plan.harga}
						satuan={plan.satuan}
						fitur={plan.fitur}
						isPopuler={plan.isPopuler}
						ctaLink={plan.ctaLink}
					/>
				{/each}
			</div>

			{#if activeTab === 'website'}
				<p class="fade-in-up mt-6 text-center text-sm font-semibold text-[#5b7665]">
					Harga sudah termasuk domain .com 1 tahun dan hosting 1 tahun pertama
				</p>
			{/if}
		</div>
	</section>

	<section class="bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in-up mx-auto max-w-3xl text-center">
				<h2 class="display-font text-3xl font-black tracking-normal sm:text-5xl">
					Bagaimana Prosesnya?
				</h2>
			</div>

			<div class="relative mt-10 grid gap-4 lg:grid-cols-4">
				<div class="absolute left-0 right-0 top-10 hidden h-px bg-[#d7e5dc] lg:block"></div>
				{#each workSteps as step, index}
					<article class="fade-in-up relative rounded-lg border border-[#d7e5dc] bg-white p-6 shadow-sm">
						<span class="grid size-12 place-items-center rounded-full bg-[#1a5c38] text-lg font-extrabold text-white">
							{index + 1}
						</span>
						<h3 class="mt-5 text-xl font-extrabold">{step.title}</h3>
						<p class="mt-3 leading-7 text-[#5b7665]">{step.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in-up max-w-3xl">
				<h2 class="display-font text-3xl font-black tracking-normal sm:text-5xl">
					Website yang Sudah Kami Bangun
				</h2>
			</div>

			<div class="mt-10 grid gap-4 md:grid-cols-3">
				{#each portfolio as item}
					<article class="fade-in-up rounded-lg border border-[#d7e5dc] bg-white p-6 shadow-sm">
						{#if item.label}
							<span class="mb-4 inline-flex rounded-full bg-[#f3ead0] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[#8a6f21]">
								{item.label}
							</span>
						{/if}
						<h3 class="text-xl font-extrabold">{item.title}</h3>
						<p class="mt-3 leading-7 text-[#5b7665]">{item.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="faq" class="bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
			<div class="fade-in-up">
				<h2 class="display-font text-3xl font-black tracking-normal sm:text-5xl">
					Pertanyaan yang Sering Ditanyakan
				</h2>
			</div>

			<div class="grid gap-3">
				{#each faqs as faq, index}
					<FaqItem
						pertanyaan={faq.pertanyaan}
						jawaban={faq.jawaban}
						{index}
						activeIndex={activeFaq}
						onToggle={(nextIndex) => (activeFaq = nextIndex)}
					/>
				{/each}
			</div>
		</div>
	</section>

	<section class="relative overflow-hidden bg-[#0d2418] px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-20">
		<div class="absolute inset-0 bg-gradient-to-br from-[#0b1f15] via-[#123923] to-[#1a5c38]"></div>
		<svg class="absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden="true">
			<defs>
				<pattern id="jasa-pattern-footer" width="72" height="72" patternUnits="userSpaceOnUse">
					<path d="M36 2 70 36 36 70 2 36Z" fill="none" stroke="white" stroke-width="2" />
					<path d="M36 14 58 36 36 58 14 36Z" fill="none" stroke="white" stroke-width="2" />
					<path d="M2 36h68M36 2v68" stroke="white" stroke-width="1.5" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#jasa-pattern-footer)" />
		</svg>
		<div class="fade-in-up relative mx-auto max-w-5xl text-center">
			<h2 class="display-font mx-auto max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">
				Siap Hadir di Dunia Digital?
			</h2>
			<p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/78">
				Konsultasikan kebutuhan Anda sekarang, tanpa komitmen.
			</p>
			<a
				class="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-extrabold text-[#1a5c38] transition hover:bg-[#f2d982] hover:text-[#102a1c] focus:outline-none focus:ring-4 focus:ring-white/30"
				href={whatsappUrl}
			>
				Hubungi via WhatsApp
			</a>
			<p class="mt-5 text-sm text-white/65">Atau email ke hello@santrionline.com</p>
		</div>
	</section>
</main>

<style>
	:global(.jasa-page) {
		font-family: 'Plus Jakarta Sans', sans-serif;
	}

	:global(.jasa-page .display-font) {
		font-family: 'Playfair Display', serif;
	}

	:global(.jasa-page .fade-in-up) {
		opacity: 0;
		transform: translateY(22px);
		transition:
			opacity 560ms ease,
			transform 560ms ease;
	}

	:global(.jasa-page .fade-in-up.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.jasa-page .fade-in-up) {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
