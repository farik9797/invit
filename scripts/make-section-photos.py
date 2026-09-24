"""Снимки разделов от клиента в вид, пригодный для витрины.

Кладём исходники в `files/section-photos/<адрес раздела>.webp` — имя файла и
задаёт раздел. Первый набор пришёл кадром 1600×1200, где товар занимал
четверть по центру, поэтому белое поле срезаем по краю содержимого; у уже
обрезанных кадров это ничего не меняет. Ужимаем до 600px по большей стороне,
не растягивая мелкие.

Запуск: python3 scripts/make-section-photos.py
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / 'files/section-photos'
OUT = ROOT / 'src/assets/section-photos'
SIZE = 600
QUALITY = 85


def trimmed(image):
    """Кадр без белого поля по краям; небольшой отступ оставляем."""
    white = Image.new('RGB', image.size, (255, 255, 255))
    # add=-12 считает белым и то, что отличается от него на пару единиц:
    # у присланных кадров фон не ровно 255, а с лёгким градиентом.
    box = ImageChops.difference(image, white).convert('L').point(lambda v: 255 if v > 12 else 0).getbbox()
    if not box:
        return image
    pad = round(max(box[2] - box[0], box[3] - box[1]) * 0.03)
    return image.crop((
        max(box[0] - pad, 0), max(box[1] - pad, 0),
        min(box[2] + pad, image.width), min(box[3] + pad, image.height)
    ))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    if not SOURCES.exists():
        print(f'нет папки с исходниками: {SOURCES.relative_to(ROOT)}')
        return 1

    for path in sorted(SOURCES.iterdir()):
        if path.suffix.lower() not in ('.jpg', '.jpeg', '.png', '.webp'):
            continue

        image = Image.open(path).convert('RGB')
        cropped = trimmed(image)
        cropped.thumbnail((SIZE, SIZE), Image.LANCZOS)
        target = OUT / f'{path.stem}.webp'
        cropped.save(target, 'WEBP', quality=QUALITY, method=6)
        print(f'{path.name} {image.size} -> {cropped.size} {target.relative_to(ROOT)}'
              f' ({target.stat().st_size // 1024} КБ)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
