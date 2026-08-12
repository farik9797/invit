import React from 'react';
import { Factory, Percent, Truck, ShieldCheck } from 'lucide-react';

export const AdvantagesBar: React.FC = () => {
  const advantages = [
    {
      icon: Factory,
      title: 'Белорусский производитель',
      desc: 'Уплотнительные и герметизирующие бутилкаучуковые ленты EUROBAND производим сами, в Минске.',
      color: 'text-brand-red',
      badge: 'ООО ИНВИТ'
    },
    {
      icon: Percent,
      title: 'Гибкое ценообразование',
      desc: 'Специальные оптовые прайсы для застройщиков, монтажников и дилеров.',
      color: 'text-brand-blue',
      badge: 'B2B Скидки'
    },
    {
      icon: Truck,
      title: 'Прямые поставки комплектующих',
      desc: 'Вентиляционные комплектующие от ведущих производителей — со склада в Минске.',
      color: 'text-brand-blue',
      badge: 'Склад Минск'
    },
    {
      icon: ShieldCheck,
      title: 'Документы по качеству',
      desc: 'Технические свидетельства, декларации о соответствии, паспорта качества на каждую партию.',
      color: 'text-emerald-600',
      badge: 'СТБ / ГОСТ'
    }
  ];

  return (
    <section className="bg-white py-10 border-b border-slate-200">
      <div className="max-w-[1340px] mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-all duration-300 flex items-start gap-4 group shadow-xs hover:shadow-md"
              >
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0 group-hover:scale-110 group-hover:border-blue-200 transition-all">
                  <Icon className={`w-6 h-6 ${adv.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-brand-blue transition-colors leading-snug">
                    {adv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {adv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
