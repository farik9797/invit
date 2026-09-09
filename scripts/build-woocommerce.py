"""Пересборка выгрузки для WooCommerce.

Делает три вещи:
  1. Убирает из выгрузки товары, которых нет в клиентском каталоге
     `invit-katalog.xlsx` (сверка по колонке Name).
  2. Добавляет лестницы и стремянки из `Лестницы_стремянки.csv`, приводя их
     из формата поставщика (53 колонки) к формату WooCommerce (27 колонок).
  3. Достаёт фото лестниц из `by-full.zip` в папку `images/` и проставляет
     имена файлов в колонку Images. Кого в архиве нет — тот остаётся без фото:
     ссылки `media_img` ведут на CDN поставщика, но там у многих позиций не
     снимок товара, а схема с таблицей размеров, и в карточках это выбивалось
     из общего вида. Решение клиента.

Исходник читается из `woocommerce_import.before-ladders.csv` (создаётся при
первом запуске), поэтому скрипт можно гонять сколько угодно раз — результат
один и тот же.

Запуск: python3 scripts/build-woocommerce.py
"""
import csv, html, pathlib, re, shutil, sys, zipfile
from collections import defaultdict

ROOT = pathlib.Path(__file__).parent.parent
HERE = ROOT / 'files'          # выгрузки поставщиков и фото — вне репозитория
WOO = HERE / 'woocommerce_import.csv'
SOURCE = HERE / 'woocommerce_import.before-ladders.csv'
CATALOG = HERE / 'invit-katalog.xlsx'
LADDERS = HERE / 'Лестницы_стремянки.csv'
ARCHIVE = HERE / 'by-full.zip'
IMAGES = HERE / 'images'

# Раздел под лестницы. В выгрузке дерево двухуровневое, а у поставщика
# трёхуровневое («Инструмент, оборудование > Лестницы, стремянки > Лестницы»),
# поэтому вешаем на существующего родителя «Инструмент и оборудование».
CATEGORY = 'Инструмент, оборудование > Лестницы, стремянки'

# Дерево разделов клиента. Слева — как раздел назывался в исходной выгрузке,
# справа — как должен называться. Двухуровневое: ВЛ, НЛ, ЛБ, ЛБА и прочие
# конкретные ленты — это товары внутри подраздела, а не отдельные подразделы.
CATEGORY_MAP = {
    'Материалы для монтажа окон > Пена монтажная и очистители':
        'Материалы для монтажа окон > Пена монтажная, очиститель для пены',
    'Алюминиевые и армированные ленты (скотч) > Изоляционные ленты (изолента)':
        'Алюминиевые и армированные ленты (скотч) > Изоляционные ленты',
    'Комплектующие для воздуховодов и систем вентиляции > Кронштейны (L/V/Z/П-образные)':
        'Комплектующие для воздуховодов и систем вентиляции > Кронштейны L, V, Z, П-образные',
    'Комплектующие для воздуховодов и систем вентиляции > Профиль монтажный (L/U)':
        'Комплектующие для воздуховодов и систем вентиляции > Профиль монтажный L, U',
    'Комплектующие для воздуховодов и систем вентиляции > Анкер латунный (цанга)':
        'Комплектующие для воздуховодов и систем вентиляции > Анкер латунный (цанга)',
    'Инструмент и оборудование > Лестницы и стремянки':
        'Инструмент, оборудование > Лестницы, стремянки',
    'Инструмент и оборудование > Инструмент режущий':
        'Инструмент, оборудование > Инструмент режущий',
    'Инструмент и оборудование > Инструмент крепёжный':
        'Инструмент, оборудование > Инструмент крепёжный',
    'Инструмент и оборудование > Инструмент отделочный':
        'Инструмент, оборудование > Инструмент отделочный',
    'Инструмент и оборудование > Пистолеты для пены':
        'Инструмент, оборудование > Пистолеты для пены',
    'Инструмент и оборудование > Пистолеты для герметика':
        'Инструмент, оборудование > Пистолеты для герметика',
}

