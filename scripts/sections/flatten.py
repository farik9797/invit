"""Плоские силуэты из знаков клиента: WebP -> одноцветный SVG.

У знаков клиента есть светотень, поэтому рядом с плоскими векторами MDI они
смотрелись как два разных набора. Здесь тень убирается: берём альфа-канал,
трассируем его в один контур и рисуем сплошной заливкой.

Форма предмета (рулон, баллон, гайка) сохраняется, объём уходит — зато весь
набор становится однородным и красится currentColor.
"""
from PIL import Image, ImageFilter
import numpy as np, pathlib, subprocess, re, sys

SRC = pathlib.Path('/Users/farik/claude/Projects/Invit/src/assets/sections')
OUT = pathlib.Path('out'); OUT.mkdir(exist_ok=True)
SCALE = 2          # больше — только длиннее координаты, на вид не влияет
BLUR = 1.2

def trace(mask_img, tmp):
    img = mask_img.resize((mask_img.width * SCALE, mask_img.height * SCALE), Image.BICUBIC)
    img = img.filter(ImageFilter.GaussianBlur(BLUR * SCALE / 2))
    img = img.point(lambda v: 0 if v > 127 else 255)   # potrace обводит чёрное
    img.convert('1').save(tmp)
    out = subprocess.run(
        ['potrace', tmp, '-b', 'svg', '-o', '-', '--flat',
         '-a', '1.4', '-O', '0.9', '-t', '20', '-u', '5'],
        capture_output=True, check=True).stdout.decode()
    d = re.search(r'<path[^>]*\sd="([^"]+)"', out)
    tr = re.search(r'transform="([^"]+)"', out)
    if not d:
        return None
    squash = lambda s: ' '.join(s.split())
    return squash(d.group(1)), squash(tr.group(1) if tr else '')

rows = []
for f in sorted(SRC.glob('*.webp')):
    im = Image.open(f).convert('RGBA')
    alpha = np.array(im)[..., 3]
    mask = Image.fromarray(np.where(alpha > 110, 255, 0).astype('uint8'), 'L')

    got = trace(mask, f'/tmp/{f.stem}.pbm')
    if not got:
        print('не обвелось:', f.stem); continue
    d, tr = got

    side = im.width * SCALE
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}">'
           f'<g transform="{tr}"><path fill="currentColor" d="{d}"/></g></svg>')
    (OUT / f'{f.stem}.svg').write_text(svg)
    rows.append((f.stem, len(d)))

print(f'готово: {len(rows)} знаков')
for name, n in rows:
    print(f'  {name:46s} {n//1000}k')
