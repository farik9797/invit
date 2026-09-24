"""Каталог сайта из сведённой выгрузки.

Читает `files/woocommerce_import_variations.csv` (там уже собраны вариации) и
пишет `src/data/catalog.generated.ts`: разделы и товары в том виде, в каком их
ждут страницы. Фото переводит в webp 500px и кладёт в `public/products/`.

Именно в `public`, а не в `src/assets`: двум тысячам файлов нужен был бы
`import.meta.glob`, и dev-сервер тянул бы их по одному запросу на файл — первая
отрисовка занимала минуты. Из `public` они уходят в сборку как есть, а имя файла
совпадает с идентификатором товара.

Дерево разделов задано клиентом (STRUCTURE) — одиннадцать разделов в его
порядке. Подразделы, в которых есть товары, но которых в списке клиента нет,
дописываются в конец своего раздела: иначе шестьсот позиций крепежа оказались
бы без места. Пустые подразделы не показываем.

Идентификатор товара: где он был на сайте, там и остаётся прежним — иначе
отвалятся подробные описания из `productContent.ts`, они лежат по этому ключу.
Для остальных собираем из названия.

Адрес страницы и имя файла с фото берём не из идентификатора, а из его безопасного
вида: у шести десятков позиций с invit.by в идентификаторе сидит «%27» (апостроф
из адреса), браузер его раскодирует обратно в «'», и товар переставал находиться.

Запуск: python3 scripts/build-catalog.py
"""
import csv, html, io, json, pathlib, re, shutil, sys
from collections import defaultdict

ROOT = pathlib.Path(__file__).parent.parent
SRC = ROOT / 'files/woocommerce_import_variations.csv'
DST = ROOT / 'src/data/catalog.generated.ts'
TEXTS = ROOT / 'src/data/catalogDescriptions.ts'
IMAGES_IN = ROOT / 'files/images'
IMAGES_OUT = ROOT / 'public/products'
CONTENT = ROOT / 'src/data/productContent.ts'

# Раздел клиента -> (slug, подразделы в порядке клиента). Ключ подраздела —
# как он называется в выгрузке; None означает «в выгрузке такого нет».
DOWELS = 'Дюбельная техника'
METRIC = 'Метрический крепёж'

