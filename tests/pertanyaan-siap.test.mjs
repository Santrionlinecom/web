import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pilihUntukSlot, slotSaatIni, sisaSlotMs, SLOT_MS, kunciPertanyaan } from '../src/lib/pertanyaan-siap.js';

const kolam = Array.from({ length: 30 }, (_, i) => 'q' + i);

test('slot berganti tiap 30 menit dan sisa slot benar', () => {
	assert.equal(SLOT_MS, 1_800_000);
	assert.equal(slotSaatIni(SLOT_MS * 5 + 10), 5);
	assert.equal(sisaSlotMs(SLOT_MS * 5 + 10), SLOT_MS - 10);
});

test('pilihan deterministik per slot, 3 unik, slot berurutan tidak berbagi pertanyaan', () => {
	assert.deepEqual(pilihUntukSlot(kolam, 100), pilihUntukSlot(kolam, 100));
	for (let s = 1; s < 200; s++) {
		const a = pilihUntukSlot(kolam, s), b = pilihUntukSlot(kolam, s + 1);
		assert.equal(new Set(a).size, 3);
		assert.equal(a.filter((x) => b.includes(x)).length, 0);
	}
	const terlihat = new Set();
	for (let s = 0; s < 200; s++) pilihUntukSlot(kolam, s).forEach((x) => terlihat.add(x));
	assert.equal(terlihat.size, 30);
});

test('kunci pertanyaan mengabaikan huruf besar & tanda baca', () => {
	assert.equal(kunciPertanyaan('Apa itu Ihsan?'), kunciPertanyaan('apa itu ihsan'));
});

test('data siap: tiap item berjawaban dengan rujukan kitab', () => {
	const data = JSON.parse(readFileSync(new URL('../src/lib/server/pertanyaan-siap.json', import.meta.url), 'utf8'));
	assert.ok(data.length >= 12);
	for (const d of data) {
		assert.ok(d.q && d.reply && d.reply.length > 40, d.q);
		assert.ok(Array.isArray(d.rujukan) && d.rujukan.length > 0, d.q);
		assert.doesNotMatch(d.reply, /Belum ada kutipan/, d.q);
	}
});
