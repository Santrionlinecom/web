<script lang="ts">
	// src/routes/literasi/munaqosah-tahfidz/+page.svelte — panduan pengelola:
	// arti munaqosah tahfidz (170), predikat (90), syahadah (110), sertifikat
	// tahfidz (170). Satu topik = satu artikel (aturan konten SEO 26 Sep 2026).
	import ArtikelLiterasi from '$lib/components/ArtikelLiterasi.svelte';

	const faq = [
		{ q: 'Munaqosah tahfidz artinya apa?', a: 'Munaqosah (مُنَاقَشَة) secara bahasa berarti pemeriksaan atau diskusi. Munaqosah tahfidz adalah ujian hafalan Al-Qur’an di depan penguji untuk menilai kelancaran, ketepatan bacaan, dan tajwid sebelum santri dinyatakan lulus pada juz atau jenjang tertentu.' },
		{ q: 'Apa beda syahadah dan sertifikat tahfidz?', a: 'Keduanya bukti kelulusan. Syahadah (شَهَادَة, “kesaksian”) adalah istilah yang lazim di pesantren dan lembaga tahfidz; sertifikat tahfidz lebih sering dipakai sekolah. Isinya sama: identitas santri, juz yang diujikan, predikat, tanggal, dan tanda tangan penguji.' },
		{ q: 'Apakah ada standar predikat resmi?', a: 'Tidak ada satu standar nasional yang mengikat semua lembaga. Ambang yang lazim: Mumtaz 90–100, Jayyid Jiddan 80–89, Jayyid 70–79, Maqbul 60–69. Setiap lembaga sebaiknya menuliskan ambang dan cara menghitung kesalahannya sendiri.' },
		{ q: 'Apa beda munaqosah dan tasmi’?', a: 'Tasmi’ adalah memperdengarkan hafalan (bisa tanpa penilaian formal). Munaqosah adalah ujian dengan penguji, lembar penilaian, dan keputusan lulus atau mengulang.' }
	];
	const terkait = [
		{ href: '/literasi/tahfidz-adalah', label: 'Pilar', judul: 'Tahfidz adalah: pengertian, dalil, dan metode menghafal Al-Qur’an.' },
		{ href: '/aplikasi-raport-tpq', label: 'Unduhan gratis', judul: 'Templat raport TPQ Excel dengan predikat otomatis.' },
		{ href: '/fitur/ujian-tahfidz', label: 'Ujian tahfidz', judul: 'Catat hasil ujian tahfidz di tempat dari HP penguji.' },
		{ href: '/aplikasi-hafalan-quran', label: 'Untuk lembaga', judul: 'Aplikasi hafalan Quran: setoran per ayat, ziyadah dan murojaah.' }
	];
</script>

<ArtikelLiterasi
	judul="Munaqosah Tahfidz: Arti, Tahapan Ujian, Predikat, dan Syahadah"
	title="Arti Munaqosah Tahfidz, Tahapan Ujian, Predikat & Syahadah Tahfidz | SantriOnline"
	description="Arti munaqosah tahfidz, tahapan ujian hafalan Al-Qur’an, cara menilai, predikat Mumtaz–Jayyid Jiddan–Jayyid–Maqbul, serta isi syahadah atau sertifikat tahfidz. Panduan untuk pengelola TPQ dan rumah tahfidz."
	path="/literasi/munaqosah-tahfidz"
	label="Tahfidz"
	terbit="2026-09-26"
	diperbarui="2026-09-26"
	peninjau="Yogik Pratama Aprilian"
	{faq}
	{terkait}
