"""Оснастка к электроинструменту из выгрузки поставщика в формат WooCommerce.

Исходник — `files/Круги_буры_оснастка.csv` (у поставщика он называется
«Круги+_буры+оснастка_export_universal…»): 3388 позиций, 40 колонок,
разделитель — табуляция, кодировка cp1251. Тот же поставщик,
что и у лестниц, но выгрузка другая: разделы приходят не одной строкой,
а четырьмя уровнями (parentid_name1…4).

Пишет:
  · оснастка.csv       — 27 колонок, как в остальных файлах проекта
  · woocommerce_import.csv — основной импорт, с оснасткой в хвосте
  · оснастка.xlsx      — то же для клиента, плюс лист «Без фото»
  · оснастка-фото.csv  — что с фотографиями по каждой позиции

Фото берём из `by-full.zip` по коду okdp: он совпадает с папкой архива
(«ЦБ-2607687823»), тот же код латиницей стоит в ссылке media_img. Совпадение
проверяем целиком, вместе с префиксом: у лестниц выяснилось, что один и тот же
номер под другим префиксом — это другой товар.

Оснастка дописывается в конец основного импорта. Исходник читается из
`woocommerce_import.before-osnastka.csv` (создаётся при первом запуске), поэтому
скрипт можно гонять сколько угодно раз — результат один и тот же.

Запуск: python3 scripts/build-osnastka.py
        python3 scripts/merge-site.py && python3 scripts/build-variations.py
"""
import csv, html, io, pathlib, re, shutil, sys, zipfile
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).parent.parent
HERE = ROOT / 'files'          # выгрузки поставщиков и фото — вне репозитория
SRC = HERE / 'Круги_буры_оснастка.csv'
DST = HERE / 'оснастка.csv'
XLSX = HERE / 'оснастка.xlsx'
PHOTO_REPORT = HERE / 'оснастка-фото.csv'
ARCHIVE = HERE / 'by-full.zip'
IMAGES = HERE / 'images'
MERGED = HERE / 'woocommerce_import_merged.csv'
WOO = HERE / 'woocommerce_import.csv'
BEFORE = HERE / 'woocommerce_import.before-osnastka.csv'

COLUMNS = ['Type', 'SKU', 'Name', 'Published', 'Is featured?', 'Visibility in catalog',
           'Short description', 'Description', 'Tax status', 'Tax class', 'In stock?',
           'Weight (kg)', 'Length (cm)', 'Width (cm)', 'Height (cm)', 'Regular price',
           'Categories', 'Tags', 'Images', 'Attribute 1 name', 'Attribute 1 value(s)',
           'Attribute 1 visible', 'Attribute 1 global', 'Attribute 2 name',
           'Attribute 2 value(s)', 'Attribute 2 visible', 'Attribute 2 global']

# Четвёртый уровень поставщика в дерево не берём: он уточняет хвостовик и
# производителя («Сверла по металлу цилиндрический хвостовик EXPERT STARTUL»),
# и с ним разделов становится 112 вместо 70, а половина — на десяток позиций.
DEPTH = 3

# Часть артикулов приехала из Excel в виде «4,81606E+12» — это штрихкод,
# который потерял точность, и у девяти таких значений на них висит до сотни
# разных товаров. В SKU такие не годятся: там нужен уникальный код.
BROKEN_CODE = re.compile(r'^\d+[.,]\d+E\+\d+$', re.I)

CYR2LAT = {'ЦБ': 'cb', 'ЦВ': 'cv', 'ЦЗ': 'cz', 'ЦГ': 'cg',
           'ЦИ': 'ci', 'ЦЕ': 'ce', 'ЦД': 'cd'}


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


def category(row):
    parts = [row[f'parentid_name{i}'].strip() for i in range(1, DEPTH + 1)]
    return ' > '.join(p for p in parts if p)


def latin(okdp):
    """«ЦБ-2607687823» -> «cb-2607687823»: имя файла без кириллицы."""
    prefix, _, code = okdp.partition('-')
    return f'{CYR2LAT.get(prefix, prefix.lower())}-{code}'


def read_source():
    text = SRC.read_bytes().decode('cp1251')
    return list(csv.DictReader(io.StringIO(text), delimiter='\t'))


def archive_folders():
    """Папки архива: «ЦБ-2607687823» -> [файлы], отсортированные по номеру."""
    with zipfile.ZipFile(ARCHIVE) as z:
        by_folder = defaultdict(list)
        for name in z.namelist():
            folder, _, file = name.partition('/')
            if file:
                by_folder[folder].append(name)
    return {f: sorted(v, key=lambda n: int(pathlib.Path(n).stem)) for f, v in by_folder.items()}


def assign_skus(rows):
    """Артикул поставщика, где он годится, иначе код okdp (он уникален).

    Занятые артикулы читаем из снимка «до оснастки», а не из готового импорта:
    в импорте уже лежит вчерашняя оснастка, и на втором запуске все до единого
    артикула оказывались занятыми — своими же. Все 3388 позиций уходили на
    okdp, и у товаров пропадали настоящие артикулы.
    """
    codes = Counter(r['vendor_code'].strip() for r in rows)
    source = BEFORE if BEFORE.exists() else WOO
    skus, taken = {}, set()
    if source.exists():
        with source.open(encoding='utf-8-sig', newline='') as f:
            taken = {r['SKU'].strip() for r in csv.DictReader(f) if r['SKU'].strip()}
    for row in rows:
        code = row['vendor_code'].strip()
        okdp = row['okdp'].strip()
        ok = code and codes[code] == 1 and not BROKEN_CODE.match(code) and code not in taken
        skus[okdp] = code if ok else okdp
    return skus


