"""Выгрузка товаров с сайта клиента invit.by в xlsx.

Берёт разбор обхода (`files/invit-site.json`, его делает parse-invit-site.py)
и выписывает всё, что на сайте есть у карточки: название, раздел из адреса,
описание, размерную таблицу, снимки и приложенные PDF.

Запуск: python3 scripts/build-invit-site-sheet.py
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'files/invit-site.json'
CRAWL = ROOT / 'files/invit-site'
OUT = ROOT / 'files/выгрузка-invit-by.xlsx'


def section_names():
    """Адрес раздела -> его название. В адресах invit.by латиница
    («flancevyj profil'»), а человеческое имя лежит в заголовке h1 страницы
    раздела — забираем его из сохранённого обхода."""
    index = json.loads((CRAWL / 'index.json').read_text(encoding='utf-8'))
    out = {}
    for url, name in index.items():
        path = CRAWL / 'pages' / name
        if not path.exists():
            continue
        found = re.search(r'<h1[^>]*>(.*?)</h1>',
                          path.read_text(encoding='utf-8', errors='replace'), re.S)
        if found:
            out[url.rstrip('/')] = ' '.join(re.sub(r'<[^>]+>', '', found.group(1)).split())
    return out


def parts(url, names):
    """Раздел и подраздел товара: адрес страницы на invit.by и есть дерево."""
    tail = url.split('invit.by/', 1)[-1].strip('/').split('/')
    out = []
    for depth in (1, 2):
        if depth < len(tail):
            branch = 'https://invit.by/' + '/'.join(tail[:depth])
            out.append(names.get(branch, tail[depth - 1]))
    return (out + ['', ''])[:2]


def text_of(product):
    out = []
    for block in product['blocks']:
        if block['kind'] == 'text':
            out.append(block['text'])
        elif block['kind'] == 'list':
            out.extend(f'— {item}' for item in block['items'])
    return '\n'.join(out)


def table_of(product):
    """Размерный ряд одной строкой: «шапка: значение; …»."""
    for block in product['blocks']:
        if block['kind'] == 'table' and block.get('rows'):
            head = ' | '.join(block.get('headers') or [])
            rows = ['; '.join(r) for r in block['rows']]
            return (head + '\n' if head else '') + '\n'.join(rows)
    return ''


def main():
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font

    products = json.load(SRC.open(encoding='utf-8'))['products']
    names = section_names()

    book = Workbook()
    sheet = book.active
    sheet.title = 'invit.by'
    header = ['Раздел', 'Подраздел', 'Название', 'Описание', 'Размерный ряд',
              'Снимки', 'Файлы PDF', 'Адрес страницы']
    sheet.append(header)
    for cell in sheet[1]:
        cell.font = Font(bold=True)
    for column, width in zip('ABCDEFGH', (34, 34, 60, 80, 46, 46, 30, 60)):
        sheet.column_dimensions[column].width = width
    sheet.freeze_panes = 'A2'

    rows = sorted(products.items(), key=lambda kv: (parts(kv[0], names), kv[1]['title'].lower()))
    for url, product in rows:
        section, sub = parts(url, names)
        sheet.append([
            section, sub, product['title'],
            text_of(product)[:4000], table_of(product)[:2000],
            '\n'.join(product.get('images', [])),
            '\n'.join(f.get('href', '') if isinstance(f, dict) else str(f)
                      for f in product.get('pdfs', [])),
            url
        ])

    for row in sheet.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical='top', wrap_text=True)
    sheet.auto_filter.ref = f'A1:H{len(rows) + 1}'
    book.save(OUT)

    print(f'товаров: {len(rows)}')
    print(f'с описанием   : {sum(1 for _, p in rows if text_of(p))}')
    print(f'с таблицей    : {sum(1 for _, p in rows if table_of(p))}')
    print(f'со снимком    : {sum(1 for _, p in rows if p.get("images"))}')
    print(f'-> {OUT.relative_to(ROOT)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
