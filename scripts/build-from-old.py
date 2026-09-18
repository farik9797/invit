"""Позиции из «старой» выгрузки поставщика в сведённый импорт.

Формат этой выгрузки отличается от остальных: разделы тремя колонками
PARENTID_NAME0..2, название в NAIMEN, артикул в ARTIKUL, характеристики
в XARAKT. Поэтому отдельный разбор, а не build-osnastka.py.

Берём не всё подряд, а то, что просит клиент: отбор по куску названия.

    python3 scripts/build-from-old.py "PT5" "Крепёж > Саморез кровельный"

Цена — рекомендованная розничная (REKOMEND_CENA). Там, где поставщик её не
дал, оставляем пусто: в карточке будет «цена по запросу». Оптовую без НДС
подставлять нельзя — это другая цена, и покупателю она не адресована.

Фото берём из by-full.zip по коду OKDP: папка архива названа этим же кодом.

Скрипт идемпотентен: известные артикулы пропускаются.
"""
import csv, html, re, shutil, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HERE = ROOT / 'files'
SRC = HERE / 'export_old_2026-09-01.csv'
WOO = HERE / 'woocommerce_import_variations.csv'
ARCHIVE = HERE / 'by-full.zip'
IMAGES = HERE / 'images'


def get(row, key):
    return (row.get(key) or '').strip()


def as_html(text):
    lines = [line.strip() for line in str(text).splitlines()]
    return ''.join(f'<p>{html.escape(line)}</p>' for line in lines if line)


def num(value, factor=1, digits=2):
    raw = str(value).replace(',', '.').strip()
    try:
        value = round(float(raw) * factor, digits)
    except ValueError:
        return ''
    return f'{value:g}' if value else ''


def photos_for(archive, code, sku):
    """Снимки товара из архива под именем артикула. Пусто — значит их там нет."""
    if not code:
        return []
    entries = sorted(n for n in archive.namelist()
                     if n.startswith(f'{code}/') and n.lower().endswith(('.jpg', '.jpeg', '.png')))
    names = []
    for n, entry in enumerate(entries, 1):
        name = f'{sku}-{n}.jpg'
        target = IMAGES / name
        if not target.exists():
            with archive.open(entry) as src, target.open('wb') as dst:
                shutil.copyfileobj(src, dst)
        names.append(name)
    return names


def to_woo(row, columns, archive):
    sku = get(row, 'ARTIKUL')
    values = {
        'Type': 'simple',
        'SKU': sku,
        'Name': get(row, 'NAIMEN'),
        'Published': '1',
        'Is featured?': '0',
        'Visibility in catalog': 'visible',
        'Short description': '',
        'Description': as_html(get(row, 'XARAKT')),
        'Tax status': 'taxable',
        'Tax class': '',
        'In stock?': '1',
        'Weight (kg)': num(get(row, 'VESB'), digits=3),
        # Габариты у поставщика в метрах, в выгрузке — в сантиметрах
        'Length (cm)': num(get(row, 'DLINA'), factor=100),
        'Width (cm)': num(get(row, 'SHIRINA'), factor=100),
        'Height (cm)': num(get(row, 'VISOTA'), factor=100),
        'Regular price': num(get(row, 'REKOMEND_CENA')),
        'Categories': TARGET,
        'Tags': '',
        'Images': ', '.join(photos_for(archive, get(row, 'OKDP'), sku)),
        'Attribute 1 name': 'Бренд',
        'Attribute 1 value(s)': get(row, 'BRAND'),
        'Attribute 1 visible': '1',
        'Attribute 1 global': '0',
        'Attribute 2 name': 'Страна',
        'Attribute 2 value(s)': get(row, 'STRANA'),
        'Attribute 2 visible': '1',
        'Attribute 2 global': '0',
    }
    return {column: values.get(column, '') for column in columns}


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 1
    global TARGET
    needle, TARGET = sys.argv[1], sys.argv[2]

    IMAGES.mkdir(exist_ok=True)
    supplier = list(csv.DictReader(open(SRC, encoding='utf-8-sig'), delimiter=';'))
    picked = [r for r in supplier if needle.lower() in get(r, 'NAIMEN').lower()]

    rows = list(csv.DictReader(open(WOO, encoding='utf-8-sig')))
    columns = list(rows[0].keys())
    known = {r['SKU'].strip() for r in rows}

    archive = zipfile.ZipFile(ARCHIVE)
    added, skipped = [], 0
    for row in picked:
        sku = get(row, 'ARTIKUL')
        if not sku or sku in known:
            skipped += 1
            continue
        added.append(to_woo(row, columns, archive))
        known.add(sku)

    if added:
        with open(WOO, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=columns, lineterminator='\r\n')
            writer.writeheader()
            writer.writerows(rows + added)

    print(f'в выгрузке          : {len(supplier)}')
    print(f'подошло по «{needle}» : {len(picked)}')
    print(f'добавлено           : {len(added)} (уже были: {skipped})')
    print(f'с ценой             : {sum(1 for r in added if r["Regular price"])}')
    print(f'со снимком          : {sum(1 for r in added if r["Images"])}')
    print(f'→ {WOO.relative_to(ROOT)}: {len(rows)} + {len(added)} = {len(rows) + len(added)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
