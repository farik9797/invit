"""Баннеры для слайдера главной из фотографий клиента.

Слайдер тёмный: слева на кадр ложится градиент и белый текст. Поэтому левая
часть баннера — фирменный тёмно-синий, справа — снимок продукции, между ними
косая граница с синей и оранжевой полосой. Тот же приём, что на баннерах,
которые прислал клиент, только вывернутый: у него светлый фон и фото справа,
здесь фон тёмный, иначе текст слайда лёг бы на белое.

Ленту нельзя дорисовывать: прежние кадры слайдера были красивы, но продукция и
марка на них выдуманы — на одном по ленте шла нечитаемая кириллица под видом
надписи EUROBAND. Здесь только снимки клиента и заливка.

Снимки берутся из `files/photos/` — там съёмка продукции, которую прислал
клиент.

Запуск: python3 scripts/make-hero-banner.py
"""
import pathlib, sys
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).parent.parent
PHOTOS = ROOT / 'files/photos'      # съёмка продукции клиента, вне репозитория
OUT = ROOT / 'src/assets/hero'

W, H = 1920, 1080

NAVY = (22, 44, 88)            # --color-brand-navy, тот же, что фон слайдера
BLUE = (13, 93, 160)           # синий с баннеров клиента
ORANGE = (254, 123, 9)         # оранжевый оттуда же

# Косая граница: сверху правее, снизу левее — как на баннерах клиента.
EDGE_TOP, EDGE_BOTTOM = 0.46, 0.28

BANNERS = [
    ('_S4A8882.jpg', 'euroband-range.webp'),      # «Монтажный шов окна»
    ('_S4A8945 корр.jpg', 'alu-butyl-rolls.webp'),  # «Сэндвич-панели и профлист»
    ('_S4A8025.jpg', 'tape-range.webp'),          # «Уплотнительные и герметизирующие ленты»
    ('64.JPG', 'pes-tape-rolls.webp'),            # «Стык плит и панелей»
    ('_S4A8870.jpg', 'butyl-tape-roll.webp'),     # «Стыки оснований и покрытий»
    ('_S4A8904.jpg', 'psul-euroband.webp'),       # «Саморасширяющаяся лента ПСУЛ»
]

# Снимки без фирменной подачи: в мозаике разделов на /v2 фото лежит под
# затемнением и своим заголовком, косая граница там была бы лишней деталью.
PLAIN = [
    ('_S4A8910.jpg', 'euroband-rolls-photo.webp'),
]


def cover(photo, box_w, box_h):
    """Вписать снимок в область по большей стороне, лишнее обрезать."""
    scale = max(box_w / photo.width, box_h / photo.height)
    size = (round(photo.width * scale), round(photo.height * scale))
    photo = photo.resize(size, Image.LANCZOS)
    left = (size[0] - box_w) // 2
    top = (size[1] - box_h) // 2
    return photo.crop((left, top, left + box_w, top + box_h))


def bar(draw, shift, width, color):
    """Полоса вдоль косой границы, сдвинутая влево на `shift` пикселей."""
    x_top, x_bot = EDGE_TOP * W - shift, EDGE_BOTTOM * W - shift
    draw.polygon([(x_top, -20), (x_top + width, -20),
                  (x_bot + width, H + 20), (x_bot, H + 20)], fill=color)


def build(source, target):
    # Снимок вписываем в саму область справа от границы, а не в весь холст:
    # иначе кадр обрезался по центру полотна и в видимую часть попадал один
    # рулон во весь экран.
    box_left = round(EDGE_BOTTOM * W)
    with Image.open(PHOTOS / source) as raw:
        photo = cover(raw.convert('RGB'), W - box_left, H)

    canvas = Image.new('RGB', (W, H), NAVY)

    # Маска: фото живёт правее косой границы
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).polygon(
        [(EDGE_TOP * W, 0), (W, 0), (W, H), (EDGE_BOTTOM * W, H)], fill=255)
    canvas.paste(photo, (box_left, 0), mask.crop((box_left, 0, W, H)))

    draw = ImageDraw.Draw(canvas)
    bar(draw, 0, 14, BLUE)        # кромка самой границы
    bar(draw, 46, 30, BLUE)       # широкая синяя
    bar(draw, 92, 18, ORANGE)     # тонкая оранжевая

    canvas.save(OUT / target, 'WEBP', quality=84, method=6)
    return (OUT / target).stat().st_size // 1024


def plain(source, target, width=1600):
    """Снимок как есть, только уменьшенный: для мозаики и карточек."""
    with Image.open(PHOTOS / source) as raw:
        photo = raw.convert('RGB')
        height = round(photo.height * width / photo.width)
        photo.resize((width, height), Image.LANCZOS).save(
            OUT / target, 'WEBP', quality=84, method=6)
    return (OUT / target).stat().st_size // 1024


def main():
    for source, target in BANNERS:
        if not (PHOTOS / source).exists():
            print(f'нет снимка: {source}')
            continue
        print(f'{target}: {W}x{H}  {build(source, target)} КБ')
    for source, target in PLAIN:
        if not (PHOTOS / source).exists():
            print(f'нет снимка: {source}')
            continue
        print(f'{target}: без подачи, {plain(source, target)} КБ')
    return 0


if __name__ == '__main__':
    sys.exit(main())
