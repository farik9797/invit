"""Правки клиента из «Коррекция … выгрузка товаров.xlsx» в сведённую выгрузку.

Разметка в файле цветом:
  * красный шрифт  — позицию удалить;
  * жёлтая заливка — перенести в другую группу, целевая группа записана
    в соседней колонке;
  * зелёная заливка — то, чего в выгрузке не хватает (часть строк — просто
    замечания текстом, они разбираются руками).

Пишет files/woocommerce_import_variations.csv, прежний файл сохраняет рядом
с суффиксом .before-corrections.

Запуск: python3 scripts/apply-corrections.py [путь к xlsx]
"""
import csv, shutil, sys
from collections import Counter, defaultdict
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parent.parent
BOOK = ROOT / 'files' / 'коррекция-15-09.xlsx'
WOO = ROOT / 'files' / 'woocommerce_import_variations.csv'
BACKUP = WOO.with_suffix('.csv.before-corrections')

RED = 'FFFF0000'        # шрифт: удалить
YELLOW = 'FFFFFF00'     # заливка: перенести
GREEN = 'FF92D050'      # заливка: не хватает

# Клиент пишет имена разделов чуть иначе, чем они заведены в каталоге.
SECTION_ALIAS = {
    'Кровельные уплотнители, клейкие ленты': 'Кровельные уплотнительные клейкие ленты',
}


def marks(ws, row):
    """Цвет строки: смотрим первые четыре колонки, размечена бывает любая."""
    red = fill = None
    for col in range(1, 5):
        cell = ws.cell(row, col)
        colour = getattr(cell.font.color, 'rgb', None) if cell.font.color else None
        if colour == RED:
            red = True
        patt = cell.fill
        value = getattr(patt.fgColor, 'rgb', None) if patt and patt.patternType else None
        if value in (YELLOW, GREEN):
            fill = value
    return red, fill


def read_book(path):
    """Три списка: что удалить, что куда перенести, что не хватает."""
    ws = load_workbook(path)['Товары']
    drop, move, missing, homeless = set(), {}, [], []

    for row in range(2, ws.max_row + 1):
        sku = str(ws.cell(row, 1).value or '').strip()
        red, fill = marks(ws, row)
        note = ws.cell(row, 5).value
        target = ws.cell(row, 6).value or (note if note and '>' in str(note) else None)

        if red and sku:
            drop.add(sku)
        elif fill == YELLOW and sku:
            if target:
                move[sku] = str(target).strip()
            else:
                homeless.append((sku, str(ws.cell(row, 3).value or '')))
        elif fill == GREEN:
            missing.append((sku, str(ws.cell(row, 2).value or ''), str(ws.cell(row, 3).value or '')))

    return drop, move, missing, homeless


def two_levels(target):
    """«Крепёж > Дюбельная техника > Дюбель распорный» → «Крепёж > Дюбель распорный».

    Третий уровень клиент придумал как группировку внутри раздела; в каталоге
    уровня два, поэтому запоминаем только раздел и сам подраздел.
    """
    parts = [p.strip() for p in str(target).split('>')]
    section = SECTION_ALIAS.get(parts[0], parts[0])
    return f'{section} > {parts[-1]}', (parts[1] if len(parts) == 3 else '')


def main():
    book = Path(sys.argv[1]) if len(sys.argv) > 1 else BOOK
    drop, move, missing, homeless = read_book(book)

    rows = list(csv.DictReader(open(WOO, encoding='utf-8-sig')))
    columns = list(rows[0].keys())
    parent_of = {r['SKU'].strip(): r['Parent'].strip() for r in rows if r['Type'] == 'variation'}

    # Перенос вариации — это перенос всей карточки: у исполнения своей группы нет
    moved_cards, groups = {}, Counter()
    for sku, target in move.items():
        card = parent_of.get(sku, sku)
        path, group = two_levels(target)
        moved_cards[card] = path
        if group:
            groups[group] += 1

    # Удаление вариации, после которого у карточки не осталось исполнений,
    # уносит и саму карточку: пустой родитель в WooCommerce не показывается.
    left = Counter(r['Parent'].strip() for r in rows
                   if r['Type'] == 'variation' and r['SKU'].strip() not in drop)
    had = Counter(r['Parent'].strip() for r in rows if r['Type'] == 'variation')
    orphans = {p for p in had if left[p] == 0}

    kept, dropped = [], Counter()
    for row in rows:
        sku = row['SKU'].strip()
        if sku in drop or sku in orphans:
            dropped[row['Type']] += 1
            continue
        card = parent_of.get(sku, sku)
        if card in moved_cards:
            row['Categories'] = moved_cards[card]
        kept.append(row)

    shutil.copy(WOO, BACKUP)
    with open(WOO, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, lineterminator='\r\n')
        writer.writeheader()
        writer.writerows(kept)

    print(f'удалено      : {sum(dropped.values())} строк {dict(dropped)}')
    print(f'перенесено   : {len(moved_cards)} карточек по {len(set(moved_cards.values()))} группам')
    for path, n in Counter(moved_cards.values()).most_common():
        print(f'   {n:4}  {path}')
    if groups:
        print('группировка клиента (в каталоге уровня нет):', dict(groups))
    if homeless:
        print(f'\nжёлтые без цели ({len(homeless)}) — оставлены на месте:')
        for sku, where in homeless:
            print(f'   {sku[:45]:45} {where}')
    if missing:
        print(f'\nзелёные — чего не хватает ({len(missing)}), разбираются руками:')
        for sku, name, where in missing:
            print(f'   {sku[:40]:40} {name[:50]:50} {where[:40]}')
    print(f'\nстрок было {len(rows)}, стало {len(kept)}  → {WOO.relative_to(ROOT)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
