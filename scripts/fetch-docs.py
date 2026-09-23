"""Техническая документация с invit.by/docs в public/docs/library.

На старом сайте это отдельная страница: ГОСТы, ТКП и СТБ по монтажным швам и
воздуховодам, схемы монтажа и рекламные листовки на ленты. Сайт заменяется,
поэтому файлы держим у себя, а список кладём в src/data/library.ts.

Запуск: python3 scripts/fetch-docs.py
Читает: files/invit-site/ (его наполняет fetch-invit-site.py)
Пишет: public/docs/library/* и src/data/library.ts
"""
import json, re, urllib.parse, urllib.request
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'files' / 'invit-site'
OUT = ROOT / 'public/docs/library'
DATA = ROOT / 'src/data/library.ts'
PAGE = 'https://invit.by/docs'

UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/131.0 Safari/537.36'}

TRANSLIT = {'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
            'ю': 'yu', 'я': 'ya'}

HEAD = """import { LibraryDoc } from '../types';

// Техническая документация со старого сайта (invit.by/docs): нормы по
// монтажным швам и воздуховодам, схемы монтажа, листовки на ленты.
// Собран scripts/fetch-docs.py, файлы лежат в public/docs/library.

export const LIBRARY: LibraryDoc[] = [
"""


def slugify(text):
    out = ''.join(TRANSLIT.get(ch, ch) for ch in text.lower())
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', out)).strip('-')[:60]


def quote(text):
    return "'" + text.replace('\\', '\\\\').replace("'", "\\'") + "'"


def main():
    index = json.loads((SITE / 'index.json').read_text(encoding='utf-8'))
    html = (SITE / 'pages' / index[PAGE]).read_text(encoding='utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    OUT.mkdir(parents=True, exist_ok=True)

    docs = []
    for block in soup.select('main.content div.list'):
        link = block.find('a', class_='download')
        title = ' '.join(block.select_one('.title').get_text().split())
        if not link or not title:
            continue
        # В именах файлов на сайте есть пробелы и восклицательные знаки —
        # без кодирования такой адрес не открыть.
        raw_url = urllib.parse.urljoin(PAGE, link['href'])
        parts = urllib.parse.urlsplit(raw_url)
        url = urllib.parse.urlunsplit(parts._replace(path=urllib.parse.quote(parts.path)))
        suffix = Path(urllib.parse.unquote(parts.path)).suffix.lower()
        name = slugify(title) + suffix
        target = OUT / name
        if not target.exists():
            try:
                request = urllib.request.Request(url, headers=UA)
                with urllib.request.urlopen(request, timeout=60) as response:
                    target.write_bytes(response.read())
            except Exception as error:
                print(f'  ! {title[:50]}: {error}')
                continue
        text = block.find('p')
        docs.append({'id': slugify(title), 'title': title,
                     'text': ' '.join(text.get_text().split()) if text else '',
                     'file': name, 'size': target.stat().st_size})
        print(f'  {name} — {target.stat().st_size // 1024} КБ')

    lines = [HEAD]
    for doc in docs:
        lines.append('  {')
        lines.append(f"    id: {quote(doc['id'])},")
        lines.append(f"    title: {quote(doc['title'])},")
        lines.append(f"    text: {quote(doc['text'])},")
        lines.append(f"    file: {quote(doc['file'])},")
        lines.append(f"    size: {doc['size']}")
        lines.append('  },')
    lines.append('];\n')
    DATA.write_text('\n'.join(lines), encoding='utf-8')
    print(f'документов: {len(docs)} -> {DATA.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
