import React from 'react';
import { Scissors, Send, CheckCircle } from 'lucide-react';

interface CustomCutBannerProps {
  onOpenCallbackWithNote: (note: string) => void;
}

export const CustomCutBanner: React.FC<CustomCutBannerProps> = ({ onOpenCallbackWithNote }) => {
  return (
    <section className="py-14 sm:py-16 bg-gradient-to-r from-slate-950 via-[#08487F] to-slate-950 text-white border-y border-blue-900/80 relative overflow-hidden">
      {/* Background Subtle Lines Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F39200_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-[1340px] mx-auto px-5 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Main Info */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#F39200] text-slate-950 font-black text-xs uppercase px-3 py-1 rounded-md shadow-xs">
              <Scissors className="w-4 h-4" />
              <span>Цех высокоточной порезки EUROBAND</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Производим клейкие ленты <span className="text-[#F39200]">нетипичных размеров</span> под заказ
            </h2>

            <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed font-normal">
              ООО «ИНВИТ» располагает собственной станочной базой дисковой порезки. Нарежем ленту любой нестандартной ширины (от 10 мм до 1500 мм) под чертежи и проемы вашего объекта за 24 часа.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-bold">
                <CheckCircle className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Точность ширины ролика до ±0.2 мм</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-bold">
                <CheckCircle className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Индивидуальная намотка метража</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-bold">
                <CheckCircle className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Нанесение вашего логотипа на лайнер</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-bold">
                <CheckCircle className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Бесплатные образцы на объект</span>
              </div>
            </div>
          </div>

          {/* CTA Action */}
          <div className="shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onOpenCallbackWithNote('Запрос на индивидуальную порезку ленты EUROBAND по индивидуальным размерам')}
              className="w-full sm:w-auto bg-[#F39200] hover:bg-[#E08200] active:scale-98 text-slate-950 font-black py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Заказать индивидуальную порезку</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

