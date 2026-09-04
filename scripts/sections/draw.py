"""Знаки разделов каталога — рисуем весь набор сами.

Сначала рисовали только пять: три раздела знака клиента не имели, ещё два
не переживали уплощение (кровельный уплотнитель вырождался в шляпу,
оснащение воздуховодов — в овал; проверено на четырёх наборах параметров
potrace, см. PROGRESS.md). Остальные тринадцать брались уплощением растровых
знаков клиента, и набор выходил разнородным: часть знаков предметная, часть —
обводка чужой картинки. Клиент попросил заменить весь набор, поэтому
тринадцать оставшихся тоже нарисованы здесь.

Стиль: линейный. Пути НЕ заливаются, а обводятся (`fill:none`, `stroke`,
скруглённые стыки) — см. `src/lib/sectionIcons.tsx`. Поэтому здесь нет вырезов:
то, что при заливке было дыркой (керн рулона, отверстие под крепёж), в контуре
просто ещё одна линия. Геометрия считается формулами: путь по памяти рисовать
нельзя.

Из-за обводки некоторым знакам нужны линии, которых силуэту не требовалось:
у рулона в перспективе силуэт обводит только половину торцевого эллипса,
и без второй половины цилиндр читается как капля.

Пять разделов про ленту не должны путаться между собой, поэтому у каждого своя
подача: монтажные ленты — рулон с отклеенным концом, ПСУЛ — спираль (она же
намёк на саморасширение), ПЭС — плоская полоса с отходящей плёнкой, ППЭ —
рулон в перспективе, вентиляционные ленты — два рулона друг на друге.

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


def ellipse(cx, cy, rx, ry, steps=64):
    return poly([(cx + rx*math.cos(2*math.pi*i/steps),
                  cy + ry*math.sin(2*math.pi*i/steps)) for i in range(steps)])


def mirrored(profile):
    """Симметричная деталь из профиля [(полуширина, y), ...] снизу вверх."""
    return ([(C - h, y) for h, y in profile] +
            [(C + h, y) for h, y in reversed(profile)])


def disc_with_arm(cx, cy, R, ang_deg, w_base, tip, arc_steps=96):
    """Диск с приливом ОДНИМ контуром.

    Наложить прилив на диск отдельной фигурой нельзя: под evenodd пересечение
    вычитается и на стыке появляется выемка. Поэтому считаем, где кромки
    прилива режут окружность, и обходим её длинной дугой — мимо прилива.

    `tip` — точки конца прилива в осевых координатах (s вдоль оси от центра
    диска, n поперёк), перечисленные от левой кромки к правой.
    """
    a = math.radians(ang_deg)
    ux, uy = math.cos(a), math.sin(a)               # ось прилива
    nx, ny = -uy, ux                                # нормаль к оси

    s_off = math.sqrt(max(R*R - w_base*w_base, 1))  # где кромка режет окружность
    pL = (cx + nx*w_base + ux*s_off, cy + ny*w_base + uy*s_off)
    pR = (cx - nx*w_base + ux*s_off, cy - ny*w_base + uy*s_off)
    aL = math.atan2(pL[1]-cy, pL[0]-cx)
    aR = math.atan2(pR[1]-cy, pR[0]-cx)

    pts = [pL] + [(cx + ux*s + nx*n, cy + uy*s + ny*n) for s, n in tip] + [pR]

    sweep = (aL - aR) % (2*math.pi)
    if sweep < math.pi:                             # короткая дуга — это прилив,
        sweep -= 2*math.pi                          # обходим в другую сторону
    for i in range(1, arc_steps):
        t = aR + sweep*(i/arc_steps)
        pts.append((cx + R*math.cos(t), cy + R*math.sin(t)))
    return pts


# ── Материалы для монтажа окон ──────────────────────────────────────────────

def tape_roll(cx=140, cy=140, R=100, yt=170, yb=226, x_end=340, cut=18):
    """Монтажные ленты для окон: рулон и отмотанная лента.

    Лента отходит по касательной, а не радиально: радиальный прилив любой
    ширины читается как ручка лупы. Контур один — окружность обходится
    длинной дугой мимо полосы (иначе evenodd вычел бы наложение).
    """
    xt = cx + math.sqrt(R*R - (yt-cy)**2)           # где кромки ленты режут рулон
    xb = cx + math.sqrt(R*R - (yb-cy)**2)
    at = math.atan2(yt-cy, xt-cx)
    ab = math.atan2(yb-cy, xb-cx)

    pts = [(xt, yt), (x_end, yt), (x_end + cut, yb), (xb, yb)]
    sweep = (at + 2*math.pi) - ab                   # длинная дуга, мимо ленты
    for i in range(1, 97):
        t = ab + sweep*(i/96)
        pts.append((cx + R*math.cos(t), cy + R*math.sin(t)))
    return poly(pts) + circle(cx, cy, 34)


# Витков меньше, шаг крупнее, чем было у заливки: в контуре каждый виток — это
# две линии вместо одной, и частая спираль на 26px заплывала в пятно.
def psul_coil(cx=C, cy=C, r_out=158, pitch=66, band=30, turns=1.7, steps=200):
    """ПСУЛ: спираль сжатой ленты — она же читается как саморасширение."""
    outer, inner = [], []
    for i in range(steps + 1):
        t = turns*2*math.pi*(i/steps)
        r = r_out - pitch*(t/(2*math.pi))
        outer.append((cx + r*math.cos(t), cy + r*math.sin(t)))
        inner.append((cx + (r-band)*math.cos(t), cy + (r-band)*math.sin(t)))
    return poly(outer + inner[::-1])


def foam_gun():
    """Пена монтажная: пистолет — ствол, посадочное гнездо под баллон, рукоять.

    Раньше здесь был баллон, но рядом стоит картридж герметика, и два
    вертикальных сосуда в контуре путались. Пистолет по силуэту не похож
    ни на что в наборе.
    """
    # Первый вариант был одним контуром с прямой рукоятью и коротким гнездом —
    # выходил силуэт молотка. Наклонные баллон и рукоять узнаются лучше.
    # В контурном стиле части можно рисовать по отдельности: обводки не
    # вычитаются, а стыки читаются как сборка на техническом эскизе.
    barrel = poly([(102, 132), (278, 132), (278, 144), (322, 144),
                   (322, 172), (278, 172), (278, 184), (102, 184)])
    socket = poly([(118, 132), (184, 132), (154, 48), (88, 48)])
    grip = poly([(110, 184), (172, 184), (184, 300), (124, 308)])
    trigger = poly([(192, 192), (216, 216), (200, 240)], close=False)
    return barrel + socket + grip + trigger


def sealant_bead(cx=150, cy=120, ang_deg=40, back=-100, neck=84,
                 tip=130, hw=46, tip_hw=16):
    """Герметики: картридж под углом и валик выдавленного шва.

    Валик — единственная волнистая линия в наборе, по ней раздел опознаётся
    даже когда сам картридж на 26px сминается.
    """
    a = math.radians(ang_deg)
    ux, uy = math.cos(a), math.sin(a)
    nx, ny = -uy, ux
    def pt(s_, n_):
        return (cx + ux*s_ + nx*n_, cy + uy*s_ + ny*n_)

    body = poly([pt(back, -hw), pt(neck, -hw), pt(neck + 16, -28), pt(tip, -tip_hw),
                 pt(tip, tip_hw), pt(neck + 16, 28), pt(neck, hw), pt(back, hw)])
    piston = poly([pt(back + 24, -hw), pt(back + 24, hw)], close=False)

    x0, x1, y0, amp, steps = 150, 352, 300, 16, 60
    bead = poly([(x0 + (x1-x0)*i/steps,
                  y0 + amp*math.sin(2*math.pi*2*i/steps)) for i in range(steps + 1)],
                close=False)
    return body + piston + bead


def anchor_bolt():
    """Крепёж для окон, кровли, фасадов: болт с шестигранной головкой и шайбой."""
    hx, hy, hr = C, 96, 66
    v = [(hx + hr*math.cos(math.radians(60*i)),
          hy + hr*math.sin(math.radians(60*i))) for i in range(6)]
    # v[0] правая точка, дальше по часовой: v[1] низ-право, v[2] низ-лево …
    wash_hw, wash_bot = 58, 176
    sh_hw, sh_bot, tip_hw = 26, 316, 14
    pts = [v[5], v[0], v[1],
           (hx + wash_hw, v[1][1]), (hx + wash_hw, wash_bot), (hx + sh_hw, wash_bot),
           (hx + sh_hw, sh_bot), (hx + tip_hw, 342), (hx - tip_hw, 342), (hx - sh_hw, sh_bot),
           (hx - sh_hw, wash_bot), (hx - wash_hw, wash_bot), (hx - wash_hw, v[2][1]),
           v[2], v[3], v[4]]
    return poly(pts)


def pes_strip():
    """Уплотнительные ленты ПЭС: полоса и отходящая защитная плёнка."""
    foam = poly([(58, 118), (326, 118), (340, 132), (340, 198),
                 (326, 212), (58, 212), (44, 198), (44, 132)])
    liner = poly([(44, 240), (232, 240), (296, 200), (322, 182),
                  (338, 206), (312, 224), (250, 278), (44, 278)])
    return foam + liner


def wrench():
    """Инструмент, СИЗы: комбинированный ключ — накидное кольцо и рожок."""
    cx, cy, R = 128, 128, 62
    tip = [(200, 34), (248, 34), (248, 13), (212, 13),
           (212, -13), (248, -13), (248, -34), (200, -34)]
    ring_hole = poly([(cx + 36*math.cos(math.radians(60*i + 30)),
                       cy + 36*math.sin(math.radians(60*i + 30))) for i in range(6)])
    return poly(disc_with_arm(cx, cy, R, 45, 26, tip)) + ring_hole


def ppe_roll():
    """Пенополиэтилен ППЭ: рулон в перспективе, с торца виден керн."""
    y0, y1, cy = 132, 268, 200
    ry, rx = (y1 - y0)/2, 40
    xl, xr = 104, 296
    pts = []
    for i in range(33):                             # левый торец, выпуклый влево
        t = math.pi/2 + math.pi*(i/32)
        pts.append((xl + rx*math.cos(t), cy + ry*math.sin(t)))
    for i in range(33):                             # правый торец
        t = -math.pi/2 + math.pi*(i/32)
        pts.append((xr + rx*math.cos(t), cy + ry*math.sin(t)))
    return (poly(pts) + ellipse(xr, cy, rx, ry)      # торец целиком, не половина
            + ellipse(xr, cy, 22, 38))                  # керн


# ── Комплектующие для вентиляции ────────────────────────────────────────────

def flange_profile():
    """Фланцевый профиль: сечение гнутого профиля с отбортовкой."""
    return poly([(92, 70), (300, 70), (300, 114), (136, 114),
                 (136, 268), (300, 268), (300, 312), (92, 312)])


def corner_bracket():
    """Уголки монтажные: уголок с отверстиями под крепёж."""
    body = poly([(72, 72), (144, 72), (144, 240), (312, 240), (312, 312), (72, 312)])
    return body + circle(108, 118, 22) + circle(270, 276, 22)


def z_bracket():
    """Крепёжные детали воздуховодов: Z-образный кронштейн с перфорацией."""
    body = poly([(56, 96), (200, 96), (200, 216), (328, 216),
                 (328, 288), (128, 288), (128, 168), (56, 168)])
    return body + circle(92, 132, 20) + circle(292, 252, 20)


def traverse_channel():
    """Профиль монтажный – траверса: перфорированный швеллер."""
    body = poly([(36, 120), (76, 120), (76, 158), (308, 158), (308, 120),
                 (348, 120), (348, 252), (36, 252)])
    holes = ''.join(circle(x, 206, 24) for x in (90, 156, 222, 288))
    return body + holes


def two_rolls():
    """Ленты уплотнительные самоклеящиеся: два рулона разного размера."""
    return (circle(140, 150, 92) + circle(140, 150, 32) +
            circle(280, 246, 64) + circle(280, 246, 22))


# ── Категории верхнего уровня и общие знаки ─────────────────────────────────

def window_frame():
    """Материалы для монтажа окон: оконная коробка с импостом и подоконником."""
    frame = poly([(48, 56), (336, 56), (336, 300), (352, 300), (352, 332),
                  (32, 332), (32, 300), (48, 300)])
    pane_l = poly([(78, 86), (180, 86), (180, 270), (78, 270)])
    pane_r = poly([(204, 86), (306, 86), (306, 270), (204, 270)])
    return frame + pane_l + pane_r


def duct_elbow(ox=300, oy=300, rc=150, w=52, fl=30, fw=14):
    """Комплектующие для вентиляции: отвод воздуховода с фланцами по торцам."""
    ro, ri = rc + w, rc - w
    a0, a1 = math.pi, 1.5*math.pi                   # от нижнего торца к правому

    def arc(r, t0, t1, n=48):
        return [(ox + r*math.cos(t0 + (t1-t0)*i/n),
                 oy + r*math.sin(t0 + (t1-t0)*i/n)) for i in range(n + 1)]

    xi, xo = ox - ri, ox - ro                       # нижний торец: x внутр./внешн.
    yi, yo = oy - ri, oy - ro                       # правый торец: y внутр./внешн.
    pts = ([(xo - fw, oy), (xo - fw, oy + fl), (xi + fw, oy + fl), (xi + fw, oy)]
           + arc(ri, a0, a1)
           + [(ox, yi + fw), (ox + fl, yi + fw), (ox + fl, yo - fw), (ox, yo - fw)]
           + arc(ro, a1, a0))
    return poly(pts)


def standing_roll(cx=192, ry=46, rx=118, y_top=132, y_bot=250, steps=40):
    """Ленты EUROBAND: рулон стоя, в три четверти — виден торец и керн."""
    pts = [(cx - rx, y_top), (cx - rx, y_bot)]
    for i in range(steps + 1):                      # низ: полуэллипс через дно
        t = math.pi - math.pi*(i/steps)
        pts.append((cx + rx*math.cos(t), y_bot + ry*math.sin(t)))
    pts.append((cx + rx, y_top))
    for i in range(steps + 1):                      # верх: полуэллипс через макушку
        t = -math.pi*(i/steps)
        pts.append((cx + rx*math.cos(t), y_top + ry*math.sin(t)))
    return (poly(pts) + ellipse(cx, y_top, rx, ry)   # верхний торец целиком
            + ellipse(cx, y_top, 40, 16))               # керн


def catalog_grid(a=132, gap=32):
    """Весь каталог: четыре плитки. Он же запасной знак, если раздел неизвестен."""
    x0 = (S - (2*a + gap)) / 2
    return ''.join(poly([(x, y), (x + a, y), (x + a, y + a), (x, y + a)])
                   for x in (x0, x0 + a + gap) for y in (x0, x0 + a + gap))


# ── Нарисованные раньше ─────────────────────────────────────────────────────

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

    sw = 44                                                 # крестовый шлиц — две линии
    my = (head_top + head_bot)/2 - 4
    slot = (poly([(C-sw, my), (C+sw, my)], close=False)
            + poly([(C, my-sw*0.62), (C, my+sw*0.62)], close=False))
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

    slot = poly([(C, bot - 10), (C, y1 + 16)], close=False)
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
    """Резиновый уплотнитель: полое сечение с монтажной ножкой.

    Сплошной знак был силуэтом D с дыркой; в контуре это читалось как буква.
    Двойной контур со стенкой постоянной толщины плюс ножка, которой профиль
    заводится в паз, — так рисуют сечения уплотнителей в каталогах.
    """
    outer = ('M200 90A102 102 0 0 1 200 294'         # спинка и круглый перёд
             'L200 264L82 264L82 230L200 230Z')      # монтажная ножка, снизу
    inner = 'M216 122A70 70 0 0 1 216 262Z'          # полость
    return outer + inner


def damper_handle(cx=158, cy=236, R=94, ang_deg=-44, length=196,
                  w_base=26, w_tip=19, tip_r=34):
    """Оснащение воздуховодов: ручка дроссель-клапана — площадка и рычаг."""
    tip = [(length, w_tip)]
    for i in range(1, 25):                          # скругление на конце рычага
        th = math.pi/2 - math.pi*(i/24)
        tip.append((length + tip_r*math.cos(th), tip_r*math.sin(th)))
    tip.append((length, -w_tip))

    q = 34                                          # посадочное гнездо под ось
    return (poly(disc_with_arm(cx, cy, R, ang_deg, w_base, tip))
            + poly([(cx, cy-q), (cx+q, cy), (cx, cy+q), (cx-q, cy)]))


ICONS = {
    # материалы для монтажа окон
    'montazhnye-lenty-dlya-okon': tape_roll(),
    'samorasshiryayuschayasya-lenta-psul': psul_coil(),
    'pena-montazhnaya-ochistitel-dlya-peny': foam_gun(),
    'germetiki-kleya-himiya-smazki': sealant_bead(),
    'krepezh-dlya-okon-krovli-fasadov': anchor_bolt(),
    'samorezy-i-shurupy': screw(),
    'dyubelnaya-tehnika': dowel(),
    'krovelnye-uplotniteli-kleykie-lenty': roof_seal(),
    'uplotnitelnye-lenty-pes-samokleyaschiesy': pes_strip(),
    'instrument-sizy': wrench(),
    'uplotnitel-rezinovyy-d-p-e': rubber_profile(),
    'penopolietilen-ppe-rulonnaya-izolyaciya': ppe_roll(),
    # комплектующие для вентиляции
    'flancevyy-profil-dlya-vozduhovodov': flange_profile(),
    'ugolki-montazhnye': corner_bracket(),
    'krepezhnye-detali-dlya-vozduhovodov': z_bracket(),
    'profil-montazhnyy-traversa': traverse_channel(),
    'lenty-uplotnitelnye-samokleyaschiesya': two_rolls(),
    'elementy-osnascheniya-vozduhovodov': damper_handle(),
    # категории верхнего уровня и разделы мега-меню
    'materialy-dlya-okon': window_frame(),
    'ventilyaciya': duct_elbow(),
    'tapes': standing_roll(),
    'all': catalog_grid(),
}

body = ''.join(f"  '{k}': '{d}',\n" for k, d in ICONS.items())
out = f'''/* Сгенерировано `scripts/sections/draw.py` — руками не править.
 *
 * Знаки всех восемнадцати подразделов каталога. Рисуются формулами на сетке
 * {S}x{S}: сплошной силуэт предмета, внутренняя структура вырезами, поэтому
 * при отрисовке нужен fill-rule evenodd.
 */

export const DRAWN_ICONS: Record<string, string> = {{
{body}}};
'''
p = pathlib.Path('/Users/farik/claude/Projects/Invit/src/lib/sectionIconsDrawn.ts')
p.write_text(out, encoding='utf-8')
print('записано:', p)
for k, d in ICONS.items():
    print(f'  {k:44s} {len(d):5d} симв.')
