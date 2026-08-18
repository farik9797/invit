import React from 'react';

/** Короткая полоса фактов вместо блока с четырьмя абзацами текста. */
const FACTS = [
  { value: 'с 2009', label: 'Работаем на рынке' },
  { value: '12 видов', label: 'Лент EUROBAND' },
  { value: 'от 10 мм', label: 'Порезка под размер' },
  { value: 'РБ', label: 'Производство в Минске' }
];

export const Facts: React.FC = () => (
  <section className="border-b border-line bg-surface">
    <div className="max-w-[1340px] mx-auto px-5 grid grid-cols-2 lg:grid-cols-4 divide-x divide-line">
      {FACTS.map((fact) => (
        <div key={fact.label} className="px-5 py-8 first:pl-0 text-center lg:text-left">
          <div className="text-2xl sm:text-3xl font-bold text-brand-blue tracking-tight">
            {fact.value}
          </div>
          <div className="mt-1 text-xs text-brand-navy/60">{fact.label}</div>
        </div>
      ))}
    </div>
  </section>
);