def pull_images(rows, folders, skus):
    """Достаёт фото из архива. Возвращает {okdp: [имена файлов]}."""
    IMAGES.mkdir(exist_ok=True)
    picked = {}
    with zipfile.ZipFile(ARCHIVE) as z:
        for row in rows:
            okdp = row['okdp'].strip()
            entries = folders.get(okdp)
            if not entries:
                continue
            names = []
            for n, entry in enumerate(entries, 1):
                name = f'{latin(okdp)}-{n}.jpg'
                with z.open(entry) as src, (IMAGES / name).open('wb') as dst:
                    shutil.copyfileobj(src, dst)
                names.append(name)
            picked[okdp] = names
    return picked


def to_woo(row, sku, photos):
    # Цена: у поставщика это рекомендованная розничная, а где её нет — базовая
    price = row['price_recommended'].strip() or row['price']
    return {
        'Type': 'simple',
        'SKU': sku,
        'Name': row['name'].strip(),
        'Published': '1',
        'Is featured?': '0',
        'Visibility in catalog': 'visible',
        'Short description': row['description_short'].strip(),
        'Description': as_html(row['description']),
        'Tax status': 'taxable',
        'Tax class': '',
        'In stock?': '1',
        # Габариты у поставщика в метрах, в выгрузке — в сантиметрах
        'Weight (kg)': num(row['prop_weight_gross'], digits=3),
        'Length (cm)': num(row['prop_length'], factor=100),
        'Width (cm)': num(row['prop_width'], factor=100),
        'Height (cm)': num(row['prop_height'], factor=100),
        'Regular price': num(price, digits=2),
        'Categories': category(row),
        'Tags': '',
        'Images': ', '.join(photos),
        'Attribute 1 name': 'Бренд',
        'Attribute 1 value(s)': row['brand'].strip(),
        'Attribute 1 visible': '1',
        'Attribute 1 global': '0',
        'Attribute 2 name': 'Страна',
        'Attribute 2 value(s)': row['country'].strip(),
        'Attribute 2 visible': '1',
        'Attribute 2 global': '0',
    }


def write_xlsx(out, no_photo):
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font
    from openpyxl.utils import get_column_letter

    head = ['Артикул', 'Название', 'Раздел', 'Бренд', 'Страна', 'Цена, BYN',
            'Вес, кг', 'Фото', 'Описание']
    wb = Workbook()
    ws = wb.active
    ws.title = 'Оснастка'
    ws.append(head)
    for r in out:
        ws.append([r['SKU'], r['Name'], r['Categories'], r['Attribute 1 value(s)'],
                   r['Attribute 2 value(s)'], r['Regular price'], r['Weight (kg)'],
                   len(r['Images'].split(', ')) if r['Images'] else 0,
                   re.sub(r'<[^>]+>', ' ', r['Description']).strip()[:600]])

    ws2 = wb.create_sheet('Без фото')
    ws2.append(['Артикул', 'Название', 'Раздел', 'Ссылка у поставщика'])
    for r, link in no_photo:
        ws2.append([r['SKU'], r['Name'], r['Categories'], link])

    for sheet, widths in ((ws, [18, 60, 55, 16, 14, 11, 10, 7, 70]),
                          (ws2, [18, 60, 55, 70])):
        sheet.freeze_panes = 'A2'
        sheet.auto_filter.ref = sheet.dimensions
        for i, w in enumerate(widths, 1):
            sheet.column_dimensions[get_column_letter(i)].width = w
        for cell in sheet[1]:
            cell.font = Font(bold=True)
            cell.alignment = Alignment(vertical='center')
    wb.save(XLSX)


def main():
    rows = read_source()
    folders = archive_folders()
    skus = assign_skus(rows)
    picked = pull_images(rows, folders, skus)

    out, no_photo, photo_rows = [], [], []
    for row in rows:
        okdp = row['okdp'].strip()
        sku = skus[okdp]
        photos = picked.get(okdp, [])
        item = to_woo(row, sku, photos)
        out.append(item)
        link = row['media_img'].strip()
        if not photos:
            no_photo.append((item, link))
        photo_rows.append({'Артикул': sku, 'Код поставщика': okdp,
                           'Название': row['name'].strip(),
                           'Файлов из архива': len(photos),
                           'Ссылка у поставщика': link})

    with DST.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS, lineterminator='\r\n')
        w.writeheader(); w.writerows(out)
    with PHOTO_REPORT.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(photo_rows[0]), lineterminator='\r\n')
        w.writeheader(); w.writerows(photo_rows)
    write_xlsx(out, no_photo)

    if not BEFORE.exists():
        shutil.copy2(WOO, BEFORE)
    with BEFORE.open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        base_columns, base = reader.fieldnames, list(reader)
    with WOO.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=base_columns, lineterminator='\r\n')
        w.writeheader(); w.writerows(base + [{c: r.get(c, '') for c in base_columns}
                                             for r in out])

    files = sum(len(v) for v in picked.values())
    by_okdp = sum(1 for r in out if r['SKU'].startswith(tuple(CYR2LAT)))
    print(f'товаров        : {len(out)}')
    print(f'разделов       : {len(set(r["Categories"] for r in out))}')
    print(f'с ценой        : {sum(1 for r in out if r["Regular price"])}')
    print(f'с описанием    : {sum(1 for r in out if r["Description"])}')
    print(f'с фото         : {len(picked)} товаров, файлов {files} → {IMAGES}/')
    print(f'без фото       : {len(no_photo)}'
          f' (из них со ссылкой у поставщика {sum(1 for _, l in no_photo if l)})')
    print(f'SKU по артикулу: {len(out) - by_okdp}, по коду поставщика: {by_okdp}')
    print(f'\n{WOO.name}: {len(base)} → {len(base) + len(out)}')
    print(f'{DST.name}, {XLSX.name}, {PHOTO_REPORT.name}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
