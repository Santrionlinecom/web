import glob, os, sys
from playwright.sync_api import sync_playwright
from PIL import Image
D = "/home/yogik/wt-web-belajar/docs/mockup"
CH = sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome")))[-1]
TOPS={}; CSSH={}
jobs = [("beranda.html","beranda-hp.png",390),("beranda.html","beranda-desktop.png",1366),("tipe-santri.html","tipe-santri-hp.png",390)]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CH, args=["--no-sandbox"])
    for src, out, w in jobs:
        pg = b.new_page(viewport={"width": w, "height": 900}, device_scale_factor=2 if w == 390 else 1)
        pg.goto(f"file://{D}/{src}", wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(600)
        sw = pg.evaluate("document.documentElement.scrollWidth")
        TOPS[out] = pg.evaluate("[...document.querySelectorAll('body > section, footer')].map(e=>e.getBoundingClientRect().top+scrollY)")
        CSSH[out] = pg.evaluate("document.documentElement.scrollHeight")
        pg.screenshot(path=f"{D}/{out}", full_page=True)
        print(out, Image.open(f"{D}/{out}").size, "scrollWidth", sw, "fonts", pg.evaluate("[...document.fonts].filter(f=>f.status=='loaded').map(f=>f.family).filter((v,i,a)=>a.indexOf(v)==i).join(',')"))
    b.close()

# Versi Telegram: JPG lebar <=1080, dipotong bila tinggi > 4000
def ringan(png, base):
    im = Image.open(f"{D}/{png}").convert("RGB")
    if im.width > 1080:
        im = im.resize((1080, round(im.height * 1080 / im.width)), Image.LANCZOS)
    for f in glob.glob(f"{D}/{base}*.jpg"): os.remove(f)
    if im.height <= 4000:
        im.save(f"{D}/{base}.jpg", quality=84, optimize=True, progressive=True); print(base+".jpg", im.size); return
    sk = im.height / CSSH[png]
    batas = sorted(round(t*sk) for t in TOPS[png])
    n = -(-im.height // 3800)
    cuts = [0]
    for i in range(1, n):
        t = round(im.height * i / n)
        near = [b for b in batas if abs(b - t) <= 450]
        cuts.append(min(near, key=lambda b: abs(b - t)) if near else t)
    cuts.append(im.height)
    for i in range(n):
        part = im.crop((0, cuts[i], im.width, cuts[i+1]))
        part.save(f"{D}/{base}-{i+1}.jpg", quality=84, optimize=True, progressive=True); print(f"{base}-{i+1}.jpg", part.size)
ringan("beranda-hp.png", "beranda-hp")
ringan("beranda-desktop.png", "beranda-desktop")
ringan("tipe-santri-hp.png", "tipe-santri-hp")
