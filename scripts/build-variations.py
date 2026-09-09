"""Сборка вариативных товаров для WooCommerce.

Читает `woocommerce_import.csv` и пишет `woocommerce_import_variations.csv`,
где сгруппированные позиции превращаются в variable + variation, а остальные
остаются simple.

Ось у каждого семейства своя (см. AXIS_BY_CATEGORY). Фасовка осью НЕ является:
«5 кг», «50 шт в зип-локе» и «20000 шт в коробе» — это разные торговые единицы
с разной ценой, а не свойство товара. Если сделать её второй осью, у одних
только универсальных шурупов выходит сетка 75x54 = 4050 комбинаций, из которых
реально существует 348, и покупатель, выбрав размер, гадает, в какой фасовке
он бывает. Поэтому фасовка остаётся частью названия карточки.

Запуск: python3 scripts/build-variations.py
"""
import csv, pathlib, re, sys
from collections import defaultdict

ROOT = pathlib.Path(__file__).parent.parent
HERE = ROOT / 'files'          # выгрузки поставщиков и фото — вне репозитория
# Если сведение с каталогом сайта уже сделано — собираем вариации по нему
MERGED = HERE / 'woocommerce_import_merged.csv'
SRC = MERGED if MERGED.exists() else HERE / 'woocommerce_import.csv'
DST = HERE / 'woocommerce_import_variations.csv'
REPORT = HERE / 'вариативные-группы.csv'

norm = lambda s: re.sub(r'\s+', ' ', s).strip(' ,.-')

NUM = re.compile(r'\d+(?:[.,]\d+)?')


def natural(value):
    """Ключ сортировки значений оси: числа сравниваем как числа.

    Иначе список длин выглядит «100 мм, 120 мм, 20 мм», а типоразмеров —
    «М10, М12, М6»: покупатель видит порядок, которого не ожидает.
    """
    nums = tuple(float(x.replace(',', '.')) for x in NUM.findall(value))
    return (nums, value.lower())

# «13 класс» у перчаток — класс вязки, а не размер; в размеры не попадает.
P = {
    'ral':     re.compile(r'RAL\s*\d{4}', re.I),
    'color':   re.compile(r'\b(прозрачн\w+|бесцветн\w+|сер\w+е|серый|чёрн\w+|черн\w+|бел\w+|'
                          r'красн\w+|син\w+|голуб\w+|зелён\w+|зелен\w+|жёлт\w+|желт\w+|'
                          r'янтарн\w+|коричнев\w+|оранжев\w+|бордов\w+|розов\w+|'
                          r'бежев\w+|дымчат\w+|оливков\w+)\b', re.I),
    'tape':    re.compile(r'\b\d{1,3}\s*мм\s*[хx]\s*\d{1,3}(?:[.,]\d+)?\s*м\b', re.I),
    # Три числа подряд — типоразмер оснастки: у бура это диаметр, рабочая длина
    # и общая («10х345х460 мм»), у сверла — диаметр, рабочая часть и длина.
    # Ловим до «size», иначе от названия остаётся хвост вроде «х460 мм».
    'triple':  re.compile(r'\b\d+(?:[.,]\d+)?\s*[хx]\s*\d+(?:[.,]\d+)?\s*[хx]\s*'
                          r'\d+(?:[.,]\d+)?(?:\s*мм)?', re.I),
    'thread':  re.compile(r'\bМ\d{1,2}(?:х\d+\s*мм)?\b'),
    'diam':    re.compile(r'\bD\s?\d{2,4}\s*мм\b', re.I),
    'size':    re.compile(r'\b\d+[.,/]?\d*\s*[хx]\s*\d+[.,]?\d*(?:\s*мм)?', re.I),
    'glove':   re.compile(r'(?:р-?р\s*\d{1,2}\s*/\s*(?:XS|S|M|L|XL|XXL)|р-?р\s*(?:XS|S|M|L|XL|XXL)'
                          r'|\b\d{1,2}\s*р-?р\b|\bразмер\s*\d{1,2}\b)', re.I),
    'len':     re.compile(r'\b\d{1,3}(?:[.,]\d+)?\s*м\b(?!м)'),
}
LABEL = {'ral': 'Цвет', 'color': 'Цвет', 'tape': 'Размер', 'thread': 'Типоразмер',
         'diam': 'Диаметр', 'size': 'Размер', 'glove': 'Размер', 'len': 'Длина',
         'triple': 'Типоразмер'}

