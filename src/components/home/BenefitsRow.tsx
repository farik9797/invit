import React from 'react';
import { BadgeCheck, Factory, HandCoins, MonitorSmartphone, Truck } from 'lucide-react';
import { Reveal } from '../Reveal';

/*
 * Полоса преимуществ между категориями и каталогом: пять причин заказать у
 * ИНВИТ, коротко и в один ряд.
 *
 * Знаки — линейные, синим из палитры, без подложек: клиент правкой от 02.10
 * убрал цветные кружки, они читались как детская картинка. Тонкая обводка и
 * один цвет — та же манера, что у знаков разделов каталога.
 */
const BENEFITS = [
  { icon: Factory, label: 'Собственное производство' },
  { icon: Truck, label: 'Быстрая доставка' },
  { icon: BadgeCheck, label: 'Сертифицированный товар' },
  { icon: HandCoins, label: 'Честные цены' },
  { icon: MonitorSmartphone, label: 'Заказ через сайт 24/7' }
];

export const BenefitsRow: React.FC = () => (
  <section className="bg-surface-soft pt-10 sm:pt-14">
    <div className="max-w-[1340px] mx-auto px-5">
      <Reveal>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 rounded-xl border border-line bg-white px-5 py-8 sm:px-8 sm:py-10">
          {/* Пятый пункт на телефоне остаётся один в ряду — растягиваем его на
              обе колонки, иначе он жмётся к левому краю */}
          {BENEFITS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-3.5 text-center last:col-span-2 sm:last:col-span-1"
            >
              <Icon
                className="w-11 h-11 sm:w-12 sm:h-12 text-brand-blue"
                strokeWidth={1.25}
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
