export type InvoiceItem = {
	nama: string;
	qty: number;
	harga: number;
};

export type InvoiceStatus = 'unpaid' | 'paid' | 'expired' | 'cancelled';

export type InvoiceRow = {
	id: number;
	kode: string;
	nama_klien: string;
	email_klien: string | null;
	whatsapp_klien: string | null;
	deskripsi: string;
	items: string;
	subtotal: number;
	pajak: number;
	total: number;
	status: InvoiceStatus;
	midtrans_order_id: string | null;
	midtrans_transaction_id: string | null;
	midtrans_snap_token: string | null;
	catatan: string | null;
	due_date: string | null;
	paid_at: string | null;
	created_at: string;
	updated_at: string;
};

export type Invoice = Omit<InvoiceRow, 'items'> & {
	items: InvoiceItem[];
};

const INVOICE_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateKodeInvoice(date = new Date()): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	let suffix = '';

	for (let index = 0; index < 4; index += 1) {
		const randomIndex = Math.floor(Math.random() * INVOICE_CODE_CHARS.length);
		suffix += INVOICE_CODE_CHARS[randomIndex];
	}

	return `INV-${year}${month}-${suffix}`;
}

function toPositiveInteger(value: number) {
	if (!Number.isFinite(value)) {
		return 0;
	}

	return Math.max(0, Math.round(value));
}

export function normalizeInvoiceItems(items: unknown): InvoiceItem[] {
	if (!Array.isArray(items)) {
		return [];
	}

	return items
		.map((item) => {
			const record = item as Partial<Record<keyof InvoiceItem, unknown>>;
			const nama = typeof record.nama === 'string' ? record.nama.trim() : '';
			const qty = toPositiveInteger(Number(record.qty));
			const harga = toPositiveInteger(Number(record.harga));

			return { nama, qty, harga };
		})
		.filter((item) => item.nama.length > 0 && item.qty > 0 && item.harga >= 0);
}

export function hitungTotal(
	items: InvoiceItem[],
	pajak: number
): { subtotal: number; pajak_nominal: number; total: number } {
	const subtotal = items.reduce((sum, item) => sum + item.qty * item.harga, 0);
	const pajakPersen = Number.isFinite(pajak) ? Math.max(0, pajak) : 0;
	const pajak_nominal = Math.round((subtotal * pajakPersen) / 100);

	return {
		subtotal,
		pajak_nominal,
		total: subtotal + pajak_nominal
	};
}

export function formatRupiah(nominal: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(nominal);
}

export function parseInvoice(row: InvoiceRow): Invoice {
	let items: InvoiceItem[] = [];

	try {
		items = normalizeInvoiceItems(JSON.parse(row.items));
	} catch {
		items = [];
	}

	return {
		...row,
		items
	};
}
