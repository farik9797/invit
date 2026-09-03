# Разовый импорт крепежа STARFIX/STARTUL из прайса поставщика (см. PROGRESS.md,
# «Импорт 594 товаров крепежа»). Источники — CSV-выгрузка 1С и zip с фото —
# в репозиторий не входят (это данные поставщика, не наши). Чтобы повторить
# при обновлении прайса: положить оба файла в ~/Downloads под теми же именами
# (или поправить пути ниже) и запустить `python3 scripts/import-fasteners/gen.py`
# из корня репозитория. Пересоздаёт src/data/importedFasteners.ts и файлы
# в src/assets/products/ — коллизий с id существующих 208 товаров не проверяет
# повторно, полагается на суффикс `_ID` поставщика для уникальности.
import csv, zipfile, os, re, json, io
from PIL import Image

DL = os.path.expanduser('~/Downloads')
CSV_PATH = f'{DL}/export_old_2026-08-27_1787815752_600500616 (1).csv'
ZIP_PATH = f'{DL}/by (1).zip'
IMG_OUT = 'src/assets/products'
TS_OUT = 'src/data/importedFasteners.ts'

TRANSLIT = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y',
    'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
    'х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
}

def translit(s):
    out = []
    for ch in s.lower():
        out.append(TRANSLIT.get(ch, ch))
    return ''.join(out)

def slugify(s):
    t = translit(s)
    t = re.sub(r'[^a-z0-9]+', '-', t)
    t = re.sub(r'-+', '-', t).strip('-')
    return t

# PARENTID_NAME1 -> (categorySlug, subcategorySlug, subcategoryName, division, isNewSubcat)
SUBCAT_MAP = {
    'Саморезы и шурупы': ('materialy-dlya-okon', 'samorezy-i-shurupy', 'Саморезы и шурупы', 'windows', True),
    'Дюбельная техника': ('materialy-dlya-okon', 'dyubelnaya-tehnika', 'Дюбельная техника', 'windows', True),
    'Специальный крепеж': ('materialy-dlya-okon', 'krepezh-dlya-okon-krovli-fasadov', 'Крепёж для окон, кровли, фасадов', 'windows', False),
    'Заклепки': ('materialy-dlya-okon', 'krepezh-dlya-okon-krovli-fasadov', 'Крепёж для окон, кровли, фасадов', 'windows', False),
    'Скобяные изделия': ('materialy-dlya-okon', 'krepezh-dlya-okon-krovli-fasadov', 'Крепёж для окон, кровли, фасадов', 'windows', False),
    'Перфорированный крепеж': ('materialy-dlya-okon', 'krepezh-dlya-okon-krovli-fasadov', 'Крепёж для окон, кровли, фасадов', 'windows', False),
    'Хомуты': ('materialy-dlya-okon', 'krepezh-dlya-okon-krovli-fasadov', 'Крепёж для окон, кровли, фасадов', 'windows', False),
    'Анкерный крепеж': ('materialy-dlya-okon', 'krepezh-dlya-okon-krovli-fasadov', 'Крепёж для окон, кровли, фасадов', 'windows', False),
    'Малярный инструмент': ('materialy-dlya-okon', 'instrument-sizy', 'Инструмент, СИЗы', 'windows', False),
    'Слесарно-столярный инструмент': ('materialy-dlya-okon', 'instrument-sizy', 'Инструмент, СИЗы', 'windows', False),
    'Общестроительный инструмент': ('materialy-dlya-okon', 'instrument-sizy', 'Инструмент, СИЗы', 'windows', False),
    'Перчатки': ('materialy-dlya-okon', 'instrument-sizy', 'Инструмент, СИЗы', 'windows', False),
    'Клей': ('materialy-dlya-okon', 'germetiki-kleya-himiya-smazki', 'Герметики, клея, химия, смазки', 'windows', False),
    'Комплектующие для систем вентиляции': ('ventilyaciya', 'profil-montazhnyy-traversa', 'Профиль монтажный – траверса', 'hvac', False),
}

with zipfile.ZipFile(ZIP_PATH) as z:
    photo_ids = set(n.rsplit('.',1)[0] for n in z.namelist())

with open(CSV_PATH, encoding='utf-8-sig') as f:
    r = csv.DictReader(f, delimiter=';')
    rows = [row for row in r if row['ID'] in photo_ids]

print('matched rows:', len(rows))

seen_slugs = set()
products = []
missing_map = set()

