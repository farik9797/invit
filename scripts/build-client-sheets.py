"""Две выгрузки на согласование: то, что на сайте, и то, чего на сайте нет.

Клиент правит их у себя: вычёркивает лишнее, поправляет раздел. Дальше каталог
собирается заново из того, что осталось, — поэтому в файлах есть всё, что нужно
для сборки: артикул, название, раздел, бренд, страна, цена, фото, описание.

  files/выгрузка-1-сайт.xlsx        — 7412 позиций витрины
  files/выгрузка-2-поставщик.xlsx   — позиции старой выгрузки, которых нет на сайте

Раздел для второго файла подбирается правилами из build-client-review.py:
по названию группы поставщика и самого товара, иначе — голосованием внутри
группы, иначе помечается «(новый подраздел)».

Запуск: python3 scripts/build-client-sheets.py
"""
import csv, json, re, sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'src/data/catalog.generated.ts'
DESCRIPTIONS = ROOT / 'src/data/catalogDescriptions.ts'
WOO = ROOT / 'files/woocommerce_import_variations.csv'
# Выгрузка поставщика на согласование. Клиент присылает её кусками (метизы,
# заглушки, такелаж), поэтому источников может быть несколько: и csv, и xlsx.
SUPPLIERS = [ROOT / 'files/Болты_гайки_шайбы_2026-09-17.xlsx']
OUT_SITE = ROOT / 'files/выгрузка-1-сайт.xlsx'
OUT_NEW = ROOT / 'files/выгрузка-2-поставщик.xlsx'

# Правила раскладки по нашим разделам лежат в соседнем скрипте: держать их
# в двух местах нельзя, разъедутся.
RULES_SOURCE = ROOT / 'scripts/build-client-review.py'


def load_rules():
    """Берём RULES, LEVEL1, BROAD и PACKAGING из build-client-review.py."""
    namespace: dict = {'__file__': str(RULES_SOURCE)}
    code = RULES_SOURCE.read_text(encoding='utf-8')
    body = code[:code.index('def main(')]
    exec(compile(body, str(RULES_SOURCE), 'exec'), namespace)
    return namespace


def norm(text):
    return ' '.join((text or '').split()).lower()


def plain(value):
    """Значение ячейки строкой: excel отдаёт числа как 966783.0."""
    if value is None:
        return ''
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip()


def read_supplier(path):
    """Строки выгрузки поставщика из csv или xlsx — колонки у них одинаковые."""
    if path.suffix.lower() == '.csv':
        with path.open(encoding='utf-8-sig', errors='replace', newline='') as f:
            return [{k: plain(v) for k, v in row.items()} for row in csv.DictReader(f, delimiter=';')]

    from openpyxl import load_workbook
    sheet = load_workbook(path, read_only=True).active
    rows = sheet.iter_rows(values_only=True)
    header = [plain(h) for h in next(rows)]
    out = []
    for row in rows:
        item = {key: plain(value) for key, value in zip(header, row)}
        if item.get('NAIMEN'):
            out.append(item)
    return out


def catalog():
    source = CATALOG.read_text(encoding='utf-8')
    cats = json.loads(re.search(r'export const CATEGORIES: Category\[\] = (\[.*?\]);\n', source, re.S).group(1))
    products = json.loads(re.search(r'export const RAW_PRODUCTS[^=]*= (\[.*?\]);\n', source, re.S).group(1))
    names = {c['slug']: c['name'] for c in cats}
    subs = {s['slug']: s['name'] for c in cats for s in c['subcategories']}
    return products, names, subs


def descriptions():
    """Полные описания карточек: id -> текст."""
    if not DESCRIPTIONS.exists():
        return {}
    source = DESCRIPTIONS.read_text(encoding='utf-8')
    start = source.index('= {') + 2
    return json.loads(source[start:source.rindex('}') + 1])


def sheet_of(book, title, header, widths):
    sheet = book.create_sheet(title) if book.sheetnames != ['Sheet'] else book.active
    sheet.title = title
    sheet.append(header)
    from openpyxl.styles import Font
    for cell in sheet[1]:
        cell.font = Font(bold=True)
    for column, width in zip('ABCDEFGHIJKLMN', widths):
        sheet.column_dimensions[column].width = width
    sheet.freeze_panes = 'A2'
    return sheet


def finish(sheet, rows):
    sheet.auto_filter.ref = f'A1:{chr(ord("A") + len(sheet[1]) - 1)}{rows + 1}'


