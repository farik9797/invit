import React, { useState } from 'react';
import { Search, PackageCheck, Truck, Clock, CheckCircle2, AlertCircle, Building2, MapPin } from 'lucide-react';
import { MOCK_ORDERS } from '../data/catalogData';
import { OrderStatus } from '../types';

export const OrderStatusModule: React.FC = () => {
  const [searchCode, setSearchCode] = useState('INV-2026-9041');
  const [activeOrder, setActiveOrder] = useState<OrderStatus | null>(MOCK_ORDERS['INV-2026-9041']);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = searchCode.trim().toUpperCase();
    if (MOCK_ORDERS[formatted]) {
      setActiveOrder(MOCK_ORDERS[formatted]);
      setErrorMsg('');
    } else {
      // Dynamic generated lookup for any custom code entered by user
      setActiveOrder({
        orderNumber: formatted,
        companyName: 'Оптовый покупатель',
        date: '11.08.2026',
        status: 'cutting',
        statusText: 'В обработке отделом логистики ООО «ИНВИТ»',
        estimatedDelivery: 'В течение 24–48 часов',
        destination: 'г. Минск, Поставщик ООО ИНВИТ',
        itemsCount: 50,
        weight: '120 кг',
        steps: [
          { title: 'Заказ зарегистрирован в базе', date: '11.08.2026 09:00', completed: true },
          { title: 'Согласование спецификации и счета', date: '11.08.2026 10:15', completed: true, current: true },
          { title: 'Порезка и комплектация на складе', date: 'Ожидается', completed: false },
          { title: 'Готовность к самовывозу / Отгрузка', date: 'Ожидается', completed: false }
        ]
      });
      setErrorMsg('');
    }
  };

  return (
    <section id="tracking" className="py-12 bg-white border-b border-line">
      <div className="max-w-[1340px] mx-auto px-5">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold  text-brand-blue mb-1">
              <Truck className="w-4 h-4 text-brand-red" />
              <span>B2B Сервис для покупателей</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
              Отслеживание статуса текущих заказов
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-navy/70 max-w-md">
            Введите номер вашего счета-фактуры или заказа (например, <span className="font-mono font-bold text-brand-blue">INV-2026-9041</span>) для контроля стадии порезки и логистики.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Search Box Column */}
          <div className="lg:col-span-5 bg-surface-soft p-6 rounded-xl border border-line shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-brand-navy flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-blue" />
              Проверить статус заказа онлайн
            </h3>

            <form onSubmit={handleSearch} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-brand-navy/80 mb-1">
                  Номер заказа / счета:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Например: INV-2026-9041"
                    className="w-full pl-3 pr-24 py-2.5 bg-white border border-line rounded-lg text-brand-navy text-sm font-mono font-bold focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs px-3 rounded-md transition-colors cursor-pointer"
                  >
                    Проверить
                  </button>
                </div>
              </div>

              {/* Sample Presets */}
              <div className="pt-2 border-t border-line">
                <span className="block text-[11px] text-brand-navy/55 font-medium mb-1.5">
                  Быстрый выбор тестовых заказов:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(MOCK_ORDERS).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setSearchCode(code);
                        setActiveOrder(MOCK_ORDERS[code]);
                      }}
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        activeOrder?.orderNumber === code
                          ? 'bg-brand-blue text-white border-brand-blue'
                          : 'bg-white text-brand-navy/80 border-line hover:bg-surface-soft'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            <div className="p-3 bg-brand-sky-soft border border-line rounded-lg text-xs text-brand-navy/80 space-y-1">
              <span className="font-bold text-brand-blue block">
                Нужна помощь по отгрузке?
              </span>
              <p>
                Отдел складской логистики: <a href="tel:+375296444979" className="font-bold text-brand-navy hover:text-brand-blue">+375 (29) 644-49-79</a>
              </p>
            </div>
          </div>

          {/* Status Progress Results Column */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-line shadow-lg">
            {activeOrder ? (
              <div className="space-y-6">
                {/* Order Top Banner */}
                <div className="p-4 bg-brand-navy text-white rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-navy/45 font-mono">
                        Заказ №
                      </span>
                      <span className="text-lg font-bold text-brand-red font-mono">
                        {activeOrder.orderNumber}
                      </span>
                    </div>
                    <div className="text-xs text-brand-navy/40 font-semibold flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-brand-navy/45" />
                      <span>{activeOrder.companyName}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="inline-block bg-brand-blue text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                      {activeOrder.statusText}
                    </span>
                    <span className="block text-[11px] text-brand-navy/45 mt-1">
                      Ориентировочная готовность: <strong className="text-white">{activeOrder.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>

                {/* Details Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-surface-soft p-3.5 rounded-xl border border-line">
                  <div>
                    <span className="text-brand-navy/45 block text-[10px] uppercase font-bold">Пункт назначения:</span>
                    <span className="font-semibold text-brand-navy flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                      <span className="truncate">{activeOrder.destination}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-navy/45 block text-[10px] uppercase font-bold">Количество мест:</span>
                    <span className="font-semibold text-brand-navy mt-0.5 block">{activeOrder.itemsCount} позиций ({activeOrder.weight})</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-brand-navy/45 block text-[10px] uppercase font-bold">Дата оформления:</span>
                    <span className="font-semibold text-brand-navy mt-0.5 block">{activeOrder.date}</span>
                  </div>
                </div>

                {/* Step Timeline */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold  text-brand-navy/55">
                    Этапы производства и отгрузки:
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
                    {activeOrder.steps.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3">
                        {/* Dot */}
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            step.completed
                              ? 'bg-emerald-600 text-white'
                              : step.current
                              ? 'bg-brand-red text-white ring-4 ring-red-100'
                              : 'bg-surface-soft text-brand-navy/55'
                          }`}
                        >
                          {step.completed ? '✓' : idx + 1}
                        </div>

                        {/* Text */}
                        <div className="space-y-0.5">
                          <h5
                            className={`text-xs font-semibold ${
                              step.current
                                ? 'text-brand-blue'
                                : step.completed
                                ? 'text-brand-navy'
                                : 'text-brand-navy/45'
                            }`}
                          >
                            {step.title}
                          </h5>
                          <span className="text-[11px] text-brand-navy/45 font-mono block">
                            {step.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-brand-navy/55 text-sm">
                Введите номер заказа для просмотра текущего статуса.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
