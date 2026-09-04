"""Знаки разделов, которых нет у клиента, — рисуем сами.

Пять разделов остались без фирменного знака:
  · саморезы и дюбели — разделы появились с импортом крепежа STARFIX,
    знаков клиент не присылал;
  · кровельные уплотнители и оснащение воздуховодов — знаки клиента есть,
    но не переживают уплощение: вся узнаваемость у них в светотени, силуэт
    вырождается в шляпу и в овал (проверено на четырёх наборах параметров
    potrace, см. PROGRESS.md);
  · резиновый уплотнитель D/P/E — знака нет.

Стиль набора: плотный одноцветный силуэт реального предмета, внутренняя
структура — вырезами (fill-rule evenodd), как у траверсы с отверстиями.
Геометрия считается формулами: путь по памяти рисовать нельзя.

Запуск:  python3 scripts/sections/draw.py
Пишет:   src/lib/sectionIconsDrawn.ts
"""
import math, pathlib

S = 384          # сторона холста
C = S / 2        # центр


def poly(points, close=True):
    d = f'M{points[0][0]:.1f} {points[0][1]:.1f}'
    for x, y in points[1:]:
        d += f'L{x:.1f} {y:.1f}'
    return d + ('Z' if close else '')


def circle(cx, cy, r):
    """Окружность двумя дугами — при evenodd даёт отверстие."""
    return (f'M{cx-r:.1f} {cy:.1f}'
            f'A{r:.1f} {r:.1f} 0 1 0 {cx+r:.1f} {cy:.1f}'
            f'A{r:.1f} {r:.1f} 0 1 0 {cx-r:.1f} {cy:.1f}Z')


def screw():
    """Саморез: потайная головка с крестовым шлицем, витки, остриё."""
    head_hw, head_top, head_bot = 78, 46, 104
    sh_hw, tooth_out = 26, 54
    y0, y1, teeth = head_bot, 296, 8
    step = (y1 - y0) / teeth

    pts = [(C-head_hw, head_top), (C+head_hw, head_top), (C+sh_hw, head_bot)]
    for i in range(teeth):                                  # правый борт — пила витков
        y = y0 + i*step
        pts += [(C+tooth_out, y + step*0.45), (C+sh_hw, y + step)]
    pts += [(C, 342)]                                       # остриё
    for i in range(teeth-1, -1, -1):                        # левый борт зеркально
        y = y0 + i*step
        pts += [(C-sh_hw, y + step), (C-tooth_out, y + step*0.45)]
    pts += [(C-sh_hw, head_bot)]

    sw, st = 46, 13                                         # крестовый шлиц — вырез
    my = (head_top + head_bot)/2 - 4
    slot = (poly([(C-sw, my-st), (C+sw, my-st), (C+sw, my+st), (C-sw, my+st)])
            + poly([(C-st, my-sw*0.62), (C+st, my-sw*0.62),
                    (C+st, my+sw*0.62), (C-st, my+sw*0.62)]))
    return poly(pts) + slot


def dowel():
    """Дюбель: буртик сверху, распорные рёбра, шлиц снизу."""
    hw, top, bot = 42, 62, 322
    c_hw, c_bot = 62, 100
    barbs, out = 5, 34
    y0, y1 = c_bot + 6, bot - 46
    step = (y1 - y0) / barbs

    pts = [(C-c_hw, top), (C+c_hw, top), (C+c_hw, c_bot), (C+hw, c_bot)]
    for i in range(barbs):
        y = y0 + i*step
        pts += [(C+hw+out, y + step*0.30), (C+hw, y + step*0.62), (C+hw, y + step)]
    pts += [(C+hw, bot), (C-hw, bot)]
    for i in range(barbs-1, -1, -1):
        y = y0 + i*step
        pts += [(C-hw, y + step*0.62), (C-hw-out, y + step*0.30), (C-hw, y)]
    pts += [(C-hw, c_bot), (C-c_hw, c_bot)]

    slot = poly([(C-11, bot), (C+11, bot), (C+11, y1+16), (C-11, y1+16)])
    return poly(pts) + slot


def roof_seal(top=104, base=222, amp=26, periods=2.5):
    """Кровельный уплотнитель: верх плоский (к коньку), низ — волна профлиста."""
    x0, x1, steps = 46, 338, 140
    pts = [(x0, top), (x1, top)]
    for i in range(steps + 1):
        t = i / steps
        pts.append((x1 - (x1-x0)*t, base + amp*math.cos(2*math.pi*periods*t)))
    return poly(pts)


def rubber_profile():
    """Резиновый уплотнитель: сечение профиля D — спинка, круглый перёд, полость."""
    back, top_y, bot_y = 118, 74, 310
    r = (bot_y - top_y) / 2
    cy = (top_y + bot_y) / 2
    outer = f'M{back:.1f} {top_y:.1f}A{r:.1f} {r:.1f} 0 0 1 {back:.1f} {bot_y:.1f}Z'
    base = poly([(back-40, top_y), (back, top_y), (back, bot_y), (back-40, bot_y)])
    return outer + base + circle(back + r*0.48, cy, r*0.44)


def flex_insert():
    """Оснащение воздуховодов: гибкая вставка — два фланца и гофр между ними."""
    fw, fx0, fx1 = 36, 52, 332
    fy0, fy1 = 78, 306
    by0, by1 = 132, 252

    outline = poly([
        (fx0, fy0), (fx0+fw, fy0), (fx0+fw, by0), (fx1-fw, by0), (fx1-fw, fy0),
        (fx1, fy0), (fx1, fy1), (fx1-fw, fy1), (fx1-fw, by1), (fx0+fw, by1),
        (fx0+fw, fy1), (fx0, fy1),
    ])
    n, sw = 5, 14
    span = (fx1-fw) - (fx0+fw)
    gap = (span - n*sw) / (n+1)
    sy0, sy1 = by0 + 18, by1 - 18
    slots = ''.join(
        poly([(x, sy0), (x+sw, sy0), (x+sw, sy1), (x, sy1)])
        for x in (fx0 + fw + gap + i*(sw+gap) for i in range(n)))
    return outline + slots


ICONS = {
    'samorezy-i-shurupy': screw(),
    'dyubelnaya-tehnika': dowel(),
    'krovelnye-uplotniteli-kleykie-lenty': roof_seal(),
    'uplotnitel-rezinovyy-d-p-e': rubber_profile(),
    'elementy-osnascheniya-vozduhovodov': flex_insert(),
}

body = ''.join(f"  '{k}': '{d}',\n" for k, d in ICONS.items())
out = f'''/* Сгенерировано `scripts/sections/draw.py` — руками не править.
 *
 * Знаки для пяти разделов, у которых нет фирменного знака клиента.
 * Рисуются формулами на сетке {S}x{S}, стиль тот же, что у уплощённых:
 * сплошной силуэт, внутренняя структура вырезами (нужен fill-rule evenodd).
 */

export const DRAWN_ICONS: Record<string, string> = {{
{body}}};
'''
p = pathlib.Path('/Users/farik/claude/Projects/Invit/src/lib/sectionIconsDrawn.ts')
p.write_text(out, encoding='utf-8')
print('записано:', p)
for k, d in ICONS.items():
    print(f'  {k:40s} {len(d):5d} симв.')