# Папки в архиве названы кириллицей («ЦВ-0019679400»), а в ссылке media_img
# тот же код записан латиницей («…/cv-0019679400/…»). Это и есть ключ:
# другого общего поля у выгрузки и архива нет.
LAT2CYR = {'cb': 'ЦБ', 'cv': 'ЦВ', 'cz': 'ЦЗ', 'cg': 'ЦГ',
           'ci': 'ЦИ', 'ce': 'ЦЕ', 'cd': 'ЦД'}
CODE_IN_URL = re.compile(r'/([a-z]{2})-(\d{10})/')

# Две лестницы, чьи коды в архив не попали, но фото там есть под другим кодом.
# Названий в архиве нет (папки — только коды, метаданные вычищены), поэтому
# искали не по названию, а по самой картинке: перцептивный хеш CDN-фото против
# всех 50 056 файлов архива. Хеш дал шесть кандидатов, но четыре оказались
# чужими товарами (проволочная подставка, нож Fiskars, мойка) — у снимков на
# белом фоне силуэты слишком похожи, а по MAE верные и ложные пары не
# разделяются (0.07–13 против 6–21). Поэтому в списке только те две пары,
# которые сверены глазами.
VERIFIED = {
    'ST9732-04': 'ЦБ-1201080699',
    'ST9947-12': 'ЦБ-1583856340',
}


def num(value, factor=1.0, digits=1):
    """Число поставщика («2,99») в число WooCommerce («299.0»). Пусто — пусто."""
    text = str(value).strip().replace(',', '.')
    if not text:
        return ''
    try:
        return f'{float(text) * factor:.{digits}f}'
    except ValueError:
        return ''


def as_html(text):
    """Описание поставщика — простой текст с переносами, в выгрузке — HTML."""
    lines = [line.strip() for line in str(text).splitlines()]
    return ''.join(f'<p>{html.escape(line)}</p>' for line in lines if line)


def archive_index():
    """Папки архива: код -> {префикс: [файлы]}."""
    index = defaultdict(dict)
    with zipfile.ZipFile(ARCHIVE) as z:
        by_folder = defaultdict(list)
        for name in z.namelist():
            folder, _, file = name.partition('/')
            if file:
                by_folder[folder].append(name)
    for folder, files in by_folder.items():
        prefix, _, code = folder.partition('-')
        # внутри папки файлы называются 0.jpg, 1.jpg… — сортируем по числу
        index[code][prefix] = sorted(files, key=lambda n: int(pathlib.Path(n).stem))
    return index


def pull_images(items, index):
    """Достаёт фото из архива. Возвращает {vendor_code: [имена файлов]}."""
    IMAGES.mkdir(exist_ok=True)
    picked, ambiguous, absent = {}, [], []

    with zipfile.ZipFile(ARCHIVE) as z:
        for item in items:
            match = CODE_IN_URL.search(item['media_img'] or '')
            if not match:
                absent.append((item['vendor_code'], 'нет ссылки media_img'))
                continue
            latin, code = match.groups()
            if item['vendor_code'].strip() in VERIFIED:
                code = VERIFIED[item['vendor_code'].strip()].split('-', 1)[1]
                latin = None
            variants = index.get(code)
            if not variants:
                absent.append((item['vendor_code'], f'{latin}-{code} нет в архиве'))
                continue

            wanted = (VERIFIED[item['vendor_code'].strip()].split('-', 1)[0]
                      if latin is None else LAT2CYR.get(latin))
            if wanted not in variants:
                # Префикс — часть идентификатора, а не оформление. Проверено:
                # у трёх лестниц код нашёлся под другим префиксом, и там лежали
                # фрезер, электроды и мешки для мусора. Берём только точное
                # совпадение префикса и кода, иначе фото не подставляем.
                ambiguous.append((item['vendor_code'], f'{latin}-{code}', sorted(variants)))
                continue
            prefix = wanted

            sku = re.sub(r'[^\w.-]', '_', item['vendor_code'].strip())
            names = []
            for n, entry in enumerate(variants[prefix], 1):
                name = f'{sku}-{n}.jpg'
                with z.open(entry) as src, (IMAGES / name).open('wb') as dst:
                    shutil.copyfileobj(src, dst)
                names.append(name)
            picked[item['vendor_code']] = names

    return picked, ambiguous, absent


