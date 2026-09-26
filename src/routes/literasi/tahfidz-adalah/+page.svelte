<script lang="ts">
	// src/routes/literasi/tahfidz-adalah/+page.svelte — artikel pilar "tahfidz adalah"
	// (5.400/bln, KD 1; SEO Tahap 3). Teks ayat disalin dari mushaf repo app
	// (static/quran/juz-*.json), terjemah Kemenag; nomor hadits dicek di sunnah.com.
	import ArtikelLiterasi from '$lib/components/ArtikelLiterasi.svelte';

	const faq = [
		{ q: 'Tahfidz artinya apa?', a: 'Tahfidz (تَحْفِيظ) berarti menghafalkan atau membimbing hafalan. Dalam pendidikan Islam di Indonesia, tahfidz adalah kegiatan menghafal Al-Qur’an di bawah bimbingan guru, dengan setoran dan murojaah yang teratur.' },
		{ q: 'Apa beda tahfidz dan tahsin?', a: 'Tahsin memperbaiki bacaan: makharijul huruf, sifat huruf, dan tajwid. Tahfidz menghafalkan. Tahsin biasanya didahulukan supaya yang dihafal sudah benar bacaannya.' },
		{ q: 'Apa hukum menghafal Al-Qur’an?', a: 'Menurut penjelasan as-Suyuthi dalam al-Itqan, adanya penghafal Al-Qur’an di tengah umat hukumnya fardhu kifayah. Bagi pribadi, menghafal seluruh Al-Qur’an adalah amal yang sangat utama; yang wajib bagi setiap muslim adalah hafalan yang cukup untuk shalat, yaitu al-Fatihah.' },
		{ q: 'Berapa lama menghafal 30 juz?', a: 'Berbeda-beda. Dengan satu halaman sehari tanpa libur, 604 halaman mushaf selesai sekitar 20 bulan — di luar hari murojaah. Yang menentukan bukan kecepatan, tapi keteraturan setoran dan murojaah.' },
		{ q: 'Apa itu ziyadah dan murojaah?', a: 'Ziyadah adalah setoran hafalan baru. Murojaah adalah mengulang hafalan lama supaya tidak lepas. Program tahfidz yang sehat menjadwalkan keduanya setiap hari.' }
	];
	const terkait = [
		{ href: '/literasi/munaqosah-tahfidz', label: 'Panduan', judul: 'Munaqosah tahfidz: arti, tahapan ujian, predikat, dan syahadah.' },
		{ href: '/aplikasi-hafalan-quran', label: 'Untuk lembaga', judul: 'Aplikasi hafalan Quran: setoran per ayat, ziyadah dan murojaah.' },
		{ href: 'https://app.santrionline.com/blog/mengenal-isymam-dalam-al-quran-msfzeel9', label: 'Tajwid', judul: 'Isymam adalah: contoh di QS Yusuf 11 dan cara membacanya.' },
		{ href: 'https://app.santrionline.com/kitab/quran', label: 'Mushaf', judul: 'Mushaf Utsmani online: baca Al-Qur’an 30 juz.' }
	];
</script>

<ArtikelLiterasi
	judul="Tahfidz Adalah: Pengertian, Dalil, dan Metode Menghafal Al-Qur’an"
	title="Tahfidz Adalah: Pengertian, Dalil, Hukum, dan Metode Tahfidz Al-Qur’an | SantriOnline"
	description="Tahfidz adalah kegiatan menghafal Al-Qur’an di bawah bimbingan guru. Pengertian tahfidz, dalil, hukum menghafal, metode setoran dan murojaah, serta istilah yang dipakai di TPQ dan rumah tahfidz."
	path="/literasi/tahfidz-adalah"
	label="Tahfidz"
	terbit="2026-09-26"
	diperbarui="2026-09-26"
	peninjau="Yogik Pratama Aprilian"
	{faq}
	{terkait}
