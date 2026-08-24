import React from 'react';
import {
  Blinds,
  Bolt,
  Boxes,
  Cylinder,
  Drill,
  Fan,
  Frame,
  HardHat,
  Layers,
  PaintRoller,
  Scroll,
  Shield,
  Spline,
  SprayCan,
  SquareStack,
  StretchHorizontal,
  Wind
} from 'lucide-react';

/*
 * Иконки разделов каталога — линейные пиктограммы, как на tbmmarket.by,
 * который прислал клиент как образец.
 *
 * Берём из lucide-react, он уже в зависимостях. Рисовать SVG руками нельзя:
 * получится набор разной толщины и посадки. Если понадобится знак, которого
 * в наборе нет, лучше поставить второй набор, чем чертить путь вручную.
 */

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

const BY_SUBCATEGORY: Record<string, IconComponent> = {
  // Материалы для монтажа окон
  'montazhnye-lenty-dlya-okon': Scroll,
  'samorasshiryayuschayasya-lenta-psul': StretchHorizontal,
  'pena-montazhnaya-ochistitel-dlya-peny': SprayCan,
  'germetiki-kleya-himiya-smazki': PaintRoller,
  'krepezh-dlya-okon-krovli-fasadov': Bolt,
  'krovelnye-uplotniteli-kleykie-lenty': Shield,
  'uplotnitelnye-lenty-pes-samokleyaschiesy': Layers,
  'instrument-sizy': HardHat,
  'uplotnitel-rezinovyy-d-p-e': Spline,
  'penopolietilen-ppe-rulonnaya-izolyaciya': SquareStack,

  // Комплектующие для вентиляции
  'flancevyy-profil-dlya-vozduhovodov': Frame,
  'ugolki-montazhnye': Blinds,
  'krepezhnye-detali-dlya-vozduhovodov': Drill,
  'profil-montazhnyy-traversa': Cylinder,
  'lenty-uplotnitelnye-samokleyaschiesya': Scroll,
  'elementy-osnascheniya-vozduhovodov': Fan
};

const BY_CATEGORY: Record<string, IconComponent> = {
  'materialy-dlya-okon': Layers,
  ventilyaciya: Wind
};

/** Иконка подраздела, а если такого нет — общий знак каталога. */
export const SectionIcon: React.FC<{ slug: string; className?: string }> = ({
  slug,
  className = 'w-5 h-5'
}) => {
  const Icon = BY_SUBCATEGORY[slug] ?? BY_CATEGORY[slug] ?? Boxes;
  return <Icon className={className} strokeWidth={1.5} />;
};