def main():
    from openpyxl import load_workbook

    if not SOURCE.exists():
        shutil.copy2(WOO, SOURCE)

    keep = {
        str(row[0]).strip()
        for row in load_workbook(CATALOG, read_only=True, data_only=True)['woocommerce_import']
        .iter_rows(min_row=2, values_only=True)
        if row and row[0]
    }

    with SOURCE.open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        columns, rows = reader.fieldnames, list(reader)

    kept = [r for r in rows if r['Name'].strip() in keep]
    dropped = [r for r in rows if r['Name'].strip() not in keep]

    with LADDERS.open(encoding='utf-8-sig', newline='') as f:
        ladders = list(csv.DictReader(f))

    photos, ambiguous, absent = pull_images(ladders, archive_index())

    known_sku = {r['SKU'] for r in kept}
    added = []
    for item in ladders:
        sku = item['vendor_code'].strip()
        if sku in known_sku:                      # на всякий случай: не плодим дубли
            print(f'  пропущен дубль SKU {sku}: {item["name"][:60]}')
            continue
        known_sku.add(sku)
        # Цена: у поставщика это рекомендованная розничная, а где её нет — базовая
        price = item['price_recommended'].strip() or item['price']
        added.append({
            'Type': 'simple',
            'SKU': sku,
            'Name': item['name'].strip(),
            'Published': '1',
            'Is featured?': '0',
            'Visibility in catalog': 'visible',
            'Short description': '',
            'Description': as_html(item['description']),
            'Tax status': 'taxable',
            'Tax class': '',
            'In stock?': '1',
            # Габариты у поставщика в метрах, в выгрузке — в сантиметрах
            'Weight (kg)': num(item['prop_weight_gross'], digits=3),
            'Length (cm)': num(item['prop_length'], factor=100),
            'Width (cm)': num(item['prop_width'], factor=100),
            'Height (cm)': num(item['prop_height'], factor=100),
            'Regular price': num(price, digits=2),
            'Categories': CATEGORY,
            'Tags': '',
            'Images': ', '.join(photos.get(sku, [])),
            'Attribute 1 name': 'Бренд',
            'Attribute 1 value(s)': item['brand'].strip(),
            'Attribute 1 visible': '1',
            'Attribute 1 global': '0',
            'Attribute 2 name': 'Страна',
            'Attribute 2 value(s)': item['country'].strip(),
            'Attribute 2 visible': '1',
            'Attribute 2 global': '0',
        })

    for row in kept:                    # приводим разделы к дереву клиента
        row['Categories'] = CATEGORY_MAP.get(row['Categories'], row['Categories'])

    # Тот же вид файла, что был: UTF-8 с BOM и переводы строк CRLF
    with WOO.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, lineterminator='\r\n')
        writer.writeheader()
        writer.writerows(kept + added)

    total_files = sum(len(v) for v in photos.values())
    print(f'было      : {len(rows)}')
    print(f'удалено   : {len(dropped)}')
    for r in dropped:
        print(f'    {r["SKU"]:>16}  {r["Name"][:64]}')
    print(f'добавлено : {len(added)}')
    print(f'стало     : {len(kept) + len(added)}')
    print(f'\nфото из архива : {len(photos)} товаров, файлов {total_files} → {IMAGES}/')
    print(f'без фото       : {len(ladders) - len(photos)}')
    if ambiguous:
        print(f'  код есть, но под чужим префиксом — пропущены ({len(ambiguous)}):')
        for sku, code, prefixes in ambiguous:
            print(f'    {sku:14} {code} → в архиве {prefixes}')
    print(f'  без фото ({len(absent)}):')
    for sku, why in absent:
        print(f'    {sku:14} {why}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
