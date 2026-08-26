"""Собирает src/lib/sectionIconPaths.ts из плоских силуэтов клиента."""
import pathlib, re

OUT = pathlib.Path('/Users/farik/claude/Projects/Invit/src/lib/sectionIconPaths.ts')

# Два знака после уплощения перестали читаться: короб воздуховода превратился
# в пятно, крыша — в шляпу. Для них берём MDI (см. sectionIcons.tsx).
SKIP = {'elementy-osnascheniya-vozduhovodov', 'krovelnye-uplotniteli-kleykie-lenty'}

entries = []
for f in sorted(pathlib.Path('out').glob('*.svg')):
    if f.stem in SKIP:
        continue
    svg = f.read_text()
    vb = re.search(r'viewBox="([^"]+)"', svg).group(1)
    m = re.search(r'<g transform="([^"]*)"><path fill="currentColor" d="([^"]+)"/></g>', svg, re.S)
    t, d = ' '.join(m.group(1).split()), ' '.join(m.group(2).split())
    entries.append("  '%s': { viewBox: '%s', t: '%s', d: '%s' }" % (f.stem, vb, t, d))

ts = '''/* Сгенерировано из знаков клиента (`src/assets/sections/*.webp`).
 *
 * Растровые знаки уплощены: берётся альфа-канал, обводится potrace и рисуется
 * сплошной заливкой. Светотень уходит, форма предмета остаётся — зато знаки
 * встают в один ряд с векторными запасными и красятся `currentColor`.
 *
 * Пересобрать: `python3 flatten.py && python3 gen.py` в scripts/sections/.
 * Файл переписывается скриптом — руками не править.
 */

export interface FlatIcon {
  viewBox: string;
  /** Трансформация от potrace: он выдаёт путь в перевёрнутых координатах. */
  t: string;
  d: string;
}

export const FLAT_ICONS: Record<string, FlatIcon> = {
%s
};
''' % ',\n'.join(entries)

OUT.write_text(ts)
print('записано:', OUT, f'{len(ts)/1024:.1f}KB, знаков: {len(entries)}')
