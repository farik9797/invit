import React from 'react';
import {
  AppWindow,
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
  Ribbon,
  Scroll,
  Shield,
  Spool,
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

type IconComponent = React.ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}>;

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
  'uplotnitel-rezinovyy-d-p-e': Spool,
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
  'materialy-dlya-okon': AppWindow,
  ventilyaciya: Wind,
  // Раздел мега-меню, которого нет в каталоге: только ленты собственного производства
  tapes: Ribbon
};

/*
 * Иконка подраздела, а если такого нет — общий знак каталога.
 *
 * `size` — сетка, в которой рисуется знак (атрибуты width/height у svg).
 * На резкость это не влияет: SVG векторный и на любом размере остаётся
 * чётким. Влияет другое — толщина линии. Она задаётся в единицах viewBox 24,
 * поэтому на крупной иконке масштабируется вместе со знаком и штрих
 * становится жирным: 1.5 при 48px даёт 3px реальной линии.
 *
 * Поэтому у крупных знаков включаем `absoluteStrokeWidth` — lucide пересчитает
 * штрих так, чтобы он остался ~1.75px независимо от размера. Мелкие
 * (16-20px) оставляем как были: там абсолютный штрих, наоборот, жирнит.
 */
const BIG = 32;

export const SectionIcon: React.FC<{
  slug: string;
  className?: string;
  size?: number;
}> = ({ slug, className = 'w-5 h-5', size = 24 }) => {
  const Icon = BY_SUBCATEGORY[slug] ?? BY_CATEGORY[slug] ?? Boxes;

  return (
    <Icon
      className={className}
      size={size}
      strokeWidth={size >= BIG ? 1.75 : 1.5}
      absoluteStrokeWidth={size >= BIG}
    />
  );
};
