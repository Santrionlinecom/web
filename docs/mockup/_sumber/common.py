import sys, re
sys.path.insert(0, "/home/yogik/.hermes/cache/scratch/mockup-belajar")
from stick import MASKOT, lelaki, perempuan, TANYA, BUKU_BUKA

OUT = "/home/yogik/wt-web-belajar/docs/mockup"
LOGO = "../../static/logo-santrionline.png"

HEAD = '''<!doctype html><html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<link href="fonts.css" rel="stylesheet">
<style>
:root{{--g:#123f34;--g2:#1b5546;--g3:#0c2c25;--gold:#fcd34d;--gold2:#fde68a;--ink2:#065f46;--cream:#f6f7f3;--border:#e2e5dd;--muted:#475569;--ink:#0f172a;
--sh:0 12px 34px rgb(18 63 52/.08);--sh2:0 18px 60px rgb(18 63 52/.12)}}
*{{box-sizing:border-box}}
body{{margin:0;font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:var(--cream);color:var(--ink);-webkit-font-smoothing:antialiased}}
a{{color:inherit;text-decoration:none}}
.wrap{{max-width:1180px;margin:0 auto;padding:0 18px}}
.disp{{font-family:'Fraunces',Georgia,serif;letter-spacing:-.02em}}
.eyebrow{{display:inline-flex;align-items:center;gap:8px;border:1px solid rgb(252 211 77/.45);background:#fff;border-radius:999px;padding:6px 12px;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--g)}}
.dot{{width:8px;height:8px;border-radius:9px;background:var(--g2)}}
.btn{{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 22px;border-radius:999px;font-weight:800;font-size:15px}}
.btn-p{{background:var(--g);color:#fff;box-shadow:0 8px 20px rgb(18 63 52/.22)}}
.btn-s{{background:#fff;color:var(--g);border:1.5px solid rgb(201 168 76/.6)}}
.btn-gold{{background:var(--gold);color:var(--g3)}}
.btn-ghost{{border:1.5px solid rgb(255 255 255/.3);color:#fff}}
.card{{background:#fff;border:1px solid var(--border);border-radius:22px;box-shadow:var(--sh)}}
.tag{{display:inline-block;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}}
.t-free{{background:#dcfce7;color:#065f46}}.t-pay{{background:#fef3c7;color:#7c5a06}}.t-soon{{background:#eef0ea;color:#475569}}
h2.sec{{font-family:'Fraunces',Georgia,serif;color:var(--g);font-size:28px;line-height:1.15;margin:10px 0 8px;letter-spacing:-.02em}}
p.lead{{color:var(--muted);font-size:15px;line-height:1.65;margin:0 0 22px;max-width:640px}}
section{{padding:44px 0}}
.kicker{{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--ink2)}}
@media(min-width:900px){{h2.sec{{font-size:40px}} section{{padding:72px 0}} p.lead{{font-size:17px}} .wrap{{padding:0 40px}}}}
{css}
</style></head><body>
'''

HEADER = f'''<header class="hdr"><div class="wrap hdr-in">
  <a class="brand" href="#"><img src="{LOGO}" alt="SantriOnline" width="36" height="36"><span class="disp">SantriOnline</span></a>
  <nav class="nav"><a href="#" class="on">Belajar</a><a href="#">Tipe Santri</a><a href="#">Perpustakaan Kitab</a><a href="#">Tanya Kitab</a><a href="#">Untuk Lembaga <span class="car">&#9662;</span></a></nav>
  <div class="hdr-act"><a class="btn btn-s sm" href="#">Masuk</a><a class="btn btn-p sm hide-m" href="#">Daftar gratis</a><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span></div>
</div></header>'''

BASE_CSS = '''
.hdr{position:sticky;top:0;z-index:5;background:rgb(246 247 243/.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
.hdr-in{display:flex;align-items:center;justify-content:space-between;height:64px;gap:16px}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;color:var(--g);font-size:19px}
.brand img{border-radius:10px}
.nav{display:none;gap:4px;font-weight:700;font-size:14px;color:var(--muted)}
.nav a{padding:8px 12px;border-radius:999px}.nav a.on{color:var(--g);background:rgb(18 63 52/.07)}
.car{font-size:10px}
.hdr-act{display:flex;align-items:center;gap:8px}
.btn.sm{min-height:38px;padding:8px 16px;font-size:13px}
.burger{display:grid;gap:4px;width:40px;height:40px;place-content:center;border:1px solid var(--border);border-radius:999px;background:#fff}
.burger i{display:block;width:16px;height:2px;background:var(--g);border-radius:2px}
.hide-m{display:none}
@media(min-width:900px){.nav{display:flex}.burger{display:none}.hide-m{display:inline-flex}}
'''

def tulis(nama, title, css, body):
    html = HEAD.format(title=title, css=BASE_CSS + css) + HEADER + body + "\n</body></html>\n"
    # Penjaga aturan copy: tanpa em/en-dash
    teks = re.sub(r"<[^>]+>", " ", html)
    assert "\u2014" not in teks and "\u2013" not in teks, f"dash di {nama}"
    open(f"{OUT}/{nama}", "w").write(html)
    print("tulis", nama, len(html))
