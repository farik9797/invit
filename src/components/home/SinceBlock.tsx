import React from 'react';
import { Reveal } from '../Reveal';
import { CERTIFICATES, PRODUCTS } from '../../data/catalogData';

const FOUNDED = 2009;

/** Числа считаются по данным каталога, руками их менять не надо. */
const FACTS = [
  { value: new Date().getFullYear() - FOUNDED, label: 'лет на рынке' },
  {
    value: PRODUCTS.filter((p) => p.badge === 'Собственное производство').length,
    label: 'лент своего производства'
  },
  { value: CERTIFICATES.length, label: 'документов на продукцию' }
];

const VALUES = [
  'качество продукции и стабильность характеристик от партии к партии;',
  'гибкость в ценообразовании и индивидуальный подход;',
  'клиенты, с которыми нам выгодно работать вдолгую.'
];

/**
 * Светлый текстовый блок слева и тёмно-синяя карточка справа.
 * Раньше поверх лежала огромная выцветшая надпись «работаем с 2009 г» —
 * приём из середины десятых, к тому же дублировавший заголовок. Вместо неё
 * три числа, которые считаются по каталогу.
 */
export const SinceBlock: React.FC = () => (
  <section className="relative bg-surface-soft overflow-hidden">
    <div className="max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2">
      {/* Левая колонка */}
      <Reveal>
        <div className="relative z-10 py-16 sm:py-24 lg:pr-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-tight">
            Мы работаем на рынке строительных лент и уплотнителей с 2009 года.
          </h2>

          <p className="mt-6 text-sm sm:text-base text-ink/70 leading-relaxed">
            За это время наладили собственное производство в Минске, подтвердили статус отечественного
            производителя и наработали репутацию надёжного поставщика.
          </p>

          <p className="mt-4 text-sm sm:text-base text-ink/70 leading-relaxed">
            Наши ленты применяются при монтаже окон и дверей, на фасадах, кровле и в системах
            вентиляции — там, где шов должен оставаться герметичным годами.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
            {FACTS.map((fact, idx) => (
              <div
                key={fact.label}
                className={idx > 0 ? 'pl-4 sm:pl-6 border-l border-line' : ''}
              >
                <dt className="text-2xl sm:text-3xl font-bold text-ink tabular-nums leading-none">
                  {fact.value}
                </dt>
                <dd className="mt-1.5 text-xs text-ink/55 leading-snug">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* Тёмная карточка */}
      <Reveal delay={0.12} className="h-full">
        <div className="h-full lg:-mr-5">
          <div className="h-full bg-brand-navy text-white/75 p-8 sm:p-12 lg:py-24">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Для нас важны:</h3>
            <ul className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed">
              {VALUES.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>

            <p className="mt-8 text-sm sm:text-base leading-relaxed">
              Мы последовательно расширяем ассортимент лент и географию поставок по Беларуси и странам
              ЕАЭС.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