STRUCTURE = [
    ('Материалы для монтажа окон', 'materialy-dlya-okon', 'windows', [
        ('Монтажные ленты для окон', 'montazhnye-lenty-dlya-okon'),
        ('Саморасширяющаяся лента ПСУЛ', 'samorasshiryayuschayasya-lenta-psul'),
        ('Полнобутиловые ленты', 'polnobutilovye-lenty'),
        ('Пена монтажная, очиститель для пены', 'pena-montazhnaya-ochistitel-dlya-peny'),
        ('Клинья, заглушки', 'klinya-zaglushki'),
    ]),
    ('Герметики', 'germetiki', 'windows', [
        ('Силиконовые', 'germetiki-silikonovye'),
        ('Акриловые', 'germetiki-akrilovye'),
        ('Акрилатные', 'germetiki-akrilatnye'),
        ('Полиуретановые', 'germetiki-poliuretanovye'),
    ]),
    ('Клей, химия, смазки', 'kley-himiya-smazki', 'windows', [
        ('Химия для окон COSMOFEN', 'himiya-dlya-okon-cosmofen'),
        ('Смазки аэрозольные', 'smazki-aerozolnye'),
        ('Краски, грунтовки', 'kraski-gruntovki'),
    ]),
    ('Уплотнительные ленты ПЭС самоклеящаяся', 'uplotnitelnye-lenty-pes-samokleyaschiesy', 'windows', [
        ('Звукоизоляционная лента', 'zvukoizolyacionnaya-lenta'),
        ('Межфланцевая лента', 'pes-mezhflancevaya-lenta'),
        ('Лента под контробрешётку', 'pes-lenta-pod-kontrobreshyotku'),
        ('Лента для сэндвич-панелей', 'lenta-dlya-sendvich-paneley'),
        ('Шумопоглощающая лента', 'shumopogloschayuschaya-lenta'),
        ('Демпферная лента', 'dempfernaya-lenta'),
    ]),
    ('Кровельные уплотнительные клейкие ленты', 'krovelnye-uplotniteli-kleykie-lenty', 'windows', [
        ('Лента под контробрешётку', 'lenta-pod-kontrobreshyotku'),
        ('Уплотнитель универсальный саморасширяющийся ПСУЛ', 'uplotnitel-universalnyy-psul'),
        ('Лента бутилкаучуковая EUROBAND ЛБ', 'lenta-butilkauchukovaya-lb'),
        ('Лента бутилкаучуковая EUROBAND ЛБА', 'lenta-butilkauchukovaya-lba'),
        ('Клейкая лента двухсторонняя', 'kleykaya-lenta-dvuhstoronnyaya'),
    ]),
    ('Резиновые уплотнители для окон дверей и EPDM', 'uplotnitel-rezinovyy-d-p-e', 'windows', [
        ('Уплотнитель D', 'uplotnitel-d'),
        ('Уплотнитель P', 'uplotnitel-p'),
        ('Уплотнитель E', 'uplotnitel-e'),
        ('Уплотнитель W', 'uplotnitel-w'),
    ]),
    ('Крепёж', 'krepezh', 'windows', [
        ('Анкерный крепёж', 'anker-ramnyy'),
        ('Пластина анкерная', 'plastina-ankernaya'),
        ('Кронштейн опорный для отливов', 'kronshteyn-opornyy-dlya-otlivov'),
        ('Шуруп по бетону (нагель)', 'shurup-po-betonu-nagel'),
        ('Шуруп универсальный', 'shurup-universalnyy'),
        ('Саморез оконный острый', 'samorez-okonnyy-ostryy'),
        ('Саморез оконный со сверлом', 'samorez-okonnyy-so-sverlom'),
        ('Шуруп с полусферической головкой', 'shurup-s-polusfericheskoy-golovkoy'),
        ('Саморез с пресс-шайбой острый', 'samorez-s-press-shayboy-ostryy'),
        ('Саморез с пресс-шайбой со сверлом', 'samorez-s-press-shayboy-so-sverlom'),
        ('Саморез для сэндвич-панелей', 'samorez-dlya-sendvich-paneley'),
        ('Заклёпки', 'zaklyopki'),
        ('Саморез для фасадных систем', 'samorez-dlya-fasadnyh-sistem'),
        ('Саморез кровельный', 'samorez-krovelnyy'),
        ('Шуруп с шестигранной головкой', 'shurup-s-shestigrannoy-golovkoy'),
        ('Шуруп конструкционный', 'shurup-konstrukcionnyy'),
        # Третий элемент — группа: подразделы с одинаковой группой идут подряд
        # под её заголовком. Так клиент собрал дюбели правкой от 15.09.
        ('Дюбель-гвоздь', 'dyubel-gvozd', DOWELS),
        ('Дюбель распорный', 'dyubel-raspornyy', DOWELS),
        ('Дюбель рамный', 'dyubel-ramnyy', DOWELS),
        ('Дюбель для теплоизоляции', 'dyubel-dlya-teploizolyacii', DOWELS),
        ('Дюбель металлический для пустотелых конструкций', 'dyubel-metallicheskiy-pustotelyy', DOWELS),
        ('Скобяные изделия', 'skobyanye-izdeliya'),
        ('Перфолента', 'perfolenta'),
        ('Хомуты', 'krepezh-homuty'),
        # Метрический крепёж: болты, гайки и шайбы завели по выгрузке
        # «Болты, гайки, шайбы» — отдельной группой, как у поставщика.
        ('Шпилька резьбовая', 'shpilka-rezbovaya', METRIC),
        ('Болты', 'bolty', METRIC),
        ('Гайки', 'gayki', METRIC),
        ('Шайбы', 'shayby', METRIC),
    ]),
    ('Алюминиевые и армированные ленты (скотч)', 'alyuminievye-armirovannye-lenty', 'windows', [
        ('Алюминиевые ленты ALU', 'alyuminievye-lenty-alu'),
        ('Армированные ленты TPL', 'armirovannye-lenty-tpl'),
        ('Малярная лента', 'malyarnaya-lenta'),
        ('Изоляционные ленты', 'izolyacionnye-lenty'),
    ]),
    # Перфолента, хомуты и шпильки уехали в крепёж, кронштейны переименованы —
    # правка клиента от 15.09.
    ('Комплектующие для воздуховодов и систем вентиляции', 'ventilyaciya', 'hvac', [
        ('Уголки монтажные', 'ugolki-montazhnye'),
        ('Кронштейн', 'kronshteyny-l-v-z-p'),
        ('Струбцины', 'strubciny'),
        ('Скоба', 'skoba'),
        ('Хомуты', 'homuty'),
        ('Траверса', 'profil-montazhnyy-traversa'),
        ('Профиль монтажный L, U', 'profil-montazhnyy-l-u'),
        ('Анкер латунный (цанга)', 'anker-latunnyy-canga'),
        ('Спрей-аэрозоль', 'sprey-aerozol-cinkovyy'),
        ('Элементы оснащения', 'elementy-osnascheniya'),
    ]),
    ('Инструмент, оборудование', 'instrument-oborudovanie', 'windows', [
        ('Пистолеты для пены', 'pistolety-dlya-peny'),
        ('Пистолеты для герметика', 'pistolety-dlya-germetika'),
        ('Инструмент отделочный', 'instrument-otdelochnyy'),
        ('Инструмент режущий', 'instrument-rezhuschiy'),
        ('Инструмент измерительный', 'instrument-izmeritelnyy'),
        ('Инструмент крепёжный', 'instrument-krepyozhnyy'),
        ('Инструмент слесарный', 'instrument-slesarnyy'),
        ('Лестницы, стремянки', 'lestnicy-stremyanki'),
    ]),
    ('СИЗ и расходные материалы', 'siz-rashodnye-materialy', 'windows', [
        ('Перчатки', 'perchatki'),
        ('Очки', 'ochki'),
        ('Маски', 'maski'),
        ('Наушники', 'naushniki'),
        ('Плёнка укрывочная', 'plyonka-ukryvochnaya'),
        ('Стрейч-плёнка', 'streych-plyonka'),
        ('Мешки для строительного мусора', 'meshki-dlya-musora'),
    ]),
]

