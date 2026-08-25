import React from 'react';
import { mdiAirFilter, mdiPackageVariantClosed, mdiViewGrid, mdiWindowClosedVariant } from '@mdi/js';
import { SPRITE_ICONS } from './sectionIconPaths';

/*
 * Иконки разделов каталога.
 *
 * Основной набор — **готовые знаки от клиента** (`src/assets/sections/*.webp`):
 * те же предметы, что на invit.by, но чистые, с прозрачностью и в приличном
 * разрешении. Их прислали архивом, здесь они приведены к квадрату 192px:
 * пропорции у оригиналов разные (75x87, 112x59), а в сетке знаки должны быть
 * одного кегля.
 *
 * Клиент прислал 14 знаков из наших 16. Для герметиков и резинового
 * уплотнителя знака нет — там остаётся вариант, векторизованный из спрайта
 * invit.by (`sectionIconPaths.ts`). Для двух категорий и раздела меню
 * «Ленты EUROBAND» знаков нет вовсе — там Material Design Icons.
 *
 * Цвет у всех знаков одинаковый тёмно-серый: растр перекрасить нельзя, а
 * разнобой «часть синие, часть серые» был бы заметнее, чем отсутствие
 * подсветки у выбранного пункта. Выбранный пункт по-прежнему помечен красным
 * текстом.
 *
 * Рисовать SVG руками нельзя: путь по памяти рендерится мусором.
 */

/** Цвет знаков клиента — под него подогнаны и запасные варианты. */
const INK = '#47474a';

const CLIENT_ICONS = import.meta.glob('../assets/sections/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(CLIENT_ICONS).map(([path, url]) => [
    path.split('/').pop()!.replace('.webp', ''),
    url
  ])
);

const BY_CATEGORY: Record<string, string> = {
  'materialy-dlya-okon': mdiWindowClosedVariant,
  ventilyaciya: mdiAirFilter,
  tapes: mdiPackageVariantClosed
};

/**
 * Иконка подраздела, а если такого нет — общий знак каталога (`all` в дереве).
 *
 * `size` задаёт сетку знака. На резкость он не влияет у векторных вариантов,
 * а у растровых определяет, какой кусок 192px-картинки будет виден: держим его
 * равным размеру в классе, иначе знак ужмётся вдвое.
 */
export const SectionIcon: React.FC<{
  slug: string;
  className?: string;
  size?: number;
}> = ({ slug, className = 'w-5 h-5', size = 24 }) => {
  const client = BY_SLUG[slug];

  if (client) {
    return (
      <img
        src={client}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={size}
        height={size}
        className={`${className} object-contain`}
      />
    );
  }

  const sprite = SPRITE_ICONS[slug];

  if (sprite) {
    return (
      <svg
        viewBox={sprite.viewBox}
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {sprite.layers.map((layer, i) => (
          <g key={i} transform={layer.t}>
            <path fill={INK} fillOpacity={layer.o} d={layer.d} />
          </g>
        ))}
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
      <path fill={INK} d={BY_CATEGORY[slug] ?? mdiViewGrid} />
    </svg>
  );
};
