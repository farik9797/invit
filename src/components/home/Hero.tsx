import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { paths } from '../../routes';

interface HeroProps {
  onOpenCallback: () => void;
}

/** Тёмный экран с фото и зелёным подчёркиванием ключевой строки — как на invit.belinfo.by. */
export const Hero: React.FC<HeroProps> = ({ onOpenCallback }) => (
  <section className="relative bg-ink overflow-hidden">
    <img
      src="https://invit.by/image/cache/data/slides/vodoizoljacionnaja_lenta_nl_evroband-1092x337.jpg"
      alt=""
      aria-hidden
      className="absolute inset-0 w-full h-full object-cover opacity-35"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

    <div className="relative max-w-[1340px] mx-auto px-5 py-20 sm:py-28 lg:py-32">
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.25] tracking-tight">
          Производим уплотнительные
          <br className="hidden sm:block" /> и герметизирующие{' '}
          <span className="border-b-4 border-brand-green pb-1">ленты EUROBAND</span>
        </h1>

        <p className="mt-7 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
          Белорусский производитель с 2009 года. Изготовим ленты нетипичных размеров под ваш проект.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          <Link
            to={paths.catalog}
            className="inline-flex justify-center items-center bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold px-8 py-4 transition-colors w-full sm:w-auto"
          >
            Смотреть каталог
          </Link>

          <button
            onClick={onOpenCallback}
            className="inline-flex justify-center items-center border border-white/25 hover:bg-white/10 text-white text-sm font-semibold px-8 py-4 transition-colors cursor-pointer w-full sm:w-auto"
          >
            Запросить расчёт
          </button>
        </div>
      </div>

      <ArrowDown className="hidden lg:block w-5 h-5 text-brand-green mt-16" />
    </div>
  </section>
);
