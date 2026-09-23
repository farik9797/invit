"""Разбор копии invit.by: карточки товаров, сертификаты, технические листы.

Читает files/invit-site/ (его наполняет fetch-invit-site.py) и раскладывает
страницы по полям: заголовок, снимок, блоки описания, таблица характеристик,
ссылки на PDF. Блоки те же, что в src/data/productContent.ts.

Запуск: python3 scripts/parse-invit-site.py
Пишет: files/invit-site.json — его читает patch-invit-content.py
"""
import json, re, urllib.parse
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'files' / 'invit-site'
OUT = ROOT / 'files' / 'invit-site.json'

NBSP = ' '
DOWNLOAD = re.compile(r'файл(ы)? для скачивания', re.I)


def clean(text):
    """Текст без разметки. Склейку тегов делаем без пробела: на сайте слово
    нередко разорвано парой <span>, и разделитель рвал бы его пополам."""
    return ' '.join(text.replace(NBSP, ' ').split()).strip()


def original(url):
    """Адрес оригинала: превью лежат в /image/cache/ с суффиксом размера."""
    url = urllib.parse.urljoin('https://invit.by/', url).replace('http://', 'https://')
    url = url.replace('/image/cache/', '/image/')
    return re.sub(r'-\d+x\d+(\.\w+)$', r'\1', url)


def is_heading(node):
    """Заголовок: весь текст абзаца жирный. На сайте они ещё и синие.

    Сравниваем без пробелов и хвостовых знаков: слово нередко разорвано парой
    <strong>, а двоеточие в конце остаётся за их пределами.
    """
    text = clean(node.get_text())
    if not text or len(text) > 120:
        return False
    bold = ''.join(b.get_text() for b in node.find_all(['strong', 'b']))
    squeeze = lambda value: re.sub(r'[\s:.,;\u2013\u2014-]+$', '', re.sub(r'\s+', '', value))
    return bool(bold.strip()) and squeeze(clean(bold)) == squeeze(text)


def table_of(node):
    """Таблица как headers + rows: первая строка идёт в шапку, если она жирная."""
    rows = []
    for tr in node.find_all('tr'):
        cells = [clean(td.get_text()) for td in tr.find_all(['td', 'th'])]
        while cells and not cells[-1]:
            cells.pop()
        if any(cells):
            rows.append(cells)
    if not rows:
        return None
    width = max(len(r) for r in rows)
    rows = [r + [''] * (width - len(r)) for r in rows]
    first = node.find('tr')
    bold = bool(first.find(['strong', 'b'])) or bool(first.find('th'))
    headers, body = (rows[0], rows[1:]) if bold and len(rows) > 1 else ([''] * width, rows)
    # Колонка под картинку на сайте приходит пустой: выбрасываем такие целиком,
    # иначе в таблице остаётся пустой столбец.
    keep = [i for i in range(width) if any(row[i] for row in body)]
    if keep and len(keep) < width:
        headers = [headers[i] for i in keep]
        body = [[row[i] for i in keep] for row in body]
    return {'kind': 'table', 'headers': headers, 'rows': body}


def caption_of(img):
    """Подпись под иллюстрацию: она на сайте живёт в title ссылки и картинки."""
    link = img.find_parent('a')
    for source in ((link.get('title') if link else None), img.get('title'), img.get('alt')):
        text = clean(source or '')
        if text:
            return text
    return ''


