import React from 'react';
import { Reveal } from '../Reveal';
import ownProduction from '../../assets/benefits/proizvodstvo.webp';
import delivery from '../../assets/benefits/dostavka.webp';
import certified from '../../assets/benefits/sertifikat.webp';
import prices from '../../assets/benefits/ceny.webp';
import online from '../../assets/benefits/zakaz.webp';

/*
 * Полоса преимуществ между категориями и каталогом: пять причин заказать у
 * ИНВИТ, коротко и в один ряд.
 *
 * Знаки прислал клиент одной картинкой — нарезали на пять и перевели в webp
 * с прозрачным фоном (исходник: «Снимок экрана 2026-10-02»). Рисунок
 * линейный, тёмно-синий #041538, поэтому ряд читается заодно со знаками
 * разделов каталога. Цветных подложек нет: клиент убрал их правкой от 02.10.
 */
const BENEFITS = [
  { icon: ownProduction, label: 'Собственное производство' },
  { icon: delivery, label: 'Быстрая доставка' },
  { icon: certified, label: 'Сертифицированный товар' },
  { icon: prices, label: 'Честные цены' },
  { icon: online, label: 'Заказ через сайт 24/7' }
];

export const BenefitsRow: React.FC = () => (
  <section className="bg-surface-soft pt-10 sm:pt-14">
    <div className="max-w-[1340px] mx-auto px-5">
      <Reveal>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 rounded-xl border border-line bg-white px-5 py-8 sm:px-8 sm:py-10">
          {/* Пятый пункт на телефоне остаётся один в ряду — растягиваем его на
              обе колонки, иначе он жмётся к левому краю */}
          {BENEFITS.map(({ icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-3.5 text-center last:col-span-2 sm:last:col-span-1"
            >
              <img
                src={icon}
                alt=""
                aria-hidden
                width={56}
                height={56}
                className="w-12 h-12 sm:w-14 sm:h-14 select-none"
              />
              <span className="text-xs sm:text-[13px] font-semibold leading-snug text-ink max-w-[16ch]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);
