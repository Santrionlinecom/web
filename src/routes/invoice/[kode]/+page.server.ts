import { env as publicEnv } from '$env/dynamic/public';
import { parseInvoice, type InvoiceRow } from '$lib/server/invoice';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type RuntimeEnv = {
	DB?: D1Database;
	PUBLIC_MIDTRANS_CLIENT_KEY?: string;
	PUBLIC_MIDTRANS_MODE?: string;
};

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

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = getRuntimeEnv(platform).DB;

	if (!db) {
		throw error(500, 'Binding D1 DB belum dikonfigurasi.');
	}

	const invoiceRow = await db
		.prepare('SELECT * FROM invoices WHERE kode = ? LIMIT 1')
		.bind(params.kode)
		.first<InvoiceRow>();

	if (!invoiceRow) {
		throw error(404, 'Invoice tidak ditemukan.');
	}

	const mode = getPublicValue(platform, 'PUBLIC_MIDTRANS_MODE') === 'production' ? 'production' : 'sandbox';

	return {
		invoice: parseInvoice(invoiceRow),
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
