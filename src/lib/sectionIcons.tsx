import React from 'react';
import { DRAWN_ICONS } from './sectionIconsDrawn';

/*
 * Иконки разделов каталога — единый набор плоских силуэтов.
 *
 * Весь набор рисуется формулами в `scripts/sections/draw.py`: 18 подразделов,
 * две категории верхнего уровня, раздел мега-меню «Ленты EUROBAND» и общий
 * знак «Весь каталог». Сторонних наборов в знаках нет.
 *
 * Стиль линейный: путь не заливается, а обводится. Цвет обводки —
 * `currentColor`, поэтому у выбранного раздела знак становится красным.
 *
 * Толщина обводки задана в единицах сетки 384, поэтому масштабируется вместе
 * со знаком: на плитке 48px это ~2px, в меню 20px — ~0.9px.
 *
 * Раньше знаки были сплошными силуэтами, а до того — уплощением растровых
 * картинок клиента (potrace) и Material Design Icons. Растры и скрипты
 * уплощения оставлены (`src/assets/sections/*.webp`, `flatten.py`, `gen.py`) —
 * это путь назад, если знаки клиента понадобятся снова.
 *
 * Рисовать SVG руками нельзя: путь по памяти рендерится мусором.
 */

/**
 * Знак раздела, а для неизвестного слага — общий знак каталога (`all`).
 *
 * `size` задаёт сетку знака. На резкость он не влияет: всё векторное.
 */
/** Толщина обводки в единицах сетки 384. */
const STROKE = 18;

/*
 * Новые подразделы из правки клиента от 15.09, для которых знака не рисовали:
 * берём соседний по смыслу. «Хомуты» в крепеже — те же хомуты, что в
 * вентиляции, просто под другим слагом; дюбель для пустотелых конструкций —
 * ближайший к распорному.
 */
const ALIAS: Record<string, string> = {
  'krepezh-homuty': 'homuty',
  'dyubel-metallicheskiy-pustotelyy': 'dyubel-raspornyy',
  // Правка клиента от 01.10: пена стала отдельным разделом и разошлась на три
  // подраздела. Баллон уже нарисован — берём его, клей-пене достаётся знак
  // бывших «клеёв монтажных», гибридному герметику — общий знак герметиков.
  'pena-montazhnaya': 'pena-montazhnaya-ochistitel-dlya-peny',
  'pena-montazhnaya-ppu': 'pena-montazhnaya-ochistitel-dlya-peny',
  'ochistiteli-peny': 'pena-montazhnaya-ochistitel-dlya-peny',
  'kley-pena': 'klei-montazhnye',
  'germetiki-universalnye': 'germetiki'
};

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
    fill="none"
    stroke="currentColor"
    strokeWidth={STROKE}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d={DRAWN_ICONS[slug] ?? DRAWN_ICONS[ALIAS[slug]] ?? DRAWN_ICONS.all} />
  </svg>
);
