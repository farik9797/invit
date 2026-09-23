"""Снимки с invit.by для карточек, у которых в выгрузке фото нет.

Выгрузка поставщика покрывает не всё: часть позиций пришла без снимка, хотя
на сайте клиента он есть. Скрипт скачивает такие кадры в files/images и
прописывает имя файла в колонку Images рабочей выгрузки — дальше их подхватит
build-catalog.py.

Запуск: python3 scripts/fetch-invit-photos.py
Читает: files/invit-site.json, src/data/siteCatalogSource.ts
Пишет: files/images/*.jpg и files/woocommerce_import_variations.csv
"""
import csv, json, re, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'files' / 'invit-site.json'
SOURCE = ROOT / 'src/data/siteCatalogSource.ts'
CSV_FILE = ROOT / 'files' / 'woocommerce_import_variations.csv'
IMAGES = ROOT / 'files' / 'images'
BACKUP = CSV_FILE.with_suffix('.csv.before-invit-photos')

UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/131.0 Safari/537.36'}

TRANSLIT = {'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
            'ю': 'yu', 'я': 'ya'}


def slugify(text):
    out = ''.join(TRANSLIT.get(ch, ch) for ch in text.lower())
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', out)).strip('-')


def titles_with_photo():
    """Названия карточек invit.by и адрес их снимка."""
    source = SOURCE.read_text(encoding='utf-8')
    ident = {}
    for name, body in re.findall(r"id:\s*'([^']+)'(.*?)(?=\n  \{|\Z)", source, re.S):
        url = re.search(r"sourceUrl:\s*'([^']+)'", body)
        title = re.search(r"title:\s*'((?:[^'\\]|\\.)*)'", body)
        if url and title:
            ident[url.group(1).rstrip('/')] = title.group(1).replace("\\'", "'")
    site = json.loads(SITE.read_text(encoding='utf-8'))['products']
    found = {}
    for url, product in site.items():
        title = ident.get(url.rstrip('/')) or product['title']
        if product['images']:
            found[' '.join(title.split())] = product['images'][0]
    return found


def main():
    photos = titles_with_photo()
    with CSV_FILE.open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        fields, rows = reader.fieldnames, list(reader)

    IMAGES.mkdir(parents=True, exist_ok=True)
    added = []
    for row in rows:
        if row['Images'].strip():
            continue
        url = photos.get(' '.join(row['Name'].split()))
        if not url:
            continue
        name = slugify(row['SKU'] or row['Name'])[:60] + Path(urllib.parse.urlsplit(url).path).suffix
        target = IMAGES / name
        if not target.exists():
            try:
                request = urllib.request.Request(url, headers=UA)
                with urllib.request.urlopen(request, timeout=30) as response:
                    target.write_bytes(response.read())
            except Exception as error:
                print(f'  ! {row["Name"][:50]}: {error}')
                continue
        row['Images'] = name
        added.append(row['Name'])

    if not added:
        print('нечего добавлять: у всех карточек с invit.by снимок уже есть')
        return

    if not BACKUP.exists():
        BACKUP.write_bytes(CSV_FILE.read_bytes())
    with CSV_FILE.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    print(f'снимков добавлено: {len(added)}')
    for name in added:
        print('  ', name[:70])


if __name__ == '__main__':
    main()