# Оснастки в списке клиента нет, а в выгрузке она есть — 3388 позиций. Держим
# отдельным разделом и по второму уровню дерева поставщика: третий даёт
# семьдесят подразделов, в меню это нечитаемо.
OSNASTKA = ('Оснастка к электроинструменту', 'osnastka-k-elektroinstrumentu', 'windows')

# Товары, которые в выгрузке лежат не там, где их ждёт клиент. Ключ — кусок
# названия, значение — куда положить.
MOVES = [
    (r'ПСУЛ EUROBAND для монтажа окон',
     ('Материалы для монтажа окон', 'Саморасширяющаяся лента ПСУЛ')),
    # ЛБ клиент правкой от 15.09 отправил в кровельные ленты, осталась ЛБА
    (r'EUROBAND ЛБА,',
     ('Материалы для монтажа окон', 'Полнобутиловые ленты')),
    # Лента ПЭС: клиент называет её и в кровельных, и в ПЭС. Товар из ПЭС,
    # поэтому кладём по материалу.
    (r'ПЭС EUROBAND под контробрешётку',
     ('Уплотнительные ленты ПЭС самоклеящаяся', 'Лента под контробрешётку')),
    # Три ленты попали в «межфланцевую» вентиляции при сведении, хотя это
    # обычные алюминиевая и тканевые армированные.
    (r'^Лента алюминиевая армированная',
     ('Алюминиевые и армированные ленты (скотч)', 'Алюминиевые ленты ALU')),
    (r'^Лента ТПЛ армированная',
     ('Алюминиевые и армированные ленты (скотч)', 'Армированные ленты TPL')),
]

