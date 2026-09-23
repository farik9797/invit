"""Сканы сертификатов с invit.by в src/assets/certificates.

Документы лежат в галерее старого сайта (Документы -> Сертификаты). Сайт
заменяется новым, поэтому сканы держим у себя: страница документации читает
их из src/assets/certificates по идентификатору карточки (cert-1 … cert-N).

Рядом кладём и оригинал JPEG: со страницы документ можно скачать и отправить
дальше, а webp открывается не везде.

Скрипт сверяет список на сайте со списком в catalogData.ts и называет
документы, которых у нас нет.

Запуск: python3 scripts/fetch-certificates.py
Читает: files/invit-site.json (его наполняют fetch/parse-invit-site.py)
Пишет: src/assets/certificates/cert-*.webp и public/docs/certificates/cert-*.jpg
"""
import io, json, re, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'files' / 'invit-site.json'
DATA = ROOT / 'src/data/catalogData.ts'
OUT = ROOT / 'src/assets/certificates'
FULL = ROOT / 'public/docs/certificates'   # оригиналы для скачивания
GALLERY = 'https://invit.by/sertifikaty'

UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/131.0 Safari/537.36'}

# Сканы квадратные 700x700 — это и есть оригиналы, крупнее на сайте нет.
QUALITY = 90


def key(text):
    """Название к сравнимому виду: без кавычек, регистра и лишних знаков."""
    return ' '.join(re.sub(r'[^a-zа-я0-9]+', ' ', text.lower().replace('ё', 'е')).split())


def score(a, b):
    """Насколько названия похожи: доля общих слов, короткие тоже считаются.

    Без них «Техническое свидетельство на НЛ» и «… на ПЭС» неразличимы — вся
    разница в двухбуквенной марке ленты.
    """
    first, second = set(key(a).split()), set(key(b).split())
    return len(first & second) / max(len(first | second), 1)


def ours():
    """Карточки документов из catalogData.ts: идентификатор и название."""
    block = re.search(r'export const CERTIFICATES.*?\n\];', DATA.read_text(encoding='utf-8'), re.S)
    return re.findall(r"id: '([^']+)',\s*\n\s*title: '((?:[^'\\]|\\.)*)'", block.group(0))


def main():
    gallery = json.loads(SITE.read_text(encoding='utf-8'))['pages'][GALLERY]['gallery']
    cards = ours()
    OUT.mkdir(parents=True, exist_ok=True)
    FULL.mkdir(parents=True, exist_ok=True)

    # Пары «карточка — скан» по убыванию похожести: скан достаётся одной
    # карточке, иначе однокоренные названия разбирают один и тот же файл.
    pairs = sorted(((score(title, item['title']), ident, title, item)
                    for ident, title in cards for item in gallery),
                   key=lambda row: -row[0])
    chosen, taken = {}, set()
    for value, ident, title, item in pairs:
        if value < 0.3 or ident in chosen or item['url'] in taken:
            continue
        chosen[ident] = (title, item)
        taken.add(item['url'])

    for ident, title in cards:
        if ident not in chosen:
            print(f'  ! {title[:50]}: на сайте не нашёлся')
            continue
        _, item = chosen[ident]
        request = urllib.request.Request(item['url'], headers=UA)
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read()
        with Image.open(io.BytesIO(raw)) as scan:
            scan.convert('RGB').save(OUT / f'{ident}.webp', 'WEBP', quality=QUALITY, method=6)
        (FULL / f'{ident}.jpg').write_bytes(raw)
        size = (OUT / f'{ident}.webp').stat().st_size // 1024
        print(f'  {ident}: {item["title"][:46]} — {size} КБ + оригинал {len(raw) // 1024} КБ')

    missing = [i['title'] for i in gallery if i['url'] not in taken]
    print(f'на сайте: {len(gallery)}, у нас: {len(cards)}, скачано: {len(taken)}')
    if missing:
        print('нет карточки в catalogData.ts:')
        for title in missing:
            print('   -', title)


if __name__ == '__main__':
    main()
