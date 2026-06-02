CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kode TEXT UNIQUE NOT NULL,
  nama_klien TEXT NOT NULL,
  email_klien TEXT,
  whatsapp_klien TEXT,
  deskripsi TEXT NOT NULL,
  items TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  pajak INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'unpaid',
  midtrans_order_id TEXT UNIQUE,
  midtrans_transaction_id TEXT,
  midtrans_snap_token TEXT,
  catatan TEXT,
  due_date TEXT,
  paid_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_invoices_kode ON invoices(kode);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