# Порядок = приоритет. Первый шаблон, который сработал, и становится осью.
AXIS_BY_CATEGORY = [
    ('Крепёж > Заклёпки',                          ['ral']),
    ('Крепёж > Саморез кровельный',                ['ral', 'size']),
    ('Герметики',                                  ['color']),
    ('Резиновые уплотнители',                      ['color', 'len']),
    ('Алюминиевые и армированные ленты',           ['tape', 'color']),
    ('Кровельные уплотнительные клейкие ленты',    ['tape']),
    ('СИЗ и расходные материалы > Перчатки',       ['glove']),
    ('СИЗ и расходные материалы > Маски',          ['glove']),
    ('СИЗ и расходные материалы > Очки',           ['color']),
    ('СИЗ и расходные материалы > Плёнка',         ['tape', 'size']),
    ('Комплектующие для воздуховодов',             ['thread', 'diam', 'size']),
    ('Оснастка к электроинструменту',               ['triple', 'size']),
    ('',                                           ['size']),          # крепёж и всё прочее
]
# Хвост «(Примерное количество…)», «(Цвет: …)» — справочный, в имя карточки не идёт
TAIL = re.compile(r'\s*\((?:Примерное количество|Цвет)[^)]*\)?.*$', re.I)
LADDERS = 'Инструмент, оборудование > Лестницы'
SERIES = re.compile(r'^([A-Z]{2}\d{4}|\d{4})')

# Крепёж «диаметр х длина»: у крупных групп диаметр уходит в название карточки,
# а осью остаётся длина. Иначе у универсального шурупа один список на 67 позиций.
# Порог 20 выбран по расчёту: 67 превращается максимум в 17, а осколком остаётся
# всего один товар. Разбивать все размерные группы нельзя — при пороге 0
# одиночками стали бы 224 позиции.
DIAM_SPLIT_OVER = 20
DIAM_LEN = re.compile(r'^(\d+[.,]?\d*)\s*[хx]\s*(\d+[.,]?\d*\s*(?:мм)?)$', re.I)


def split_by_diameter(multi):
    """Крупные группы «диаметр х длина» режет по диаметру, ось меняет на длину."""
    out = {}
    for key, items in multi.items():
        cat, base, label = key
        parsed = [DIAM_LEN.match(v.strip()) for v, _ in items]
        if label != 'Размер' or len(items) <= DIAM_SPLIT_OVER or not all(parsed):
            out[key] = items
            continue
        by_diam = defaultdict(list)
        for m, (_, row) in zip(parsed, items):
            by_diam[m.group(1)].append((m.group(2).strip(), row))
        for diam, sub in by_diam.items():
            out[(cat, base.replace('§', f'{diam} мм'), 'Длина')] = sub
    return out


def drop_repeats(multi):
    """Одно значение оси — одна вариация: вторую такую WooCommerce не покажет.

    У поставщика оснастки разные артикулы носят одинаковое название: у Bosch
    это соседние линейки одного размера, и цена отличается вдвое. В карточке
    покупателю их не различить, поэтому в вариации идёт самый дешёвый, а
    остальные остаются отдельными товарами.
    """
    price = lambda row: (float(row['Regular price'].replace(',', '.') or 0), row['SKU'])
    # «250x20мм», «250х20мм» и «250х20» — один размер: у поставщика «x» то
    # латинская, то русская, а «мм» стоит не везде. Сравниваем по очищенному
    # виду, показываем как в названии.
    same = lambda v: re.sub(r'\s+|мм', '', v.lower().replace('x', 'х').replace(',', '.'))
    out = {}
    for key, items in multi.items():
        seen, kept = set(), []
        for value, row in sorted(items, key=lambda x: price(x[1])):
            if same(value) in seen:
                continue
            seen.add(same(value))
            kept.append((value, row))
        out[key] = kept
    return out


def axis_of(row):
    """Возвращает (метка оси, значение, база карточки) или None."""
    cat, name = row['Categories'], TAIL.sub('', row['Name']).strip()

    if cat.startswith(LADDERS):
        m = SERIES.match(row['SKU'])
        if not m:
            return None
        # Ось лестницы — типоразмер: высота и число ступеней
        steps = re.search(r'\d+\s*(?:х\s*)?\d*\s*ступ\.?', name)
        height = re.search(r'\d+(?:/\d+)*\s*см', name)
        value = ', '.join(x.group(0) for x in (height, steps) if x) or row['SKU']
        base = norm(re.sub(r'[\d,./]+\s*(?:см|ступ\.?|кг)', '', name))
        return 'Типоразмер', value, f'{base} [{m.group(1)}]'

    keys = next(ks for prefix, ks in AXIS_BY_CATEGORY if cat.startswith(prefix))
    for key in keys:
        m = P[key].search(name)
        if m:
            return LABEL[key], m.group(0).strip(), norm(name[:m.start()] + '§' + name[m.end():])
    return None


