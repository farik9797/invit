"""Векторизация спрайта invit.by: 17 ячеек 25x25 -> SVG в две тоновые заливки.

Растр 25px сам по себе ступенчатый, поэтому перед трассировкой ячейку
увеличиваем и размываем: potrace тогда кладёт кривую по сглаженной границе,
а не по «лесенке» исходных пикселей.
"""
import subprocess, re, pathlib
from PIL import Image, ImageFilter
import numpy as np

CELL = 25
SCALE = 20
BLUR = SCALE / 2.4       # сглаживание лесенки
LIGHT_CUT = 118          # граница тёмного корпуса и светлого торца
PAD = 0.6                # поле вокруг знака, в пикселях исходного масштаба

im = Image.open('sprite.png').convert('RGBA')
a = np.array(im)

def mask_to_pbm(mask, path):
    img = Image.fromarray((mask * 255).astype('uint8'), 'L')
    img = img.resize((CELL * SCALE, CELL * SCALE), Image.BICUBIC)
    img = img.filter(ImageFilter.GaussianBlur(BLUR))
    img = img.point(lambda v: 0 if v > 127 else 255)   # potrace трассирует чёрное
    img.convert('1').save(path)

def trace(pbm):
    out = subprocess.run(
        ['potrace', pbm, '-b', 'svg', '-o', '-', '--flat',
         '-a', '1.5', '-O', '0.6', '-t', '12', '-u', '10'],
        capture_output=True, check=True).stdout.decode()
    d = re.search(r'<path[^>]*\sd="([^"]+)"', out)
    tr = re.search(r'transform="([^"]+)"', out)
    return (d.group(1), tr.group(1) if tr else '') if d else None

out_dir = pathlib.Path('out'); out_dir.mkdir(exist_ok=True)

for k in range(17):
    cell = a[k * CELL:(k + 1) * CELL]
    alpha = cell[..., 3] > 110
    luma = cell[..., :3].mean(axis=2)

    ys, xs = np.where(alpha)
    x0, x1 = xs.min() - PAD, xs.max() + 1 + PAD
    y0, y1 = ys.min() - PAD, ys.max() + 1 + PAD
    side = max(x1 - x0, y1 - y0)                    # квадратный кадр: знаки одного кегля
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    vb = (cx - side / 2, cy - side / 2, side, side)

    parts = []
    for mask, opacity in ((alpha & (luma < LIGHT_CUT), '1'),
                          (alpha & (luma >= LIGHT_CUT), '.4')):
        if mask.sum() < 3:
            continue
        mask_to_pbm(mask, f'/tmp/l{k}.pbm')
        got = trace(f'/tmp/l{k}.pbm')
        if not got:
            continue
        d, tr = got
        parts.append(f'<g transform="{tr}"><path fill="currentColor" fill-opacity="{opacity}" d="{d}"/></g>')

    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%.2f %.2f %.2f %.2f">%s</svg>'
           % (vb[0] * SCALE, vb[1] * SCALE, vb[2] * SCALE, vb[3] * SCALE, ''.join(parts)))
    (out_dir / f'cell-{k:02d}.svg').write_text(svg)
    print(f'ячейка {k}: слоёв {len(parts)}, {len(svg)} байт')
