import React, { useEffect } from 'react';
import { HeaderV2, FooterV2 } from '../components/home-v2/Chrome';
import {
  HeroV2,
  FactsRow,
  TapeBento,
  ProductRail,
  AboutBlock,
  ValuesBlock,
  DocumentsBand,
  NewsList,
  ContactSplit
} from '../components/home-v2/Sections';

/**
 * Второй вариант главной страницы в дизайн-системе American Express:
 * синий #006FCF как цвет действия, тёмно-синий #00175A на премиальных
 * поверхностях, много воздуха, сдержанная анимация 240 мс.
 *
 * Страница намеренно живёт вне общего Layout: своя шапка и подвал, иначе
 * зелёная обвязка основного сайта смешивалась бы с синей палитрой.
 * Тема одна на всю страницу — светлая; тёмно-синие полосы это поверхность
 * той же системы, а не переключение режима.
 */
export const HomePageV2: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-amex-ink font-amex antialiased selection:bg-amex-blue selection:text-white">
      <HeaderV2 />
      <main>
        <HeroV2 />
        <FactsRow />
        <TapeBento />
        <ProductRail />
        <AboutBlock />
        <ValuesBlock />
        <DocumentsBand />
        <NewsList />
        <ContactSplit />
      </main>
      <FooterV2 />
    </div>
  );
};
