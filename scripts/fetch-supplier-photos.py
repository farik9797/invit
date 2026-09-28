"""Снимки из интернет-магазина поставщика.

В архиве `by-full.zip` снимков хватило не на всё: часть позиций пришла из
других выгрузок, у части в архиве нет папки. Зато магазин поставщика держит
снимки по тому же коду OKDP, который есть в выгрузках:

    https://starfix.by/image/catalog/product/tools-by/<OKDP>/0.jpg

Первым заходом адрес собирается прямо из кода — искать ничего не нужно.
Вторым заходом остальное ищется по названию: магазин отдаёт карточку, из неё
берём адрес снимка. Обход магазину разрешён: в его robots.txt закрыты только
корзина и личный кабинет.

Запуск: python3 scripts/fetch-supplier-photos.py [сколько-позиций]
Скрипт идемпотентен: строки, где фото уже есть, пропускаются.
"""
import csv, gzip, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WOO = ROOT / 'files/woocommerce_import_variations.csv'
IMAGES = ROOT / 'files/images'
BACKUP = WOO.with_suffix('.csv.before-supplier-photos')
SHOP = 'https://starfix.by/image/catalog/product/tools-by'
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/122.0 Safari/537.36')

# Выгрузки поставщика: где искать пару «артикул — код OKDP».
# csv с ';' — старый формат (ARTIKUL/OKDP), с табом — новый (vendor_code/okdp).
SOURCES = [
    ('files/export_old_2026-09-01.csv', ';', 'ARTIKUL', 'OKDP'),
    ('files/Круги_буры_оснастка.csv', '\t', 'vendor_code', 'okdp'),
    ('files/Заглушки_такелаж.csv', '\t', 'vendor_code', 'okdp'),
]
EXCEL = [('files/Болты_гайки_шайбы_2026-09-17.xlsx', 'ARTIKUL', 'OKDP')]

# Больше четырёх снимков на карточку витрине не нужно
MAX_PHOTOS = 4


def file_name(sku, number):
    """Имя файла из артикула: у части позиций в нём слэш («134716/146688»),
    и путь уезжал в несуществующую папку."""
    return f"{sku.replace('/', '-')}-{number}.jpg"


def plain(value):
    if value is None:
        return ''
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip()


def codes():
    out = {}
    csv.field_size_limit(10 ** 7)
    for name, sep, sku_key, code_key in SOURCES:
        path = ROOT / name
        if not path.exists():
            print(f'нет файла: {name}')
            continue
        with path.open(encoding='utf-8-sig', errors='replace', newline='') as f:
            for row in csv.DictReader(f, delimiter=sep):
                sku, code = plain(row.get(sku_key)), plain(row.get(code_key))
                if sku and code:
                    out.setdefault(sku, code)

    from openpyxl import load_workbook
    for name, sku_key, code_key in EXCEL:
        path = ROOT / name
        if not path.exists():
            continue
        rows = load_workbook(path, read_only=True).active.iter_rows(values_only=True)
        header = [plain(h) for h in next(rows)]
        for line in rows:
            row = dict(zip(header, line))
            sku, code = plain(row.get(sku_key)), plain(row.get(code_key))
            if sku and code:
                out.setdefault(sku, code)
    return out


def page(url):
    """HTML страницы магазина. Просим gzip: страница с меню весит 3 МБ, сжатая — 200 КБ."""
    request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip'})
    with urllib.request.urlopen(request, timeout=40) as response:
        raw = response.read()
        if response.headers.get('Content-Encoding') == 'gzip':
            raw = gzip.decompress(raw)
        return raw.decode('utf-8', 'replace')


def title(text):
    """Название к сравнимому виду: без скобок с фасовкой и без знаков препинания."""
    plain = re.sub(r'\([^)]*\)', ' ', text.lower())
    return ' '.join(re.sub(r'[^\w\s.,х-]', ' ', plain).split())


CARD = re.compile(r'product-item__image">\s*<a href="[^"]+">\s*<img src="([^"]+)"[^>]*alt="([^"]*)"')


