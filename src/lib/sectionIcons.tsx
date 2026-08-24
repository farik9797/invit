import React from 'react';
import {
  mdiAirFilter,
  mdiAngleRight,
  mdiArrowExpandVertical,
  mdiBottleTonic,
  mdiFan,
  mdiHomeRoof,
  mdiLayersTriple,
  mdiNut,
  mdiPackageVariantClosed,
  mdiScrewMachineFlatTop,
  mdiSpray,
  mdiSticker,
  mdiTableRow,
  mdiTapeMeasure,
  mdiTextureBox,
  mdiTire,
  mdiToolbox,
  mdiVectorRectangle,
  mdiViewGrid,
  mdiWindowClosedVariant
} from '@mdi/js';

/*
 * Иконки разделов каталога.
 *
 * Клиент прислал свой invit.by: там у разделов не абстрактные знаки, а сами
 * предметы — рулон, баллон пены, туба герметика, саморез, гайка, вентилятор.
 * Отсюда два требования: предметность и заливка (у них силуэты, не контуры).
 * Прежний линейный набор из lucide по мотивам tbmmarket.by этому не отвечал.
 *
 * Иконки самого invit.by взять нельзя: это спрайт 25x425 px, шестнадцать
 * знаков по 25px. Растр такого размера на нашей плитке 48px даст кашу.
 *
 * Поэтому Material Design Icons (`@mdi/js`) — это только строки `d`, без
 * рантайма, в сборку попадают лишь перечисленные ниже. Заливка вместо штриха
 * заодно снимает вопрос толщины линии на крупных размерах.
 *
 * Рисовать SVG руками нельзя: путь по памяти рендерится мусором.
 */

const BY_SUBCATEGORY: Record<string, string> = {
  // Материалы для монтажа окон
  'montazhnye-lenty-dlya-okon': mdiTapeMeasure,
  'samorasshiryayuschayasya-lenta-psul': mdiArrowExpandVertical,
  'pena-montazhnaya-ochistitel-dlya-peny': mdiSpray,
  'germetiki-kleya-himiya-smazki': mdiBottleTonic,
  'krepezh-dlya-okon-krovli-fasadov': mdiScrewMachineFlatTop,
  'krovelnye-uplotniteli-kleykie-lenty': mdiHomeRoof,
  'uplotnitelnye-lenty-pes-samokleyaschiesy': mdiLayersTriple,
  'instrument-sizy': mdiToolbox,
  'uplotnitel-rezinovyy-d-p-e': mdiTire,
  'penopolietilen-ppe-rulonnaya-izolyaciya': mdiTextureBox,

  // Комплектующие для вентиляции
  'flancevyy-profil-dlya-vozduhovodov': mdiVectorRectangle,
  'ugolki-montazhnye': mdiAngleRight,
  'krepezhnye-detali-dlya-vozduhovodov': mdiNut,
  'profil-montazhnyy-traversa': mdiTableRow,
  'lenty-uplotnitelnye-samokleyaschiesya': mdiSticker,
  'elementy-osnascheniya-vozduhovodov': mdiFan
};

const BY_CATEGORY: Record<string, string> = {
  'materialy-dlya-okon': mdiWindowClosedVariant,
  ventilyaciya: mdiAirFilter,
  // Раздел мега-меню, которого нет в каталоге: только ленты собственного производства
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
}> = ({ slug, className = 'w-5 h-5', size = 24 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path fill="currentColor" d={BY_SUBCATEGORY[slug] ?? BY_CATEGORY[slug] ?? mdiViewGrid} />
  </svg>
);