def blocks_of(desc):
    """Описание -> блоки в исходном порядке. Ссылки на PDF уходят отдельно."""
    blocks, images, pdfs = [], [], []

    def add_image(img):
        src = original(img.get('src', ''))
        if not src:
            return
        images.append(src)
        block = {'kind': 'image', 'src': src}
        caption = caption_of(img)
        if caption:
            block['title'] = caption
        blocks.append(block)

    def walk(node):
        for child in node.children:
            if getattr(child, 'name', None) is None:
                text = clean(str(child))
                if text:
                    blocks.append({'kind': 'text', 'text': text})
                continue
            name = child.name
            if name == 'table':
                table = table_of(child)
                if table:
                    blocks.append(table)
                continue
            if name in ('ul', 'ol'):
                items = [clean(li.get_text()) for li in child.find_all('li')]
                items = [i for i in items if i]
                if items:
                    blocks.append({'kind': 'list', 'items': items})
                continue
            if name == 'img':
                add_image(child)
                continue
            if name in ('script', 'style'):
                continue
            if name == 'a' and re.search(r'\.pdf$', child.get('href', ''), re.I):
                pdfs.append({'url': urllib.parse.urljoin('https://invit.by/', child['href']),
                             'title': clean(child.get_text())})
                continue
            if name in ('p', 'div', 'h1', 'h2', 'h3', 'h4', 'span', 'td'):
                # Разбираем по частям только настоящие блоки. Иллюстрация внутри
                # абзаца — не повод дробить его текст на куски.
                if child.find(['table', 'ul', 'ol', 'p', 'div']):
                    walk(child)
                    continue
                link = child.find('a', href=re.compile(r'\.pdf$', re.I))
                if link:
                    pdfs.append({'url': urllib.parse.urljoin('https://invit.by/', link['href']),
                                 'title': clean(link.get_text())})
                    continue
                text = clean(child.get_text())
                if text and not DOWNLOAD.search(text):
                    blocks.append({'kind': 'heading' if is_heading(child) else 'text', 'text': text})
                for img in child.find_all('img'):
                    add_image(img)
                continue
            walk(child)

    walk(desc)
    for link in desc.find_all('a', href=re.compile(r'\.pdf$', re.I)):
        url = urllib.parse.urljoin('https://invit.by/', link['href'])
        if url not in [p['url'] for p in pdfs]:
            pdfs.append({'url': url, 'title': clean(link.get_text())})
    return blocks, images, pdfs


def attribute_of(soup):
    """Вкладка «Характеристики» — отдельная таблица ocStore под описанием."""
    tab = soup.find(id='tab-attribute')
    if not tab:
        return None
    head = tab.find('thead')
    title = clean(head.get_text()) if head else 'Технические характеристики'
    rows = []
    for tr in (tab.find('tbody') or tab).find_all('tr'):
        cells = [clean(td.get_text()) for td in tr.find_all('td')]
        if len(cells) >= 2 and any(cells):
            rows.append(cells[:2])
    return {'title': title, 'rows': rows} if rows else None


def main():
    index = json.loads((SITE / 'index.json').read_text(encoding='utf-8'))
    products, pages = {}, {}
    for url, file in sorted(index.items()):
        html = (SITE / 'pages' / file).read_text(encoding='utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        main_tag = soup.find('main', class_='content')
        if not main_tag:
            continue
        title = clean(main_tag.h1.get_text()) if main_tag.h1 else ''
        full = main_tag.find('div', class_='product-full')
        if not full:
            gallery = [{'url': original(a['href']), 'title': clean(a.find_next('div', class_='name').get_text())
                        if a.find_next('div', class_='name') else ''}
                       for a in main_tag.find_all('a', class_='colorbox')]
            pages[url] = {'title': title, 'gallery': gallery}
            continue
        desc = full.find('div', class_='desc')
        blocks, inline, pdfs = blocks_of(desc) if desc else ([], [], [])
        photo = full.find('a', class_='colorbox')
        images = ([original(photo['href'])] if photo and photo.get('href') else []) + inline
        attribute = attribute_of(soup)
        slug = urllib.parse.urlsplit(url).path.rstrip('/').rsplit('/', 1)[-1]
        products[url] = {'slug': urllib.parse.unquote(slug), 'title': title, 'images': images,
                         'blocks': blocks, 'attribute': attribute, 'pdfs': pdfs}

    OUT.write_text(json.dumps({'products': products, 'pages': pages}, ensure_ascii=False, indent=1),
                   encoding='utf-8')
    with_text = sum(1 for p in products.values() if p['blocks'])
    print(f'карточек: {len(products)}, с описанием: {with_text}, '
          f'с характеристиками: {sum(1 for p in products.values() if p["attribute"])}, '
          f'с PDF: {sum(1 for p in products.values() if p["pdfs"])}')
    print(f'прочих страниц: {len(pages)} -> {OUT}')


if __name__ == '__main__':
    main()
