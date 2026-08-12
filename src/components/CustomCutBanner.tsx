import React, { useState } from 'react';
import { Scissors, Send, CheckCircle, Calculator, Zap, Ruler } from 'lucide-react';

interface CustomCutBannerProps {
  onOpenCallbackWithNote: (note: string) => void;
}

export const CustomCutBanner: React.FC<CustomCutBannerProps> = ({ onOpenCallbackWithNote }) => {
  const [tapeType, setTapeType] = useState('Пароизоляционная оконная лента EUROBAND');
  const [width, setWidth] = useState(85);
  const [length, setLength] = useState('25 м');
  const [quantity, setQuantity] = useState(100);

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customNote = `Заявка на индивидуальную порезку ленты EUROBAND:\n• Тип: ${tapeType}\n• Ширина: ${width} мм\n• Намотка: ${length}\n• Тираж: ${quantity} рулонов`;
    onOpenCallbackWithNote(customNote);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-slate-900 via-[#08487F] to-slate-900 text-white border-y border-blue-900 relative overflow-hidden">
      {/* Background Subtle Lines Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F39200_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#F39200] text-slate-950 font-black text-xs uppercase px-3 py-1 rounded shadow">
              <Scissors className="w-4 h-4" />
              <span>Цех высокоточной порезки EUROBAND</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Производим клейкие ленты <span className="text-[#F39200]">нетипичных размеров</span> под заказ
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
              ООО «ИНВИТ» располагает собственной станочной базой дисковой порезки. Нарежем ленту любой нестандартной ширины (от 10 мм до 1500 мм) под чертежи и проемы вашего объекта за 24 часа.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold">
                <CheckCircle className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Точность ширины ролика до ±0.2 мм</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold">
                <CheckCircle className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Индивидуальная намотка метража</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold">
                <CheckCircle className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Нанесение вашего логотипа на лайнер</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold">
                <CheckCircle className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Бесплатные образцы на объект</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Custom Calculator Form */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#0B5FA5]" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Быстрый онлайн-расчет порезки
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                За 24 часа
              </span>
            </div>

            <form onSubmit={handleCalculateSubmit} className="space-y-4 text-xs">
              {/* Type Select */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Выберите тип ленты:
                </label>
                <select
                  value={tapeType}
                  onChange={(e) => setTapeType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#0B5FA5] focus:outline-none"
                >
                  <option value="Пароизоляционная оконная лента EUROBAND">Пароизоляционная оконная лента EUROBAND</option>
                  <option value="Гидро-паропроницаемая диффузионная лента">Гидро-паропроницаемая диффузионная лента</option>
                  <option value="Бутиловая герметизирующая лента">Бутиловая герметизирующая лента</option>
                  <option value="ПСУЛ уплотнительная лента">ПСУЛ уплотнительная лента</option>
                  <option value="Межфланцевая лента ПЭС">Межфланцевая лента ПЭС</option>
                </select>
              </div>

              {/* Slider for Width */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-[#0B5FA5]" />
                    <span>2. Необходимая ширина ролика:</span>
                  </label>
                  <span className="font-black text-sm text-[#0B5FA5] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {width} мм
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-[#0B5FA5] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>10 мм</span>
                  <span>150 мм</span>
                  <span>300+ мм</span>
                </div>
              </div>

              {/* Winding & Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Намотка:
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="12.5 м">12.5 м</option>
                    <option value="25 м">25 м</option>
                    <option value="50 м">50 м</option>
                    <option value="100 м">100 м</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Количество (рул):
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#F39200] hover:bg-[#E08200] text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Отправить заявку на порезку</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
