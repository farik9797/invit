"""Выгрузка каталога invit.by из админки ocStore в формат WooCommerce.

Источник — `invit-admin-dump.json`: снимок всех 235 карточек из
`catalog/product/update`, снятый через авторизованную сессию админки.

Пишет два файла:
  * `выгрузка-сайта.csv` — те же 27 колонок, что и в остальных выгрузках
    проекта, чтобы файл сводился с ними без переделки;
  * `выгрузка-сайта-полная.csv` — плюс SEO-поля, ЧПУ, product_id и порядок
    сортировки: в WooCommerce они не входят, но при переносе сайта нужны,
    иначе потеряются позиции в поиске.

Опции и скидки из дампа не переносим: это демо-данные установки ocStore
(опции «Radio/File/Date» со значением «test», скидки 88/77/66) — они висят
на карточках с 2011 года и товара не описывают.

Запуск: python3 scripts/build-site-export.py
"""
import csv, json, pathlib, re, sys
from urllib.parse import quote

ROOT = pathlib.Path(__file__).parent.parent
HERE = ROOT / 'files'          # выгрузки поставщиков и фото — вне репозитория
DUMP = HERE / 'invit-admin-dump.json'
DST = HERE / 'выгрузка-сайта.csv'
FULL = HERE / 'выгрузка-сайта-полная.csv'
IMG_BASE = 'https://invit.by/image/'

COLUMNS = ['Type', 'SKU', 'Name', 'Published', 'Is featured?', 'Visibility in catalog',
           'Short description', 'Description', 'Tax status', 'Tax class', 'In stock?',
           'Weight (kg)', 'Length (cm)', 'Width (cm)', 'Height (cm)', 'Regular price',
           'Categories', 'Tags', 'Images', 'Attribute 1 name', 'Attribute 1 value(s)',
           'Attribute 1 visible', 'Attribute 1 global', 'Attribute 2 name',
           'Attribute 2 value(s)', 'Attribute 2 visible', 'Attribute 2 global']

EXTRA = ['product_id', 'URL (ЧПУ)', 'H1', 'SEO title', 'Meta description',
         'Meta keywords', 'Теги', 'Все категории', 'Порядок', 'В продаже с']


def sub(o, prefix):
    """Строки табличных полей формы: product_attribute[0][...] -> [{...}]."""
    idx = sorted({m.group(1) for k in o
                  if (m := re.match(re.escape(prefix) + r'\[(\d+)\]', k))}, key=int)
    out = []
    for i in idx:
        head = f'{prefix}[{i}]'
        out.append({k[len(head):].strip('[]').replace('][', '.'): v
                    for k, v in o.items() if k.startswith(head)})
    return out


def num(value, digits=2):
    """Габарит/вес ocStore («0.00000000») в число WooCommerce. Ноль — пусто."""
    try:
        f = float(str(value).replace(',', '.'))
    except ValueError:
        return ''
    return '' if f == 0 else f'{f:.{digits}f}'


def images(o):
    """Главное фото плюс дополнительные, полными ссылками на invit.by.

    `no_image.jpg` — заглушка ocStore для карточек без снимка, в выгрузку она
    не идёт. Пробелы в путях кодируем: у части файлов папка названа
    «uplotnitel EPDM», и без кодирования ссылка нерабочая.
    """
    paths = [o.get('image', '').strip()]
    paths += [r.get('image', '').strip() for r in sub(o, 'product_image')]
    return ', '.join(IMG_BASE + quote(p) for p in dict.fromkeys(paths)
                     if p and 'no_image' not in p)


