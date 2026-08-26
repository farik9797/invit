/*
 * АРХИВ. Первая версия блока «О производстве», которую клиент попросил
 * сохранить на /about-old после редизайна страницы. В живой /about не
 * используется — там `src/pages/AboutPage.tsx`.
 *
 * Единственная правка против оригинала: три фото продукции переведены с
 * прямых ссылок invit.by на локальные копии (`contentImage`).
 */
import React, { useState } from 'react';
import { contentImage } from '../lib/contentImages';
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
    <section id="manufacturing" className="py-14 bg-surface-soft border-b border-line">
      <div className="max-w-[1340px] mx-auto px-5">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-red-50 text-brand-red text-xs font-bold  px-3 py-1 rounded-full mb-2 border border-red-100">
            <Factory className="w-3.5 h-3.5" />
            <span>Белорусский производитель</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
            ООО «ИНВИТ» — производство лент EUROBAND
          </h2>
          <p className="text-ink/70 text-sm sm:text-base mt-2">
            Производим уплотнительные и герметизирующие бутилкаучуковые ленты EUROBAND для строительства. Высокое качество, гибкость в ценообразовании, индивидуальный подход.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex justify-start sm:justify-center mb-8 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <div className="bg-surface-soft p-1.5 rounded-xl flex gap-1 border border-line shrink-0">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'about'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-ink/80 hover:bg-surface-soft'
              }`}
            >
              О компании & История
            </button>
            <button
              onClick={() => setActiveTab('capacity')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'capacity'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-ink/80 hover:bg-surface-soft'
              }`}
            >
              Производственные мощности
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'standards'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-ink/80 hover:bg-surface-soft'
              }`}
            >
              Стандарты СТБ & Лаборатория
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden p-6 sm:p-10">
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-ink leading-snug">
                  Белорусский производитель строительных клейких лент и уплотнителей
                </h3>
                <p className="text-ink/70 text-sm leading-relaxed">
                  ООО «ИНВИТ» — белорусский производитель строительных клейких лент и уплотнителей из синтетических материалов для различных областей строительства, в том числе монтажных лент для установки окон под собственной маркой <strong>EUROBAND</strong>.
                </p>
                <p className="text-ink/70 text-sm leading-relaxed">
                  Энергосберегающая безопасная технология ООО «ИНВИТ» представлена системой герметизирующих материалов EUROBAND для качественного монтажа светопрозрачных конструкций. По желанию клиента производим уплотнительные и герметизирующие ленты нетипичных размеров на различных основах и подложках.
                </p>

                <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-surface-soft rounded-xl border border-line text-center">
                    <span className="block text-xl font-bold text-brand-blue">с 2001</span>
                    <span className="text-[11px] font-semibold text-ink/55">Работаем на рынке</span>
                  </div>
                  <div className="p-3 bg-surface-soft rounded-xl border border-line text-center">
                    <span className="block text-xl font-bold text-brand-red">РБ</span>
                    <span className="text-[11px] font-semibold text-ink/55">Производство в Минске</span>
                  </div>
                  <div className="p-3 bg-surface-soft rounded-xl border border-line text-center">
                    <span className="block text-xl font-bold text-brand-blue">10–1500</span>
                    <span className="text-[11px] font-semibold text-ink/55">Мм — ширина порезки</span>
                  </div>
                  <div className="p-3 bg-surface-soft rounded-xl border border-line text-center">
                    <span className="block text-xl font-bold text-emerald-600">2025–27</span>
                    <span className="text-[11px] font-semibold text-ink/55">Сертификат собств. пр-ва</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onOpenCallback}
                    className="bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold text-sm px-5 py-3 rounded-lg shadow transition-colors"
                  >
                    Запросить презентацию компании
                  </button>
                  <button
                    onClick={onOpenCertificates}
                    className="bg-surface-soft hover:bg-surface-soft text-ink font-semibold text-sm px-5 py-3 rounded-lg border border-line transition-colors"
                  >
                    Смотреть сертификаты СТБ
                  </button>
                </div>
              </div>

              {/* Реальные фото продукции EUROBAND с invit.by */}
              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-xl overflow-hidden border border-line bg-white">
                  <img
                    src={contentImage('https://invit.by/image/cache/data/slides/lenta_vla_euroband_pil-1092x337.jpg')}
                    alt="Пароизоляционная лента EUROBAND ВЛ(а) собственного производства"
                    className="w-full h-44 object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden border border-line bg-white">
                    <img
                      src={contentImage('https://invit.by/image/data/PSUL/psul_eyroband_okna.png')}
                      alt="Лента ПСУЛ EUROBAND"
                      loading="lazy"
                      className="w-full h-32 object-contain p-2"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-line bg-white">
                    <img
                      src={contentImage('https://invit.by/image/data/GIL%20PIL/lenta_euroband_%20vla.jpg')}
                      alt="Ленты EUROBAND в рулонах"
                      loading="lazy"
                      className="w-full h-32 object-contain p-2"
                    />
                  </div>
                </div>

                <p className="text-xs text-ink/55 leading-relaxed">
                  Производство и склад: Минский р-н, Сеницкий с/с, 84 (ТЦ Сеница)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'capacity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-surface-soft rounded-xl border border-line space-y-2">
                  <div className="p-2.5 bg-brand-blue text-white w-fit rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-base text-ink">
                    Автоматические бобинорезательные линии
                  </h4>
                  <p className="text-xs text-ink/70 leading-relaxed">
                    Высокоскоростная дисковая порезка рулонов EUROBAND с прецизионной точностью ±0.2 мм. Возможность нарезки ширин от 10 мм до 1500 мм.
                  </p>
                </div>

                <div className="p-5 bg-surface-soft rounded-xl border border-line space-y-2">
                  <div className="p-2.5 bg-brand-red text-white w-fit rounded-lg">
                    <Factory className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-base text-ink">
                    Ленты нетипичных размеров
                  </h4>
                  <p className="text-xs text-ink/70 leading-relaxed">
                    Производим ленты на различных основах и подложках, наносим клейкие полосы из бутилкаучука и акрилового клея с одной или с двух сторон.
                  </p>
                </div>

                <div className="p-5 bg-surface-soft rounded-xl border border-line space-y-2">
                  <div className="p-2.5 bg-emerald-600 text-white w-fit rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-base text-ink">
                    Складской терминал в Минске
                  </h4>
                  <p className="text-xs text-ink/70 leading-relaxed">
                    Собственный склад в Минском районе (ТЦ Сеница) на выезде из Минска. Постоянный резерв ходовых позиций и отгрузка со склада.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-brand-sky-soft border border-line rounded-xl text-xs text-ink/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="font-semibold text-ink">
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
              <div className="space-y-3 text-xs text-ink/70">
                <h3 className="text-lg font-semibold text-ink">
                  Строгий контроль адгезии, паропроницаемости и эластичности
                </h3>
                <p className="leading-relaxed">
                  Каждая партия лент и уплотнителей EUROBAND проходит испытания в аккредитованной лаборатории физико-механических свойств строительных материалов.
                </p>
                <ul className="space-y-2 text-ink font-medium pt-2">
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

              <div className="bg-surface-soft p-6 rounded-xl border border-line space-y-4">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-brand-blue" />
                  <div>
                    <h4 className="font-bold text-ink text-sm">
                      Паспорта качества и ТДС
                    </h4>
                    <p className="text-xs text-ink/55">
                      Предоставляем полный пакет сопроводительной документации с каждой партией
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenCertificates}
                  className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-1.5"
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
