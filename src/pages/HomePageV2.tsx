import React, { useEffect, useState } from 'react';
import { HeaderV2, FooterV2, AwardBadge, FloatingActions } from '../components/home-v2/Chrome';
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
 * Второй вариант главной страницы в цветах клиента: синий #3F5B9E с
 * действующего invit.by отвечает за действия, тёмно-синий #162C58 за тёмные
 * полосы, красный #D91920 из логотипа EUROBAND за марку и выбранный раздел
 * каталога. Много воздуха, сдержанная анимация 240 мс.
 *
 * Страница намеренно живёт вне общего Layout: своя шапка и подвал, иначе
 * зелёная обвязка основного сайта смешивалась бы с синей палитрой.
 * Тема одна на всю страницу — светлая; тёмно-синие полосы это поверхность
 * той же системы, а не переключение режима. Чёрно-серых плит, как на
 * нынешнем invit.by, здесь нет намеренно.
 */
export const HomePageV2: React.FC = () => {
  // Медаль «Лучший продукт 2013» и раскрытый виджет контактов делят одно
  // и то же место на телефонах — прячем медаль, пока виджет открыт.
  const [contactsOpen, setContactsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-inv-ink font-v2 antialiased selection:bg-inv-blue selection:text-white">
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

      <AwardBadge dimmed={contactsOpen} />

      <FloatingActions expanded={contactsOpen} onExpandedChange={setContactsOpen} />
    </div>
  );
};
