"""Снимки разделов от клиента в вид, пригодный для витрины.

Присылают их кадром 1600×1200, где сам товар занимает четверть по центру,
а остальное — белое поле. На плитке 48px от такого кадра остаётся точка,
поэтому поле срезаем по краю непрозрачного содержимого и ужимаем до 600px.

Запуск: python3 scripts/make-section-photos.py
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src/assets/section-photos'
SIZE = 600
QUALITY = 82

# Файл от клиента -> адрес раздела в каталоге
SOURCES = {
    'Downloads/01_materialy_dlya_montazha_okon.jpg': 'materialy-dlya-okon',
    'Downloads/02_germetiki.jpg': 'germetiki',
    'Downloads/03_klei_himiya_smazki.jpg': 'kley-himiya-smazki',
    'Downloads/04_uplotnitelnye_lenty_PGS.jpg': 'uplotnitelnye-lenty-pes-samokleyaschiesy',
}


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
    home = Path.home()

    for source, slug in SOURCES.items():
        path = home / source
        if not path.exists():
            print(f'нет файла: {path}')
            continue

        image = Image.open(path).convert('RGB')
        cropped = trimmed(image)
        cropped.thumbnail((SIZE, SIZE), Image.LANCZOS)
        target = OUT / f'{slug}.webp'
        cropped.save(target, 'WEBP', quality=QUALITY, method=6)
        print(f'{path.name} {image.size} -> {cropped.size} {target.relative_to(ROOT)}'
              f' ({target.stat().st_size // 1024} КБ)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
