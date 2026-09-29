import React from 'react';
import { BadgeCheck, Factory, HandCoins, MonitorSmartphone, Truck } from 'lucide-react';
import { Reveal } from '../Reveal';

/*
 * Полоса преимуществ между категориями и каталогом: пять причин заказать у
 * ИНВИТ, коротко и в один ряд. Клиент прислал такой блок с другого сайта —
 * там иконка и подпись под ней, карточка белая поверх серой полосы.
 *
 * Знаки берём из lucide, который уже стоит в проекте: рисовать свои SVG
 * незачем, а чужие наборы тянуть ради пяти картинок тем более.
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
              className="flex flex-col items-center gap-3 text-center last:col-span-2 sm:last:col-span-1"
            >
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-green-soft text-brand-green">
                <Icon className="w-7 h-7" strokeWidth={1.5} />
              </span>
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