def original(url):
    """Адрес полного снимка: витрина отдаёт уменьшенную копию из /image/cache."""
    return re.sub(r'-\d+x\d+(\.\w+)$', r'\1', url.replace('/image/cache/', '/image/'))


def search(name):
    """Снимок позиции, найденной в магазине по названию."""
    query = ' '.join(re.sub(r'\([^)]*\)', ' ', name).split())[:60]
    url = 'https://starfix.by/index.php?route=product/search&' + urllib.parse.urlencode({'search': query})
    try:
        html = page(url)
    except Exception as exc:
        print('   поиск:', exc)
        return ''
    want = title(name)[:30]
    for image, found in CARD.findall(html):
        if title(found)[:30] == want:
            return image
    return ''


def fetch(url):
    # В адресе снимка сидит код позиции кириллицей («ЦБ-0095369400») — без
    # экранирования urllib роняет запрос на ascii.
    parts = urllib.parse.urlsplit(url)
    url = urllib.parse.urlunsplit(parts._replace(path=urllib.parse.quote(parts.path)))
    request = urllib.request.Request(url, headers={'User-Agent': UA, 'Referer': 'https://starfix.by/'})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.headers.get('Content-Type', '').startswith('image/'):
                return response.read()
    except urllib.error.HTTPError:
        return None
    except Exception as exc:
        print('   сеть:', exc)
    return None


def photos_for(code, sku):
    """Снимки позиции: 0.jpg, 1.jpg… пока магазин их отдаёт."""
    names = []
    for number in range(MAX_PHOTOS):
        target = IMAGES / file_name(sku, number + 1)
        if target.exists():
            names.append(target.name)
            continue
        data = fetch(f'{SHOP}/{code}/{number}.jpg')
        if not data:
            break
        target.write_bytes(data)
        names.append(target.name)
        time.sleep(0.2)
    return names


def main():
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    IMAGES.mkdir(exist_ok=True)

    code_of = codes()
    print(f'артикулов с кодом: {len(code_of)}')

    csv.field_size_limit(10 ** 7)
    with WOO.open(encoding='utf-8-sig', newline='') as f:
        rows = list(csv.DictReader(f))
    columns = list(rows[0].keys())

    empty = [r for r in rows if not r['Images'].strip()]
    todo = [r for r in empty if code_of.get(r['SKU'].strip())]
    if limit:
        todo = todo[:limit]
    print(f'без фото: {len(empty)}, из них с кодом: {len(todo)}')

    filled = 0
    for number, row in enumerate(todo, 1):
        sku = row['SKU'].strip()
        names = photos_for(code_of[sku], sku)
        if names:
            row['Images'] = ', '.join(names)
            filled += 1
        if number % 100 == 0:
            print(f'   {number}/{len(todo)}: снимков {filled}')

    # Вторым заходом — поиск по названию: у оснастки код в магазине другой,
    # но карточка находится по имени, а в ней тот же снимок.
    rest = [r for r in rows if not r['Images'].strip()]
    if limit:
        rest = rest[:limit]
    print(f'ищем по названию: {len(rest)}')

    found = 0
    for number, row in enumerate(rest, 1):
        link = search(row['Name'])
        if link:
            data = fetch(original(link)) or fetch(link)
            if data:
                name = file_name(row['SKU'].strip(), 1)
                (IMAGES / name).write_bytes(data)
                row['Images'] = name
                found += 1
        time.sleep(0.3)
        if number % 100 == 0:
            print(f'   {number}/{len(rest)}: снимков {found}')
    filled += found
    print(f'по названию найдено: {found}')

    if filled:
        if not BACKUP.exists():
            BACKUP.write_bytes(WOO.read_bytes())
        with WOO.open('w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=columns, lineterminator='\r\n')
            writer.writeheader()
            writer.writerows(rows)

    print(f'добавлено: {filled} из {len(todo)}')
    print(f'осталось без снимка: {len(empty) - filled}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
