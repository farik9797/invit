import React from 'react';
import { BadgeCheck, Factory, HandCoins, MonitorSmartphone, Truck } from 'lucide-react';
import { Reveal } from '../Reveal';

/*
 * Полоса преимуществ между категориями и каталогом: пять причин заказать у
 * ИНВИТ, коротко и в один ряд.
 *
 * Оформление повторяет приём с vkt.by, который показал клиент: тонкий
 * линейный знак, а за ним пятно цвета, сдвинутое в сторону. Сами картинки с
 * того сайта не берём — это его файлы; знаки свои, из lucide, пятно рисует
 * css. Каждому пункту свой цвет, чтобы ряд читался как пять разных вещей, а
 * не как пять одинаковых кружков.
 */
const BENEFITS = [
  { icon: Factory, label: 'Собственное производство', blob: 'bg-sky-200/70' },
  { icon: Truck, label: 'Быстрая доставка', blob: 'bg-emerald-200/70' },
  { icon: BadgeCheck, label: 'Сертифицированный товар', blob: 'bg-amber-200/70' },
  { icon: HandCoins, label: 'Честные цены', blob: 'bg-rose-200/70' },
  { icon: MonitorSmartphone, label: 'Заказ через сайт 24/7', blob: 'bg-violet-200/70' }
];

export const BenefitsRow: React.FC = () => (
  <section className="bg-surface-soft pt-10 sm:pt-14">
    <div className="max-w-[1340px] mx-auto px-5">
      <Reveal>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 rounded-xl border border-line bg-white px-5 py-8 sm:px-8 sm:py-10">
          {/* Пятый пункт на телефоне остаётся один в ряду — растягиваем его на
              обе колонки, иначе он жмётся к левому краю */}
          {BENEFITS.map(({ icon: Icon, label, blob }) => (
            <li
              key={label}
              className="group flex flex-col items-center gap-3 text-center last:col-span-2 sm:last:col-span-1"
            >
              <span className="relative flex items-center justify-center w-16 h-16">
                {/* Пятно уходит влево-вверх из-под знака, как на образце */}
                <span
                  aria-hidden
                  className={`absolute left-1 top-1 w-9 h-9 rounded-full ${blob} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110`}
                />
                <Icon className="relative w-10 h-10 text-ink" strokeWidth={1.25} />
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
