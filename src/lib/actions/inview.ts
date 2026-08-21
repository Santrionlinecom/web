// src/lib/actions/inview.ts
// Action reusable: animasikan elemen saat masuk viewport (Fase 2c).
//
// Pemakaian:
//   <section use:inview>            → elemen ini sendiri dianimasikan
//   <ul use:inview={{ stagger: 80 }}> dengan anak-anak ber-atribut data-inview
//     → anak muncul berurutan berjarak 80ms
//
// Aturan yang dijaga action ini:
// - Hanya transform+opacity (kelas CSS .js-inview [data-inview] di layout.css).
// - threshold 0 + rootMargin -5%: elemen muncul begitu tepinya masuk layar —
//   pelajaran dari bug "tengah halaman kosong" (threshold besar tidak pernah
//   tercapai pada section yang lebih tinggi dari viewport).
// - Jaring pengaman 2.5 detik: apa pun yang gagal, konten wajib terlihat.
// - Tanpa IntersectionObserver (browser purba) → konten langsung terlihat.
// - prefers-reduced-motion ditangani CSS global (layout.css), bukan di sini.

type InviewOptions = {
	/** Jarak antar anak (ms) saat elemen punya anak ber-[data-inview]. */
	stagger?: number;
};

export function inview(node: HTMLElement, options: InviewOptions = {}) {
	const { stagger = 0 } = options;

	// Anak eksplisit ber-data-inview; bila tidak ada, elemen ini targetnya.
	const children = Array.from(node.querySelectorAll<HTMLElement>('[data-inview]'));
	const targets = children.length > 0 ? children : [node];

	if (children.length === 0) {
		node.setAttribute('data-inview', '');
	}

	const reveal = () => {
		targets.forEach((el, i) => {
			if (stagger > 0) {
				el.style.transitionDelay = `${i * stagger}ms`;
			}
			el.classList.add('inview-visible');
		});
	};

	// Browser tanpa IntersectionObserver: langsung tampil, tanpa animasi.
	if (typeof IntersectionObserver === 'undefined') {
		reveal();
		return {};
	}

	// Kelas penanda di <html>: CSS baru menyembunyikan elemen SETELAH JS
	// terbukti hidup — tanpa JS konten tetap terlihat (no-JS safe).
	document.documentElement.classList.add('js-inview');

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				reveal();
				observer.disconnect();
			}
		},
		{ threshold: 0, rootMargin: '0px 0px -5% 0px' }
	);

	observer.observe(node);

	// Jaring pengaman: konten wajib terlihat paling lambat 2.5 detik.
	const safety = setTimeout(reveal, 2500);

	return {
		destroy() {
			clearTimeout(safety);
			observer.disconnect();
		}
	};
}
