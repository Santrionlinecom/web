# Stickman SVG SantriOnline: laki-laki berpeci + sarung, perempuan berhijab panjang + gamis.
# Tanpa detail wajah. Hanya tokoh umum (bukan Nabi/sahabat).
INK = "#123f34"

def _arms(pose, y=66):
    if pose == "up":      # satu tangan terangkat (bertanya)
        return f'<path d="M60 {y} L80 {y-22}" /><path d="M60 {y} L42 {y+20}" />'
    if pose == "hold":    # kedua tangan ke depan memegang sesuatu
        return f'<path d="M60 {y} L46 {y+16} L58 {y+20}" /><path d="M60 {y} L74 {y+16} L62 {y+20}" />'
    if pose == "wide":    # tangan terbuka seimbang
        return f'<path d="M60 {y} L36 {y+8}" /><path d="M60 {y} L84 {y+8}" />'
    if pose == "pray":    # tangan bersedekap
        return f'<path d="M60 {y} L48 {y+14} L66 {y+16}" /><path d="M60 {y} L72 {y+14} L56 {y+16}" />'
    return f'<path d="M60 {y} L42 {y+22}" /><path d="M60 {y} L78 {y+22}" />'

def lelaki(pose="down", sarung="#c79a2e", prop="", w=120):
    return f'''<svg viewBox="0 0 120 170" width="{w}" aria-hidden="true">
  <g fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="60" cy="38" r="14" fill="#fffdf6"/>
    <path d="M60 52 L60 98"/>
    {_arms(pose)}
    <path d="M52 146 L50 156 M68 146 L70 156"/>
  </g>
  <path d="M45 30 L46 19 Q60 13 74 19 L75 30 Q60 26 45 30 Z" fill="#0c2c25"/>
  <path d="M46 96 L74 96 L80 148 L40 148 Z" fill="{sarung}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M44 114 L76 114 M42 130 L78 130" stroke="#fffdf6" stroke-opacity=".55" stroke-width="3"/>
  {prop}
</svg>'''

def perempuan(pose="down", hijab="#1b5546", gamis="#3f8f74", prop="", w=120):
    return f'''<svg viewBox="0 0 120 170" width="{w}" aria-hidden="true">
  <path d="M40 86 L80 86 L90 154 L30 154 Z" fill="{gamis}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
  <g fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    {_arms(pose, 72)}
  </g>
  <path d="M60 18 C44 18 41 32 41 44 L34 90 Q60 102 86 90 L79 44 C79 32 76 18 60 18 Z" fill="{hijab}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="60" cy="41" rx="10.5" ry="12.5" fill="#fffdf6"/>
  <path d="M52 154 L51 160 M68 154 L69 160" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
  {prop}
</svg>'''

# Properti
TANYA = '<g><circle cx="94" cy="26" r="13" fill="#fcd34d" stroke="#123f34" stroke-width="3"/><text x="94" y="32" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="17" fill="#123f34">?</text></g>'
BUKU_TUTUP = '<rect x="48" y="82" width="24" height="18" rx="2" fill="#fcd34d" stroke="#123f34" stroke-width="2.5"/><rect x="52" y="87" width="16" height="2.5" fill="#123f34"/>'
BUKU_BUKA = '<path d="M46 92 L60 96 L74 92 L74 80 L60 84 L46 80 Z" fill="#fffdf6" stroke="#123f34" stroke-width="3" stroke-linejoin="round"/><path d="M60 84 L60 96" stroke="#123f34" stroke-width="2"/>'
SAJADAH = '<path d="M26 158 L94 158 L98 168 L22 168 Z" fill="#b45a3c" opacity=".85"/><path d="M30 163 L90 163" stroke="#fcd34d" stroke-width="2"/>'
BINTANG = '<g fill="#fcd34d" stroke="#123f34" stroke-width="2"><circle cx="20" cy="30" r="5"/><circle cx="100" cy="22" r="4"/><circle cx="104" cy="48" r="3"/></g>'
# Versi cara belajar (Okt 2026): Si Penyeimbang diganti Pendengar, Pengamat, Istiqomah.
# Sumber hidup ada di src/lib/belajar/maskot.ts; berkas ini hanya untuk merender ulang mockup.
def headphone(kiri, kanan, atas, y):
    return (f'<g fill="none" stroke="#123f34" stroke-width="3.5" stroke-linecap="round"><path d="M{kiri+3} {y} Q{kiri+1} {atas} 60 {atas} Q{kanan-1} {atas} {kanan-3} {y}"/></g>'
            f'<rect x="{kiri-3}" y="{y-6}" width="10" height="16" rx="4" fill="#c79a2e" stroke="#123f34" stroke-width="2.5"/>'
            f'<rect x="{kanan-7}" y="{y-6}" width="10" height="16" rx="4" fill="#c79a2e" stroke="#123f34" stroke-width="2.5"/>'
            f'<g fill="none" stroke="#c79a2e" stroke-width="3" stroke-linecap="round"><path d="M{kanan+10} {y-6} Q{kanan+15} {y+2} {kanan+10} {y+10}"/><path d="M{kanan+17} {y-11} Q{kanan+25} {y+2} {kanan+17} {y+15}"/></g>')
