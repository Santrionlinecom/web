import sys
sys.path.insert(0, "/home/yogik/.hermes/cache/scratch/mockup-belajar")
from common import tulis
from stick import MASKOT

CSS = '''
.lbl{display:flex;align-items:center;gap:10px;margin:0 0 12px;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.lbl b{background:var(--g);color:#fff;border-radius:99px;padding:3px 10px;letter-spacing:.06em}
.scr{padding:28px 0 34px;border-bottom:1px dashed #cdd3c7}
.panel{border-radius:26px;padding:24px 20px;background:#fff;border:1px solid var(--border);box-shadow:var(--sh)}
.intro{background:radial-gradient(500px 300px at 100% 0%,rgb(252 211 77/.22),transparent 60%),#fff;text-align:center}
.intro h1{font-family:'Fraunces',serif;color:var(--g);font-size:34px;line-height:1.1;margin:14px 0 10px;letter-spacing:-.03em}
.intro p{color:var(--muted);font-size:15px;line-height:1.65;margin:0 auto 18px;max-width:460px}
.facts{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:0 0 20px}
.facts span{background:#eef1ea;color:var(--g);font-weight:800;font-size:13px;border-radius:99px;padding:7px 12px}
.mrow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;margin:6px -6px 20px}
.m{background:#f6f1e3;border-radius:14px;padding:6px 2px 6px;text-align:center;color:var(--g)}
.m svg{width:100%;height:auto;display:block}.m b{display:block;font-size:8.5px;letter-spacing:-.01em;line-height:1.2;overflow-wrap:normal}
.btn.blk{width:100%}
.fine{font-size:12px;color:var(--muted);margin:12px 0 0}
.qtop{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;color:var(--g)}
.qtop span:last-child{color:var(--muted);font-weight:700}
.bar{height:8px;background:#eef1ea;border-radius:9px;margin:10px 0 20px;overflow:hidden}.bar i{display:block;height:100%;width:33.3%;background:linear-gradient(90deg,#1b5546,#34a873);border-radius:9px}
.sit{font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--ink2)}
.q{font-family:'Fraunces',serif;color:var(--g);font-size:23px;line-height:1.3;margin:8px 0 18px}
.opt{display:flex;gap:12px;align-items:flex-start;border:1.5px solid var(--border);border-radius:16px;padding:14px;margin-bottom:10px;font-size:15px;line-height:1.5;background:#fff}
.opt .k{flex:none;width:30px;height:30px;border-radius:9px;background:#eef1ea;color:var(--g);font-weight:900;display:grid;place-items:center;font-size:14px}
.opt.sel{border-color:var(--g);background:#ecfdf3;box-shadow:0 0 0 3px rgb(18 63 52/.12)}.opt.sel .k{background:var(--g);color:#fff}
.qnav{display:flex;justify-content:space-between;align-items:center;margin-top:16px}
.qnav a.back{font-weight:800;color:var(--muted);font-size:14px}
.hint{font-size:13px;color:var(--muted);background:#f6f7f3;border-radius:12px;padding:10px 12px;margin-top:14px}
.res{background:var(--g3);color:#fff;text-align:center;position:relative;overflow:hidden;border:0}
.res:before{content:"";position:absolute;right:-70px;top:-70px;width:240px;height:240px;border-radius:999px;background:rgb(27 85 70/.7);filter:blur(30px)}
.res > *{position:relative}
.res .badge{display:inline-block;background:rgb(252 211 77/.18);color:var(--gold2);font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;border-radius:99px;padding:6px 12px}
.res .hero-m{width:150px;margin:14px auto 4px;background:#f6f1e3;border-radius:28px;padding:10px 6px 4px}
.res .hero-m svg{width:100%;height:auto;display:block}
.res h2{font-family:'Fraunces',serif;font-size:32px;margin:8px 0 6px}
.res p.d{color:#d7e7df;font-size:15px;line-height:1.65;margin:0 auto 18px;max-width:440px}
.box{text-align:left;background:rgb(255 255 255/.07);border:1px solid rgb(255 255 255/.14);border-radius:16px;padding:14px 16px;margin-bottom:10px}
.box small{display:block;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:4px}
.box p{margin:0;font-size:14px;line-height:1.6;color:#eef5f1}
.acts{display:grid;gap:10px;margin-top:16px}
.btn-ghost{border:1.5px solid rgb(255 255 255/.3);color:#fff}
.lain{margin-top:20px}.lain h4{margin:0 0 10px;color:var(--g);font-size:15px}
.lain .row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.lain .m{background:#fff;border:1px solid var(--border)}
.disc{font-size:12px;color:#b9cdc4;margin:14px 0 0}
'''

