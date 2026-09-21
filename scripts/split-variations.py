"""Разворачивает вариативные карточки обратно в обычные товары.

Клиент попросил все вариативные товары разделить на обычные: каждое
исполнение — своя карточка со своим названием, ценой и артикулом.

Правки клиента, заглушки и добавленные саморезы уже лежат в рабочем импорте
woocommerce_import_variations.csv, поэтому разворачиваем его, а не пересобираем
из плоской выгрузки: иначе все эти правки пропали бы.

Исполнение берёт у родителя то, чего у него самого нет: раздел (правки
клиента писали его в родителя), бренд и страну, описание и снимок. Скрытый
родитель прячет и свои исполнения.

Прежний файл сохраняется с суффиксом .before-split. Повторный запуск ничего
не меняет: вариативных строк в файле уже нет.

Запуск: python3 scripts/split-variations.py && python3 scripts/build-catalog.py
"""
import csv, shutil, sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WOO = ROOT / 'files' / 'woocommerce_import_variations.csv'
BACKUP = WOO.with_suffix('.csv.before-split')

# Что исполнение наследует от карточки, если своего нет
INHERIT = ['Short description', 'Description', 'Images',
           'Attribute 1 name', 'Attribute 1 value(s)', 'Attribute 1 visible', 'Attribute 1 global',
           'Attribute 2 name', 'Attribute 2 value(s)', 'Attribute 2 visible', 'Attribute 2 global']
AXIS = ['Attribute 3 name', 'Attribute 3 value(s)', 'Attribute 3 visible', 'Attribute 3 global']


def main():
    rows = list(csv.DictReader(open(WOO, encoding='utf-8-sig')))
    columns = list(rows[0].keys())
    kinds = Counter(r['Type'] for r in rows)
    if not kinds['variable'] and not kinds['variation']:
        print('вариативных строк нет — делать нечего')
        return 0

    parents = {r['SKU'].strip(): r for r in rows if r['Type'] == 'variable'}
    out, orphans = [], 0
    for row in rows:
        if row['Type'] == 'variable':
            continue                                    # карточка-обёртка больше не нужна
        if row['Type'] == 'variation':
            parent = parents.get(row['Parent'].strip())
            if parent is None:
                orphans += 1
            else:
                # Раздел — всегда родительский: правки клиента писали именно его
                row['Categories'] = parent['Categories']
                for column in INHERIT:
                    if not row[column].strip():
                        row[column] = parent[column]
                if parent['Published'].strip() == '0':
                    row['Published'] = '0'
            row['Type'] = 'simple'
            row['Parent'] = ''
            for column in AXIS:
                row[column] = ''
        out.append(row)

    shutil.copy(WOO, BACKUP)
    with open(WOO, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, lineterminator='\r\n')
        writer.writeheader()
        writer.writerows(out)

    print(f'было       : {len(rows)} строк {dict(kinds)}')
    print(f'развёрнуто : {kinds["variable"]} карточек → {kinds["variation"]} обычных товаров')
    if orphans:
        print(f'исполнений без родителя: {orphans} — оставлены как есть')
    print(f'стало      : {len(out)} строк, все simple')
    print(f'прежний файл: {BACKUP.relative_to(ROOT)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
