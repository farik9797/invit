import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { paths } from '../../routes';
import { Reveal } from '../Reveal';
import productionShop from '../../assets/about/production-shop.webp';

/*
 * Фото цеха слева, текст справа.
 *
 * Раньше слева был коллаж из двух снимков со смещением. Клиент прислал кадр
 * своего производства и попросил поставить его — коллаж из монтажа и рулона
 * рядом с текстом «собственного производства» смотрелся слабее, чем сам цех.
 */
export const AboutIntro: React.FC = () => (
  <section className="py-16 sm:py-24 bg-surface">
    <div className="max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      {/* Фото цеха */}
      <Reveal>
        <div className="rounded-[8px] border border-line bg-white overflow-hidden">
          <img
            src={productionShop}
            alt="Производство уплотнительных лент EUROBAND: намотка и экструзия"
            loading="lazy"
            className="w-full h-64 sm:h-80 lg:h-[420px] object-cover object-left"
          />
        </div>
      </Reveal>

      {/* Текст */}
      <Reveal delay={0.12}>
        <div className="xl:pr-24">
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
            className="group mt-7 inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
          >
            Подробнее о компании
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);