# Подпись раздела в каталоге: одна строка о том, что внутри.
DESCRIPTIONS = {
    'materialy-dlya-okon': 'Ленты EUROBAND собственного производства, пена, клинья — всё для монтажного шва.',
    'germetiki': 'Силиконовые, акриловые, акрилатные и полиуретановые составы для швов и стыков.',
    'kley-himiya-smazki': 'Химия для окон COSMOFEN, аэрозольные смазки и составы для ухода за профилем.',
    'uplotnitelnye-lenty-pes-samokleyaschiesy': 'Ленты из вспененного полиэтилена EUROBAND: звукоизоляция, демпфирование, уплотнение стыков.',
    'krovelnye-uplotniteli-kleykie-lenty': 'Бутилкаучуковые и двухсторонние ленты, ПСУЛ и уплотнители для кровли.',
    'uplotnitel-rezinovyy-d-p-e': 'Профили D, P, E и W для окон, дверей и вентиляционных соединений.',
    'krepezh': 'Саморезы, шурупы, дюбели, заклёпки и анкеры для окон, кровли и фасадов.',
    'alyuminievye-armirovannye-lenty': 'Ленты ALU и TPL, малярная и изоляционная — для воздуховодов, кровли и отделки.',
    'ventilyaciya': 'Фланцевый профиль, траверсы, кронштейны и крепёж для изготовления и монтажа воздуховодов.',
    'instrument-oborudovanie': 'Пистолеты для пены и герметика, режущий, слесарный и измерительный инструмент, лестницы.',
    'siz-rashodnye-materialy': 'Перчатки, очки, маски, наушники, плёнка и мешки для стройплощадки.',
    'osnastka-k-elektroinstrumentu': 'Буры, свёрла, круги, коронки и шлифматериалы для дрелей, перфораторов и шлифмашин.',
}

TRANSLIT = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
    'ю': 'yu', 'я': 'ya',
}


def slugify(text):
    out = ''.join(TRANSLIT.get(ch, ch) for ch in text.lower())
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', out)).strip('-')


def plain(text):
    """HTML описания в обычный текст: на карточке и в шапке товара он голый."""
    text = re.sub(r'<br\s*/?>|</p>', ' ', text)
    text = html.unescape(re.sub(r'<[^>]+>', '', text))
    return re.sub(r'\s+', ' ', text).strip()


def paragraphs(text):
    """То же, но с сохранением абзацев — для полного описания на странице.

    У поставщика описание размечено абзацами и переносами, а разделы внутри
    отбиты строкой из дефисов. Склеенный в одну строку такой текст читается
    сплошняком, поэтому границы блоков оставляем переносами, а строки-дефисы
    выкидываем: на странице их роль играет сам отступ между абзацами.
    """
    text = re.sub(r'<br\s*/?>|</p>|</div>|</li>', '\n', text)
    text = html.unescape(re.sub(r'<[^>]+>', '', text))
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]
    return '\n'.join(line for line in lines if line and not re.fullmatch(r'[-–—]{2,}', line))


EXCERPT = 200


