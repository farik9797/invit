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
    <section id="tracking" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B5FA5] mb-1">
              <Truck className="w-4 h-4 text-[#F39200]" />
              <span>B2B Сервис для покупателей</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Отслеживание статуса текущих заказов
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Введите номер вашего счета-фактуры или заказа (например, <span className="font-mono font-bold text-[#0B5FA5]">INV-2026-9041</span>) для контроля стадии порезки и логистики.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Search Box Column */}
          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#0B5FA5]" />
              Проверить статус заказа онлайн
            </h3>

            <form onSubmit={handleSearch} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Номер заказа / счета:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Например: INV-2026-9041"
                    className="w-full pl-3 pr-24 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm font-mono font-bold focus:ring-2 focus:ring-[#0B5FA5] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 bg-[#0B5FA5] hover:bg-[#1A6DB5] text-white font-bold text-xs px-3 rounded-md transition-colors cursor-pointer"
                  >
                    Проверить
                  </button>
                </div>
              </div>

              {/* Sample Presets */}
              <div className="pt-2 border-t border-slate-200">
                <span className="block text-[11px] text-slate-500 font-medium mb-1.5">
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
                          ? 'bg-[#0B5FA5] text-white border-[#0B5FA5]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-slate-700 space-y-1">
              <span className="font-bold text-[#0B5FA5] block">
                Нужна помощь по отгрузке?
              </span>
              <p>
                Отдел складской логистики: <a href="tel:+375296444979" className="font-bold text-slate-900 hover:text-[#0B5FA5]">+375 (29) 644-49-79</a>
              </p>
            </div>
          </div>

          {/* Status Progress Results Column */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
            {activeOrder ? (
              <div className="space-y-6">
                {/* Order Top Banner */}
                <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">
                        Заказ №
                      </span>
                      <span className="text-lg font-black text-[#F39200] font-mono">
                        {activeOrder.orderNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeOrder.companyName}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="inline-block bg-[#0B5FA5] text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                      {activeOrder.statusText}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1">
                      Ориентировочная готовность: <strong className="text-white">{activeOrder.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>

                {/* Details Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Пункт назначения:</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0B5FA5]" />
                      <span className="truncate">{activeOrder.destination}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Количество мест:</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{activeOrder.itemsCount} позиций ({activeOrder.weight})</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Дата оформления:</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{activeOrder.date}</span>
                  </div>
                </div>

                {/* Step Timeline */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Этапы производства и отгрузки:
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {activeOrder.steps.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3">
                        {/* Dot */}
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            step.completed
                              ? 'bg-emerald-600 text-white'
                              : step.current
                              ? 'bg-[#F39200] text-slate-950 ring-4 ring-orange-100'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {step.completed ? '✓' : idx + 1}
                        </div>

                        {/* Text */}
                        <div className="space-y-0.5">
                          <h5
                            className={`text-xs font-extrabold ${
                              step.current
                                ? 'text-[#0B5FA5]'
                                : step.completed
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.title}
                          </h5>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            {step.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm">
                Введите номер заказа для просмотра текущего статуса.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
