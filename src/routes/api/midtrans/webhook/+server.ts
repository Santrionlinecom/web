// src/routes/api/midtrans/webhook/+server.ts
// DIMATIKAN 2026-08-21 atas keputusan Mas Yogik: pembayaran resmi hanya
// diproses di app.santrionline.com (commit b9547a4 menghapus env Midtrans
// dari web). Endpoint dipertahankan sebagai 410 Gone — bukan 404 — supaya
// Midtrans/integrasi lama yang masih menembak ke sini mendapat sinyal tegas
// "sudah pindah permanen", dan supaya tidak ada handler pembayaran hidup
// tanpa pengawasan di properti marketing.
import { json, type RequestHandler } from '@sveltejs/kit';

const GONE_BODY = {
	message:
		'Webhook pembayaran di santrionline.com sudah dinonaktifkan permanen. Konfigurasi notifikasi Midtrans mengarah ke app.santrionline.com.'
};

export const POST: RequestHandler = () => json(GONE_BODY, { status: 410 });
export const GET: RequestHandler = () => json(GONE_BODY, { status: 410 });
