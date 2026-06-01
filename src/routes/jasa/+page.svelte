<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.png';
	import FaqItem from '$lib/components/jasa/FaqItem.svelte';
	import PricingCard from '$lib/components/jasa/PricingCard.svelte';

	type PricingPlan = {
		name: string;
		price: string;
		description: string;
		features: string[];
		badge?: string;
		highlight?: boolean;
	};

	let activeTab = $state<'website' | 'tahunan'>('website');
	let openFaq = $state(0);

	const whatsappUrl =
		'https://wa.me/6287854545274?text=Halo%2C%20saya%20ingin%20konsultasi%20jasa%20website%20SantriOnline';
	const orderUrl = '/order';

	const menuItems = [
		{ href: '/#chat', label: 'AI Chat' },
		{ href: '/#fitur', label: 'Fitur AI' },
		{ href: '#pricing', label: 'Paket' },
		{ href: '#faq', label: 'FAQ' }
	];

	const trustSignals = [
		{ marker: '01', title: 'Website Profesional & Modern' },
		{ marker: '02', title: 'Teknologi AI-Powered' },
		{ marker: '03', title: 'Support & Maintenance Terpercaya' }
	];

	const audiences = [
		{ marker: 'KL', title: 'Klinik & Bidan Praktek' },
		{ marker: 'PM', title: 'Pesantren & Masjid' },
		{ marker: 'UM', title: 'UMKM & Toko Online' },
		{ marker: 'DP', title: 'Dokter & Profesional' },
		{ marker: 'LY', title: 'Lembaga & Yayasan' },
		{ marker: 'PB', title: 'Freelancer & Personal Branding' }
	];

	const websitePlans: PricingPlan[] = [
		{
			name: 'Halaman Profil',
			price: 'Rp2.500.000',
			description: 'Landing page satu halaman untuk profil usaha, lembaga, kontak, dan tampilan mobile-friendly.',
			features: ['Profil usaha atau lembaga', 'Kontak dan tombol WhatsApp', 'Desain responsif', 'Rilis website awal']
		},
		{
			name: 'Company Profile',
			price: 'Rp5.000.000',
			description: 'Website multi-halaman untuk membangun kredibilitas bisnis atau lembaga secara lebih lengkap.',
			features: ['Tentang kami', 'Produk atau layanan', 'Galeri', 'Halaman kontak'],
			badge: 'Terpopuler',
			highlight: true
		},
		{
			name: 'Toko & Layanan',
			price: 'Rp10.000.000',
			description: 'Website katalog produk atau jasa dengan alur pemesanan yang jelas dan mudah dihubungi.',
			features: ['Katalog produk atau jasa', 'Form order', 'Integrasi WhatsApp', 'Struktur konten penjualan']
		},
		{
			name: 'Aplikasi Web',
			price: 'Rp20.000.000+',
			description: 'Solusi custom untuk kebutuhan login, dashboard, manajemen data, dan integrasi sistem.',
			features: ['Dashboard custom', 'Login pengguna', 'Manajemen data', 'Integrasi API dan pembayaran']
		}
	];

	const maintenancePlans: PricingPlan[] = [
		{
			name: 'Dasar',
			price: 'Rp750.000',
			description: 'Perawatan dasar tahunan agar website tetap aktif, aman, dan mudah dipantau.',
			features: ['Hosting tahunan', 'SSL aktif', 'Update minor 1x per bulan', 'Pengecekan dasar']
		},
		{
			name: 'Bisnis',
			price: 'Rp1.500.000',
			description: 'Perawatan untuk bisnis aktif dengan domain, backup, dan update konten rutin.',
			features: ['Hosting dan domain .com per tahun', 'Update 3x per bulan', 'Backup berkala', 'Support prioritas normal'],
			badge: 'Terpopuler',
			highlight: true
		},
		{
			name: 'Profesional',
			price: 'Rp3.000.000',
			description: 'Paket perawatan lebih intensif untuk website yang sering diperbarui.',
			features: ['Semua fitur Bisnis', 'Update konten fleksibel', 'Laporan bulanan', 'Priority support']
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			description: 'Dukungan khusus untuk lembaga atau sistem yang membutuhkan SLA dan integrasi lanjutan.',
			features: ['SLA khusus', 'Dedicated support', 'Integrasi sistem', 'Perencanaan teknis berkala']
		}
	];

	const processSteps = [
		{ step: '1', title: 'Konsultasi', description: 'Ceritakan kebutuhan Anda via WhatsApp.' },
		{ step: '2', title: 'Proposal', description: 'Kami kirim desain dan penawaran dalam 1x24 jam.' },
		{ step: '3', title: 'Pengerjaan', description: 'Website dikerjakan 7-14 hari kerja sesuai scope.' },
		{ step: '4', title: 'Live & Support', description: 'Website aktif, lalu kami dampingi selama kontrak.' }
	];

	const portfolio = [
		{ title: 'alkesduaputry.com', category: 'Distributor Alat Kesehatan' },
		{ title: 'Bidan Praktek', category: 'Website layanan kesehatan lokal' },
		{ title: 'Lembaga Komunitas', category: 'Profil lembaga dan publikasi kegiatan' }
	];

	const faqs = [
		{
			question: 'Apakah ada biaya tersembunyi?',
			answer: 'Tidak. Harga yang tertera sudah final untuk scope yang disepakati. Perpanjangan domain dan hosting kami informasikan jauh-jauh hari.'
		},
		{
			question: 'Berapa lama proses pembuatan website?',
			answer: 'Tergantung kompleksitas. Landing page biasanya 3-5 hari, company profile 7-10 hari, dan aplikasi web 14-30 hari.'
		},
		{
			question: 'Bisa minta revisi?',
			answer: 'Ya. Setiap paket sudah termasuk revisi sesuai scope. Kami pastikan website siap digunakan sebelum live.'
		},
		{
			question: 'Metode pembayaran apa yang tersedia?',
			answer: 'Pembayaran dapat dilakukan melalui transfer bank, QRIS, dan metode pembayaran online yang disepakati.'
		},
		{
			question: 'Apakah website bisa dikelola sendiri setelah jadi?',
			answer: 'Ya, kami berikan panduan dan akses. Untuk konten rutin, tersedia paket perawatan tahunan.'
		},
		{
			question: 'Apakah tersedia untuk klien di luar kota?',
			answer: 'Ya, proses dapat dilakukan remote. Brief, review, dan serah terima bisa dilakukan online.'
		}
	];

	const visiblePlans = $derived(activeTab === 'website' ? websitePlans : maintenancePlans);

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
			{ threshold: 0.16 }
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
		content="Jasa pembuatan website profesional untuk UMKM, klinik, pesantren, dan lembaga. Mulai Rp750.000/tahun. AI-powered, modern, dan terpercaya."
	/>
	<meta property="og:title" content="Jasa Website Profesional | SantriOnline" />
	<meta
		property="og:description"
		content="Website profesional mulai Rp750.000/tahun untuk UMKM, klinik, pesantren, dan lembaga."
	/>
	<meta property="og:url" content="https://santrionline.com/jasa" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="jasa-page min-h-screen bg-[#f8faf9] text-[#1a2e22]">
	<header class="sticky top-0 z-40 border-b border-[#d4e6da] bg-[#f8faf9]/92 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
		<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4" aria-label="Navigasi jasa">
			<a class="flex min-w-0 items-center gap-3" href="/" aria-label="Santri Online beranda">
				<img src={logo} alt="Logo Santri Online" class="size-10 rounded-xl object-cover shadow-sm" />
				<span class="truncate text-base font-black sm:text-lg">Santri Online</span>
			</a>

			<div class="hidden items-center gap-7 text-sm font-bold text-[#5a7a65] lg:flex">
				{#each menuItems as item}
					<a class="transition hover:text-[#1a5c38]" href={item.href}>{item.label}</a>
				{/each}
			</div>

			<a
				class="inline-flex items-center justify-center rounded-full bg-[#1a5c38] px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#174f31] focus:outline-none focus:ring-4 focus:ring-[#1a5c38]/20"
				href={orderUrl}
			>
				Pesan Sekarang
			</a>
		</nav>
	</header>

	<section class="relative overflow-hidden bg-[#0f1f17] px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-24">
		<div class="islamic-pattern absolute inset-0 opacity-[0.04]"></div>
		<div class="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
			<div class="fade-in-up">
				<p class="inline-flex rounded-full border border-[#e8c97a]/25 bg-white/8 px-4 py-2 text-sm font-extrabold text-[#e8c97a]">
					AI-Powered Web Developer
				</p>
				<h1 class="display-font mt-6 max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-7xl">
					Hadir Digital, Tumbuh Profesional
				</h1>
				<p class="mt-6 max-w-2xl text-lg leading-8 text-white/78">
					Jasa pembuatan website profesional untuk UMKM, klinik, pesantren, dan lembaga
					dengan teknologi modern dan dukungan AI-powered.
				</p>
				<div class="mt-8 flex flex-col gap-3 sm:flex-row">
					<a
						class="inline-flex items-center justify-center rounded-full bg-[#c9a84c] px-7 py-3 text-base font-black text-[#0f1f17] transition hover:bg-[#e8c97a] focus:outline-none focus:ring-4 focus:ring-[#c9a84c]/30"
						href="#pricing"
					>
						Lihat Paket
					</a>
					<a
						class="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/8 px-7 py-3 text-base font-black text-white transition hover:border-[#e8c97a] hover:text-[#e8c97a]"
						href={whatsappUrl}
					>
						Konsultasi via WhatsApp
					</a>
				</div>
				<div class="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-white/72">
					<a class="rounded-full bg-white/8 px-4 py-2 hover:text-[#e8c97a]" href="/#chat">Akses AI Chat</a>
					<a class="rounded-full bg-white/8 px-4 py-2 hover:text-[#e8c97a]" href="/#fitur">Lihat Fitur AI</a>
				</div>
			</div>

			<div class="fade-in-up rounded-[28px] border border-white/12 bg-white/8 p-5 shadow-2xl shadow-black/20">
				<div class="rounded-3xl bg-[#f8faf9] p-6 text-[#1a2e22]">
					<div class="flex items-center gap-3 border-b border-[#d4e6da] pb-5">
						<img src={logo} alt="" class="size-12 rounded-xl object-cover" />
						<div>
							<p class="text-sm font-extrabold text-[#1a5c38]">SantriOnline Web Studio</p>
							<h2 class="display-font text-2xl font-black">Website yang siap dipercaya</h2>
						</div>
					</div>
					<div class="mt-5 grid gap-3">
						{#each trustSignals as signal}
							<div class="flex items-center gap-3 rounded-2xl border border-[#d4e6da] bg-white p-4">
								<span class="grid size-10 shrink-0 place-items-center rounded-full bg-[#1a5c38] text-xs font-black text-white">
									{signal.marker}
								</span>
								<p class="font-black">{signal.title}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in-up mx-auto max-w-3xl text-center">
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">Untuk Siapa</p>
				<h2 class="display-font mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Cocok untuk Berbagai Kebutuhan
				</h2>
			</div>

			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each audiences as audience}
					<article class="fade-in-up rounded-2xl border border-[#d4e6da] bg-white p-5 shadow-sm transition hover:border-[#c9a84c] hover:shadow-lg">
						<span class="grid size-12 place-items-center rounded-xl bg-[#f8faf9] text-sm font-black text-[#1a5c38]">
							{audience.marker}
						</span>
						<h3 class="mt-5 text-xl font-black">{audience.title}</h3>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="pricing" class="bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in-up mx-auto max-w-3xl text-center">
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">Paket Harga</p>
				<h2 class="display-font mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Paket Harga Transparan
				</h2>
				<p class="mt-4 text-base leading-7 text-[#5a7a65]">
					Mulai dari Rp750.000 / tahun. Tidak ada biaya tersembunyi.
				</p>
			</div>

			<div class="fade-in-up mt-8 flex justify-center">
				<div class="grid rounded-full border border-[#d4e6da] bg-[#f8faf9] p-1 sm:grid-cols-2">
					<button
						type="button"
						class={`rounded-full px-5 py-2.5 text-sm font-black transition ${
							activeTab === 'website' ? 'bg-[#1a5c38] text-white shadow-sm' : 'text-[#5a7a65] hover:text-[#1a5c38]'
						}`}
						onclick={() => (activeTab = 'website')}
					>
						Paket Website
					</button>
					<button
						type="button"
						class={`rounded-full px-5 py-2.5 text-sm font-black transition ${
							activeTab === 'tahunan' ? 'bg-[#1a5c38] text-white shadow-sm' : 'text-[#5a7a65] hover:text-[#1a5c38]'
						}`}
						onclick={() => (activeTab = 'tahunan')}
					>
						Paket Perawatan Tahunan
					</button>
				</div>
			</div>

			<div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{#each visiblePlans as plan}
					<PricingCard {...plan} />
				{/each}
			</div>

			<p class="fade-in-up mt-6 text-center text-sm font-semibold text-[#5a7a65]">
				Harga paket website sudah termasuk domain .com 1 tahun dan hosting 1 tahun pertama.
			</p>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in-up mx-auto max-w-3xl text-center">
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">Proses Kerja</p>
				<h2 class="display-font mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Bagaimana Prosesnya?
				</h2>
			</div>

			<div class="mt-10 grid gap-4 lg:grid-cols-4">
				{#each processSteps as item}
					<article class="fade-in-up rounded-2xl border border-[#d4e6da] bg-white p-6 shadow-sm">
						<span class="grid size-12 place-items-center rounded-full bg-[#1a5c38] text-lg font-black text-white">
							{item.step}
						</span>
						<h3 class="mt-5 text-xl font-black">{item.title}</h3>
						<p class="mt-3 leading-7 text-[#5a7a65]">{item.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="fade-in-up max-w-3xl">
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">Portfolio</p>
				<h2 class="display-font mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Website yang Sudah Kami Bangun
				</h2>
			</div>

			<div class="mt-10 grid gap-4 md:grid-cols-3">
				{#each portfolio as item}
					<article class="fade-in-up rounded-2xl border border-[#d4e6da] bg-[#f8faf9] p-6 shadow-sm">
						<h3 class="text-xl font-black">{item.title}</h3>
						<p class="mt-3 leading-7 text-[#5a7a65]">{item.category}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="faq" class="px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
		<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
			<div class="fade-in-up">
				<p class="text-sm font-black uppercase tracking-[0.14em] text-[#c9a84c]">FAQ</p>
				<h2 class="display-font mt-3 text-3xl font-black tracking-normal sm:text-5xl">
					Pertanyaan yang Sering Ditanyakan
				</h2>
			</div>

			<div class="grid gap-3">
				{#each faqs as faq, index}
					<FaqItem
						question={faq.question}
						answer={faq.answer}
						open={openFaq === index}
						onToggle={() => (openFaq = openFaq === index ? -1 : index)}
					/>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-[#0f1f17] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-20">
		<div class="fade-in-up mx-auto max-w-5xl text-center">
			<p class="text-sm font-black uppercase tracking-[0.14em] text-[#e8c97a]">Mulai Konsultasi</p>
			<h2 class="display-font mx-auto mt-3 max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">
				Siap Hadir di Dunia Digital?
			</h2>
			<p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
				Konsultasikan kebutuhan Anda sekarang. Kami bantu susun rencana website yang tepat.
			</p>
			<a
				class="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-black text-[#1a5c38] transition hover:bg-[#e8c97a] hover:text-[#0f1f17] focus:outline-none focus:ring-4 focus:ring-white/30"
				href={whatsappUrl}
			>
				Hubungi via WhatsApp
			</a>
			<p class="mt-5 text-sm text-white/60">Atau email ke: hello@santrionline.com</p>
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
		transform: translateY(20px);
		transition:
			opacity 0.5s ease,
			transform 0.5s ease;
	}

	:global(.jasa-page .fade-in-up.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	.islamic-pattern {
		background-image:
			linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
			linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
			linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
			linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff);
		background-position:
			0 0,
			0 0,
			32px 56px,
			32px 56px;
		background-size: 64px 112px;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.jasa-page .fade-in-up) {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
