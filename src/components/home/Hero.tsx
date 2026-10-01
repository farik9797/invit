import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { paths } from '../../routes';
import eurobandMark from '../../assets/logo/euroband-color.svg';
import butylWindowTapes from '../../assets/hero/butyl-window-tapes.webp';
import aluButylFoil from '../../assets/hero/alu-butyl-foil.webp';
import eurobandBoxes from '../../assets/hero/euroband-boxes-range.webp';
import pesGreyRolls from '../../assets/hero/pes-grey-rolls.webp';
import butylFoamRoll from '../../assets/hero/butyl-foam-roll.webp';
import pesAndFoil from '../../assets/hero/pes-and-foil-tapes.webp';

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

/*
 * Все кадры — съёмка продукции клиента, собранная в баннеры скриптом
 * scripts/make-hero-banner.py. Прежде здесь стояли стоковые кадры, и лента с
 * маркой на них были чужие: на одном по ленте шла нечитаемая кириллица под
 * видом надписи EUROBAND.
 */
const SLIDES: Slide[] = [
  {
    id: 'about',
    lead: 'Уплотнительные и герметизирующие',
    accent: 'ленты',
    text: 'Белорусский производитель с 2001 года. Изготовим ленты нетипичных размеров под ваш проект.',
    image: eurobandBoxes,
    href: paths.catalog,
    cta: 'Смотреть каталог'
  },
  {
    id: 'joint',
    lead: 'Стык плит и панелей —',
    accent: 'уплотнительная лента ПЭС',
    text: 'Самоклеящаяся лента из вспененного полиэтилена закрывает шов от воды, шума и холода: сэндвич-панели, перекрытия, металлоконструкции.',
    image: pesGreyRolls,
    href: `${paths.category('materialy-dlya-okon')}?sub=uplotnitelnye-lenty-pes-samokleyaschiesy`,
    cta: 'Ленты ПЭС'
  },
  {
    id: 'floor',
    lead: 'Стыки оснований и покрытий —',
    accent: 'лента EUROBAND',
    text: 'Проклеиваем шов между бетоном и покрытием: кромка не задирается, пыль и влага в стык не идут.',
    image: aluButylFoil,
    href: `${paths.category('materialy-dlya-okon')}?sub=uplotnitelnye-lenty-pes-samokleyaschiesy`,
    cta: 'Ленты ПЭС'
  },
  {
    id: 'hvac',
    lead: 'Воздуховоды и вентиляция —',
    accent: 'межфланцевая лента ПЭС',
    text: 'Лента проклеивается между фланцами: воздух не уходит через соединение, магистраль тише, затраты на подачу ниже.',
    image: pesAndFoil,
    href: `${paths.category('uplotnitelnye-lenty-pes-samokleyaschiesy')}?sub=pes-mezhflancevaya-lenta`,
    cta: 'Межфланцевая лента'
  },
  {
    id: 'sandwich',
    lead: 'Сэндвич-панели и профлист —',
    accent: 'герметизация стыков',
    text: 'Бутилкаучуковая ЛБ на продольных и поперечных нахлёстах, ПЭС под прижимные планки. Стык не течёт и не свистит на ветру.',
    image: butylFoamRoll,
    href: `${paths.category('materialy-dlya-okon')}?sub=krovelnye-uplotniteli-kleykie-lenty`,
    cta: 'Кровельные ленты'
  },
  {
    id: 'butyl',
    lead: 'Примыкание окна к проёму —',
    accent: 'бутиловые ленты ЛБ и ЛБА',
    text: 'ЛБА на металлизированной основе закрывает шов от воды и ветра, двусторонняя ЛБ склеивает и герметизирует стык. Бутилкаучук не отверждается: масса остаётся пластичной.',
    image: butylWindowTapes,
    href: `${paths.category('materialy-dlya-okon')}?sub=polnobutilovye-lenty`,
    cta: 'Бутиловые ленты'
  }
];

/** Кадр держится 3,5 секунды — так попросил клиент. */
const DURATION = 3500;

/*
 * Текст слайда выходит лесенкой: заголовок, за ним описание, за ним кнопки.
 * Приём с сайта, который показал клиент: строки поднимаются на 24px и
 * проявляются с разницей в 0,1 секунды. Больше разницу брать нельзя — кадр
 * висит всего 3,5 секунды.
 */