def main():
    data = json.loads(DUMP.read_text(encoding='utf-8'))
    cats, products = data['categories'], data['products']

    rows, full = [], []
    for pid, o in products.items():
        d = lambda f: o.get(f'product_description[1][{f}]', '').strip()

        # Разделы: главный — полным путём, остальные добираем по id
        main = o.get('main_category_id', '').strip()
        every = [cats.get(c, '') for c in o.get('product_category[]', [])]
        every = [c for c in dict.fromkeys([main] + every) if c and 'Не выбрано' not in c]

        attrs = [(r.get('name', '').strip(),
                  r.get('product_attribute_description.1.text', '').strip())
                 for r in sub(o, 'product_attribute')]
        attrs = [(n, v) for n, v in attrs if n and v]

        row = dict.fromkeys(COLUMNS, '')
        row.update({
            'Type': 'simple',
            # Своих артикулов у сайта нет: поле sku пустое у всех 235 карточек.
            # Ключом делаем id товара в базе — он же связывает строку с админкой.
            'SKU': f'INV-{pid}',
            'Name': d('name'),
            'Published': '1' if o.get('status') == 'Включено' else '0',
            'Is featured?': '0',
            'Visibility in catalog': 'visible',
            'Description': d('description'),
            'Tax status': 'taxable',
            'In stock?': '1' if o.get('stock_status_id') != 'Нет в наличии' else '0',
            'Weight (kg)': num(o.get('weight'), 3),
            'Length (cm)': num(o.get('length')),
            'Width (cm)': num(o.get('width')),
            'Height (cm)': num(o.get('height')),
            # Цен на сайте нет ни у одного товара: работа по запросу расчёта
            'Regular price': num(o.get('price')),
            'Categories': ' | '.join(every),
            'Tags': d('tag'),
            'Images': images(o),
            'Attribute 1 name': 'Бренд',
            'Attribute 1 value(s)': ('' if 'Не выбрано' in o.get('manufacturer_id', '')
                                     else o.get('manufacturer_id', '').strip()),
            'Attribute 1 visible': '1', 'Attribute 1 global': '0',
            'Attribute 2 name': 'Модель',
            'Attribute 2 value(s)': o.get('model', '').strip(),
            'Attribute 2 visible': '1', 'Attribute 2 global': '0',
        })
        rows.append(row)

        wide = dict(row)
        wide.update({
            'product_id': pid,
            'URL (ЧПУ)': o.get('keyword', '').strip(),
            'H1': d('seo_h1'), 'SEO title': d('seo_title'),
            'Meta description': d('meta_description'), 'Meta keywords': d('meta_keyword'),
            'Теги': d('tag'), 'Все категории': ' | '.join(every),
            'Порядок': o.get('sort_order', ''), 'В продаже с': o.get('date_available', ''),
        })
        for n, (name, value) in enumerate(attrs, 3):
            wide[f'Attribute {n} name'] = name
            wide[f'Attribute {n} value(s)'] = value
        full.append(wide)

    wide_cols = COLUMNS + EXTRA
    for r in full:
        for k in r:
            if k not in wide_cols:
                wide_cols.append(k)

    for path, cols, data_rows in ((DST, COLUMNS, rows), (FULL, wide_cols, full)):
        with path.open('w', encoding='utf-8-sig', newline='') as f:
            w = csv.DictWriter(f, fieldnames=cols, lineterminator='\r\n', restval='')
            w.writeheader()
            w.writerows(data_rows)

    on = sum(1 for r in rows if r['Published'] == '1')
    print(f'товаров        : {len(rows)}')
    print(f'  включено     : {on}')
    print(f'  отключено    : {len(rows) - on}')
    print(f'с описанием    : {sum(1 for r in rows if r["Description"])}')
    print(f'с фото         : {sum(1 for r in rows if r["Images"])}')
    print(f'с ценой        : {sum(1 for r in rows if r["Regular price"])}')
    print(f'с брендом      : {sum(1 for r in rows if r["Attribute 1 value(s)"])}')
    print(f'разделов задето: {len({c for r in rows for c in r["Categories"].split(" | ") if c})}')
    print(f'\n{DST.name}: {len(rows)} строк')
    print(f'{FULL.name}: {len(full)} строк, {len(wide_cols)} колонок')
    return 0


if __name__ == '__main__':
    sys.exit(main())