def excerpt(text, limit=EXCERPT):
    """Описание для карточки и шапки товара.

    Полные тексты поставщика — без малого три мегабайта, и в карточке нужны
    только первые строки. Поэтому в витрину идёт начало, а полный текст лежит
    в `catalogDescriptions.ts` и грузится отдельным куском на странице товара.
    """
    if len(text) <= limit:
        return text
    cut = text[:limit]
    stop = max(cut.rfind('. '), cut.rfind('! '), cut.rfind('? '))
    return (cut[:stop + 1] if stop > limit // 2 else cut.rsplit(' ', 1)[0] + '…')


def short(title, limit=70):
    if len(title) <= limit:
        return title
    cut = title[:limit].rsplit(' ', 1)[0]
    return f'{cut}...'


def site_ids():
    """Ключи подробных описаний: у этих товаров идентификатор менять нельзя."""
    if not CONTENT.exists():
        return set()
    return set(re.findall(r"^  '([^']+)':", CONTENT.read_text(encoding='utf-8'), re.M))


def read_rows():
    with SRC.open(encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def place(row):
    """Куда положить товар: (раздел, подраздел) по-русски."""
    name = row['Name']
    for pattern, target in MOVES:
        if re.search(pattern, name):
            return target
    parts = [p.strip() for p in row['Categories'].split(' > ')]
    return (parts[0], parts[1] if len(parts) > 1 else '')


# Ленты собственного производства, в названии которых бренда нет: лента идёт
# под бытовым названием, а EUROBAND стоит только в описании.
OWN_NAMES = {'Демпферная лента для стяжки пола'}


def own_made(name):
    """Наша продукция: по бренду в названии или по списку исключений."""
    return 'EUROBAND' in name or name.strip() in OWN_NAMES


def convert_photos(wanted):
    """Фото карточек в webp 500px. Возвращает {файл выгрузки: имя webp}."""
    from PIL import Image

    if IMAGES_OUT.exists():
        shutil.rmtree(IMAGES_OUT)
    IMAGES_OUT.mkdir(parents=True)
    done = {}
    for source, target in wanted.items():
        path = IMAGES_IN / source
        if not path.exists():
            continue
        try:
            with Image.open(path) as im:
                im = im.convert('RGB')
                im.thumbnail((500, 500), Image.LANCZOS)
                im.save(IMAGES_OUT / f'{target}.webp', 'WEBP', quality=80, method=6)
        except Exception as exc:
            print(f'  фото не переведено: {source} — {exc}')
            continue
        done[source] = target
    return done


def main():
    rows = read_rows()
    keep_id = site_ids()

    parents = {r['SKU']: r for r in rows if r['Type'] == 'variable'}
    variations = defaultdict(list)
    for r in rows:
        if r['Type'] == 'variation':
            variations[r['Parent']].append(r)

    # Published=0 — позиция выключена на invit.by. В выгрузку для магазина она
    # идёт (черновиком), на витрине её нет.
    hidden = [r for r in rows if r['Type'] != 'variation' and r['Published'].strip() == '0']
    cards = [r for r in rows
             if r['Type'] != 'variation' and r['Published'].strip() != '0']

    # Идентификаторы: сохраняем прежние, остальные собираем из названия
    ids, used = {}, set()
    for r in cards:
        sku = r['SKU'].strip()
        base = sku if sku in keep_id else slugify(short(r['Name'], 80)) or slugify(sku)
        ident, n = base, 1
        while ident in used:
            n += 1
            ident = f'{base}-{n}'
        used.add(ident)
        ids[id(r)] = ident

    # Адрес страницы: только латиница, цифры и дефисы
    slugs, taken = {}, set()
    for r in cards:
        base = slugify(ids[id(r)])
        value, n = base, 1
        while value in taken:
            n += 1
            value = f'{base}-{n}'
        taken.add(value)
        slugs[id(r)] = value

    # Фото: одно на карточку, имя файла — адрес товара
    wanted = {}
    for r in cards:
        first = r['Images'].split(', ')[0].strip()
        if first:
            wanted.setdefault(first, slugs[id(r)])
    photos = convert_photos(wanted)

    # Раскладка по дереву
    by_place = defaultdict(list)
    for r in cards:
        by_place[place(r)].append(r)

    known = {(section, entry[0]) for section, _, _, subs in STRUCTURE for entry in subs}
    sections, products, extras, empty = [], [], [], []
    texts = {}                      # полные описания, id -> текст
    money_of = {}                   # цены, id -> (нижняя, верхняя)
    shared_photo = {}               # id -> имя чужого снимка, если он общий

    def spec(row):
        out = []
        # V-0360 — служебный номер родителя вариаций, «ЦБ-…» внутренний код
        # поставщика, а у позиций с invit.by в артикуле лежит адрес страницы
        # («djubel%27-s-termogolovkoj»): номера у них нет. Ничего из этого
        # покупателю не пригодится. Артикул исполнения показываем рядом с
        # выбором типоразмера.
        sku = row['SKU'].strip()
        if (sku and sku != ids[id(row)] and not re.match(r'^V-\d+$', sku)
                and not re.match(r'^Ц[БВЗГИЕД]-', sku)):
            out.append(('Артикул', sku))
        for n in ('1', '2'):
            label, value = row[f'Attribute {n} name'].strip(), row[f'Attribute {n} value(s)'].strip()
            if label and value:
                out.append((label, value))
        # У своих лент бренда и страны в выгрузке нет: их заводили не из прайса
        # поставщика, а со старого сайта, где таких полей не было вовсе. Без них
        # наша продукция не попадала ни в отбор по бренду, ни по стране.
        if own_made(row['Name']):
            if not any(a == 'Бренд' for a, _ in out):
                out.append(('Бренд', 'EUROBAND'))
            if not any(a == 'Страна' for a, _ in out):
                out.append(('Страна', 'Беларусь'))
        return [{'label': a, 'value': b} for a, b in out]

    def money(raw):
        """Цена из выгрузки числом. Пусто — значит «по запросу», так и оставляем."""
        value = raw.strip().replace(',', '.')
        try:
            return round(float(value), 2) if value else None
        except ValueError:
            return None

    def build(row, category_slug, sub_slug):
        ident = ids[id(row)]
        safe = slugs[id(row)]
        text = plain(row['Description'])
        if len(text) > EXCERPT:
            texts[ident] = paragraphs(row['Description'])
        kids = variations.get(row['SKU'], []) if row['Type'] == 'variable' else []
        # slug, shortTitle, subcategoryName, division, image и пустые features
        # с sourceUrl выводятся из остального — их достраивает catalogData.ts.
        # В данных они занимали полтора мегабайта на пустом месте.
        item = {
            'id': ident,
            'title': row['Name'],
            'categorySlug': category_slug,
            'subcategorySlug': sub_slug,
            'description': excerpt(text),
            'specs': spec(row),
        }
        if safe != ident:
            item['slug'] = safe
        first = row['Images'].split(', ')[0].strip()
        if first in photos:
            # Один снимок на несколько товаров — у бывших исполнений одной
            # карточки. Файл пишется один раз, под первым товаром; остальные
            # ссылаются на него по имени, а не получают свою копию.
            item['photo'] = True
            if photos[first] != safe:
                # Строку в объект не кладём: смешанные true/строка в пяти тысячах
                # литералов роняют вывод типов TypeScript. Отдельная таблица.
                shared_photo[ident] = photos[first]
        if own_made(row['Name']):
            item['badge'] = 'Собственное производство'
        if kids:
            item['variantLabel'] = kids[0]['Attribute 3 name'] or 'Типоразмер'
            item['variants'] = [{'sku': k['SKU'], 'title': k['Name'],
                                 'value': k['Attribute 3 value(s)']} for k in kids]

        # У карточки с исполнениями своей цены нет: показываем «от» самого
        # дешёвого исполнения, а при разбросе — и верхнюю границу.
        prices = ([money(k['Regular price']) for k in kids] if kids
                  else [money(row['Regular price'])])
        prices = sorted(p for p in prices if p is not None)
        # Цены держим отдельными массивами, а не полями объекта: с ними
        # TypeScript перестаёт выводить тип литерала из пяти тысяч объектов
        # («union type is too complex»). Плоский список чисел ему по силам.
        money_of[ident] = (prices[0], prices[-1] if prices and prices[-1] != prices[0] else None) \
            if prices else (None, None)
        return item

    plan = [(name, slug, division, subs) for name, slug, division, subs in STRUCTURE]
    osnastka_subs = sorted({place(r)[1] for r in cards
                            if place(r)[0] == OSNASTKA[0]})
    if osnastka_subs:
        plan.append((OSNASTKA[0], OSNASTKA[1], OSNASTKA[2],
                     [(s, slugify(s)) for s in osnastka_subs]))

    for name, slug, division, subs in plan:
        listed = [entry[0] for entry in subs]
        found = {sub for section, sub in by_place if section == name}
        tail = sorted(found - set(listed))
        subcategories, count_total = [], 0
        for entry in subs + [(s, slugify(s)) for s in tail]:
            sub_name, sub_slug = entry[0], entry[1]
            group = entry[2] if len(entry) > 2 else ''
            items = by_place.get((name, sub_name), [])
            if not items:
                empty.append(f'{name} > {sub_name}')
                continue
            if sub_name in tail:
                extras.append(f'{name} > {sub_name} ({len(items)})')
            sub = {'id': sub_slug, 'name': sub_name, 'slug': sub_slug, 'count': len(items)}
            if group:
                sub['group'] = group
            subcategories.append(sub)
            count_total += len(items)
            for row in items:
                products.append(build(row, slug, sub_slug))
        if subcategories:
            sections.append({'id': slug, 'name': name, 'slug': slug,
                             'division': division,
                             'description': DESCRIPTIONS.get(slug, ''),
                             'iconName': 'Layers', 'image': '',
                             'subcategories': subcategories})

    # то, что не попало ни в один раздел плана
    planned = {name for name, _, _, _ in plan}
    lost = [(k, len(v)) for k, v in by_place.items() if k[0] not in planned]

    # Без отступов: файл читает сборщик, а не человек, и лишние пробелы
    # добавляли к нему четыре мегабайта.
    dump = lambda value: json.dumps(value, ensure_ascii=False, separators=(',', ':'))
    DST.write_text(
        '// Сгенерировано scripts/build-catalog.py из '
        'files/woocommerce_import_variations.csv.\n'
        '// Руками не править: правки затрёт следующая сборка.\n'
        "import { Category } from '../types';\n\n"
        '/** Товар без выводимых полей: их достраивает catalogData.ts. */\n'
        'export interface RawProduct {\n'
        '  id: string;\n'
        '  /** Адрес страницы, если он отличается от идентификатора. */\n'
        '  slug?: string;\n  title: string;\n  categorySlug: string;\n'
        '  subcategorySlug: string;\n  description: string;\n'
        "  specs: { label: string; value: string }[];\n"
        "  badge?: 'Собственное производство';\n  variantLabel?: string;\n"
        '  variants?: { sku: string; title: string; value: string }[];\n'
        '  photo?: boolean;\n}\n\n'
        f'export const CATEGORIES: Category[] = {dump(sections)};\n\n'
        f'export const RAW_PRODUCTS: RawProduct[] = {dump(products)};\n\n'
        '/** Цены в порядке RAW_PRODUCTS: null — «цена по запросу». */\n'
        f'export const PRICES: (number | null)[] = {dump([money_of.get(p["id"], (None, None))[0] for p in products])};\n\n'
        '/** Снимок, общий с другим товаром: id -> имя файла без .webp. */\n'
        f'export const SHARED_PHOTOS: Record<string, string> = {dump(shared_photo)};\n\n'
        '/** Верхняя граница там, где исполнения стоят по-разному. */\n'
        f'export const PRICES_MAX: (number | null)[] = {dump([money_of.get(p["id"], (None, None))[1] for p in products])};\n',
        encoding='utf-8')

    TEXTS.write_text(
        '// Сгенерировано scripts/build-catalog.py — руками не править.\n'
        '//\n'
        '// Полные описания товаров. В витрине лежит только начало: три\n'
        '// мегабайта текста в первой загрузке сайта не нужны никому, а здесь\n'
        '// они уходят отдельным куском и грузятся на странице товара.\n\n'
        'export const DESCRIPTIONS: Record<string, string> = '
        f'{dump(texts)};\n',
        encoding='utf-8')

    variants = sum(len(p.get('variants', [])) for p in products)
    print(f'скрыто (Published=0): {len(hidden)}')
    print(f'разделов        : {len(sections)}')
    print(f'подразделов     : {sum(len(s["subcategories"]) for s in sections)}')
    print(f'карточек        : {len(products)}  (из них с вариациями '
          f'{sum(1 for p in products if p.get("variants"))}, вариантов {variants})')
    print(f'с ценой         : {sum(1 for p in products if money_of.get(p["id"], (None,))[0] is not None)}')
    print(f'с фото          : {sum(1 for p in products if p.get("photo"))}'
          f'  → {IMAGES_OUT.relative_to(ROOT)}/ ({len(photos)} файлов)')
    print(f'сохранён прежний id: {sum(1 for p in products if p["id"] in keep_id)}'
          f'  (адрес отличается у {sum(1 for p in products if p.get("slug"))})')
    print(f'\n{DST.relative_to(ROOT)}: {DST.stat().st_size // 1024} КБ')
    print(f'{TEXTS.relative_to(ROOT)}: {len(texts)} описаний, '
          f'{TEXTS.stat().st_size // 1024} КБ')
    if extras:
        print(f'\nподразделы вне списка клиента ({len(extras)}):')
        for x in extras:
            print(f'   {x}')
    if empty:
        print(f'\nиз списка клиента пусты ({len(empty)}):')
        for x in empty:
            print(f'   {x}')
    if lost:
        print(f'\nНЕ ПОПАЛИ В КАТАЛОГ ({len(lost)}):')
        for k, n in lost:
            print(f'   {n:5}  {k}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
