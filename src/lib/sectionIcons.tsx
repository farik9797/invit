import React from 'react';
import {
  mdiAirFilter,
  mdiFan,
  mdiHomeRoof,
  mdiPackageVariantClosed,
  mdiTire,
  mdiViewGrid,
  mdiWindowClosedVariant
} from '@mdi/js';
import { FLAT_ICONS } from './sectionIconPaths';

/*
 * Иконки разделов каталога — единый набор плоских силуэтов.
 *
 * Основа — знаки клиента из его архива. Они приходили растром со светотенью, и
 * рядом с векторными запасными смотрелись как другой набор. Поэтому знаки
 * уплощены: берётся альфа-канал, обводится potrace, рисуется сплошной заливкой.
 * Форма предмета (рулон, баллон, ключ, уголок) остаётся, объём уходит.
 *
 * Что это дало, кроме единства: знак стал вектором и красится `currentColor` —
 * у выбранного пункта каталога иконка снова красная, чего с растром не было.
 *
 * Шесть знаков берём из Material Design Icons:
 * - резиновый уплотнитель, две категории и раздел меню «Ленты EUROBAND» —
 *   их в архиве клиента нет;
 * - кровельные уплотнители и оснащение воздуховодов — после уплощения крыша
 *   превращалась в шляпу, а короб воздуховода в бесформенное пятно.
 *
 * Пересобрать плоские знаки: `scripts/sections/flatten.py`, затем `gen.py`.
 * Рисовать SVG руками нельзя: путь по памяти рендерится мусором.
 */

const BY_SLUG: Record<string, string> = {
  'krovelnye-uplotniteli-kleykie-lenty': mdiHomeRoof,
  'elementy-osnascheniya-vozduhovodov': mdiFan,
  'uplotnitel-rezinovyy-d-p-e': mdiTire,
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