>
	<p><strong>Tahfidz adalah kegiatan menghafal Al-Qur’an di bawah bimbingan guru</strong>, dengan menyetorkan hafalan baru (ziyadah) dan mengulang hafalan lama (murojaah) secara teratur sampai hafalan itu melekat. Kata tahfidz (تَحْفِيظ) berasal dari <em>ḥaffaẓa–yuḥaffiẓu</em>, “menjadikan hafal”; orang yang sudah menghafal disebut <em>hafiz</em> (laki-laki) atau <em>hafizah</em> (perempuan).</p>
	<p>Di Indonesia, kata ini dipakai untuk nama lembaga (rumah tahfidz, pondok tahfidz), nama program di TPQ dan sekolah, dan nama ujiannya (munaqosah tahfidz). Intinya selalu sama: hafalan disetorkan kepada guru, bukan dihafal sendiri tanpa ada yang menyimak.</p>

	<h2>Dalil keutamaan menghafal Al-Qur’an</h2>
	<p>Allah menjamin kemudahan Al-Qur’an untuk diingat:</p>
	<blockquote>
		<p class="ayat font-arabic" lang="ar">وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ</p>
		<p>“Sungguh, Kami benar-benar telah memudahkan Al-Qur’an sebagai pelajaran. Maka, adakah orang yang mau mengambil pelajaran?” (QS al-Qamar [54]: 17)</p>
	</blockquote>
	<p>Allah juga menjaga Al-Qur’an — dan salah satu jalan penjagaan itu adalah dada para penghafalnya:</p>
	<blockquote>
		<p class="ayat font-arabic" lang="ar">إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ وَإِنَّا لَهُۥ لَحَـٰفِظُونَ</p>
		<p>“Sesungguhnya Kamilah yang menurunkan Al-Qur’an dan pasti Kami (pula) yang memeliharanya.” (QS al-Hijr [15]: 9)</p>
	</blockquote>
	<blockquote>
		<p class="ayat font-arabic" lang="ar">بَلْ هُوَ ءَايَـٰتٌۢ بَيِّنَـٰتٌ فِى صُدُورِ ٱلَّذِينَ أُوتُوا۟ ٱلْعِلْمَ ۚ وَمَا يَجْحَدُ بِـَٔايَـٰتِنَآ إِلَّا ٱلظَّـٰلِمُونَ</p>
		<p>“Sebenarnya, ia (Al-Qur’an) adalah ayat-ayat yang jelas di dalam dada orang-orang yang berilmu. Tidaklah mengingkari ayat-ayat Kami, kecuali orang-orang zalim.” (QS al-‘Ankabut [29]: 49)</p>
	</blockquote>
	<p>Rasulullah ﷺ bersabda: <span class="font-arabic" lang="ar" dir="rtl">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</span> — “Sebaik-baik kalian adalah orang yang belajar Al-Qur’an dan mengajarkannya.” (HR al-Bukhari no. 5027, dari ‘Utsman bin ‘Affan)</p>
	<p>Dan tentang kedudukan penghafal di akhirat: <span class="font-arabic" lang="ar" dir="rtl">يُقَالُ لِصَاحِبِ الْقُرْآنِ اقْرَأْ وَارْتَقِ وَرَتِّلْ كَمَا كُنْتَ تُرَتِّلُ فِي الدُّنْيَا فَإِنَّ مَنْزِلَكَ عِنْدَ آخِرِ آيَةٍ تَقْرَؤُهَا</span> — “Dikatakan kepada penghafal Al-Qur’an: bacalah, naiklah, dan tartilkan sebagaimana engkau dahulu mentartilkannya di dunia, karena kedudukanmu ada pada ayat terakhir yang engkau baca.” (HR Abu Dawud no. 1464 dan at-Tirmidzi no. 2914; at-Tirmidzi menilainya hasan shahih)</p>

	<h2>Hukum menghafal Al-Qur’an</h2>
	<p>Imam Jalaluddin as-Suyuthi dalam <em>al-Itqan fi ‘Ulum al-Qur’an</em> menjelaskan bahwa keberadaan penghafal Al-Qur’an di tengah umat hukumnya <strong>fardhu kifayah</strong>: bila sudah ada yang menghafal, gugur kewajiban yang lain; bila tidak ada sama sekali, semuanya berdosa. Bagi pribadi, yang wajib adalah hafalan yang cukup untuk shalat — al-Fatihah — sedangkan menghafal seluruhnya adalah keutamaan besar.</p>
	<p>Karena itu, lembaga tahfidz tidak sekadar “kegiatan tambahan”. Ia ikut menunaikan kewajiban kolektif umat.</p>

	<h2>Tahfidz, tahsin, dan tilawah: apa bedanya?</h2>
	<table>
		<thead><tr><th>Istilah</th><th>Artinya</th><th>Fokus</th></tr></thead>
		<tbody>
			<tr><td>Tilawah</td><td>Membaca Al-Qur’an</td><td>Membaca rutin dari mushaf</td></tr>
			<tr><td>Tahsin</td><td>Memperbaiki bacaan</td><td>Makharijul huruf, sifat huruf, tajwid</td></tr>
			<tr><td>Tahfidz</td><td>Menghafalkan</td><td>Setoran hafalan baru dan murojaah</td></tr>
		</tbody>
	</table>
	<p>Urutan yang lazim di TPQ: bisa membaca (Iqra/jilid) → tahsin → tahfidz. Menghafal dengan bacaan yang belum benar justru mengunci kesalahan.</p>

	<h2>Metode tahfidz yang umum dipakai</h2>
	<ol>
		<li><strong>Talaqqi</strong> — guru membacakan, murid menirukan, lalu menyetorkan. Cocok untuk anak yang belum lancar membaca mushaf.</li>
		<li><strong>Setoran (tasmi’)</strong> — murid menghafal sendiri, lalu memperdengarkan hafalannya kepada guru tanpa melihat mushaf.</li>
		<li><strong>Takrir / murojaah</strong> — mengulang hafalan lama sesuai jadwal. Banyak guru memakai perbandingan: hafalan baru sedikit, murojaah banyak.</li>
		<li><strong>Satu mushaf</strong> — menghafal dari mushaf dengan tata letak yang sama (misalnya mushaf pojok 15 baris) supaya ingatan visual halaman ikut membantu.</li>
		<li><strong>Tasmi’ akbar</strong> — memperdengarkan hafalan panjang (satu juz atau lebih) dalam sekali duduk, biasanya menjelang ujian.</li>
	</ol>

	<h2>Istilah yang sering dipakai di program tahfidz</h2>
	<ul>
		<li><strong>Ziyadah</strong> — hafalan baru yang disetorkan.</li>
		<li><strong>Murojaah</strong> — mengulang hafalan lama.</li>
		<li><strong>Sabaq, sabqi, manzil</strong> — pembagian harian: hafalan baru, hafalan beberapa hari terakhir, dan hafalan lama.</li>
		<li><strong>Mutqin</strong> — hafalan yang kokoh, lancar tanpa ragu.</li>
		<li><strong>Munaqosah</strong> — ujian hafalan di depan penguji. Lihat <a href="/literasi/munaqosah-tahfidz">panduan munaqosah tahfidz</a>.</li>
		<li><strong>Syahadah</strong> — sertifikat yang diberikan setelah lulus munaqosah.</li>
	</ul>

	<h2>Tips menjalankan program tahfidz di TPQ</h2>
	<ul>
		<li>Mulai dari Juz 30 dan surat pendek yang juga dipakai untuk shalat.</li>
		<li>Catat setiap setoran: surat, ayat dari–sampai, ziyadah atau murojaah, dan kelancarannya. Tanpa catatan, guru pengganti tidak tahu harus melanjutkan dari mana.</li>
		<li>Jadwalkan murojaah seperti menjadwalkan hafalan baru — bukan sisa waktu.</li>
		<li>Libatkan orang tua untuk murojaah di rumah, terutama selepas Subuh atau Maghrib.</li>
	</ul>
	<p>Untuk pencatatan setoran di TPQ atau rumah tahfidz, SantriOnline menyediakan <a href="/aplikasi-hafalan-quran">aplikasi hafalan Quran</a> gratis: guru mencatat per ayat dari HP, ziyadah dan murojaah dibedakan, dan daftar hafalan yang belum lancar terkumpul sendiri.</p>

	<p class="sumber">Sumber: Al-Qur’an dan terjemahan Kemenag RI; Shahih al-Bukhari no. 5027; Sunan Abi Dawud no. 1464; Jami‘ at-Tirmidzi no. 2914 (<a href="https://sunnah.com/bukhari:5027" rel="noopener">sunnah.com</a>); as-Suyuthi, <em>al-Itqan fi ‘Ulum al-Qur’an</em>, bab hafalan Al-Qur’an.</p>
</ArtikelLiterasi>