def main():
    with SRC.open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        columns, rows = reader.fieldnames, list(reader)

    groups = defaultdict(list)
    for r in rows:
        # Товары без цены (каталог сайта работает по запросу расчёта) в вариации
        # не собираем: в WooCommerce такая вариация не покупается, а родитель
        # показывает пустой диапазон цен вместо «от … до …».
        if not r['Regular price'].strip():
            continue
        found = axis_of(r)
        if found:
            label, value, base = found
            groups[(r['Categories'], base, label)].append((value, r))

    multi = split_by_diameter({k: v for k, v in groups.items() if len(v) > 1})
    multi = drop_repeats(multi)
    multi = {k: v for k, v in multi.items() if len(v) > 1}   # осколки — обратно в simple
    # По SKU считать нельзя: у части товаров он пустой, и множество схлопывает
    # их в одну запись — из выдачи молча пропадали полторы сотни позиций.
    grouped = {id(r) for v in multi.values() for _, r in v}

    out_cols = (columns[:columns.index('Attribute 1 name')] + ['Parent'] +
                columns[columns.index('Attribute 1 name'):] +
                ['Attribute 3 name', 'Attribute 3 value(s)',
                 'Attribute 3 visible', 'Attribute 3 global'])

    blank = {c: '' for c in out_cols}
    out, report = [], []

    for r in rows:                                   # одиночки — как были
        if id(r) in grouped:
            continue
        out.append({**blank, **{k: v for k, v in r.items()}})

    for n, ((cat, base, label), items) in enumerate(
            sorted(multi.items(), key=lambda x: (x[0][0], x[0][1])), 1):
        parent_sku = f'V-{n:04d}'
        items.sort(key=lambda x: natural(x[0]))
        first = items[0][1]
        # Картинки и описание родителя берём у первого товара, где они есть
        images = next((r['Images'] for _, r in items if r['Images'].strip()), '')
        descr = next((r['Description'] for _, r in items if r['Description'].strip()), '')

        out.append({**blank, **{
            'Type': 'variable', 'SKU': parent_sku,
            'Name': norm(base.replace('§', '').replace('[', '(').replace(']', ')')),
            'Published': '1', 'Is featured?': '0', 'Visibility in catalog': 'visible',
            'Description': descr, 'Tax status': 'taxable', 'In stock?': '1',
            'Categories': cat, 'Images': images,
            'Attribute 1 name': 'Бренд', 'Attribute 1 value(s)': first['Attribute 1 value(s)'],
            'Attribute 1 visible': '1', 'Attribute 1 global': '0',
            'Attribute 2 name': 'Страна', 'Attribute 2 value(s)': first['Attribute 2 value(s)'],
            'Attribute 2 visible': '1', 'Attribute 2 global': '0',
            'Attribute 3 name': label,
            'Attribute 3 value(s)': ', '.join(dict.fromkeys(v for v, _ in items)),
            'Attribute 3 visible': '1', 'Attribute 3 global': '1',
        }})

        for value, r in items:
            out.append({**blank, **{
                'Type': 'variation', 'SKU': r['SKU'], 'Parent': parent_sku,
                'Name': r['Name'], 'Published': '1', 'Visibility in catalog': 'visible',
                'Description': r['Description'], 'Tax status': 'taxable', 'In stock?': '1',
                'Weight (kg)': r['Weight (kg)'], 'Length (cm)': r['Length (cm)'],
                'Width (cm)': r['Width (cm)'], 'Height (cm)': r['Height (cm)'],
                'Regular price': r['Regular price'], 'Images': r['Images'],
                'Attribute 3 name': label, 'Attribute 3 value(s)': value,
            }})
            report.append({'Родитель': parent_sku, 'Карточка': norm(base.replace('§', '…')),
                           'Ось': label, 'Позиций': len(items), 'Значение': value,
                           'Артикул': r['SKU'], 'Название': r['Name'][:140],
                           'Цена': r['Regular price'], 'Раздел': cat})

    with DST.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=out_cols, lineterminator='\r\n')
        w.writeheader(); w.writerows(out)
    with REPORT.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(report[0]), lineterminator='\r\n')
        w.writeheader(); w.writerows(report)

    simple = sum(1 for r in out if r['Type'] == 'simple')
    print(f'исходно товаров : {len(rows)}')
    print(f'групп           : {len(multi)}')
    print(f'  variable      : {len(multi)}')
    print(f'  variation     : {len(grouped)}')
    print(f'  simple        : {simple}')
    print(f'карточек в каталоге: {len(rows)} → {simple + len(multi)}')
    print(f'\n{DST.name}: {len(out)} строк')
    print(f'{REPORT.name}: {len(report)} строк на проверку')
    return 0


if __name__ == '__main__':
    sys.exit(main())
