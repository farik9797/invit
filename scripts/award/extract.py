"""Вырезает знак «Лучший строительный продукт года 2013» из слайда invit.by.

Отдельного файла со знаком у клиента нет: он вшит в слайд
`image/cache/data/slides/slide-invit-euroband-1092x337.jpg` (лежит рядом как
`slide-source.jpg`). Знак находим по красным пикселям в верхней полосе кадра —
ниже начинается фото ленты, где тоже есть красновато-оранжевые точки.

Печать круглая, поэтому фон срезаем круговой маской. Маска на 3.5% уже кадра:
по самому краю печати остаётся полоска фона слайда, и на тёмной подложке она
читается серым ободком.

Результат: src/assets/awards/award-2013.webp, 240x240 с прозрачностью.
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import pathlib

SRC = pathlib.Path(__file__).with_name('slide-source.jpg')
OUT = pathlib.Path(__file__).resolve().parents[2] / 'src/assets/awards/award-2013.webp'

im = Image.open(SRC).convert('RGB')
a = np.array(im).astype(int)
red = (a[..., 0] > 140) & (a[..., 1] < 95) & (a[..., 2] < 95)

band = red[:160, 500:760]
ys = np.where(band.sum(axis=1) > 3)[0]
xs = np.where(band.sum(axis=0) > 3)[0]
x0, x1, y0, y1 = xs.min() + 500, xs.max() + 500, ys.min(), ys.max()

cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
side = max(x1 - x0, y1 - y0) + 4
crop = im.crop((round(cx - side / 2), round(cy - side / 2), round(cx + side / 2), round(cy + side / 2)))

SCALE = 3
big = crop.resize((crop.width * SCALE, crop.height * SCALE), Image.LANCZOS)
big = big.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=3))

inset = round(big.width * 0.035)
mask = Image.new('L', big.size, 0)
ImageDraw.Draw(mask).ellipse((inset, inset, big.width - inset - 1, big.height - inset - 1), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1.2))

out = Image.new('RGBA', big.size, (0, 0, 0, 0))
out.paste(big, (0, 0), mask)
out = out.crop(out.getbbox()).resize((240, 240), Image.LANCZOS)
out.save(OUT, quality=92, method=6)
print('сохранено:', OUT)
