import React from 'react';
import { mdiAirFilter, mdiPackageVariantClosed, mdiViewGrid, mdiWindowClosedVariant } from '@mdi/js';
import { SPRITE_ICONS } from './sectionIconPaths';

/*
 * Иконки разделов каталога.
 *
 * Знаки подразделов — **собственные иконки клиента** с invit.by. Там они лежат
 * растровым спрайтом 25x425 (шестнадцать штук по 25x25), и в таком виде на
 * плитке 48px превращались бы в кашу. Поэтому спрайт векторизован: ячейку
 * увеличивали, размывали и трассировали potrace в два тоновых слоя — тёмный
 * корпус и светлый торец. Объём знака сохранился, масштабируется без потерь.
 * Результат лежит в `sectionIconPaths.ts`, он генерируется скриптом.
 *
 * Оба слоя красятся `currentColor`, светлый — с прозрачностью, поэтому знак
 * подхватывает цвет текста: синий обычно, красный у выбранного пункта.
 *
 * У двух категорий и у раздела меню «Ленты EUROBAND» своих знаков в спрайте
 * нет — там остаются Material Design Icons.
 *
 * Рисовать SVG руками нельзя: путь по памяти рендерится мусором.
 */

const BY_CATEGORY: Record<string, string> = {
  'materialy-dlya-okon': mdiWindowClosedVariant,
  ventilyaciya: mdiAirFilter,
  tapes: mdiPackageVariantClosed
};

/**
 * Иконка подраздела, а если такого нет — общий знак каталога (`all` в дереве).
 *
 * `size` задаёт сетку знака (атрибуты svg). На резкость он не влияет: SVG
 * векторный. Держим его равным размеру в классе — иначе CSS ужмёт знак.
 */
export const SectionIcon: React.FC<{
  slug: string;
  className?: string;
  size?: number;
}> = ({ slug, className = 'w-5 h-5', size = 24 }) => {
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
            <path fill="currentColor" fillOpacity={layer.o} d={layer.d} />
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
      <path fill="currentColor" d={BY_CATEGORY[slug] ?? mdiViewGrid} />
    </svg>
  );
};
