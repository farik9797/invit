import React from 'react';
import {
  mdiAirFilter,
  mdiPackageVariantClosed,
  mdiViewGrid,
  mdiWindowClosedVariant
} from '@mdi/js';
import { DRAWN_ICONS } from './sectionIconsDrawn';

/*
 * Иконки разделов каталога — единый набор плоских силуэтов.
 *
 * Все 18 подразделов рисуются формулами в `scripts/sections/draw.py`:
 * сплошной одноцветный силуэт предмета, внутренняя структура вырезами,
 * поэтому нужен `fill-rule: evenodd`. Красится `currentColor` — у выбранного
 * раздела знак становится красным (с растром так не выходило).
 *
 * Раньше 13 знаков брались уплощением растровых картинок клиента (potrace по
 * альфа-каналу), и набор выходил разнородным: часть предметная, часть — обводка
 * чужой картинки. Клиент попросил заменить весь набор. Растры и скрипты
 * уплощения оставлены (`src/assets/sections/*.webp`, `flatten.py`, `gen.py`) —
 * это путь назад, если знаки клиента понадобятся снова.
 *
 * Material Design Icons остались на двух категориях верхнего уровня и разделе
 * мега-меню «Ленты EUROBAND»: предметных знаков для них нет.
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
