import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { paths } from '../../routes';
import eurobandMark from '../../assets/logo/euroband-color.svg';
import windowTapes from '../../assets/hero/window-tapes.webp';
import sandwichPanels from '../../assets/hero/sandwich-panels.webp';
import roofStandingSeam from '../../assets/hero/roof-standing-seam.webp';
import tapeSlabJoint from '../../assets/hero/tape-slab-joint.webp';
import floorDamperTape from '../../assets/hero/floor-damper-tape.webp';
import psulTape from '../../assets/hero/psul-tape.webp';

interface HeroProps {
  onOpenCallback: () => void;
}

interface Slide {
  id: string;
  lead: string;
  accent: string;
  text: string;
  image: string;
  /** Показать кадр целиком, не обрезая: нужно там, где в кадре есть схема. */
  whole?: boolean;
  href: string;
  cta: string;
}

const SLIDES: Slide[] = [
  {
    id: 'windows',
    lead: 'Монтажный шов окна —',
    accent: 'три слоя, три ленты',
    text: 'Внутри пароизоляционная ВЛ(а) или ВЛ, снаружи паропроницаемая НЛ, в четверти — саморасширяющаяся ПСУЛ. Шов держит тепло и выводит влагу наружу.',
    image: windowTapes,
    href: `${paths.category('materialy-dlya-okon')}?sub=montazhnye-lenty-dlya-okon`,
    cta: 'Ленты для окон'
  },
  {
    id: 'sandwich',
    lead: 'Сэндвич-панели и профлист —',
    accent: 'герметизация стыков',
    text: 'Бутилкаучуковая ЛБ на продольных и поперечных нахлёстах, ПЭС под прижимные планки. Стык не течёт и не свистит на ветру.',
    image: sandwichPanels,
    href: `${paths.category('materialy-dlya-okon')}?sub=krovelnye-uplotniteli-kleykie-lenty`,
    cta: 'Кровельные ленты'
  },
  {
    id: 'about',
    lead: 'Уплотнительные и герметизирующие',
    accent: 'ленты',
    text: 'Белорусский производитель с 2001 года. Изготовим ленты нетипичных размеров под ваш проект.',
    image: roofStandingSeam,
    href: paths.catalog,
    cta: 'Смотреть каталог'
  },
  {
    id: 'joint',
    lead: 'Стык плит и панелей —',
    accent: 'уплотнительная лента ПЭС',
    text: 'Самоклеящаяся лента из вспененного полиэтилена закрывает шов от воды, шума и холода: сэндвич-панели, перекрытия, металлоконструкции.',
    image: tapeSlabJoint,
    whole: true,
    href: `${paths.category('materialy-dlya-okon')}?sub=uplotnitelnye-lenty-pes-samokleyaschiesy`,
    cta: 'Ленты ПЭС'
  },
  {
    id: 'floor',
    lead: 'Стыки оснований и покрытий —',
    accent: 'лента EUROBAND',
    text: 'Проклеиваем шов между бетоном и покрытием: кромка не задирается, пыль и влага в стык не идут.',
    image: floorDamperTape,
    href: `${paths.category('materialy-dlya-okon')}?sub=uplotnitelnye-lenty-pes-samokleyaschiesy`,
    cta: 'Ленты ПЭС'
  },
  {
    id: 'psul',
    lead: 'Саморасширяющаяся лента —',
    accent: 'ПСУЛ EUROBAND',
    text: 'Акриловая пропитка и открытая ячейка: после монтажа лента расширяется впятеро и держит шов сухим и паропроницаемым не менее 20 лет.',
    image: psulTape,
    href: `${paths.category('materialy-dlya-okon')}?sub=samorasshiryayuschayasya-lenta-psul`,
    cta: 'Лента ПСУЛ'
  }
];

const DURATION = 7000;

export const Hero: React.FC<HeroProps> = ({ onOpenCallback }) => {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Шесть фоновых фото разом — больше мегабайта на первом экране, часть не
  // успевала прийти к моменту показа (слайд листался на пустой тёмный фон).
  // Грузим только текущий кадр и следующий: у следующего есть весь DURATION
  // на закачку, пока показан текущий. Once загруженное не выгружаем — иначе
  // нечему будет играть кросс-фейдом при возврате назад.
  const [loaded, setLoaded] = useState(() => new Set([0, 1 % SLIDES.length]));
  useEffect(() => {
    setLoaded((prev) => {
      if (prev.has(active) && prev.has((active + 1) % SLIDES.length)) return prev;
      const next = new Set(prev);
      next.add(active);
      next.add((active + 1) % SLIDES.length);
      return next;
    });
  }, [active]);

  useEffect(() => {
    if (reduced || paused) return;
    const timer = setTimeout(() => setActive((prev) => (prev + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(timer);
  }, [active, paused, reduced]);

  return (
    <section
      className="relative bg-brand-navy overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Фоны слайдов — плавная смена вместо подмены src */}
      {SLIDES.map((slide, idx) =>
        !loaded.has(idx) ? null : (
        <img
          key={slide.id}
          src={slide.image}
          alt=""
          aria-hidden
          // Кадр со схемой («защита от воды», «звукоизоляция», «теплоизоляция»)
          // на десктопе показываем целиком: обрезка по высоте уводила подписи
          // за край. На телефоне оставляем обрезку — вписанный кадр там
          // сжимается в узкую полосу, и подписи всё равно не прочитать.
          className={`absolute inset-0 w-full h-full transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            slide.whole ? 'object-cover lg:object-contain lg:object-right-bottom' : 'object-cover'
          } ${idx === active ? 'opacity-90' : 'opacity-0'}`}
        />
        )
      )}
      {/* Затемняем только левую половину под текстом, правая остаётся чистым фото */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 from-10% via-ink/45 via-45% to-transparent to-70%" />
      {/* На телефоне текст лежит поверх всей ширины кадра — горизонтальной подложки
          не хватает, добавляем вертикальную. На десктопе не нужна. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 via-40% to-ink/25 lg:hidden" />

      <div className="relative max-w-[1340px] mx-auto px-5 py-20 sm:py-28 lg:py-32">
        {/* Марка стоит над слайдами и не меняется: ленты у всех слайдов одни */}
        <span className="inline-flex items-center rounded-[4px] bg-white px-4 py-2.5 mb-6 lg:mb-8">
          <img src={eurobandMark} alt="EUROBAND" className="h-6 sm:h-7 lg:h-8 w-auto" />
        </span>

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

                <p className="mt-7 text-base sm:text-lg text-white/85 leading-relaxed max-w-xl">
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
                className="h-11 flex items-center cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    idx === active ? 'w-10 bg-brand-green' : 'w-4 bg-white/25 hover:bg-white/50'
                  }`}
                />
              </button>
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
