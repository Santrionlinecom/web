-- Rating bintang katalog etalase santrionline.com (kitab, buku, aplikasi, kursus, game).
-- Satu penilaian per pengunjung per item (pengunjung = hash cookie anonim, bukan data pribadi).
-- Terapkan dengan: wrangler d1 execute db-app --remote --file migrations/0002_katalog_ulasan.sql
-- (JANGAN `migrations apply`: db-app dipakai bersama app.santrionline.com yang punya riwayat migrasinya sendiri.)
CREATE TABLE IF NOT EXISTS katalog_ulasan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jenis TEXT NOT NULL,
  slug TEXT NOT NULL,
  pengunjung TEXT NOT NULL,
  jejak TEXT NOT NULL,
  bintang INTEGER NOT NULL CHECK (bintang BETWEEN 1 AND 5),
  dibuat TEXT NOT NULL DEFAULT (datetime('now')),
  diubah TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (jenis, slug, pengunjung)
);
CREATE INDEX IF NOT EXISTS idx_katalog_ulasan_item ON katalog_ulasan (jenis, slug);
CREATE INDEX IF NOT EXISTS idx_katalog_ulasan_jejak ON katalog_ulasan (jejak, diubah);