DENGAR_PUTRA = headphone(44, 76, 10, 38)
MATA = '<g><circle cx="24" cy="26" r="13" fill="#fcd34d" stroke="#123f34" stroke-width="3"/><path d="M15 26 Q24 17 33 26 Q24 35 15 26 Z" fill="#fffdf6" stroke="#123f34" stroke-width="2"/><circle cx="24" cy="26" r="3.2" fill="#123f34"/></g>'
BINGKAI = '<g transform="translate(0 6)"><rect x="82" y="56" width="32" height="26" rx="3" fill="#fffdf6" stroke="#123f34" stroke-width="3"/><circle cx="105" cy="63" r="3.2" fill="#fcd34d"/><path d="M86 78 L95 66 L101 73 L105 69 L111 78 Z" fill="#3f8f74"/></g>'
KALENDER = '<g><rect x="45" y="78" width="30" height="26" rx="3" fill="#fffdf6" stroke="#123f34" stroke-width="2.5"/><rect x="45" y="78" width="30" height="7" rx="2" fill="#c79a2e" stroke="#123f34" stroke-width="2.5"/><path d="M49 92 L51 94 L54 90 M58 92 L60 94 L63 90 M67 92 L69 94 L72 90 M49 100 L51 102 L54 98" fill="none" stroke="#2f7a62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>'
TETES = '<g><path d="M20 120 C14 129 13 133 20 136 C27 133 26 129 20 120 Z" fill="#7cc4e4" stroke="#123f34" stroke-width="2"/><path d="M8 160 Q10 147 21 146 Q33 146 34 160 Z" fill="#9aa59e" stroke="#123f34" stroke-width="2.5" stroke-linejoin="round"/></g>'

MASKOT = {
    "pendengar":  ("Si Pendengar",  "Paham lewat mendengar", lambda w=120: lelaki("down", "#1b5546", DENGAR_PUTRA, w)),
    "pengamat":   ("Si Pengamat",   "Paham lewat melihat", lambda w=120: perempuan("wide", "#2f7a62", "#c79a2e", MATA + BINGKAI, w)),
    "pembaca":    ("Si Pembaca",    "Paham lewat membaca", lambda w=120: perempuan("hold", "#7a4b2a", "#c79a2e", BUKU_BUKA, w)),
    "penghafal":  ("Si Penghafal",  "Cepat lewat mengulang", lambda w=120: lelaki("hold", "#1b5546", BUKU_TUTUP + BINTANG, w)),
    "penanya":    ("Si Penanya",    "Paham lewat bertanya", lambda w=120: perempuan("up", "#1b5546", "#c79a2e", TANYA, w)),
    "pengamal":   ("Si Pengamal",   "Paham lewat praktik", lambda w=120: lelaki("pray", "#2f7a62", SAJADAH, w)),
    "istiqomah":  ("Si Istiqomah",  "Pelan, diulang, melekat", lambda w=120: perempuan("hold", "#8a6a1f", "#c79a2e", KALENDER + TETES, w)),
}
