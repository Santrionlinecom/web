import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { buatTokenSerah, catatTanyaJawab, sesiTamu, COOKIE_SESI_TAMU } from '../src/lib/server/tamu-serah.ts';

// Skema sama dengan migrasi app 0103_serah_percakapan_tamu.sql (tabel milik app, D1 db-app).
const SKEMA = `
CREATE TABLE kitab_tamu_pesan (id TEXT PRIMARY KEY, sesi TEXT NOT NULL, urutan INTEGER NOT NULL, pertanyaan TEXT NOT NULL, data_json TEXT NOT NULL, dibuat_pada INTEGER NOT NULL);
CREATE TABLE kitab_tamu_serah (token TEXT PRIMARY KEY, sesi TEXT NOT NULL, pertanyaan_tertunda TEXT, dibuat_pada INTEGER NOT NULL, kedaluwarsa INTEGER NOT NULL, diklaim_oleh TEXT, diklaim_pada INTEGER, percakapan_id TEXT);`;

const d1 = (db) => {
	const stmt = (sql, args = []) => ({
		bind: (...b) => stmt(sql, b),
		first: async () => db.prepare(sql).get(...args) ?? null,
		run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...args).changes) } })
	});
	return { prepare: (sql) => stmt(sql) };
};
const siapkan = () => {
	const db = new DatabaseSync(':memory:');
	db.exec(SKEMA);
	return db;
};

test('sesi tamu: cookie httpOnly dibuat sekali, dipakai ulang, nilai aneh diganti', () => {
	const toples = new Map();
	const setel = [];
	const cookies = { get: (k) => toples.get(k), set: (k, v, o) => (toples.set(k, v), setel.push(o)) };
	const a = sesiTamu(cookies, true);
	assert.match(a, /^[A-Za-z0-9_-]{32}$/);
	assert.equal(sesiTamu(cookies, true), a);
	assert.equal(setel.length, 1);
	assert.equal(setel[0].httpOnly, true);
	assert.equal(setel[0].secure, true);
	toples.set(COOKIE_SESI_TAMU, "x'; DROP TABLE");
	assert.notEqual(sesiTamu(cookies, true), "x'; DROP TABLE");
});

test('catat: tersimpan apa adanya, maksimal 30 per sesi, sesi lain tidak terganggu', async () => {
	const raw = siapkan();
	const db = d1(raw);
	for (let i = 0; i < 35; i++) await catatTanyaJawab(db, 'S1', `q${i}`, { v: 1, sumber: 'siap', qBank: `q${i}`, reply: 'r' });
	await catatTanyaJawab(db, 'S2', 'lain', { v: 1, sumber: 'kosong', reply: 'r' });
	assert.equal(raw.prepare("SELECT count(*) n FROM kitab_tamu_pesan WHERE sesi='S1'").get().n, 30);
	assert.equal(raw.prepare("SELECT count(*) n FROM kitab_tamu_pesan WHERE sesi='S2'").get().n, 1);
	const satu = raw.prepare("SELECT data_json FROM kitab_tamu_pesan WHERE pertanyaan='q0'").get();
	assert.deepEqual(JSON.parse(satu.data_json), { v: 1, sumber: 'siap', qBank: 'q0', reply: 'r' });
});

test('token serah: acak, berlaku 2 jam, dipakai ulang selama belum diklaim', async () => {
	const raw = siapkan();
	const db = d1(raw);
	const t1 = await buatTokenSerah(db, 'S1', 'Apa rukun shalat?');
	assert.match(t1, /^[A-Za-z0-9_-]{32}$/);
	const t2 = await buatTokenSerah(db, 'S1', 'Apa rukun haji?');
	assert.equal(t2, t1);
	const row = raw.prepare('SELECT * FROM kitab_tamu_serah').get();
	assert.equal(row.pertanyaan_tertunda, 'Apa rukun haji?');
	assert.ok(Math.abs(row.kedaluwarsa - row.dibuat_pada - 2 * 3600_000) < 5);
	raw.exec("UPDATE kitab_tamu_serah SET diklaim_oleh = 'u1'");
	const t3 = await buatTokenSerah(db, 'S1', 'x');
	assert.notEqual(t3, t1);
	assert.notEqual(await buatTokenSerah(db, 'S2', 'x'), t3);
});

test('gagal-terbuka: tanpa DB atau tabel belum ada, chat tetap jalan', async () => {
	assert.equal(await buatTokenSerah(undefined, 'S1', 'x'), null);
	await catatTanyaJawab(undefined, 'S1', 'x', { v: 1, sumber: 'kosong', reply: 'r' });
	const kosong = d1(new DatabaseSync(':memory:'));
	const asli = console.error;
	console.error = () => {};
	try {
		assert.equal(await buatTokenSerah(kosong, 'S1', 'x'), null);
		await catatTanyaJawab(kosong, 'S1', 'x', { v: 1, sumber: 'kosong', reply: 'r' });
	} finally {
		console.error = asli;
	}
});
