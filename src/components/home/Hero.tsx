import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { paths } from '../../routes';

interface HeroProps {
  onOpenCallback: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCallback }) => (
  <section className="bg-brand-navy">
    <div className="max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2 items-center gap-10 py-10 sm:py-14 lg:py-0">
      {/* Текст */}
      <div className="lg:py-24">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
          <span className="w-8 h-px bg-brand-red-light" />
          Белорусский производитель · с 2009 года
        </span>

        <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight">
          Уплотнительные и герметизирующие ленты{' '}
          <span className="text-brand-red-light">EUROBAND</span>
        </h1>

        <p className="mt-5 text-base text-white/70 leading-relaxed max-w-lg">
          Собственное производство в Минске. Изготовим ленты нетипичных размеров под ваш проект.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          <Link
            to={paths.category('materialy-dlya-okon')}
            className="inline-flex justify-center items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-semibold px-6 py-3.5 rounded-lg transition-colors w-full sm:w-auto"
          >
            Смотреть ленты
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={onOpenCallback}
            className="inline-flex justify-center items-center gap-2 border border-white/25 hover:bg-white/10 text-white text-sm font-semibold px-6 py-3.5 rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
          >
            Запросить расчёт
          </button>
        </div>
      </div>

      {/* Фото продукции */}
      <div className="relative lg:h-[480px] flex items-center justify-center">
        <img
          src="https://invit.by/image/data/GIL%20PIL/lenta_euroband_%20vla.jpg"
          alt="Пароизоляционная лента EUROBAND ВЛ(а)"
          className="w-full h-full max-h-[420px] object-contain drop-shadow-lg"
        />
      </div>
    </div>
  </section>
);