mrow = "".join(f'<div class="m">{fn(80)}<b>{nm.replace("Si ","Si<br>")}</b></div>' for k,(nm,_,fn) in MASKOT.items())

s1 = f'''<section class="scr"><div class="wrap">
 <div class="lbl"><b>Layar 1</b>Pembuka</div>
 <div class="panel intro">
  <span class="eyebrow"><span class="dot"></span>Level 00 · Kenali Diri</span>
  <h1>Kamu tipe santri yang mana?</h1>
  <p>Jawab 12 situasi sehari-hari dengan jujur. Tidak ada jawaban yang salah. Hasilnya saran dari mana sebaiknya kamu mulai belajar.</p>
  <div class="facts"><span>12 situasi</span><span>&plusmn;3 menit</span><span>Tanpa login</span></div>
  <div class="mrow">{mrow}</div>
  <a class="btn btn-p blk" href="#">Mulai tes &rarr;</a>
  <p class="fine">Jawabanmu tidak disimpan kecuali kamu memilih membuat akun.</p>
 </div>
</div></section>'''

opsi = [
 ("A","Langsung kubagikan lagi. Isinya bagus, pasti bermanfaat.",False),
 ("B","Kutanya temanku dengan sopan: haditsnya dari kitab apa?",False),
 ("C","Kucari dulu sumbernya. Kalau masih ragu, kutanyakan ke ustadz.",True),
 ("D","Kudiamkan saja. Takut salah kalau ikut berkomentar.",False),
]
opts = "".join(f'<div class="opt{" sel" if sel else ""}"><span class="k">{k}</span><span>{t}</span></div>' for k,t,sel in opsi)
s2 = f'''<section class="scr"><div class="wrap">
 <div class="lbl"><b>Layar 2</b>Contoh situasi</div>
 <div class="panel">
  <div class="qtop"><span>Situasi 4 dari 12</span><span>Tipe Santri</span></div>
  <div class="bar"><i></i></div>
  <div class="sit">Di grup keluarga</div>
  <div class="q">Temanmu membagikan video ceramah yang menyebut sebuah hadits tanpa sumber. Apa yang kamu lakukan?</div>
  {opts}
  <div class="hint">Pilih yang paling mirip dengan kebiasaanmu, bukan yang menurutmu paling ideal.</div>
  <div class="qnav"><a class="back" href="#">&larr; Kembali</a><a class="btn btn-p" href="#">Lanjut &rarr;</a></div>
 </div>
</div></section>'''

nm, _, fn = MASKOT["penanya"]
lain = "".join(f'<div class="m">{MASKOT[k][2](70)}<b>{MASKOT[k][0]}</b></div>' for k in ["pendengar","pengamat","pembaca","penghafal","pengamal","istiqomah"])
s3 = f'''<section class="scr" style="border:0"><div class="wrap">
 <div class="lbl"><b>Layar 3</b>Contoh hasil</div>
 <div class="panel res">
  <span class="badge">Hasil tesmu</span>
  <div class="hero-m">{fn(140)}</div>
  <h2>Kamu Si Penanya</h2>
  <p class="d">Kamu tidak mudah menerima sesuatu sebelum tahu dasarnya. Rasa ingin tahu seperti ini bekal yang baik untuk menuntut ilmu.</p>
  <div class="box"><small>Kekuatanmu</small><p>Teliti terhadap sumber dan tidak gampang ikut-ikutan.</p></div>
  <div class="box"><small>Yang perlu dijaga</small><p>Adab bertanya: kepada orang yang tepat, di waktu yang tepat, untuk belajar dan bukan untuk menguji.</p></div>
  <div class="box"><small>Titik mulai yang disarankan</small><p>Level 01 Fondasi Muslim, mulai dari pelajaran 1: Kenapa belajar agama sekarang.</p></div>
  <div class="acts"><a class="btn btn-gold" href="#">Buka pelajaran yang disarankan &rarr;</a><a class="btn btn-ghost" href="#">Bagikan hasil sebagai gambar</a></div>
  <p class="disc">Hasil ini hanya saran titik mulai belajar, bukan penilaian iman atau amal seseorang.</p>
 </div>
 <div class="lain"><h4>Tipe lainnya</h4><div class="row">{lain}</div></div>
 <p style="text-align:center;margin:18px 0 0"><a href="#" style="font-weight:800;color:var(--g);font-size:14px">Ulangi tes</a></p>
</div></section>'''

tulis("tipe-santri.html", "Tes Tipe Santri · SantriOnline (mockup)", CSS + "\n.wrap{max-width:560px}", s1 + s2 + s3)
