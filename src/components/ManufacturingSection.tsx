import React, { useState } from 'react';
import { Factory, ShieldCheck, Award, Zap, CheckCircle2, ChevronRight, FileCheck, Layers } from 'lucide-react';

interface ManufacturingSectionProps {
  onOpenCallback: () => void;
  onOpenCertificates: () => void;
}

export const ManufacturingSection: React.FC<ManufacturingSectionProps> = ({
  onOpenCallback,
  onOpenCertificates
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'capacity' | 'standards'>('about');

  return (
    <section id="manufacturing" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1340px] mx-auto px-5">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 border border-red-100">
            <Factory className="w-3.5 h-3.5" />
            <span>Белорусский производитель</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            ООО «ИНВИТ» — производство лент EUROBAND
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Производим уплотнительные и герметизирующие бутилкаучуковые ленты EUROBAND для строительства. Высокое качество, гибкость в ценообразовании, индивидуальный подход.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/80 p-1.5 rounded-xl flex gap-1 border border-slate-300">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300/60'
              }`}
            >
              О компании & История
            </button>
            <button
              onClick={() => setActiveTab('capacity')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'capacity'
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300/60'
              }`}
            >
              Производственные мощности
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'standards'
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300/60'
              }`}
            >
              Стандарты СТБ & Лаборатория
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10">
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  Белорусский производитель строительных клейких лент и уплотнителей
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  ООО «ИНВИТ» — белорусский производитель строительных клейких лент и уплотнителей из синтетических материалов для различных областей строительства, в том числе монтажных лент для установки окон под собственной маркой <strong>EUROBAND</strong>.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Энергосберегающая безопасная технология ООО «ИНВИТ» представлена системой герметизирующих материалов EUROBAND для качественного монтажа светопрозрачных конструкций. По желанию клиента производим уплотнительные и герметизирующие ленты нетипичных размеров на различных основах и подложках.
                </p>

                <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="block text-xl font-black text-brand-blue">с 2009</span>
                    <span className="text-[11px] font-semibold text-slate-500">Работаем на рынке</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="block text-xl font-black text-brand-red">РБ</span>
                    <span className="text-[11px] font-semibold text-slate-500">Производство в Минске</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="block text-xl font-black text-brand-blue">10–1500</span>
                    <span className="text-[11px] font-semibold text-slate-500">Мм — ширина порезки</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="block text-xl font-black text-emerald-600">2025–27</span>
                    <span className="text-[11px] font-semibold text-slate-500">Сертификат собств. пр-ва</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onOpenCallback}
                    className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs uppercase px-5 py-3 rounded-lg shadow transition-colors"
                  >
                    Запросить презентацию компании
                  </button>
                  <button
                    onClick={onOpenCertificates}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase px-5 py-3 rounded-lg border border-slate-300 transition-colors"
                  >
                    Смотреть сертификаты СТБ
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
                  alt="Производство ООО ИНВИТ"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-brand-red text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                    Минский завод
                  </span>
                  <p className="text-xs font-bold mt-1">
                    Производство и склад: Минский р-н, Сеницкий с/с, 84 (ТЦ Сеница)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capacity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="p-2.5 bg-brand-blue text-white w-fit rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Автоматические бобинорезательные линии
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Высокоскоростная дисковая порезка рулонов EUROBAND с прецизионной точностью ±0.2 мм. Возможность нарезки ширин от 10 мм до 1500 мм.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="p-2.5 bg-brand-red text-white w-fit rounded-lg">
                    <Factory className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Цех проката шинорейки и уголков УГ
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Профилегибочное оборудование для изготовления оцинкованного фланцевого профиля №20 и №30 с идеальной геометрией замковых выштамповок.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="p-2.5 bg-emerald-600 text-white w-fit rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Складской терминал в Минске
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Собственный склад в Минском районе (ТЦ Сеница) на выезде из Минска. Постоянный резерв ходовых позиций и отгрузка со склада.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="font-semibold text-slate-900">
                  Нужен индивидуальный технологический заказ под нестандартный проект?
                </span>
                <button
                  onClick={onOpenCallback}
                  className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-4 py-2 rounded text-xs uppercase shrink-0"
                >
                  Связаться с главным технологом
                </button>
              </div>
            </div>
          )}

          {activeTab === 'standards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3 text-xs text-slate-600">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Строгий контроль адгезии, паропроницаемости и эластичности
                </h3>
                <p className="leading-relaxed">
                  Каждая партия лент и уплотнителей EUROBAND проходит испытания в аккредитованной лаборатории физико-механических свойств строительных материалов.
                </p>
                <ul className="space-y-2 text-slate-800 font-medium pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-red" />
                    <span>Соответствие СТБ 1488-2004 «Строительство. Уплотнение оконных швов»</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-red" />
                    <span>Испытания адгезии к бетону, кирпичу и профилям ПВХ по ГОСТ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-red" />
                    <span>Протоколы стойкости к УФ-излучению и циклическому замораживанию</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-brand-blue" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Паспорта качества и ТДС
                    </h4>
                    <p className="text-xs text-slate-500">
                      Предоставляем полный пакет сопроводительной документации с каждой партией
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenCertificates}
                  className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-white" />
                  <span>Открыть реестр сертификатов</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
