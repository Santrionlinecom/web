# Rombak santrionline.com: "Belajar Islam dari nol sampai mahir" (format ala Ailene, isi pesantren)

**Tujuan:** santrionline.com menjadi pintu belajar Islam bertahap. Pengunjung ikut tes "Tipe Santri", membuka pelajaran pertama tanpa login, menonton video stickman 30–60 detik, membaca materi, menjawab kuis, lalu naik level. Akun, progres, dan bagian berbayar ada di app.santrionline.com.

**Sumber ide:** ailene.id. Yang ditiru hanya struktur dan alurnya (tes tipe, pelajaran pertama tanpa login, video, bacaan, kuis, toolkit, tangga level, komunitas). Teks, video, maskot, dan klaim mereka tidak disalin. Semua materi ditulis sendiri dan dicek ustadz.

**Repo:** `Santrionlinecom/web` (`/home/yogik/santrionline-web`, SvelteKit, Pages project `web`). App dan akun: `Santrionlinecom/app`. Mesin video: `~/video-santri/ngaji-sanad` (stickman, sudah dipakai di "7 Golongan Dinaungi Allah").

---

## 1. Peta level

| Level | Nama | Isi | Harga |
|---|---|---|---|
| 00 | Kenali Diri | Tes "Tipe Santri": 10 situasi, ±3 menit, hasilnya 7 cara belajar (maskot stickman) | Gratis, tanpa login |
| 01 | Fondasi Muslim | 7 modul / 24 pelajaran (lihat §2) | Gratis. Pelajaran 1 tanpa login, sisanya dengan akun gratis |
| 02 | Ngaji Kitab Dasar | Safinatun Najah, 'Aqidatul 'Awam, Jurumiyah per bab: video + teks Arab + makna + kuis. Terhubung ke /kitab dan Tanya Kitab | Paket santri (mis. Rp49–99 rb) |
| 03 | Hafalan Matan | Fitur rancangan `app.santrionline/.hermes/plans/2026-10-19_hafalan-matan-pesantren.md` | Termasuk paket |
| 04 | Kajian Lanjut | Fathul Qarib, Bidayatul Hidayah, sirah; Tanya Kitab tanpa batas; live kajian 2x/bulan | Paket lanjut / lembaga |

Maskot "Tipe Santri" (stickman, laki-laki berpeci, perempuan berhijab panjang). Sejak Okt 2026 tipe = **cara belajar** (cara yang paling mudah membuat paham), bukan kebiasaan ibadah:
- **Si Pendengar** 🎧: paham lewat mendengar (audio, kajian, video narasi).
- **Si Pengamat** 👀: paham lewat melihat (gambar, bagan, contoh, peragaan).
- **Si Pembaca** 📖: paham lewat tulisan yang runtut.
- **Si Penghafal** 🔁: cepat menangkap lewat menghafal dan mengulang.
- **Si Penanya** ❓: paham lewat bertanya dan berdiskusi.
- **Si Pengamal** 🤲: paham lewat praktik langsung.
- **Si Istiqomah** 🐢: tidak cepat paham, tapi mengulang sedikit tiap hari sampai paham dan melekat.

Si Penyeimbang dihapus (nilai lama di app dibaca sebagai Si Istiqomah). Hasil = cara utama + cara kedua (selalu tampil); bila seri, dua cara ditampilkan apa adanya. Hasil tes = pintu masuk yang paling nyaman, bukan satu-satunya cara belajar, dan bukan penilaian keimanan. Mockup PNG/HTML di `docs/mockup` masih versi 5 tipe (arsip desain).

