import React from 'react';
import { Factory, Percent, Truck, ShieldCheck } from 'lucide-react';

export const AdvantagesBar: React.FC = () => {
  const advantages = [
    {
      icon: Factory,
      title: 'Собственное производство',
      desc: 'Высокоточная порезка рулонов EUROBAND любой ширины от 10 мм за 24ч.',
      color: 'text-[#0B5FA5]',
      badge: 'ООО ИНВИТ'
    },
    {
      icon: Percent,
      title: 'Гибкое ценообразование',
      desc: 'Специальные оптовые прайсы для застройщиков, монтажников и дилеров.',
      color: 'text-[#F39200]',
      badge: 'B2B Скидки'
    },
    {
      icon: Truck,
      title: 'Прямые поставки комплектующих',
      desc: 'Собственный склад в Минске (ТЦ Сеница на МКАД), быстрая отгрузка по РБ.',
      color: 'text-[#0B5FA5]',
      badge: 'Склад Минск'
    },
    {
      icon: ShieldCheck,
      title: 'Сертифицированное качество',
      desc: 'Продукция соответствует СТБ 1488-2004, ГОСТ и техническим регламентам.',
      color: 'text-emerald-600',
      badge: 'СТБ / ISO'
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
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#0B5FA5] transition-colors leading-snug">
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
