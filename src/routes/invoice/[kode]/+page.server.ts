import { env as publicEnv } from '$env/dynamic/public';
import { normalizeInvoiceItems, type InvoiceRow } from '$lib/server/invoice';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type RuntimeEnv = {
	DB?: D1Database;
	PUBLIC_MIDTRANS_CLIENT_KEY?: string;
	PUBLIC_MIDTRANS_MODE?: string;
};

type PublicInvoiceRow = Pick<
	InvoiceRow,
	| 'kode'
	| 'nama_klien'
	| 'email_klien'
	| 'whatsapp_klien'
	| 'deskripsi'
	| 'items'
	| 'subtotal'
	| 'pajak'
	| 'total'
	| 'status'
	| 'midtrans_snap_token'
	| 'catatan'
	| 'due_date'
	| 'paid_at'
	| 'created_at'
>;

function getRuntimeEnv(platform: App.Platform | undefined): RuntimeEnv {
	return (platform?.env ?? {}) as RuntimeEnv;
}

function getPublicValue(platform: App.Platform | undefined, key: keyof RuntimeEnv) {
	const runtimeEnv = getRuntimeEnv(platform);
	const value =
		runtimeEnv[key] ??
		(key === 'PUBLIC_MIDTRANS_CLIENT_KEY'
			? publicEnv.PUBLIC_MIDTRANS_CLIENT_KEY
			: publicEnv.PUBLIC_MIDTRANS_MODE);

	return typeof value === 'string' ? value.trim() : '';
}

function maskEmail(value: string | null) {
	if (!value) return '-';
	const [name, domain] = value.split('@');
	if (!domain) return '••••';
	return `${name.slice(0, 2)}•••@${domain}`;
}

function maskWhatsapp(value: string | null) {
	if (!value) return '-';
	const digits = value.replace(/\D/g, '');
	return digits.length > 4 ? `••••••${digits.slice(-4)}` : '••••';
}

function parsePublicItems(value: string) {
	try {
		return normalizeInvoiceItems(JSON.parse(value));
	} catch {
		return [];
	}
}

export const load: PageServerLoad = async ({ params, platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'private, no-store, max-age=0',
		'x-robots-tag': 'noindex, nofollow, noarchive',
		'referrer-policy': 'no-referrer'
	});

	const db = getRuntimeEnv(platform).DB;

	if (!db) {
		throw error(500, 'Layanan tagihan sedang tidak tersedia. Silakan coba lagi nanti.');
	}

	const invoiceRow = await db
		.prepare(
			`SELECT kode, nama_klien, email_klien, whatsapp_klien, deskripsi, items,
			        subtotal, pajak, total, status, midtrans_snap_token, catatan,
			        due_date, paid_at, created_at
			 FROM invoices
			 WHERE kode = ?
			 LIMIT 1`
		)
		.bind(params.kode)
		.first<PublicInvoiceRow>();

	if (!invoiceRow) {
		throw error(404, 'Invoice tidak ditemukan.');
	}

	const mode = getPublicValue(platform, 'PUBLIC_MIDTRANS_MODE') === 'production' ? 'production' : 'sandbox';

	return {
		invoice: {
			...invoiceRow,
			email_klien: maskEmail(invoiceRow.email_klien),
			whatsapp_klien: maskWhatsapp(invoiceRow.whatsapp_klien),
			items: parsePublicItems(invoiceRow.items)
		},
		midtrans: {
			clientKey: getPublicValue(platform, 'PUBLIC_MIDTRANS_CLIENT_KEY'),
			mode,
			scriptUrl:
				mode === 'production'
					? 'https://app.midtrans.com/snap/snap.js'
					: 'https://app.sandbox.midtrans.com/snap/snap.js'
		}
	};
};
