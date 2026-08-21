import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { paths } from '../../routes';

/** Коллаж из двух фото слева и текст справа — композиция с invit.belinfo.by. */
export const AboutIntro: React.FC = () => (
  <section className="py-16 sm:py-24 bg-surface">
    <div className="max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      {/* Коллаж */}
      <div className="relative">
        <div className="w-[78%] border border-line bg-white">
          <img
            src="https://invit.by/image/cache/data/slides/lenta_vla_euroband_pil-1092x337.jpg"
            alt="Производство лент EUROBAND"
            className="w-full h-56 sm:h-72 object-cover"
          />
        </div>
        <div className="w-[62%] absolute -bottom-8 right-0 border-4 border-white bg-white shadow-lg">
          <img
            src="https://invit.by/image/data/GIL%20PIL/lenta_euroband_%20vla.jpg"
            alt="Рулоны ленты EUROBAND ВЛ(а)"
            loading="lazy"
            className="w-full h-40 sm:h-52 object-contain bg-white p-3"
          />
        </div>
      </div>

      {/* Текст */}
      <div className="pt-10 lg:pt-0">
        <span className="text-xs font-semibold text-brand-green">
          Общество с ограниченной ответственностью «ИНВИТ»
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
          Уплотнительные ленты
          <br className="hidden sm:block" /> собственного производства
        </h2>

        <p className="mt-5 text-sm sm:text-base text-ink/70 leading-relaxed">
          Производим монтажные, бутилкаучуковые, саморасширяющиеся ПСУЛ и уплотнительные ленты ПЭС
          под маркой EUROBAND. По желанию клиента изготавливаем ленты нетипичных размеров на разных
          основах и подложках.
        </p>

        <p className="mt-4 text-sm sm:text-base text-ink/70 leading-relaxed">
          Сопутствующие материалы — пену, герметики, крепёж, инструмент и комплектующие для
          вентиляции — поставляем напрямую от производителей.
        </p>

        <Link
          to={paths.about}
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
        >
          Подробнее о компании
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);