def main():
    from openpyxl import Workbook

    rules = load_rules()
    compiled = [(re.compile(p), t) for p, t in rules['RULES']]
    products, names, subs = catalog()
    full = descriptions()

    csv.field_size_limit(10 ** 7)
    with WOO.open(encoding='utf-8-sig', newline='') as f:
        woo = {norm(r['Name']): r for r in csv.DictReader(f)}

    # ---------- первая выгрузка: сайт ----------
    book = Workbook()
    sheet = sheet_of(book, 'Сайт', [
        'ID', 'Артикул', 'Название', 'Раздел', 'Подраздел', 'Бренд', 'Страна',
        'Цена', 'Фото', 'Краткое описание', 'Описание', 'Адрес страницы'
    ], (34, 18, 80, 34, 32, 16, 14, 10, 8, 40, 60, 46))

    for product in sorted(products, key=lambda p: (names[p['categorySlug']],
                                                   subs.get(p['subcategorySlug'], ''),
                                                   p['title'].lower())):
        spec = {s['label']: s['value'] for s in product['specs']}
        row = woo.get(norm(product['title']), {})
        slug = product.get('slug') or product['id']
        sheet.append([
            product['id'], spec.get('Артикул', ''), product['title'],
            names[product['categorySlug']], subs.get(product['subcategorySlug'], ''),
            spec.get('Бренд', ''), spec.get('Страна', ''),
            float(row['Regular price']) if row.get('Regular price') else '',
            'есть' if product.get('photo') else '',
            product.get('description', '')[:400],
            (full.get(product['id']) or '')[:3000],
            f"https://farik9797.github.io/invit/catalog/{product['categorySlug']}/{slug}"
        ])
    finish(sheet, len(products))

    # ---------- вторая выгрузка: поставщик ----------
    supplier = []
    for path in SUPPLIERS:
        supplier += read_supplier(path)

    known = {norm(p['title']): f"{names[p['categorySlug']]} > {subs.get(p['subcategorySlug'], '')}"
             for p in products}
    votes = defaultdict(Counter)
    for row in supplier:
        path = known.get(norm(row['NAIMEN']))
        if path:
            votes[(row['PARENTID_NAME1'], row['PARENTID_NAME2'])][path] += 1

    route = lambda row: rules['route_of'](row, votes)

    fresh = [r for r in supplier if norm(r['NAIMEN']) not in known]
    sheet = sheet_of(book, 'Нет на сайте', [
        'ID', 'Артикул', 'Штрихкод', 'Название', 'Раздел', 'Подраздел',
        'Группа у поставщика', 'Бренд', 'Страна', 'Цена', 'Остаток',
        'Ед. изм.', 'Кратность', 'Характеристики'
    ], (10, 18, 16, 80, 34, 34, 46, 16, 14, 10, 10, 10, 10, 60))

    def money(raw):
        value = (raw or '').replace(',', '.').strip()
        try:
            return float(value)
        except ValueError:
            return ''

    ordered = sorted(fresh, key=lambda r: (route(r), norm(r['NAIMEN'])))
    for row in ordered:
        path = route(row)
        section, _, subsection = path.partition(' > ')
        group = ' > '.join(x for x in (row['PARENTID_NAME0'], row['PARENTID_NAME1'],
                                       row['PARENTID_NAME2']) if x)
        sheet.append([
            row['ID'], row.get('ARTIKUL', ''), row.get('EAN', ''), ' '.join(row['NAIMEN'].split()),
            section, subsection, group, row.get('BRAND', ''), row.get('STRANA', ''),
            money(row.get('REKOMEND_CENA')) or money(row.get('CENA_OPT_BEZ_NDS')),
            (row['SKLAD_ALL'] or '').strip(),
            row['EDIZM'], row['KRATN'], ' '.join((row['XARAKT'] or '').split())[:600]
        ])
    finish(sheet, len(ordered))

    book.save(OUT_SITE)

    # Вторую книгу сохраняем отдельным файлом: клиент правит их независимо.
    single = Workbook()
    single.remove(single.active)
    from copy import copy
    source_sheet = book['Нет на сайте']
    target = single.create_sheet('Нет на сайте')
    for line in source_sheet.iter_rows(values_only=True):
        target.append(line)
    for cell in target[1]:
        cell.font = copy(source_sheet['A1'].font)
    for letter in 'ABCDEFGHIJKLMN':
        target.column_dimensions[letter].width = source_sheet.column_dimensions[letter].width
    target.freeze_panes = 'A2'
    target.auto_filter.ref = source_sheet.auto_filter.ref
    single.save(OUT_NEW)

    book.remove(book['Нет на сайте'])
    book.save(OUT_SITE)

    print(f'сайт: {len(products)} позиций -> {OUT_SITE.name}')
    print(f'нет на сайте: {len(ordered)} позиций -> {OUT_NEW.name}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
