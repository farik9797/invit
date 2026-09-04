import React from 'react';
import {
  mdiAirFilter,
  mdiPackageVariantClosed,
  mdiViewGrid,
  mdiWindowClosedVariant
} from '@mdi/js';
import { FLAT_ICONS } from './sectionIconPaths';
import { DRAWN_ICONS } from './sectionIconsDrawn';

/*
 * Иконки разделов каталога — единый набор плоских силуэтов.
 *
 * Три источника, все дают один и тот же вид: сплошной одноцветный силуэт
 * предмета, красится `currentColor` (у выбранного раздела знак становится
 * красным — с растром так не выходило).
 *
 * 1. Знаки клиента (13 шт.) — приходили растром со светотенью, уплощены:
 *    альфа-канал обводится potrace и заливается сплошняком. Форма предмета
 *    (рулон, баллон, ключ, уголок) остаётся, объём уходит.
 *    Пересобрать: `scripts/sections/flatten.py`, затем `gen.py`.
 *
 * 2. Нарисованные нами (5 шт., `sectionIconsDrawn.ts`) — для разделов, где
 *    знака клиента нет (саморезы, дюбели, резиновый уплотнитель) или где он
 *    не переживает уплощение (кровельные уплотнители вырождались в шляпу,
 *    оснащение воздуховодов — в овал). Геометрия считается формулами в
 *    `scripts/sections/draw.py`; внутренняя структура сделана вырезами,
 *    поэтому этим знакам нужен `fill-rule: evenodd`.
 *
 * 3. Material Design Icons — две категории верхнего уровня и раздел
 *    мега-меню «Ленты EUROBAND», предметных знаков для них нет.
 *
 * Рисовать SVG руками нельзя: путь по памяти рендерится мусором.
 */

const BY_SLUG: Record<string, string> = {
  'materialy-dlya-okon': mdiWindowClosedVariant,
  ventilyaciya: mdiAirFilter,
  // Раздел мега-меню, которого нет в каталоге: только ленты своего производства
  tapes: mdiPackageVariantClosed
};

/**
 * Иконка подраздела, а если такого нет — общий знак каталога (`all` в дереве).
 *
 * `size` задаёт сетку знака. На резкость он не влияет: всё векторное.
 */
export const SectionIcon: React.FC<{
  slug: string;
  className?: string;
  size?: number;
}> = ({ slug, className = 'w-5 h-5', size = 24 }) => {
  const drawn = DRAWN_ICONS[slug];
  if (drawn) {
    return (
      <svg
        viewBox="0 0 384 384"
        width={size}
        height={size}
        className={className}
        fillRule="evenodd"
        aria-hidden="true"
        focusable="false"
      >
        <path fill="currentColor" d={drawn} />
      </svg>
    );
  }

  const flat = FLAT_ICONS[slug];

  if (flat) {
    return (
      <svg
        viewBox={flat.viewBox}
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <g transform={flat.t}>
          <path fill="currentColor" d={flat.d} />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d={BY_SLUG[slug] ?? mdiViewGrid} />
    </svg>
  );
};
