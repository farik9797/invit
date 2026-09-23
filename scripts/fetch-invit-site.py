"""Полная копия invit.by: обходит сайт и складывает страницы в files/invit-site/.

Сайт клиента заменяется новым, поэтому исходник нужен у нас целиком — из этих
страниц берутся описания, характеристики, иллюстрации и сертификаты.

Запуск: python3 scripts/fetch-invit-site.py [--force]
Пишет: files/invit-site/pages/*.html и files/invit-site/index.json (адрес -> файл).
Повторный запуск докачивает недостающее; --force перечитывает всё заново.
"""
import hashlib, json, re, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'files' / 'invit-site'
PAGES = OUT / 'pages'
INDEX = OUT / 'index.json'

HOST = 'invit.by'
START = 'https://invit.by/'
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/131.0 Safari/537.36'}

# robots.txt сайта: служебные маршруты и сортировки не трогаем.
SKIP = re.compile(r'route=(account|affiliate|checkout|product/search)|[?&](sort|order|limit|filter_|tracking)=|'
                  r'^/(admin|catalog|download|system)/')


def normal(url):
    """Адрес без якоря и завершающего слэша; относительные — от корня сайта."""
    url = urllib.parse.urljoin(START, url.strip())
    parts = urllib.parse.urlsplit(url)
    if parts.netloc.replace('www.', '') != HOST:
        return None
    if parts.scheme not in ('http', 'https'):
        return None
    path = parts.path or '/'
    if SKIP.search(path + ('?' + parts.query if parts.query else '')):
        return None
    if re.search(r'\.(jpg|jpeg|png|gif|webp|pdf|zip|doc|docx|xls|xlsx|css|js)$', path, re.I):
        return None
    return urllib.parse.urlunsplit(('https', HOST, path.rstrip('/') or '/', parts.query, ''))


def name_of(url):
    """Имя файла из адреса: путь через дефисы плюс хвост хеша.

    Без хеша длинные адреса каталога обрезаются до неразличимых и разные
    товары пишутся в один файл — так карточка соседнего товара однажды
    затёрла описание пистолета.
    """
    parts = urllib.parse.urlsplit(url)
    path = parts.path.strip('/') + ('-' + parts.query if parts.query else '')
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', urllib.parse.unquote(path)).strip('-')
    tail = hashlib.sha1(url.encode()).hexdigest()[:6]
    return f"{(slug or 'index')[:110]}-{tail}.html"


def fetch(url, tries=3):
    for attempt in range(tries):
        try:
            request = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read().decode('utf-8', 'replace')
        except Exception as error:
            if attempt == tries - 1:
                print(f'  ! {url}: {error}')
                return None
            time.sleep(1.5 * (attempt + 1))


def links(html):
    return [u for u in (normal(h) for h in re.findall(r'href="([^"#]+)', html)) if u]


def main():
    force = '--force' in sys.argv
    PAGES.mkdir(parents=True, exist_ok=True)
    index = json.loads(INDEX.read_text()) if INDEX.exists() and not force else {}

    seen = set(index)
    queue = [START] if force or not index else []
    queue += [u for u in index if not (PAGES / index[u]).exists()]
    if not queue:
        queue = [START]
    seen |= set(queue)

    while queue:
        batch, queue = queue[:8], queue[8:]
        with ThreadPoolExecutor(max_workers=8) as pool:
            pages = list(pool.map(fetch, batch))
        for url, html in zip(batch, pages):
            if not html:
                continue
            file = name_of(url)
            (PAGES / file).write_text(html, encoding='utf-8')
            index[url] = file
            for found in links(html):
                if found not in seen:
                    seen.add(found)
                    queue.append(found)
        print(f'\r  скачано {len(index)}, в очереди {len(queue)}', end='', flush=True)
        time.sleep(0.2)

    INDEX.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'\nстраниц: {len(index)} -> {PAGES}')


if __name__ == '__main__':
    main()
