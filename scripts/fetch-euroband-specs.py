"""Технические характеристики лент EUROBAND с invit.by.

При первом переносе каталога описания сняли из админки ocStore, а таблица
характеристик на invit.by лежит ниже ссылки на технический лист — разбор
останавливался на ней, и таблица на сайт не попала. Скрипт забирает её с живых
страниц вместе с адресом PDF-файла.

Запуск: python3 scripts/fetch-euroband-specs.py
Пишет: files/euroband-specs.json — его читает patch-euroband-content.py
"""
import json, re, sys, urllib.request
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'files' / 'euroband-specs.json'

UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/124.0 Safari/537.36'}


def urls():
    """Адреса карточек EUROBAND: id берём из витрины, адрес — из снимка старого сайта."""
    catalog = (ROOT / 'src/data/catalog.generated.ts').read_text()
    start = catalog.index('RawProduct[] = [') + len('RawProduct[] = ')
    products = json.loads(catalog[start:catalog.index('];', start) + 1])
    own = [p['id'] for p in products if p.get('badge')]

    source = (ROOT / 'src/data/siteCatalogSource.ts').read_text()
    items = re.findall(r"id:\s*'([^']+)'(.*?)(?=\n  \{|\Z)", source, re.S)
    link = {}
    for ident, body in items:
        found = re.search(r"sourceUrl:\s*'([^']+)'", body)
        if found:
            link[ident] = found.group(1)
    return [(i, link[i]) for i in own if i in link]


def table_of(node):
    """Таблица как headers + rows. Пустые строки и служебные колонки отбрасываем."""
    rows = []
    for tr in node.find_all('tr'):
        cells = [' '.join(td.get_text(' ', strip=True).split())
                 for td in tr.find_all(['td', 'th'])]
        while cells and not cells[-1]:
            cells.pop()
        if any(cells):
            rows.append(cells)
    if not rows:
        return None
    width = max(len(r) for r in rows)
    rows = [r + [''] * (width - len(r)) for r in rows]
    return rows


def parse(html):
    """Характеристики лежат во вкладке «Характеристики» (#tab-attribute).

    Это атрибуты товара ocStore — отдельная таблица в базе, а не часть
    описания. Снимок админки, из которого собирали каталог, брал только
    описание, поэтому таблица и не доехала.
    """
    soup = BeautifulSoup(html, 'html.parser')

    pdf = ''
    for a in soup.find_all('a', href=True):
        if a['href'].lower().endswith('.pdf'):
            pdf = a['href']
            break

    specs = []
    tab = soup.select_one('#tab-attribute')
    if tab:
        for table in tab.find_all('table'):
            rows = table_of(table)
            if rows:
                specs.append(rows)
    return pdf, specs


def main():
    out = {}
    for ident, url in urls():
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as page:
                html = page.read().decode('utf-8', 'replace')
        except Exception as error:                      # noqa: BLE001
            print(f'  {ident}: не открылось — {error}', file=sys.stderr)
            continue
        pdf, specs = parse(html)
        out[ident] = {'url': url, 'pdf': pdf, 'tables': specs}
        print(f'{ident:52} таблиц {len(specs)}  pdf {"есть" if pdf else "нет"}')

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f'\n{OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
