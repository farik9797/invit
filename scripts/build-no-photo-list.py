"""Список позиций без снимка — на запрос снимков у поставщика.

Берёт собранный каталог и выписывает всё, у чего нет фото: артикул, название,
раздел и адрес страницы. По этому файлу можно просить снимки у поставщика
или у брендов, а потом сверять, что пришло.

Запуск: python3 scripts/build-no-photo-list.py
"""
import json, re, sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'src/data/catalog.generated.ts'
OUT = ROOT / 'files/товары-без-фото.xlsx'


def catalog():
    source = CATALOG.read_text(encoding='utf-8')
    cats = json.loads(re.search(r'export const CATEGORIES: Category\[\] = (\[.*?\]);\n', source, re.S).group(1))
    products = json.loads(re.search(r'export const RAW_PRODUCTS[^=]*= (\[.*?\]);\n', source, re.S).group(1))
    names = {c['slug']: c['name'] for c in cats}
    subs = {s['slug']: s['name'] for c in cats for s in c['subcategories']}
    return products, names, subs


def main():
    from openpyxl import Workbook
    from openpyxl.styles import Font

    products, names, subs = catalog()
    rows = [p for p in products if not p.get('photo')]

    book = Workbook()
    sheet = book.active
    sheet.title = 'Без фото'
    header = ['Артикул', 'Название', 'Раздел', 'Подраздел', 'Бренд', 'Страна', 'Адрес страницы']
    sheet.append(header)
    for cell in sheet[1]:
        cell.font = Font(bold=True)
    for column, width in zip('ABCDEFG', (18, 85, 34, 34, 16, 14, 60)):
        sheet.column_dimensions[column].width = width
    sheet.freeze_panes = 'A2'

    for product in sorted(rows, key=lambda p: (names[p['categorySlug']],
                                               subs.get(p['subcategorySlug'], ''),
                                               p['title'].lower())):
        spec = {s['label']: s['value'] for s in product['specs']}
        slug = product.get('slug') or product['id']
        sheet.append([
            spec.get('Артикул', ''), product['title'],
            names[product['categorySlug']], subs.get(product['subcategorySlug'], ''),
            spec.get('Бренд', ''), spec.get('Страна', ''),
            f"https://farik9797.github.io/invit/catalog/{product['categorySlug']}/{slug}"
        ])
    sheet.auto_filter.ref = f'A1:G{len(rows) + 1}'
    book.save(OUT)

    print(f'без фото: {len(rows)} из {len(products)}')
    for slug, count in Counter(p['categorySlug'] for p in rows).most_common():
        print(f'  {count:5}  {names[slug]}')
    print(f'-> {OUT.relative_to(ROOT)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
