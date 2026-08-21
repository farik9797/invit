import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { paths } from '../../routes';

interface HeroProps {
  onOpenCallback: () => void;
}

interface Slide {
  id: string;
  lead: string;
  accent: string;
  text: string;
  image: string;
  href: string;
  cta: string;
}

const SLIDES: Slide[] = [
  {
    id: 'about',
    lead: 'Производим уплотнительные и герметизирующие',
    accent: 'ленты EUROBAND',
    text: 'Белорусский производитель с 2009 года. Изготовим ленты нетипичных размеров под ваш проект.',
    image: 'https://invit.by/image/cache/data/slides/vodoizoljacionnaja_lenta_nl_evroband-1092x337.jpg',
    href: paths.catalog,
    cta: 'Смотреть каталог'
  },
  {
    id: 'vla',
    lead: 'Внутренний слой монтажного шва —',
    accent: 'пароизоляционные ленты ВЛ(а) и ВЛ',
    text: 'Металлизированная плёнка с нетканым полотном, две монтажные полосы: акрил и бутилкаучук. Пять типоразмеров по ширине.',
    image: 'https://invit.by/image/cache/data/slides/lenta_vla_euroband_pil-1092x337.jpg',
    href: `${paths.category('materialy-dlya-okon')}?sub=montazhnye-lenty-dlya-okon`,
    cta: 'Монтажные ленты'
  },
  {
    id: 'psul',
    lead: 'Защита стыков от воды, шума и холода —',
    accent: 'саморасширяющаяся лента ПСУЛ',
    text: 'Предварительно сжатая уплотнительная лента. Соответствует ТКП 45-3.02-223-2010 и ГОСТ 30971-2002.',
    image: 'https://invit.by/image/cache/data/slides/psul-euroband-1092x337.jpg',
    href: `${paths.category('materialy-dlya-okon')}?sub=samorasshiryayuschayasya-lenta-psul`,
    cta: 'Лента ПСУЛ'
  },
  {
    id: 'pes',
    lead: 'Для сэндвич-панелей, кровли и вентиляции —',
    accent: 'уплотнительные ленты ПЭС',
    text: 'Самоклеящиеся ленты из вспененного полиэтилена: звукоизоляция, герметизация стыков и межфланцевых соединений.',
    image: 'https://invit.by/image/cache/data/slides/lenta_pe_euroband-1092x337.jpg',
    href: `${paths.category('materialy-dlya-okon')}?sub=uplotnitelnye-lenty-pes-samokleyaschiesy`,
    cta: 'Ленты ПЭС'
  }
];

const DURATION = 7000;

export const Hero: React.FC<HeroProps> = ({ onOpenCallback }) => {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const timer = setTimeout(() => setActive((prev) => (prev + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(timer);
  }, [active, paused, reduced]);

  return (
    <section
      className="relative bg-ink overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Фоны слайдов — плавная смена вместо подмены src */}
      {SLIDES.map((slide, idx) => (
        <img
          key={slide.id}
          src={slide.image}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            idx === active ? 'opacity-35' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

      <div className="relative max-w-[1340px] mx-auto px-5 py-20 sm:py-28 lg:py-32">
        {/* Слайды лежат в одной ячейке грида: высота равна самому длинному */}
        <div className="grid max-w-3xl">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === active;

            return (
              <motion.div
                key={slide.id}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 ${isActive ? '' : 'pointer-events-none'}`}
                initial={false}
                animate={
                  reduced
                    ? { opacity: isActive ? 1 : 0 }
                    : { opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }
                }
                // Уходящий слайд гаснет быстро, входящий появляется с задержкой —
                // иначе два текста накладываются друг на друга.
                transition={
                  isActive
                    ? { duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }
                    : { duration: 0.2, ease: 'linear' }
                }
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.25] tracking-tight">
                  {slide.lead}{' '}
                  <span className="border-b-4 border-brand-green pb-1">{slide.accent}</span>
                </h1>

                <p className="mt-7 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
                  {slide.text}
                </p>

                <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                  <Link
                    to={slide.href}
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex justify-center items-center bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold px-8 py-4 w-full sm:w-auto transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]"
                  >
                    {slide.cta}
                  </Link>

                  <button
                    onClick={onOpenCallback}
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex justify-center items-center border border-white/25 hover:bg-white/10 text-white text-sm font-semibold px-8 py-4 w-full sm:w-auto cursor-pointer transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]"
                  >
                    Запросить расчёт
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Переключатели */}
        <div className="mt-14 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActive(idx)}
                aria-label={`Слайд ${idx + 1}`}
                aria-current={idx === active}
                className={`h-1.5 rounded-full cursor-pointer transition-[width,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  idx === active ? 'w-10 bg-brand-green' : 'w-4 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <span className="text-xs text-white/40 tabular-nums">
            {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>

          {/* Полоса прогресса до следующего слайда */}
          {!reduced && (
            <div className="hidden sm:block flex-1 max-w-40 h-px bg-white/15 overflow-hidden">
              <motion.div
                key={`${active}-${paused}`}
                className="h-full bg-brand-green origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={{ duration: paused ? 0 : DURATION / 1000, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
