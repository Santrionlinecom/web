# TASK: Buat Halaman /jasa di santrionline.com

Buat 3 file berikut di repo SvelteKit ini:
1. src/routes/jasa/+page.svelte
2. src/lib/components/jasa/PricingCard.svelte
3. src/lib/components/jasa/FaqItem.svelte

## Desain
- Font heading: Amiri atau Playfair Display (Google Fonts, via svelte:head)
- Font body: Plus Jakarta Sans (Google Fonts)
- Warna utama: hijau emerald #1a5c38 dan emas #c9a84c
- Background hero: gradient hijau tua dengan SVG pattern geometri Islam inline opacity 4%
- Animasi scroll: IntersectionObserver vanilla JS, class fade-in-up
- Framework: TailwindCSS (sudah ada, gunakan utility class)
- Semua teks Bahasa Indonesia
- DILARANG sebut Cloudflare, SvelteKit, gratis, murah di teks yang tampil ke user
- DILARANG gunakan font Inter, Roboto, Arial, system-ui

## 8 Section Halaman

### Section 1 - Hero (background hijau tua)
Heading besar: Hadir Digital, Tumbuh Profesional
Subheading: Jasa pembuatan website profesional untuk UMKM, klinik, pesantren, dan lembaga dengan teknologi modern dan dukungan AI-powered.
Tombol hijau: Lihat Paket (scroll anchor ke id=pricing)
Tombol outline putih: Konsultasi Gratis via WhatsApp
Link WA: https://wa.me/6287854545274?text=Halo%2C%20saya%20ingin%20konsultasi%20jasa%20website%20SantriOnline

### Section 2 - Trust Signals (3 kolom ikon + teks)
- Website Profesional dan Modern
- Teknologi AI-Powered
- Support dan Maintenance Terpercaya

### Section 3 - Target Klien
Heading: Cocok untuk Berbagai Kebutuhan
Grid 2 kolom mobile, 3 kolom desktop, 6 kartu:
Klinik dan Bidan Praktek, Pesantren dan Masjid, UMKM dan Toko Online,
Dokter dan Profesional, Lembaga dan Yayasan, Personal Branding

### Section 4 - Pricing (id=pricing)
Heading: Paket Harga Transparan
Sub: Mulai dari Rp750.000 per tahun. Tidak ada biaya tersembunyi.

Toggle 2 tab (state activeTab website atau tahunan):

TAB website - Paket Pembuatan Website (one-time):
Gunakan komponen PricingCard.svelte untuk setiap paket.
1. Halaman Profil - Rp2.500.000 - landing page 1 halaman, profil usaha, kontak, mobile-friendly
2. Company Profile - Rp5.000.000 - multi-halaman, tentang kami, produk/layanan, galeri - BADGE TERPOPULER
3. Toko dan Layanan - Rp10.000.000 - katalog produk, form order, WhatsApp integration
4. Aplikasi Web - Rp20.000.000+ - dashboard, login, manajemen data, integrasi API dan pembayaran
Catatan bawah: Harga sudah termasuk domain .com 1 tahun dan hosting 1 tahun pertama

TAB tahunan - Paket Perawatan Tahunan (recurring):
1. Dasar - Rp750.000 per tahun - hosting, SSL gratis, update minor 1x per bulan
2. Bisnis - Rp1.500.000 per tahun - hosting plus domain .com, update 3x per bulan, backup - BADGE TERPOPULER
3. Profesional - Rp3.000.000 per tahun - semua Bisnis plus update unlimited, laporan bulanan, priority support
4. Enterprise - Harga Custom - SLA khusus, dedicated support, integrasi sistem

PricingCard.svelte menerima props: nama, harga, satuan, fitur (array string), isPopuler (boolean), ctaLink.
Setiap card punya tombol Pesan Sekarang yang link ke /order.
Card isPopuler=true punya border emas dan badge Terpopuler.

### Section 5 - Proses Kerja
Heading: Bagaimana Prosesnya?
Timeline 4 langkah, horizontal di desktop, vertikal di mobile:
1. Konsultasi - Ceritakan kebutuhan Anda via WhatsApp
2. Proposal - Kami kirim desain dan penawaran dalam 1x24 jam
3. Pengerjaan - Website dikerjakan 7 hingga 14 hari kerja
4. Live dan Support - Website aktif, kami dampingi selama kontrak

### Section 6 - Portfolio
Heading: Website yang Sudah Kami Bangun
3 kartu sederhana:
- alkesduaputry.com - Distributor Alat Kesehatan, Depok
- Website Klinik - Bidan Praktek, Depok (placeholder, label Segera)
- Website Lembaga - Dalam Pengerjaan (placeholder, label Segera)

### Section 7 - FAQ
Gunakan komponen FaqItem.svelte dengan props pertanyaan dan jawaban.
FaqItem punya state isOpen, toggle on click, animasi slide CSS.
Hanya 1 item bisa terbuka sekaligus (kirim activeIndex dari parent).

6 FAQ:
1. Q: Apakah ada biaya tersembunyi? A: Tidak. Harga yang tertera sudah final. Perpanjangan domain dan hosting kami informasikan jauh-jauh hari.
2. Q: Berapa lama proses pembuatan website? A: Landing page 3 sampai 5 hari. Company profile 7 sampai 10 hari. Aplikasi web 14 sampai 30 hari.
3. Q: Bisa minta revisi? A: Ya. Setiap paket sudah termasuk revisi. Kami pastikan Anda puas sebelum website live.
4. Q: Metode pembayaran apa yang tersedia? A: Transfer bank, QRIS, dan berbagai metode pembayaran online.
5. Q: Apakah website bisa dikelola sendiri setelah jadi? A: Ya, kami berikan panduan dan akses penuh.
6. Q: Apakah bisa untuk klien di luar kota? A: Ya, 100 persen remote. Klien kami tersebar di berbagai kota Indonesia.

### Section 8 - CTA Footer
Background hijau tua sama dengan hero.
Heading: Siap Hadir di Dunia Digital?
Sub: Konsultasikan kebutuhan Anda sekarang. Gratis, tanpa komitmen.
Tombol putih besar: Hubungi via WhatsApp (link WA sama seperti di hero)
Teks kecil: Atau email ke hello@santrionline.com

## SEO (svelte:head)
title: Jasa Website Profesional | SantriOnline Web Studio
meta description: Jasa pembuatan website profesional untuk UMKM, klinik, pesantren, dan lembaga. Mulai Rp750.000 per tahun. AI-powered, modern, dan terpercaya.
og:url: https://santrionline.com/jasa

## Checklist Sebelum Selesai
- Semua 3 file terbuat
- Toggle tab pricing berfungsi dengan benar
- FAQ accordion hanya 1 terbuka sekaligus
- IntersectionObserver aktif untuk semua section
- npm run check lulus tanpa error
