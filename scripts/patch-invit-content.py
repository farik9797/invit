"""Переписывает src/data/productContent.ts по свежей копии invit.by.

Источник — files/invit-site.json (parse-invit-site.py). Таблица вкладки
«Характеристики» добавляется в конец описания отдельным блоком: в разметке
сайта она лежит вне описания, а на карточке ей место рядом с текстом.

Запуск: python3 scripts/patch-invit-content.py
Пишет: src/data/productContent.ts (порядок карточек сохраняется)
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'files' / 'invit-site.json'
SOURCE = ROOT / 'src/data/siteCatalogSource.ts'
CATALOG = ROOT / 'src/data/catalog.generated.ts'
CONTENT = ROOT / 'src/data/productContent.ts'

HEAD = """import { ProductContent } from '../types';

// Полное содержимое карточек товаров с invit.by: галерея и блоки описания
// в исходном порядке (заголовки, абзацы, списки, таблицы, иллюстрации).
// Файл грузится отдельным чанком — только на странице товара.
//
// Собран scripts/patch-invit-content.py из копии сайта в files/invit-site/.
// Руками не правится: правки затрёт следующий прогон.

export const PRODUCT_CONTENT: Record<string, ProductContent> = {"""


def quote(text):
    return "'" + text.replace('\\', '\\\\').replace("'", "\\'") + "'"


def ident_by_url():
    """Идентификаторы карточек витрины по адресу страницы старого сайта."""
    source = SOURCE.read_text(encoding='utf-8')
    found = {}
    for ident, body in re.findall(r"id:\s*'([^']+)'(.*?)(?=\n  \{|\Z)", source, re.S):
        url = re.search(r"sourceUrl:\s*'([^']+)'", body)
        if url:
            found[url.group(1).rstrip('/')] = ident
    return found


def ident_by_title():
    """Карточки витрины по названию: адрес на старом сайте совпадает не всегда.

    Часть позиций пришла из выгрузки поставщика с тем же названием, но своим
    идентификатором — описание надо класть под него, иначе оно не найдётся.
    """
    catalog = CATALOG.read_text(encoding='utf-8')
    start = catalog.index('RawProduct[] = [') + len('RawProduct[] = ')
    products = json.loads(catalog[start:catalog.index('];', start) + 1])
    found, seen = {}, set()
    for product in products:
        key = ' '.join(product['title'].split()).lower()
        if key in found:
            seen.add(key)
        found[key] = product['id']
    return {k: v for k, v in found.items() if k not in seen}, {p['id'] for p in products}


def render(block):
    kind = block['kind']
    if kind in ('heading', 'text'):
        return f"      {{ kind: '{kind}', text: {quote(block['text'])} }},"
    if kind == 'image':
        return f"      {{ kind: 'image', src: {quote(block['src'])} }},"
    if kind == 'list':
        items = ', '.join(quote(i) for i in block['items'])
        return f"      {{ kind: 'list', items: [{items}] }},"
    headers = ', '.join(quote(h) for h in block['headers'])
    rows = '\n'.join('        [' + ', '.join(quote(c) for c in row) + '],' for row in block['rows'])
    return f"      {{ kind: 'table', headers: [{headers}], rows: [\n{rows}\n      ] }},"


def main():
    site = json.loads(SITE.read_text(encoding='utf-8'))['products']
    by_url = ident_by_url()
    by_title, catalog_ids = ident_by_title()
    parsed, renamed = {}, 0
    for url, product in site.items():
        ident = by_url.get(url.rstrip('/'))
        if not ident:
            continue
        if ident not in catalog_ids:
            same = by_title.get(' '.join(product['title'].split()).lower())
            if same:
                ident, renamed = same, renamed + 1
        blocks = list(product['blocks'])
        if product['attribute']:
            blocks.append({'kind': 'heading', 'text': product['attribute']['title']})
            blocks.append({'kind': 'table', 'headers': ['Показатель', 'Значение'],
                           'rows': product['attribute']['rows']})
        parsed[ident] = {'images': product['images'], 'blocks': blocks}

    # Порядок прежнего файла: так видно правки, а не перестановку карточек.
    before = re.findall(r"^  '([^']+)':", CONTENT.read_text(encoding='utf-8'), re.M) if CONTENT.exists() else []
    order = [i for i in before if i in parsed] + [i for i in parsed if i not in before]

    out = [HEAD]
    for ident in order:
        item = parsed[ident]
        out.append(f'  {quote(ident)}: {{')
        out.append('    images: [')
        out += [f'      {quote(src)},' for src in item['images']]
        out.append('    ],')
        out.append('    blocks: [')
        out += [render(b) for b in item['blocks']]
        out.append('    ]')
        out.append('  },')
    out.append('};\n')
    CONTENT.write_text('\n'.join(out), encoding='utf-8')

    empty = sum(1 for i in order if not parsed[i]['blocks'])
    alive = sum(1 for i in order if i in catalog_ids)
    print(f'карточек: {len(order)}, без описания: {empty}, '
          f'новых против прежнего файла: {len([i for i in order if i not in before])}')
    print(f'привязано к витрине: {alive} (из них по названию: {renamed}), '
          f'без карточки в витрине: {len(order) - alive}')


if __name__ == '__main__':
    main()