const lines = (reduced: boolean) => ({
  in: (step: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.22 + step * 0.1, ease: [0.16, 1, 0.3, 1] }
  }),
  out: { opacity: 0, y: reduced ? 0 : 24, transition: { duration: 0.2, ease: 'linear' } }
});

export const Hero: React.FC<HeroProps> = ({ onOpenCallback }) => {
  const reduced = useReducedMotion();
  const line = lines(Boolean(reduced));
  const [active, setActive] = useState(0);
  /*
   * Слайдер не встаёт под курсором: клиент просил листать всегда. Держим
   * паузу только на время, пока клавиатурный фокус внутри кадра, — иначе
   * кнопка, до которой дошли табом, уедет вместе со слайдом.
   */
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
      /*
       * Кадр занимает 85vh: первый экран кончается чуть раньше нижнего края,
       * и под ним видно начало страницы. Не фиксированная высота, а минимум —
       * на узком экране содержимое выше 85vh и не должно обрезаться. Текст
       * при этом стоит по центру кадра (flex items-center).
       */
      className="relative flex items-center bg-brand-navy overflow-hidden min-h-[85vh]"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
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

      <div className="relative w-full max-w-[1340px] mx-auto px-5 py-20 sm:py-28 lg:py-16">
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
                animate={isActive ? 'in' : 'out'}
                variants={{ in: {}, out: {} }}
                // Уходящий слайд гаснет быстро, входящий появляется с задержкой —
                // иначе два текста накладываются друг на друга.
                transition={
                  isActive
                    ? { duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }
                    : { duration: 0.2, ease: 'linear' }
                }
              >
                <motion.h1
                  variants={line}
                  custom={0}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.25] tracking-tight"
                >
                  {slide.lead}{' '}
                  <span className="border-b-4 border-white pb-1">{slide.accent}</span>
                </motion.h1>

                <motion.p
                  variants={line}
                  custom={1}
                  className="mt-7 text-base sm:text-lg text-white/85 leading-relaxed max-w-xl"
                >
                  {slide.text}
                </motion.p>

                <motion.div
                  variants={line}
                  custom={2}
                  className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3"
                >
                  <Link
                    to={slide.href}
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex justify-center items-center bg-white hover:bg-brand-green-soft text-brand-navy text-sm font-semibold rounded-[4px] px-8 py-4 w-full sm:w-auto transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]"
                  >
                    {slide.cta}
                  </Link>

                  <button
                    onClick={onOpenCallback}
                    tabIndex={isActive ? 0 : -1}
                    className="shine inline-flex justify-center items-center border border-white/25 hover:bg-white/10 text-white text-sm font-semibold rounded-[4px] px-8 py-4 w-full sm:w-auto cursor-pointer transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]"
                  >
                    Запросить расчёт
                  </button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Переключатели */}
        {/* На большом экране левый угол занимает стрелка «вниз» — отступаем от неё */}
        <div className="mt-14 flex items-center gap-4 lg:pl-[104px]">
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
                    idx === active ? 'w-10 bg-white' : 'w-4 bg-white/25 hover:bg-white/50'
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
                className="h-full bg-white origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={{ duration: paused ? 0 : DURATION / 1000, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      </div>

      {/*
        * Стрелка «вниз» в углу кадра: показывает, что под первым экраном
        * есть страница. Приём с сайта, который показал клиент — там такой
        * же квадрат в левом нижнем углу слайдера.
        *
        * Только на большом экране: на телефоне кадр и так кончается в
        * половине экрана, а угол занят переключателями.
        */}
      <button
        type="button"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight * 0.92, behavior: reduced ? 'auto' : 'smooth' })
        }
        aria-label="Прокрутить вниз"
        className="hidden lg:flex absolute left-0 bottom-0 w-[85px] h-[85px] items-center justify-center bg-ink-soft/90 text-white hover:bg-brand-red cursor-pointer transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ArrowDown className="w-6 h-6 motion-safe:animate-[nudge_2.4s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
      </button>
    </section>
  );
};
