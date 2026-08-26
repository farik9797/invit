import React from 'react';
import {
  AppWindow,
  Bolt,
  Boxes,
  Cylinder,
  Fan,
  Frame,
  HardHat,
  Hexagon,
  Home,
  Layers,
  LifeBuoy,
  Package,
  PaintBucket,
  Ruler,
  Scroll,
  Shapes,
  Spool,
  SprayCan,
  StickyNote,
  Wind
} from 'lucide-react';

/*
 * Иконки разделов каталога — единый контурный набор.
 *
 * Клиент показал tbmmarket.by и попросил такой же стиль: контурный знак, один
 * вес линии, предметная сцена. Сами их файлы взять нельзя — это графика ТБМ,
 * поэтому набор собран заново из **lucide** (лицензия ISC, коммерческое
 * использование разрешено; пакет и так в зависимостях).
 *
 * Почему весь набор из одного источника: у MDI часть знаков контурная, часть
 * залитая, и в сетке это сразу видно. Здесь у всех одна толщина линии — 1.5.
 *
 * Плюс к прежним растровым знакам: контур красится `currentColor`, поэтому
 * выбранному пункту каталога снова досталась красная подсветка.
 *
 * Файлы клиента остались в `src/assets/sections/` — если он захочет вернуть
 * свои знаки, достаточно откатить этот модуль.
 *
 * Рисовать SVG руками нельзя: путь по памяти рендерится мусором.
 */

type IconComponent = React.ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
}>;

const BY_SUBCATEGORY: Record<string, IconComponent> = {
  // Материалы для монтажа окон
  'montazhnye-lenty-dlya-okon': Spool,
  'samorasshiryayuschayasya-lenta-psul': Scroll,
  'pena-montazhnaya-ochistitel-dlya-peny': SprayCan,
  'germetiki-kleya-himiya-smazki': PaintBucket,
  'krepezh-dlya-okon-krovli-fasadov': Bolt,
  'krovelnye-uplotniteli-kleykie-lenty': Home,
  'uplotnitelnye-lenty-pes-samokleyaschiesy': Layers,
  'instrument-sizy': HardHat,
  'uplotnitel-rezinovyy-d-p-e': LifeBuoy,
  'penopolietilen-ppe-rulonnaya-izolyaciya': Cylinder,

  // Комплектующие для вентиляции
  'flancevyy-profil-dlya-vozduhovodov': Frame,
  'ugolki-montazhnye': Shapes,
  'krepezhnye-detali-dlya-vozduhovodov': Hexagon,
  'profil-montazhnyy-traversa': Ruler,
  'lenty-uplotnitelnye-samokleyaschiesya': StickyNote,
  'elementy-osnascheniya-vozduhovodov': Fan
};

const BY_CATEGORY: Record<string, IconComponent> = {
  'materialy-dlya-okon': AppWindow,
  ventilyaciya: Wind,
  // Раздел мега-меню, которого нет в каталоге: только ленты собственного производства
  tapes: Package
};

/**
 * Иконка подраздела, а если такого нет — общий знак каталога (`all` в дереве).
 *
 * `size` задаёт сетку знака. Держим его равным размеру в классе: иначе CSS
 * ужмёт знак, а толщина линии останется от исходного размера.
 */
export const SectionIcon: React.FC<{
  slug: string;
  className?: string;
  size?: number;
}> = ({ slug, className = 'w-5 h-5', size = 24 }) => {
  const Icon = BY_SUBCATEGORY[slug] ?? BY_CATEGORY[slug] ?? Boxes;

  return <Icon className={className} size={size} strokeWidth={1.5} />;
};
