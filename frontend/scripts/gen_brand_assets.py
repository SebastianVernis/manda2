#!/usr/bin/env python3
"""Genera los activos de marca de YEGA a partir del wordmark vectorial.

Produce favicons, iconos PWA, imagen Open Graph y wordmarks PNG con fondo
transparente. Requiere cairosvg + Pillow.

    python3 scripts/gen_brand_assets.py
"""
import os
from PIL import Image, ImageDraw
import cairosvg

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "public", "images", "yega-dark.svg")   # wordmark negro, transparente
PUB = os.path.join(BASE, "public")
IMG = os.path.join(PUB, "images")

NEGRO = (11, 11, 11, 255)


def wordmark_blanco(width=1856):
    """Wordmark en blanco sobre transparente."""
    tmp = "/tmp/_wm.png"
    cairosvg.svg2png(url=SRC, write_to=tmp, output_width=width)
    im = Image.open(tmp).convert("RGBA")
    alpha = im.split()[-1]
    blanco = Image.new("RGBA", im.size, (255, 255, 255, 255))
    blanco.putalpha(alpha)
    return blanco.crop(alpha.getbbox())


def wordmark_negro(width=1856):
    tmp = "/tmp/_wm2.png"
    cairosvg.svg2png(url=SRC, write_to=tmp, output_width=width)
    im = Image.open(tmp).convert("RGBA")
    return im.crop(im.split()[-1].getbbox())


def monograma(wm):
    """Primera letra del wordmark (la Y), recortada."""
    a = wm.split()[-1]
    w, h = wm.size
    runs, ini = [], None
    for x in range(w):
        lleno = any(a.getpixel((x, y)) > 40 for y in range(0, h, 2))
        if lleno and ini is None:
            ini = x
        elif not lleno and ini is not None:
            runs.append((ini, x)); ini = None
    if ini is not None:
        runs.append((ini, w))
    runs = [r for r in runs if r[1] - r[0] > 4]
    x0, x1 = runs[0]
    return wm.crop((x0, 0, x1, h))


def icono(marca, size, fondo=NEGRO, alto_rel=0.52):
    """Icono cuadrado con la marca centrada."""
    lienzo = Image.new("RGBA", (size, size), fondo)
    h = int(size * alto_rel)
    w = int(marca.width * h / marca.height)
    m = marca.resize((w, h), Image.LANCZOS)
    lienzo.alpha_composite(m, ((size - w) // 2, (size - h) // 2))
    return lienzo


def main():
    wm = wordmark_blanco()
    wm_n = wordmark_negro()
    y = monograma(wm)

    wm.save(os.path.join(IMG, "yega-white.png"))
    wm_n.save(os.path.join(IMG, "yega-black.png"))
    y.save(os.path.join(IMG, "yega-monogram-white.png"))

    # favicons (la Y, legible a tamaños chicos)
    for s in (16, 32, 48, 96):
        icono(y, s, alto_rel=0.62).save(os.path.join(PUB, f"favicon-{s}x{s}.png"))
    icono(y, 256, alto_rel=0.62).save(
        os.path.join(PUB, "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

    # Apple / PWA
    icono(y, 180, alto_rel=0.58).convert("RGB").save(os.path.join(PUB, "apple-touch-icon.png"))
    for s in (192, 512):
        icono(y, s, alto_rel=0.58).save(os.path.join(PUB, f"android-chrome-{s}x{s}.png"))

    # Open Graph 1200x630 con el wordmark completo
    og = Image.new("RGBA", (1200, 630), (11, 11, 11, 255))
    d = ImageDraw.Draw(og)
    for y0 in range(630):                      # degradado sutil
        t = y0 / 629
        d.line([(0, y0), (1200, y0)], fill=(int(11 + 18 * t), int(11 + 18 * t), int(11 + 20 * t), 255))
    ancho = 660
    alto = int(wm.height * ancho / wm.width)
    og.alpha_composite(wm.resize((ancho, alto), Image.LANCZOS), ((1200 - ancho) // 2, (630 - alto) // 2))
    og.convert("RGB").save(os.path.join(PUB, "og-image.png"), quality=92)

    print("listo:")
    for f in ("yega-white.png", "yega-black.png", "yega-monogram-white.png"):
        print("  images/" + f)
    for f in ("favicon.ico", "favicon-16x16.png", "favicon-32x32.png", "favicon-48x48.png",
              "favicon-96x96.png", "apple-touch-icon.png", "android-chrome-192x192.png",
              "android-chrome-512x512.png", "og-image.png"):
        print(f"  {f}  {os.path.getsize(os.path.join(PUB, f)):,} bytes")


if __name__ == "__main__":
    main()
