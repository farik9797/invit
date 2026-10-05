#!/usr/bin/env python3
"""Выгрузка каталога в CSV для встроенного импортёра WooCommerce.

Берём то же, что показывает сайт: src/data/catalog.generated.ts (товары, цены,
разделы, общие снимки) и src/data/catalogDescriptions.ts (подробные описания).
Снимки отдаём ссылками на GitHub Pages — импортёр Woo скачивает их сам и
кладёт в медиатеку, поэтому заливать картинки по FTP отдельно не нужно.

Файлы режем на части по 1000 строк: на общем хостинге с memory_limit 64M
импорт одним куском из восьми тысяч позиций не доходит до конца.

    python3 scripts/export-woocommerce.py

Результат: files/woocommerce-export/invit-products-01.csv и далее.
"""

import csv
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GENERATED = ROOT / 'src/data/catalog.generated.ts'
DESCRIPTIONS = ROOT / 'src/data/catalogDescriptions.ts'
OUT_DIR = ROOT / 'files/woocommerce-export'

# Снимки лежат рядом с нынешним сайтом; импортёр Woo берёт их по ссылке.
PHOTO_BASE = 'https://farik9797.github.io/invit/products'

CHUNK = 1000

COLUMNS = [
    'ID', 'Type', 'SKU', 'Name', 'Published', 'Is featured?',
    'Visibility in catalog', 'Short description', 'Description',
    'In stock?', 'Stock', 'Regular price', 'Categories', 'Tags', 'Images',
    'Attribute 1 name', 'Attribute 1 value(s)', 'Attribute 1 visible', 'Attribute 1 global',
    'Attribute 2 name', 'Attribute 2 value(s)', 'Attribute 2 visible', 'Attribute 2 global',
]


def read_literal(text, name, opener):
    """Достаёт JSON-литерал экспорта `name` из .ts-файла."""
    close = ']' if opener == '[' else '}'
    pattern = 'export const ' + name + r'[^=]*= (' + re.escape(opener) + '.*?' + re.escape(close) + ');'
    match = re.search(pattern, text, re.S)
    if not match:
        raise SystemExit(f'не нашёл {name}')
    return json.loads(match.group(1))


def path_of(section, sub):
    """Путь категории для Woo: несколько категорий он делит по запятой, поэтому
    запятую внутри названия («Клинья, заглушки») экранируем обратным слэшем —
    так её понимает и встроенный импортёр, и наш scripts/wp-import-products.php."""
    return f"{section.replace(',', chr(92) + ',')} > {sub.replace(',', chr(92) + ',')}"


def spec(product, label):
    for item in product.get('specs', []):
        if item['label'] == label:
            return item['value']
    return ''


def main():
    generated = GENERATED.read_text(encoding='utf-8')
    products = read_literal(generated, 'RAW_PRODUCTS', '[')
    sections = read_literal(generated, 'CATEGORIES', '[')
    prices = read_literal(generated, 'PRICES', '[')
    shared = read_literal(generated, 'SHARED_PHOTOS', '{')
    descriptions = read_literal(DESCRIPTIONS.read_text(encoding='utf-8'), 'DESCRIPTIONS', '{')

    # Русские имена разделов: в CSV Woo категории пишутся «Раздел > Подраздел».
    section_name = {}
    sub_name = {}
    for section in sections:
        section_name[section['slug']] = section['name']
        for sub in section['subcategories']:
            sub_name[sub['slug']] = sub['name']

    rows = []
    for index, product in enumerate(products):
        pid = product['id']

        categories = [path_of(section_name[product['categorySlug']], sub_name[product['subcategorySlug']])]
        # Вторая прописка: товар виден сразу в двух подразделах, карточка одна.
        if product.get('alsoCategorySlug'):
            categories.append(path_of(section_name[product['alsoCategorySlug']],
                                      sub_name[product['alsoSubcategorySlug']]))

        # Снимок свой или общий — так же, как его выбирает витрина сайта.
        photo_id = pid if product.get('photo') else shared.get(pid, '')
        image = f'{PHOTO_BASE}/{photo_id}.webp' if photo_id else ''

        short = product.get('description', '').strip()
        full = descriptions.get(pid, short)
        # Описания хранятся простым текстом: в Woo отдаём абзацами.
        body = ''.join(f'<p>{html.escape(line.strip())}</p>'
                       for line in full.split('\n') if line.strip())

        price = prices[index] if index < len(prices) and prices[index] else ''

        rows.append({
            'ID': '',
            'Type': 'simple',
            'SKU': spec(product, 'Артикул') or pid,
            'Name': product['title'],
            'Published': 1,
            'Is featured?': 0,
            'Visibility in catalog': 'visible',
            'Short description': short,
            'Description': body,
            'In stock?': 1,
            'Stock': '',
            'Regular price': price,
            'Categories': ', '.join(categories),
            'Tags': 'Собственное производство' if product.get('badge') else '',
            'Images': image,
            'Attribute 1 name': 'Бренд',
            'Attribute 1 value(s)': spec(product, 'Бренд'),
            'Attribute 1 visible': 1,
            'Attribute 1 global': 1,
            'Attribute 2 name': 'Страна',
            'Attribute 2 value(s)': spec(product, 'Страна'),
            'Attribute 2 visible': 1,
            'Attribute 2 global': 1,
        })

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob('invit-products-*.csv'):
        old.unlink()

    parts = 0
    for start in range(0, len(rows), CHUNK):
        parts += 1
        path = OUT_DIR / f'invit-products-{parts:02d}.csv'
        with path.open('w', encoding='utf-8-sig', newline='') as handle:
            writer = csv.DictWriter(handle, fieldnames=COLUMNS)
            writer.writeheader()
            writer.writerows(rows[start:start + CHUNK])

    with_price = sum(1 for row in rows if row['Regular price'] != '')
    with_photo = sum(1 for row in rows if row['Images'])
    print(f'товаров: {len(rows)}')
    print(f'  с ценой: {with_price}')
    print(f'  со снимком: {with_photo}')
    print(f'  во второй прописке: {sum(1 for r in rows if r["Categories"].count(">") > 1)}')
    print(f'файлов: {parts} (по {CHUNK} строк) в {OUT_DIR.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
