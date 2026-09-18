"""Заглушки из выгрузки «Заглушки, такелаж» в сведённый импорт.

Клиент прислал выгрузку на 918 позиций (мебельная фурнитура и такелаж) и
попросил взять из неё только заглушки — 233 позиции ветки «Заглушка» — и
положить в «Материалы для монтажа окон > Клинья, заглушки».

Фотографий этих позиций в архиве by-full.zip нет: он снят раньше. Зато в
выгрузке есть прямые ссылки на снимки поставщика, поэтому они скачиваются
в files/images под артикулом — дальше их подхватывает build-catalog.py.

Скрипт идемпотентен: позиции с уже известным артикулом пропускаются, снимки
повторно не скачиваются.

Запуск: python3 scripts/build-plugs.py
        python3 scripts/build-catalog.py
"""
import csv, html, sys, time, urllib.error, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HERE = ROOT / 'files'
SRC = HERE / 'Заглушки_такелаж.csv'
WOO = HERE / 'woocommerce_import_variations.csv'
IMAGES = HERE / 'images'

BRANCH = 'Заглушка'                       # третий уровень дерева поставщика
TARGET = 'Материалы для монтажа окон > Клинья, заглушки'

UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/124.0 Safari/537.36'}


def get(row, key):
    return (row.get(key) or '').strip()


def as_html(text):
    """Описание поставщика — простой текст с переносами, в выгрузке — HTML."""
    lines = [line.strip() for line in str(text).splitlines()]
    return ''.join(f'<p>{html.escape(line)}</p>' for line in lines if line)


def num(value, factor=1, digits=2):
    raw = str(value).replace(',', '.').strip()
    try:
        return f'{round(float(raw) * factor, digits):g}' if raw else ''
    except ValueError:
        return ''


def photo(row, sku):
    """Снимок поставщика под именем артикула; уже скачанный не трогаем.

    Подряд сотня запросов к одному хосту иногда отваливается по DNS, поэтому
    три попытки с паузой: со второго захода почти всё доезжает.
    """
    url = get(row, 'media_img')
    if not url:
        return ''
    name = f'{sku}.jpg'
    target = IMAGES / name
    if target.exists():
        return name

    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as src:
                target.write_bytes(src.read())
            return name
        except Exception as error:                  # noqa: BLE001
            if attempt == 2:
                print(f'  снимок не скачался: {sku} — {error}', file=sys.stderr)
            time.sleep(1.5 * (attempt + 1))
    return ''


def to_woo(row, columns):
    sku = get(row, 'vendor_code')
    # Цена у поставщика: рекомендованная розничная, где её нет — базовая
    price = get(row, 'price_recommended') or get(row, 'price')
    values = {
        'Type': 'simple',
        'SKU': sku,
        'Name': get(row, 'name'),
        'Published': '1',
        'Is featured?': '0',
        'Visibility in catalog': 'visible',
        'Short description': get(row, 'description_short'),
        'Description': as_html(get(row, 'description')),
        'Tax status': 'taxable',
        'Tax class': '',
        'In stock?': '1',
        # Габариты у поставщика в метрах, в выгрузке — в сантиметрах
        'Weight (kg)': num(get(row, 'prop_weight_gross'), digits=3),
        'Length (cm)': num(get(row, 'prop_length'), factor=100),
        'Width (cm)': num(get(row, 'prop_width'), factor=100),
        'Height (cm)': num(get(row, 'prop_height'), factor=100),
        'Regular price': num(price),
        'Categories': TARGET,
        'Tags': '',
        'Images': photo(row, sku),
        'Attribute 1 name': 'Бренд',
        'Attribute 1 value(s)': get(row, 'brand'),
        'Attribute 1 visible': '1',
        'Attribute 1 global': '0',
        'Attribute 2 name': 'Страна',
        'Attribute 2 value(s)': get(row, 'country'),
        'Attribute 2 visible': '1',
        'Attribute 2 global': '0',
    }
    return {column: values.get(column, '') for column in columns}


def main():
    IMAGES.mkdir(exist_ok=True)
    supplier = list(csv.DictReader(open(SRC, encoding='utf-8-sig'), delimiter=';'))
    plugs = [r for r in supplier if get(r, 'parentid_name3') == BRANCH]

    rows = list(csv.DictReader(open(WOO, encoding='utf-8-sig')))
    columns = list(rows[0].keys())
    known = {r['SKU'].strip() for r in rows}

    # Уже записанные позиции трогаем только ради снимка: первый заход мог
    # не докачать часть фотографий.
    existing = {r['SKU'].strip(): r for r in rows}
    added, skipped, fixed = [], 0, 0
    for row in plugs:
        sku = get(row, 'vendor_code')
        if not sku:
            continue
        if sku in known:
            skipped += 1
            here = existing.get(sku)
            if here is not None and not here['Images'].strip():
                name = photo(row, sku)
                if name:
                    here['Images'] = name
                    fixed += 1
            continue
        added.append(to_woo(row, columns))
        known.add(sku)

    if added or fixed:
        with open(WOO, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=columns, lineterminator='\r\n')
            writer.writeheader()
            writer.writerows(rows + added)

    print(f'в выгрузке поставщика   : {len(supplier)}')
    print(f'ветка «{BRANCH}»         : {len(plugs)}')
    print(f'добавлено               : {len(added)} (уже были: {skipped}, к ним добрано снимков: {fixed})')
    print(f'со снимком              : {sum(1 for r in added if r["Images"])}')
    print(f'с ценой                 : {sum(1 for r in added if r["Regular price"])}')
    print(f'→ {WOO.relative_to(ROOT)}: {len(rows)} + {len(added)} = {len(rows) + len(added)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
