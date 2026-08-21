import React from 'react';

const VALUES = [
  'качество продукции и стабильность характеристик от партии к партии;',
  'гибкость в ценообразовании и индивидуальный подход;',
  'клиенты, с которыми нам выгодно работать вдолгую.'
];

/**
 * Светлый текстовый блок слева и тёмная карточка справа, поверх — крупная
 * полупрозрачная надпись с годом. Композиция повторяет invit.belinfo.by.
 */
export const SinceBlock: React.FC = () => (
  <section className="relative bg-surface-soft overflow-hidden">
    <div className="max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2">
      {/* Левая колонка */}
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

        {/* Крупная фоновая надпись */}
        <div
          aria-hidden
          className="hidden sm:block mt-12 text-4xl lg:text-5xl font-bold tracking-tight select-none"
        >
          <span className="text-ink/10">работаем с </span>
          <span className="text-brand-green/25">2009 г</span>
        </div>
      </div>

      {/* Тёмная карточка */}
      <div className="relative lg:-mr-5">
        <div className="h-full bg-ink text-white/70 p-8 sm:p-12 lg:py-24">
          <h3 className="text-xl sm:text-2xl font-bold text-brand-green">Для нас важны:</h3>
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
    </div>
  </section>
);