os.makedirs(IMG_OUT, exist_ok=True)

with zipfile.ZipFile(ZIP_PATH) as z:
    for row in rows:
        cat = row['PARENTID_NAME1']
        if cat not in SUBCAT_MAP:
            missing_map.add(cat)
            continue
        categorySlug, subcategorySlug, subcategoryName, division, is_new = SUBCAT_MAP[cat]

        naimen = row['NAIMEN'].strip()
        pid = row['ID']
        base_slug = slugify(naimen)[:70].strip('-')
        slug = f'{base_slug}-{pid}'
        assert slug not in seen_slugs, f'dup slug {slug}'
        seen_slugs.add(slug)

        # short title: strip trailing parenthetical packaging info and brand caps-word if present
        short = re.sub(r'\s*\([^)]*\)\s*$', '', naimen).strip()
        if len(short) > 70:
            short = short[:67].rstrip() + '...'

        specs = []
        if row['ARTIKUL']:
            specs.append({'label': 'Артикул поставщика', 'value': row['ARTIKUL']})
        if row['STRANA']:
            specs.append({'label': 'Страна производства', 'value': row['STRANA']})
        if row['UPAK'] and row['UPAK'] not in ('0','1') and row['EDIZM']:
            specs.append({'label': 'Кратность заказа', 'value': f"{row['UPAK']} {row['EDIZM']}"})

        img_name = f'{slug}.webp'
        data = z.read(f'{pid}.jpg')
        im = Image.open(io.BytesIO(data)).convert('RGB')
        w, h = im.size
        side = max(w, h)
        canvas = Image.new('RGB', (side, side), (255,255,255))
        canvas.paste(im, ((side-w)//2, (side-h)//2))
        canvas = canvas.resize((500,500), Image.LANCZOS)
        canvas.save(f'{IMG_OUT}/{img_name}', 'WEBP', quality=82)

        products.append({
            'id': slug,
            'slug': slug,
            'title': naimen,
            'shortTitle': short,
            'categorySlug': categorySlug,
            'subcategorySlug': subcategorySlug,
            'subcategoryName': subcategoryName,
            'division': division,
            'description': 'Прямая поставка от поставщика. Актуальный остаток, объём и цену уточняйте у менеджера.',
            'image': img_name,
            'sku': row['ARTIKUL'],
            'specs': specs,
            'features': [],
            'sourceUrl': '',
        })

print('missing category mappings:', missing_map)
print('generated products:', len(products))

def esc(s):
    return json.dumps(s, ensure_ascii=False)

lines = []
lines.append("// Крепёж и сопутствующие материалы поставщика STARFIX/STARTUL — сгенерировано")
lines.append("// скриптом импорта из прайса поставщика (594 позиции с фото). Каждое фото")
lines.append("// приведено к 500x500 на белом фоне, как остальные товары каталога.")
lines.append("import { Product } from '../types';")
lines.append("")
lines.append("export const IMPORTED_FASTENERS: Product[] = [")
for p in products:
    lines.append("  {")
    lines.append(f"    id: {esc(p['id'])},")
    lines.append(f"    slug: {esc(p['slug'])},")
    lines.append(f"    title: {esc(p['title'])},")
    lines.append(f"    shortTitle: {esc(p['shortTitle'])},")
    lines.append(f"    categorySlug: {esc(p['categorySlug'])},")
    lines.append(f"    subcategorySlug: {esc(p['subcategorySlug'])},")
    lines.append(f"    subcategoryName: {esc(p['subcategoryName'])},")
    lines.append(f"    division: {esc(p['division'])},")
    lines.append(f"    description: {esc(p['description'])},")
    lines.append(f"    image: {esc(p['image'])},")
    if p['sku']:
        lines.append(f"    sku: {esc(p['sku'])},")
    specs_str = ', '.join(
        '{ label: %s, value: %s }' % (esc(s['label']), esc(s['value'])) for s in p['specs']
    )
    lines.append(f"    specs: [{specs_str}],")
    lines.append("    features: [],")
    lines.append(f"    sourceUrl: {esc(p['sourceUrl'])},")
    lines.append("  },")
lines.append("];")

with open(TS_OUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print('wrote', TS_OUT)

# Category count summary for CATEGORIES metadata update
from collections import Counter
csub = Counter((p['categorySlug'], p['subcategorySlug']) for p in products)
print('--- subcategory add counts ---')
for k, v in csub.items():
    print(k, v)
