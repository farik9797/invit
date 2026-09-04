import React from 'react';
import { DRAWN_ICONS } from './sectionIconsDrawn';

/*
 * Иконки разделов каталога — единый набор плоских силуэтов.
 *
 * Весь набор рисуется формулами в `scripts/sections/draw.py`: 18 подразделов,
 * две категории верхнего уровня, раздел мега-меню «Ленты EUROBAND» и общий
 * знак «Весь каталог». Сплошной одноцветный силуэт предмета, внутренняя
 * структура вырезами, поэтому нужен `fill-rule: evenodd`. Красится
 * `currentColor` — у выбранного раздела знак становится красным (с растром
 * так не выходило). Сторонних наборов в знаках больше нет.
 *
 * Раньше 13 знаков брались уплощением растровых картинок клиента (potrace по
 * альфа-каналу), а категории брались из Material Design Icons — набор выходил
 * разнородным. Растры и скрипты уплощения оставлены
 * (`src/assets/sections/*.webp`, `flatten.py`, `gen.py`) — это путь назад,
 * если знаки клиента понадобятся снова.
 *
 * Рисовать SVG руками нельзя: путь по памяти рендерится мусором.
 */

/**
 * Знак раздела, а для неизвестного слага — общий знак каталога (`all`).
 *
 * `size` задаёт сетку знака. На резкость он не влияет: всё векторное.
 */
export const SectionIcon: React.FC<{
  slug: string;
  className?: string;
  size?: number;
}> = ({ slug, className = 'w-5 h-5', size = 24 }) => (
  <svg
    viewBox="0 0 384 384"
    width={size}
    height={size}
    className={className}
    fillRule="evenodd"
    aria-hidden="true"
    focusable="false"
  >
    <path fill="currentColor" d={DRAWN_ICONS[slug] ?? DRAWN_ICONS.all} />
  </svg>
);
