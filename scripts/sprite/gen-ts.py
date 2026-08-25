"""Собирает src/lib/sectionIconPaths.ts из натрассированных ячеек спрайта."""
import pathlib, re

# Соответствие взято из CSS и разметки invit.by: класс .icoNN -> ячейка (NN-61),
# название раздела — из подписи рядом с этим span.
SLUGS = {
    0:  'montazhnye-lenty-dlya-okon',
    1:  'samorasshiryayuschayasya-lenta-psul',
    2:  'pena-montazhnaya-ochistitel-dlya-peny',
    3:  'germetiki-kleya-himiya-smazki',
    4:  'instrument-sizy',
    5:  'krovelnye-uplotniteli-kleykie-lenty',
    6:  'uplotnitelnye-lenty-pes-samokleyaschiesy',
    7:  'penopolietilen-ppe-rulonnaya-izolyaciya',
    8:  'uplotnitel-rezinovyy-d-p-e',
    9:  'krepezh-dlya-okon-krovli-fasadov',
    10: 'flancevyy-profil-dlya-vozduhovodov',
    11: 'ugolki-montazhnye',
    12: 'krepezhnye-detali-dlya-vozduhovodov',
    13: 'profil-montazhnyy-traversa',
    14: 'lenty-uplotnitelnye-samokleyaschiesya',
    15: 'elementy-osnascheniya-vozduhovodov'
}

# Клиент прислал готовые знаки для большинства разделов — для них
# натрассированный вариант в сборке не нужен. Оставляем только то, чего нет.
CLIENT = pathlib.Path(__file__).resolve().parents[2] / 'src/assets/sections'
have = {f.stem for f in CLIENT.glob('*.webp')} if CLIENT.exists() else set()

# Резиновый уплотнитель в спрайте нарисован овалом: в мелком размере он
# читается как рулон ленты и сливается с ПСУЛ. Для него взят знак из MDI.
have.add('uplotnitel-rezinovyy-d-p-e')

entries = []
for k, slug in SLUGS.items():
    if slug in have:
        continue
    svg = pathlib.Path(f'out/cell-{k:02d}.svg').read_text()
    vb = re.search(r'viewBox="([^"]+)"', svg).group(1)
    layers = []
    for g in re.finditer(r'<g transform="([^"]*)"><path fill="currentColor" fill-opacity="([^"]+)" d="([^"]+)"/></g>', svg, re.S):
        squash = lambda s: ' '.join(s.split())
        layers.append((squash(g.group(1)), g.group(2), squash(g.group(3))))
    body = ',\n      '.join(
        "{ t: '%s', o: %s, d: '%s' }" % (t, o if o != '1' else '1', d) for t, o, d in layers)
    entries.append("  '%s': {\n    viewBox: '%s',\n    layers: [\n      %s\n    ]\n  }" % (slug, vb, body))

ts = '''/* Сгенерировано из спрайта invit.by (catalog/view/theme/meta/img/sprite.png).
 *
 * Спрайт — растр 25x425: шестнадцать знаков по 25x25. Ячейку увеличивали,
 * размывали и трассировали potrace в два тоновых слоя (тёмный корпус и
 * светлый торец), поэтому знак остаётся объёмным и масштабируется без потерь.
 *
 * Здесь остались только разделы, для которых клиент **не** прислал готовый
 * знак в `src/assets/sections/`. Остальные векторы в сборку не тянем.
 *
 * Соответствие «ячейка -> раздел» взято из их CSS: класс `.icoNN` со сдвигом
 * фона, где NN - 61 = номер ячейки.
 *
 * Файл переписывается скриптом — руками не править.
 */

export interface SpriteIcon {
  viewBox: string;
  layers: { t: string; o: number; d: string }[];
}

export const SPRITE_ICONS: Record<string, SpriteIcon> = {
%s
};
''' % ',\n'.join(entries)

out = pathlib.Path('/Users/farik/claude/Projects/Invit/src/lib/sectionIconPaths.ts')
out.write_text(ts)
print('записано', out, f'{len(ts)/1024:.1f}KB, знаков: {len(entries)}')