## 2. Level 01 Fondasi Muslim: 7 modul, 24 pelajaran (draf, wajib dicek ustadz)
0. **Kenapa belajar sekarang** (1): keutamaan menuntut ilmu. HR. Ibnu Majah 224, "menuntut ilmu wajib atas setiap muslim"; derajatnya dicek dulu.
1. **Kenalan dengan Islam** (3): rukun Islam, rukun iman, ihsan (hadits Jibril, Muslim 8).
2. **Aqidah dasar** (4): sifat wajib Allah (20 sifat ala 'Aqidatul 'Awam), sifat rasul, iman kepada malaikat dan kitab, hari akhir. Sesuai aturan visual §5.
3. **Thaharah** (4): najis dan cara menyucikan, wudhu (syarat, rukun, pembatal), mandi wajib, tayammum. Rujukan: Safinah, Fathul Qarib.
4. **Shalat** (5): syarat, rukun 17, bacaan, sujud sahwi, shalat jamaah dan jamak-qashar.
5. **Puasa dan zakat dasar** (3): rukun puasa, pembatal, zakat fitrah.
6. **Adab dan akhlak** (3): adab kepada orang tua, guru, ilmu (Bidayatul Hidayah, Ta'lim).
7. **Langkah berikutnya** (1): cara memilih guru, sanad, dan bahaya belajar agama hanya dari AI atau internet.

Format tiap pelajaran (meniru alur, isi sendiri):
1. **Tonton**: video stickman 30–60 detik. Ceritanya hook, lalu inti, lalu satu pelajaran.
2. **Baca**: 400–800 kata, dalil berharakat + terjemah + sumber (kitab/hadits bernomor).
3. **Coba**: kuis 3 soal.
4. **Bawa pulang**: kartu ringkas yang bisa disimpan/dibagikan, plus satu amalan hari ini.

Ditambah 5 "contekan" PDF:
- Jadwal belajar 30 hari;
- Checklist wudhu dan shalat;
- Doa harian;
- Daftar kitab per jenjang;
- Adab bertanya agama ke AI.

## 3. Halaman santrionline.com yang baru
- **Beranda** (struktur meniru alur Ailene, teks sendiri):
  1. Hero "Belajar Islam dari nol sampai paham";
  2. 4 langkah (Kenali, Belajar, Praktik, Tumbuh);
  3. peta 4 level;
  4. contoh "sebelum dan sesudah" (mahasiswa, ibu rumah tangga, pekerja);
  5. cuplikan video;
  6. komunitas (grup Telegram/WA);
  7. paket;
  8. FAQ.

  Angka hanya yang nyata: 206 kitab, jumlah anggota nyata. Tidak ada klaim karangan.
- `/tipe-santri`: tes tanpa login. Hasil bisa dibagikan sebagai gambar OG.
- `/belajar`: daftar modul.
- `/belajar/[modul]/[pelajaran]`: pelajaran 1 terbuka. Pelajaran lain meminta login di app.santrionline.com (SSO yang sudah ada); progres disimpan di D1 app.
- Halaman lama (aplikasi pondok, raport TPQ, katalog, literasi, lembaga) tetap ada di menu "Untuk Lembaga", supaya SEO yang ada tidak hilang (redirect 301 bila URL berubah).

## 3b. Kesinambungan ke app.santrionline.com (permintaan pemilik 19 Okt)
Maskot stickman "Tipe Santri" ikut tampil saat pengguna pindah ke app:
- halaman masuk/daftar yang dibuka dari /belajar menampilkan maskot hasil tesnya ("Si Penanya, simpan progresmu");
- halaman progres belajar di app memakai maskot yang sama, dengan status level dan pelajaran berikutnya;
- empty state dan notifikasi (streak, pelajaran baru) memakai stickman dengan gaya yang sama.

Hasil tes dibawa lewat parameter `?tipe=` atau cookie, lalu disimpan ke profil setelah login. Aset SVG stickman ada di satu sumber (`stick.py`), lalu diekspor ke kedua repo. Bagian ini dikerjakan di repo `Santrionlinecom/app` setelah Fase 2 (PR terpisah).

## 4. Video stickman
- Mesin: `~/video-santri/ngaji-sanad`. Format 9:16 (juga untuk TikTok) dan 16:9 (halaman). Durasi 30–60 detik per pelajaran: 24 video untuk Level 01.
- Suara (keputusan pemilik 19 Okt): **4 video pilot memakai ElevenLabs Mahaputra** (`v70fYBHUOrHA3AKIBjPq`, eleven_multilingual_v2) untuk narasi dan dalil. **Video berikutnya (20 sisanya) memakai SantriVoice.** Ejaan "Allah"/"Rasulullah" standar.
- Alur produksi per video:
  1. naskah dari teks pelajaran yang sudah dicek;
  2. TTS;
  3. render;
  4. QA vision + whisper;
  5. ustadz "sahkan";
  6. unggah ke R2.
- Kapasitas laptop ±3–5 video per hari.

## 5. Aturan konten (wajib)
- Aqidah Aswaja dalam visual: Allah tidak digambar dalam bentuk apa pun; malaikat, 'Arsy, surga, neraka, mizan, dan shirath tidak digambar harfiah; Nabi ﷺ, sahabat, dan wanita tidak digambar. Tokoh perempuan, kalau ada, berupa stickman berhijab panjang.
- Setiap dalil memakai sumber bernomor. Teks hadits dicocokkan dengan sunnah.com, ayat dengan teks uthmani.
- Status pelajaran `draf → dicek → terbit`. Hanya admin yang menerbitkan, setelah ustadz mengesahkan.
- Fiqih memakai madzhab Syafi'i (mu'tamad).
- Tanpa em/en-dash dan tanpa `<h1>` ganda di artikel. Ikuti aturan SEO yang berlaku.

## 6. Fase kerja
1. **Fase 0, rancangan:** dokumen ini + mockup beranda (HTML, PNG untuk Telegram). Mas setujui.
2. **Fase 1, data dan halaman:** skema pelajaran (`content/belajar/*.md` frontmatter: modul, no, status, dalil[]), rute `/belajar` dan `/tipe-santri`, beranda baru di preview branch. Tes + QA HP/desktop.
3. **Fase 2, pilot isi:** Modul 0 dan 1 (4 pelajaran) + 4 video stickman + kuis. Ustadz memeriksa.
4. **Fase 3, akun dan progres:** login lewat app.santrionline.com, tabel `belajar_progres` di D1 app, kartu "Bawa pulang".
5. **Fase 4, sisa Level 01:** 20 pelajaran + 20 video, dicicil ±1 modul per minggu.
6. **Fase 5, monetisasi:** paket Level 02–04 lewat sistem coin/pembayaran yang sudah ada.
7. **Rilis:** PR → CI → preview → Mas bilang "deploy". Cek Ahrefs Health Score tetap 100 dan analytics tetap jalan.

## 7. Ukuran berhasil (90 hari)
- 24 pelajaran Level 01 terbit, semuanya sudah disahkan ustadz.
- ≥1.000 tes Tipe Santri; ≥30% lanjut ke pelajaran 1; ≥10% membuat akun.
- 24 video juga tayang di TikTok.
- Ahrefs Health Score tetap ≥95; trafik organik naik.

## 8. Keputusan yang dibutuhkan
1. Ustadz pemeriksa materi dan video.
2. Suara video: SantriVoice (suara Mas) atau ElevenLabs Bian/Mahaputra.
3. Harga paket Level 02–04.
4. Komunitas: grup Telegram (sudah ada bot) atau WhatsApp.
