#!/usr/bin/env python3
"""
Описания разделов со старого invit.by -> invit-theme/data/category-info.json.

На прежнем сайте у части разделов над товарами стоял текст: заголовок и
описание (монтажный шов в три слоя, виды пены, герметиков и т. п.). Скрипт
берёт их из локальной копии сайта (files/invit-site, её собирает
fetch-invit-site.py), чистит разметку OpenCart и переводит ссылки со старых
адресов на новые. Тема заносит текст в описание категории WooCommerce —
дальше его правят в админке (Товары -> Категории).

Запуск: python3 scripts/build-category-info.py
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'files' / 'invit-site'
OUT = ROOT / 'invit-theme' / 'data' / 'category-info.json'

# Старый раздел -> новый раздел или подраздел (адрес в WooCommerce).
# Фланцевого профиля в новом каталоге нет, его описание прикрепить некуда.
SECTIONS = {
    '/materialy-dlja-montazha-okon-uplotniteli/montazhnye-lenty': 'montazhnye-lenty-dlya-okon',
    '/materialy-dlja-montazha-okon-uplotniteli/lenta-psul': 'samorasshiryayuschayasya-lenta-psul',
    '/materialy-dlja-montazha-okon-uplotniteli/pena-montazhnaja-ochistiteli': 'pena-montazhnaya',
    '/materialy-dlja-montazha-okon-uplotniteli/germetiki-klei': 'germetiki',
    "/materialy-dlja-montazha-okon-uplotniteli/uplotnitel'nye-lenty-samoklejashhiesja-ppje": 'uplotnitelnye-lenty-pes-samokleyaschiesy',
    '/materialy-dlja-montazha-okon-uplotniteli/uplotniteli': 'uplotnitel-rezinovyy-d-p-e',
    '/komplektujushhie-dlja-vozduhovodov-i-sistem-ventiljacii/ugolki-montazhnye': 'ugolki-montazhnye',
    '/komplektujushhie-dlja-vozduhovodov-i-sistem-ventiljacii/antikorrozijnyj-cink-sprej': 'sprey-aerozol-cinkovyy',
}

# Ссылки внутри описаний: старый адрес -> новый (раздел ?sub= или товар)
LINKS = {
    '/materialy-dlja-montazha-okon-uplotniteli/lenta-psul': '/catalog/materialy-dlya-okon/?sub=samorasshiryayuschayasya-lenta-psul',
    '/materialy-dlja-montazha-okon-uplotniteli/montazhnye-lenty/diffuzionnaja-lenta-euroband-nl': '/catalog/materialy-dlya-okon/diffuzionnaja-lenta-euroband-nl/',
    '/materialy-dlja-montazha-okon-uplotniteli/montazhnye-lenty/paroizoljacionnaja-lenta-euroband-vla': '/catalog/materialy-dlya-okon/paroizoljacionnaja-lenta-euroband-vla/',
    '/materialy-dlja-montazha-okon-uplotniteli/montazhnye-lenty/paroizoljacionnaja-lenta-euroband-vl': '/catalog/materialy-dlya-okon/paroizoljacionnaja-lenta-euroband-vl/',
    '/materialy-dlja-montazha-okon-uplotniteli/pena-montazhnaja-ochistiteli/pena-professional': '/catalog/pena-montazhnaya/?sub=pena-montazhnaya-ppu',
    '/materialy-dlja-montazha-okon-uplotniteli/pena-montazhnaja-ochistiteli/pena-montazhnaja-bytovaja': '/catalog/pena-montazhnaya/?sub=pena-montazhnaya-ppu',
    '/materialy-dlja-montazha-okon-uplotniteli/germetiki-klei/germetiki-akrilovye': '/catalog/germetiki/?sub=germetiki-akrilovye',
    '/materialy-dlja-montazha-okon-uplotniteli/germetiki-klei/germetiki-silikonovye': '/catalog/germetiki/?sub=germetiki-silikonovye',
    '/materialy-dlja-montazha-okon-uplotniteli/pistolety-dlja-peny-i-germetikov/pistolety-dlja-germetikov': '/catalog/instrument-oborudovanie/?sub=pistolety-dlya-germetika',
}

# Фразы, которые на новом сайте стали неправдой: в разделе «Герметики» клеи,
# смазки и химия для окон теперь лежат отдельным разделом.
DROP = [
    re.compile(r'В этом разделе сайта кроме герметиков[^<]*'),
]
TITLES = {
    'germetiki': 'Герметики силиконовые и акриловые',
}


def old_path(url):
    path = re.sub(r'^https?://(www\.)?invit\.by', '', url).split('?')[0].rstrip('/')
    return path.replace('%27', "'")


def clean(fragment):
    s = fragment
    for rule in DROP:
        s = rule.sub('', s)
    s = re.sub(r'\s(style|class|align|id)="[^"]*"', '', s)
    s = re.sub(r'</?span[^>]*>', '', s)
    s = re.sub(r'<b>', '<strong>', s).replace('</b>', '</strong>')
    s = re.sub(r'<(/?)div>', r'<\1p>', s)

    def link(m):
        target = LINKS.get(old_path(m.group(1)))
        text = m.group(2)
        return f'<a href="{target}">{text}</a>' if target else text

    s = re.sub(r'<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', link, s, flags=re.S)
    s = s.replace('&nbsp;', ' ')
    s = re.sub(r'\s+', ' ', s)
    # Пустые абзацы и пробелы у тегов — отбивку даёт вёрстка темы
    s = re.sub(r'<p>\s*</p>', '', s)
    s = re.sub(r'\s*(</?(?:p|ul|li)>)\s*', r'\1', s)
    s = re.sub(r'(<li>)\s*', r'\1', s)
    # Двойные div старого сайта дают вложенные абзацы
    while '<p><p>' in s or '</p></p>' in s:
        s = s.replace('<p><p>', '<p>').replace('</p></p>', '</p>')
    s = re.sub(r'<p>\s*</p>', '', s)
    # Список внутри абзаца старого сайта: закрывающий </p> после него лишний
    s = s.replace('</ul></p>', '</ul>')
    return s.strip()


def main():
    index = json.loads((SITE / 'index.json').read_text(encoding='utf-8'))
    pages = {old_path(url): name for url, name in index.items()}
    out = {}
    for old, slug in SECTIONS.items():
        page = (SITE / 'pages' / pages[old]).read_text(encoding='utf-8', errors='replace')
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', page, re.S)
        body = page[h1.end():page.find('<div class="products"', h1.end())]
        title = TITLES.get(slug) or html.unescape(re.sub(r'<[^>]+>', '', h1.group(1))).strip().rstrip('.')
        out[slug] = {'old': old, 'title': title, 'html': clean(body)}

    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{len(out)} описаний -> {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