>
	<p><strong>Munaqosah tahfidz adalah ujian hafalan Al-Qur’an di depan penguji</strong> untuk menilai kelancaran, ketepatan ayat, dan tajwid santri, sebelum ia dinyatakan lulus pada juz atau jenjang tertentu. Santri yang lulus biasanya menerima <strong>syahadah</strong> (sertifikat tahfidz) berisi juz yang diujikan dan predikatnya.</p>
	<p>Kata munaqosah (مُنَاقَشَة) berarti pemeriksaan atau diskusi — di kampus dipakai untuk sidang skripsi. Di dunia tahfidz, yang “diperiksa” adalah hafalan.</p>

	<h2>Tahapan munaqosah tahfidz</h2>
	<ol>
		<li><strong>Syarat mengikuti.</strong> Santri sudah menyetorkan seluruh juz yang akan diujikan kepada guru pengampu, dan guru menyatakan siap.</li>
		<li><strong>Tasmi’ pra-ujian.</strong> Santri memperdengarkan juz itu dalam sekali duduk kepada guru atau teman sebagai latihan.</li>
		<li><strong>Ujian di depan penguji.</strong> Penguji (sebaiknya bukan guru pengampu sendiri) membacakan potongan ayat secara acak, santri melanjutkan. Bisa juga santri membaca satu juz utuh.</li>
		<li><strong>Penilaian.</strong> Penguji mencatat kesalahan pada lembar penilaian.</li>
		<li><strong>Keputusan.</strong> Lulus dengan predikat, atau mengulang bagian tertentu.</li>
		<li><strong>Syahadah.</strong> Diberikan kepada santri yang lulus, sering pada acara wisuda tahfidz.</li>
	</ol>

	<h2>Apa yang dinilai</h2>
	<ul>
		<li><strong>Kelancaran (itqan)</strong> — tidak tersendat, tidak perlu dituntun.</li>
		<li><strong>Ketepatan ayat</strong> — tidak ada ayat yang terlompat, tertukar, atau berpindah ke ayat serupa (mutasyabihat).</li>
		<li><strong>Tajwid dan makhraj</strong> — panjang-pendek, dengung, dan pengucapan huruf.</li>
		<li><strong>Adab</strong> — sikap duduk, menjaga bacaan tetap tartil, tidak tergesa-gesa.</li>
	</ul>
	<p>Banyak lembaga membedakan <em>kesalahan jali</em> (jelas: salah huruf, salah harakat, ayat terlompat) dan <em>kesalahan khafi</em> (samar: kurang sempurna dengung atau panjang), dengan pengurangan nilai berbeda.</p>

	<h2>Predikat munaqosah tahfidz</h2>
	<p>Tidak ada satu standar nasional. Ambang berikut lazim dipakai lembaga tahfidz dan sekolah di Indonesia:</p>
	<table>
		<thead><tr><th>Predikat</th><th>Nilai</th><th>Gambaran</th></tr></thead>
		<tbody>
			<tr><td>Mumtaz (istimewa)</td><td>90–100</td><td>Lancar, hampir tanpa kesalahan</td></tr>
			<tr><td>Jayyid Jiddan (sangat baik)</td><td>80–89</td><td>Beberapa kesalahan kecil, dapat membetulkan sendiri</td></tr>
			<tr><td>Jayyid (baik)</td><td>70–79</td><td>Ada kesalahan, perlu sedikit dituntun</td></tr>
			<tr><td>Maqbul (cukup)</td><td>60–69</td><td>Lulus dengan catatan murojaah</td></tr>
			<tr><td>Di bawah 60</td><td>&lt; 60</td><td>Mengulang bagian yang belum lancar</td></tr>
		</tbody>
	</table>
	<p>Tuliskan ambang dan cara menghitung kesalahan di pedoman lembaga, supaya penguji yang berbeda memberi nilai yang sebanding.</p>

	<h2>Isi syahadah atau sertifikat tahfidz</h2>
	<ul>
		<li>Kop dan nama lembaga.</li>
		<li>Nama santri, tempat dan tanggal lahir, nomor induk.</li>
		<li>Juz atau jumlah juz yang diujikan (misalnya “Juz 30” atau “5 juz: 26–30”).</li>
		<li>Predikat dan, bila dipakai, nilai angka.</li>
		<li>Tanggal munaqosah dan nomor syahadah.</li>
		<li>Tanda tangan penguji dan pimpinan lembaga.</li>
	</ul>
	<p>Syahadah yang baik juga disimpan salinannya oleh lembaga — lengkap dengan lembar penilaian — supaya bisa diterbitkan ulang bila hilang.</p>

	<h2>Menyiapkan santri sebelum munaqosah</h2>
	<ul>
		<li>Pastikan setoran seluruh juz sudah tercatat, bukan hanya diingat guru.</li>
		<li>Perbanyak murojaah pada bagian yang dicatat “belum lancar”.</li>
		<li>Latihan tasmi’ satu juz dalam sekali duduk minimal sekali sepekan menjelang ujian.</li>
		<li>Latih ayat-ayat mirip (mutasyabihat) secara khusus.</li>
	</ul>
	<p>Butuh lembar nilai dengan predikat otomatis? Unduh <a href="/aplikasi-raport-tpq">templat raport TPQ Excel</a> gratis — ambang predikatnya bisa disesuaikan. Untuk mencatat setoran dan hasil ujian dari HP, lihat <a href="/aplikasi-hafalan-quran">aplikasi hafalan Quran</a> SantriOnline.</p>

	<p class="sumber">Catatan: istilah dan ambang di atas adalah praktik yang lazim di lembaga tahfidz Indonesia, bukan standar resmi Kemenag. Sesuaikan dengan pedoman lembaga Anda.</p>
</ArtikelLiterasi>
