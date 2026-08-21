import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, AlertCircle, FileText } from 'lucide-react';
import { CATEGORIES, CERTIFICATES, NEWS, PRODUCTS } from '../../data/catalogData';
import { TAPE_SUBCATEGORIES } from '../../lib/product';
import { paths } from '../../routes';
import { Fade, FadeGroup, CountUp, BlueButton } from './Chrome';
import heroTape from '../../assets/hero/tape-application.jpg';
import heroRoof from '../../assets/hero/roof-standing-seam.jpg';
import heroSheets from '../../assets/hero/roof-profile-sheets.jpg';
import heroSlab from '../../assets/hero/tape-slab-joint.jpg';
import eurobandLogo from '../../assets/logo/euroband-color.svg';
import { gsap, MOTION_DURATION, MOTION_EASE, prefersReducedMotion, useScrollParallax } from './gsap';

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';
const H2 = 'text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]';

/** Русское склонение после числа: 1 позиция, 2 позиции, 5 позиций. */
const plural = (n: number, forms: [string, string, string]) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  const mod10 = n % 10;
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

const positions = (n: number) => `${n} ${plural(n, ['позиция', 'позиции', 'позиций'])}`;

/* ── 1. Герой: слайдер в скруглённой карточке на 95vw ─────────────────── */

interface HeroSlide {
  id: string;
  title: string;
  text: string;
  image: string;
  href: string;
  cta: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'about',
    title: 'Уплотнительные ленты EUROBAND',
    text: 'Белорусский производитель с 2009 года. Уплотняем стыки в окнах, кровле, сэндвич-панелях и вентиляции.',
    image: heroRoof,
    href: paths.catalog,
    cta: 'Смотреть каталог'
  },
  {
    id: 'vla',
    title: 'Пароизоляционные ленты ВЛ(а) и ВЛ',
    text: 'Внутренний слой монтажного шва: металлизированная плёнка с нетканым полотном, пять типоразмеров по ширине.',
    image: heroTape,
    href: `${paths.category('materialy-dlya-okon')}?sub=montazhnye-lenty-dlya-okon`,
    cta: 'Монтажные ленты'
  },
  {
    id: 'psul',
    title: 'Саморасширяющаяся лента ПСУЛ',
    text: 'Защита стыков от воды, шума и холода. Соответствует ТКП 45-3.02-223-2010 и ГОСТ 30971-2002.',
    image: heroSheets,
    href: `${paths.category('materialy-dlya-okon')}?sub=samorasshiryayuschayasya-lenta-psul`,
    cta: 'Лента ПСУЛ'
  },
  {
    id: 'pes',
    title: 'Уплотнительные ленты ПЭС',
    text: 'Самоклеящиеся ленты из вспененного полиэтилена для сэндвич-панелей, кровли и межфланцевых соединений.',
    image: heroSlab,
    href: `${paths.category('materialy-dlya-okon')}?sub=uplotnitelnye-lenty-pes-samokleyaschiesy`,
    cta: 'Ленты ПЭС'
  }
];

const HERO_DURATION = 7000;

export const HeroV2: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Автосмена кадра. При prefers-reduced-motion слайдер стоит и листается только вручную.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const timer = window.setTimeout(
      () => setActive((prev) => (prev + 1) % HERO_SLIDES.length),
      HERO_DURATION
    );
    return () => window.clearTimeout(timer);
  }, [active, paused]);

  // Перекрёстное затухание текста. Уходящий гаснет быстрее, входящий ждёт:
  // иначе два заголовка на мгновение накладываются.
  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const tweens = slideRefs.current.map((el, idx) => {
      if (!el) return null;
      return idx === active
        ? gsap.to(el, {
            opacity: 1,
            duration: reduced ? 0 : MOTION_DURATION,
            delay: reduced ? 0 : 0.2,
            ease: MOTION_EASE
          })
        : gsap.to(el, { opacity: 0, duration: reduced ? 0 : 0.16, ease: 'none' });
    });
    // Именно kill, а не revert: revert вернул бы прозрачность к исходной и мигал бы.
    return () => tweens.forEach((tween) => tween?.kill());
  }, [active]);

  // Кадр уползает медленнее страницы. Ради этого и взят ScrollTrigger:
  // привязка к прокрутке, а не таймлайн.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-hero-photo]', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top top', end: 'bottom top', scrub: true }
      });
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-white pt-3 pb-8 lg:pb-16">
      {/* Карточка шире контентной сетки: 95vw по просьбе клиента. Скругление 12px
          это верхняя ступень шкалы радиусов Amex, для крупных поверхностей. */}
      <div
        ref={cardRef}
        className="relative w-[95vw] mx-auto rounded-[12px] overflow-hidden bg-inv-deep text-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Кадры выше карточки на 12%: запас, чтобы параллакс не оголил нижний край */}
        {HERO_SLIDES.map((slide, idx) => (
          <img
            key={slide.id}
            data-hero-photo
            src={slide.image}
            alt=""
            aria-hidden
            className={`absolute left-0 top-0 w-full h-[112%] object-cover transition-opacity duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              idx === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Подложка под текстом: слева тёмно-синяя, справа кадр остаётся чистым */}
        <div className="absolute inset-0 bg-gradient-to-r from-inv-deep from-15% via-inv-deep/70 via-50% to-transparent to-80%" />
        {/* На узком экране текст лежит поверх всей ширины, поэтому вертикальная подложка */}
        <div className="absolute inset-0 bg-gradient-to-t from-inv-deep/90 via-inv-deep/55 via-45% to-inv-deep/30 lg:hidden" />

        <div className="relative px-5 sm:px-10 lg:px-16 pt-10 pb-8 lg:pt-24 lg:pb-16">
          {/* Слайды в одной ячейке грида: высота карточки не прыгает при смене */}
          <div className="grid max-w-3xl">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === active;

              return (
                <div
                  key={slide.id}
                  ref={(el) => {
                    slideRefs.current[idx] = el;
                  }}
                  aria-hidden={!isActive}
                  style={{ opacity: idx === 0 ? 1 : 0 }}
                  // min-w-0: у элемента грида min-width равен auto, и длинное слово
                  // в заголовке распирало слайд шире карточки на телефоне.
                  className={`col-start-1 row-start-1 min-w-0 ${isActive ? '' : 'pointer-events-none'}`}
                >
                  {idx === 0 ? (
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold tracking-[-0.01em] leading-[1.1]">
                      {slide.title}
                    </h1>
                  ) : (
                    <p className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold tracking-[-0.01em] leading-[1.1]">
                      {slide.title}
                    </p>
                  )}

                  <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[44ch]">
                    {slide.text}
                  </p>

                  <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row gap-3">
                    <BlueButton href="#zapros" className="w-full sm:w-auto">
                      Запросить расчёт
                    </BlueButton>
                    <Link
                      to={slide.href}
                      tabIndex={isActive ? 0 : -1}
                      className="inline-flex items-center justify-center min-h-11 px-6 rounded-[4px] border border-white/40 text-white text-sm font-semibold whitespace-nowrap transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-12 flex items-center gap-4">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-label={`Слайд ${idx + 1}`}
                  aria-current={idx === active}
                  className="w-8 h-11 flex items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span
                    className={`h-1 w-full rounded-[4px] transition-colors duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      idx === active ? 'bg-inv-blue' : 'bg-white/35'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-inv-on-deep tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── 2. Полоса фактов: четыре колонки, разделённые тонкой линией ──────── */

const FOUNDED = 2009;

const FACTS = [
  { value: new Date().getFullYear() - FOUNDED, label: 'лет на рынке' },
  {
    value: PRODUCTS.filter((p) => p.badge === 'Собственное производство').length,
    label: 'лент собственного производства'
  },
  { value: PRODUCTS.length, label: 'позиций в каталоге' },
  { value: CERTIFICATES.length, label: 'документов на продукцию' }
];

export const FactsRow: React.FC = () => (
  <section className="bg-white border-b border-inv-border">
    <FadeGroup className={`${WRAP} py-8 sm:py-12`}>
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 sm:gap-y-8">
        {FACTS.map((fact, idx) => (
          <div
            key={fact.label}
            data-fade-item
            className={idx > 0 ? 'lg:pl-8 lg:border-l lg:border-inv-border' : ''}
          >
            <dt className="text-[26px] sm:text-[32px] font-semibold text-inv-ink leading-none">
              <CountUp value={fact.value} />
            </dt>
            <dd className="mt-2 text-sm text-inv-ink-muted max-w-[22ch]">{fact.label}</dd>
          </div>
        ))}
      </dl>
    </FadeGroup>
  </section>
);

/* ── 3. Бенто разделов лент: пять ячеек, ровно по числу разделов ──────── */

interface TapeCell {
  slug: string;
  name: string;
  categorySlug: string;
  count: number;
  image: string;
}

/** Крупную ячейку отдаём самому большому разделу: под него есть кровельное фото. */
const LEAD_SLUG = 'krovelnye-uplotniteli-kleykie-lenty';

const TAPE_CELLS: TapeCell[] = [
  LEAD_SLUG,
  ...TAPE_SUBCATEGORIES.filter((slug) => slug !== LEAD_SLUG)
].map((slug) => {
  const items = PRODUCTS.filter((p) => p.subcategorySlug === slug);
  return {
    slug,
    name: items[0]?.subcategoryName ?? slug,
    categorySlug: items[0]?.categorySlug ?? CATEGORIES[0].slug,
    count: items.length,
    image: items[0]?.image ?? ''
  };
});

const cellHref = (cell: TapeCell) => `${paths.category(cell.categorySlug)}?sub=${cell.slug}`;

const CELL_BASE =
  'group flex rounded-[8px] overflow-hidden transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,23,90,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';

export const TapeBento: React.FC = () => {
  const [lead, ...rest] = TAPE_CELLS;
  // Кадр в крупной ячейке едет медленнее сетки: даёт глубину и связывает блок с прокруткой
  const parallaxRef = useScrollParallax([{ selector: '[data-bento-photo]', yPercent: -5 }]);

  return (
    <section className="bg-inv-surface-1" ref={parallaxRef}>
      <div className={`${WRAP} py-10 sm:py-14 lg:py-24`}>
        <Fade className="max-w-[46ch]">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-inv-blue">
            Продукция
          </span>
          <h2 className={`${H2} mt-3 text-inv-ink`}>Разделы лент</h2>
        </Fade>

        <FadeGroup className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-6 gap-3 sm:gap-4 md:auto-rows-[196px]">
          {/* Крупная ячейка с фото: задаёт ритм и не даёт сетке стать шестью белыми карточками */}
          <div data-fade-item className="md:col-span-4 md:row-span-2">
            <Link to={cellHref(lead)} className={`${CELL_BASE} relative h-full min-h-[210px] sm:min-h-[280px]`}>
              <img
                data-bento-photo
                src={heroRoof}
                alt=""
                aria-hidden
                className="absolute left-0 top-0 w-full h-[110%] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inv-deep via-inv-deep/70 to-inv-deep/20" />
              <div className="relative mt-auto p-5 lg:p-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-[-0.01em]">
                  {lead.name}
                </h3>
                <p className="mt-2 text-sm text-inv-on-deep tabular-nums">
                  {positions(lead.count)} в разделе
                </p>
                <span className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Открыть раздел
                  <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>

          {rest.map((cell, idx) => {
            // Первые две правые ячейки узкие, нижние две широкие: пять ячеек без пустот.
            const span = idx < 2 ? 'md:col-span-2' : 'md:col-span-3';
            const tinted = idx >= 2;

            return (
              <div key={cell.slug} data-fade-item className={span}>
                <Link
                  to={cellHref(cell)}
                  className={`${CELL_BASE} h-full min-h-[104px] sm:min-h-[196px] items-center gap-4 p-4 sm:p-5 lg:p-6 border border-inv-border ${
                    tinted ? 'bg-inv-surface-2' : 'bg-white'
                  }`}
                >
                  <img
                    src={cell.image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0 object-contain rounded-[8px] bg-white"
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-inv-ink leading-snug">
                      {cell.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-inv-ink-muted tabular-nums">
                      {positions(cell.count)}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto shrink-0 text-inv-blue transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </FadeGroup>
      </div>
    </section>
  );
};

/* ── 4. Лента товаров с горизонтальной прокруткой ─────────────────────── */

const OWN_TAPES = PRODUCTS.filter((p) => p.badge === 'Собственное производство');

export const ProductRail: React.FC = () => (
  <section className="bg-white">
    <div className={`${WRAP} py-10 sm:py-14 lg:py-24`}>
      <Fade className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <h2 className={`${H2} text-inv-ink max-w-[24ch]`}>Ленты EUROBAND</h2>
        <Link
          to={paths.catalog}
          className="inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          Весь каталог
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Fade>

      <FadeGroup
        className="mt-6 sm:mt-10 -mx-4 lg:-mx-8 px-4 lg:px-8 overflow-x-auto snap-x snap-mandatory"
        stagger={0.04}
      >
        <ul className="flex gap-4 w-max pb-2">
          {OWN_TAPES.map((product) => (
            <li key={product.id} data-fade-item className="w-[212px] sm:w-[248px] shrink-0 snap-start">
              <Link
                to={paths.product(product)}
                className="group flex flex-col h-full rounded-[8px] border border-inv-border bg-white overflow-hidden transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,23,90,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                <img
                  src={product.image}
                  alt={product.shortTitle}
                  loading="lazy"
                  className="w-full h-[140px] sm:h-[176px] object-contain bg-white p-4"
                />
                <div className="flex flex-col flex-1 gap-2 p-4 sm:p-5 border-t border-inv-border-subtle">
                  <span className="self-start rounded-[4px] bg-inv-red px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    EUROBAND
                  </span>
                  <span className="text-xs text-inv-ink-muted">{product.subcategoryName}</span>
                  <h3 className="text-base font-semibold text-inv-ink leading-snug">
                    {product.shortTitle}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-inv-blue">
                    Характеристики
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </FadeGroup>
    </div>
  </section>
);

/* ── 5. О компании: коллаж из двух фото и текст ───────────────────────── */

const ABOUT_SCENE = 'https://invit.by/image/data/PES/montazh_lenty_pod_kontrrejku1.jpg';
const ABOUT_PRODUCT =
  'https://invit.by/image/data/GIL%20PIL/lenta_butilovaja_EUROBAND_LBA.png';

export const AboutBlock: React.FC = () => {
  // Фото и товар едут в разные стороны: коллаж перестаёт быть плоским
  const parallaxRef = useScrollParallax([
    { selector: '[data-about-scene]', yPercent: -5 },
    { selector: '[data-about-product]', yPercent: 4 }
  ]);

  return (
    <section className="bg-white" ref={parallaxRef}>
      <div
        className={`${WRAP} py-10 sm:py-14 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center`}
      >
        <Fade className="lg:col-span-6">
          <div className="relative pb-12 sm:pb-16">
            <div className="w-[82%] h-[200px] sm:h-[320px] rounded-[8px] overflow-hidden border border-inv-border">
              <img
                data-about-scene
                src={ABOUT_SCENE}
                alt="Монтаж уплотнительной ленты EUROBAND под контробрешётку кровли"
                loading="lazy"
                className="w-full h-[112%] object-cover"
              />
            </div>

            <div className="absolute right-0 bottom-0 w-[54%] h-[136px] sm:h-[200px] rounded-[8px] overflow-hidden border border-inv-border bg-white shadow-[0_6px_24px_rgba(0,23,90,0.16)]">
              <img
                data-about-product
                src={ABOUT_PRODUCT}
                alt="Бутиловая лента EUROBAND ЛБА"
                loading="lazy"
                className="w-full h-full object-contain bg-white p-4"
              />
            </div>
          </div>
        </Fade>

        <Fade className="lg:col-span-6" delay={0.06}>
          <img
            src={eurobandLogo}
            alt="EUROBAND"
            className="h-7 w-auto"
          />

          <h2 className={`${H2} mt-5 text-inv-ink max-w-[20ch]`}>
            Собственное производство в Минске
          </h2>

          <p className="mt-5 sm:mt-6 text-base leading-[1.55] text-inv-ink-muted max-w-[60ch]">
            Производим монтажные, бутилкаучуковые, саморасширяющиеся ПСУЛ и уплотнительные
            ленты ПЭС под маркой EUROBAND. По желанию клиента изготавливаем ленты нетипичных
            размеров на разных основах и подложках.
          </p>

          <p className="mt-4 text-base leading-[1.55] text-inv-ink-muted max-w-[60ch]">
            Сопутствующие материалы: пену, герметики, крепёж, инструмент и комплектующие для
            вентиляции поставляем напрямую от производителей.
          </p>

          <Link
            to={paths.about}
            className="group mt-6 sm:mt-8 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
          >
            Подробнее о компании
            <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
          </Link>
        </Fade>
      </div>
    </section>
  );
};

/* ── 6. Принципы: закреплённый заголовок и список справа ──────────────── */

const VALUES = [
  {
    title: 'Стабильное качество',
    text: 'Характеристики ленты не плавают от партии к партии.'
  },
  {
    title: 'Гибкая цена',
    text: 'Считаем под объём и задачу, а не по общему прайсу.'
  },
  {
    title: 'Долгие отношения',
    text: 'Работаем с теми, кому нужен поставщик на годы, а не разовая поставка.'
  }
];

export const ValuesBlock: React.FC = () => (
  <section className="bg-inv-surface-1">
    <div className={`${WRAP} py-10 sm:py-14 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16`}>
      <Fade className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <h2 className={`${H2} text-inv-ink max-w-[16ch]`}>Работаем с 2009 года</h2>

          <p className="mt-5 sm:mt-6 text-base leading-[1.55] text-inv-ink-muted max-w-[46ch]">
            За это время наладили собственное производство в Минске, подтвердили статус
            отечественного производителя и наработали репутацию надёжного поставщика.
          </p>

          <p className="mt-4 text-base leading-[1.55] text-inv-ink-muted max-w-[46ch]">
            Наши ленты применяются при монтаже окон и дверей, на фасадах, кровле и в системах
            вентиляции: там, где шов должен оставаться герметичным годами.
          </p>
        </div>
      </Fade>

      <FadeGroup className="lg:col-span-7" stagger={0.08}>
        <ul className="divide-y divide-inv-border">
          {VALUES.map((value) => (
            <li key={value.title} data-fade-item className="py-5 sm:py-7 first:pt-0 last:pb-0">
              <h3 className="text-xl font-semibold text-inv-ink">{value.title}</h3>
              <p className="mt-2 text-base leading-[1.55] text-inv-ink-muted max-w-[52ch]">
                {value.text}
              </p>
            </li>
          ))}
        </ul>
      </FadeGroup>
    </div>
  </section>
);

/* ── 7. Тёмная полоса с документами ───────────────────────────────────── */

export const DocumentsBand: React.FC = () => (
  <section className="bg-inv-deep text-white">
    <div className={`${WRAP} py-10 sm:py-14 lg:py-24`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <Fade className="lg:col-span-5">
          <h2 className={`${H2} text-white`}>Документы на продукцию</h2>
          <p className="mt-4 sm:mt-5 text-base leading-[1.55] text-inv-on-deep max-w-[46ch]">
            Сертификат продукции собственного производства, технические свидетельства
            и декларации о соответствии на каждый тип ленты.
          </p>
          <Link
            to={paths.certificates}
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <FileText className="w-4 h-4" />
            Все документы
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Fade>

        <FadeGroup className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {CERTIFICATES.slice(0, 4).map((cert) => (
            <div key={cert.id} data-fade-item>
              <figure className="h-full">
                <img
                  src={cert.image}
                  alt={cert.title}
                  loading="lazy"
                  className="w-full h-[142px] sm:h-[200px] object-cover object-top rounded-[8px] bg-white"
                />
                <figcaption className="mt-2 sm:mt-3 text-xs leading-relaxed text-inv-on-deep">
                  {cert.type}
                </figcaption>
              </figure>
            </div>
          ))}
        </FadeGroup>
      </div>
    </div>
  </section>
);

/* ── 8. Новости: редакционный список ──────────────────────────────────── */

export const NewsList: React.FC = () => (
  <section className="bg-white">
    <div className={`${WRAP} py-10 sm:py-14 lg:py-24`}>
      <Fade>
        <h2 className={`${H2} text-inv-ink`}>Новости</h2>
      </Fade>

      <FadeGroup className="mt-6 sm:mt-8">
        <ul className="divide-y divide-inv-border-subtle border-t border-inv-border-subtle">
          {NEWS.slice(0, 3).map((item) => (
            <li key={item.id} data-fade-item>
              <Link
                to={paths.newsArticle(item.id)}
                className="group grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-8 py-5 sm:py-6 items-baseline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                <span className="md:col-span-3 text-sm text-inv-ink-muted tabular-nums">
                  {item.date}
                </span>
                <h3 className="md:col-span-7 text-lg font-semibold text-inv-ink leading-snug group-hover:text-inv-blue transition-colors duration-[120ms]">
                  {item.title}
                </h3>
                <span className="md:col-span-2 text-sm text-inv-ink-muted md:text-right">
                  {item.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </FadeGroup>

      <Fade>
        <Link
          to={paths.news}
          className="mt-6 sm:mt-8 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          Все новости
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Fade>
    </div>
  </section>
);

/* ── 9. Контакты и форма запроса ──────────────────────────────────────── */

const FIELD =
  'w-full min-h-11 px-3 py-2.5 rounded-[4px] border bg-white text-base text-inv-ink placeholder:text-inv-ink-muted transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue';

const OFFICES = [
  {
    city: 'Минск',
    address: 'Минский р-н, Сеницкий сельсовет, 84 (ТЦ «Сеница», оф. 9)',
    phones: ['+375 29 644-49-79', '+375 17 343-77-36']
  },
  {
    city: 'Солигорск',
    address: 'ул. Строителей, 30, оф. 101',
    phones: ['+375 174 32-50-22', '+375 29 644-42-70']
  }
];

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

export const ContactSplit: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [task, setTask] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { name?: string; phone?: string } = {};
    if (!name.trim()) next.name = 'Укажите, как к вам обращаться';
    if (phone.replace(/\D/g, '').length < 9) next.phone = 'Введите номер телефона полностью';
    setErrors(next);
    if (Object.keys(next).length) return;

    // Бэкенда пока нет: заявка никуда не уходит, показываем подтверждение.
    setStatus('sending');
    timer.current = window.setTimeout(() => setStatus('done'), 600);
  };

  return (
    <section id="zapros" className="bg-inv-surface-1 scroll-mt-20">
      <div className={`${WRAP} py-10 sm:py-14 lg:py-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <Fade className="lg:col-span-5">
            <h2 className={`${H2} text-inv-ink`}>Запросить расчёт</h2>
            <p className="mt-4 sm:mt-5 text-base leading-[1.55] text-inv-ink-muted max-w-[46ch]">
              Пришлём цену и сроки по вашему объёму. Нетиповую ширину и длину
              рассчитываем отдельно.
            </p>

            <div className="mt-8 space-y-6 sm:space-y-8">
              {OFFICES.map((office) => (
                <div key={office.city}>
                  <h3 className="text-sm font-semibold text-inv-ink">{office.city}</h3>
                  <p className="mt-1.5 text-sm text-inv-ink-muted max-w-[36ch]">
                    {office.address}
                  </p>
                  <div className="mt-1 sm:mt-2 flex flex-wrap gap-x-5 sm:gap-y-1">
                    {office.phones.map((p) => (
                      <a
                        key={p}
                        href={telHref(p)}
                        className="inline-flex items-center min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] whitespace-nowrap"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <h3 className="text-sm font-semibold text-inv-ink">Почта</h3>
                <a
                  href="mailto:info@invit.by"
                  className="mt-0.5 sm:mt-1.5 inline-flex items-center min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]"
                >
                  info@invit.by
                </a>
              </div>
            </div>
          </Fade>

          <Fade className="lg:col-span-7" delay={0.06}>
            <div className="bg-white border border-inv-border rounded-[8px] p-5 sm:p-6 lg:p-8">
              {status === 'done' ? (
                <div className="flex flex-col items-start gap-4 py-6">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-inv-success/10">
                    <Check className="w-6 h-6 text-inv-success" />
                  </span>
                  <h3 className="text-xl font-semibold text-inv-ink">Заявка принята</h3>
                  <p className="text-base text-inv-ink-muted max-w-[46ch]">
                    Перезвоним в рабочее время: пн-чт с 9:00 до 17:30, пт с 9:00 до 16:00.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="min-h-11 text-sm font-semibold text-inv-blue cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="v2-name" className="text-sm font-semibold text-inv-ink">
                      Имя
                    </label>
                    <input
                      id="v2-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'v2-name-error' : undefined}
                      className={`${FIELD} ${errors.name ? 'border-inv-error' : 'border-inv-border'}`}
                    />
                    {errors.name && (
                      <p
                        id="v2-name-error"
                        className="flex items-center gap-1.5 text-sm text-inv-error"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="v2-company" className="text-sm font-semibold text-inv-ink">
                      Компания
                    </label>
                    <input
                      id="v2-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={`${FIELD} border-inv-border`}
                    />
                    <p className="text-sm text-inv-ink-muted">Необязательно</p>
                  </div>

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="v2-phone" className="text-sm font-semibold text-inv-ink">
                      Телефон
                    </label>
                    <input
                      id="v2-phone"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'v2-phone-error' : 'v2-phone-hint'}
                      className={`${FIELD} ${errors.phone ? 'border-inv-error' : 'border-inv-border'}`}
                    />
                    {errors.phone ? (
                      <p
                        id="v2-phone-error"
                        className="flex items-center gap-1.5 text-sm text-inv-error"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {errors.phone}
                      </p>
                    ) : (
                      <p id="v2-phone-hint" className="text-sm text-inv-ink-muted">
                        Например, +375 29 000-00-00
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="v2-task" className="text-sm font-semibold text-inv-ink">
                      Что нужно
                    </label>
                    <textarea
                      id="v2-task"
                      rows={3}
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      className={`${FIELD} border-inv-border resize-y`}
                    />
                    <p className="text-sm text-inv-ink-muted">
                      Тип ленты, ширина и толщина, объём в метрах или рулонах.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 px-8 rounded-[4px] bg-inv-blue text-white text-sm font-semibold cursor-pointer transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-inv-blue-hover active:bg-inv-blue-pressed active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                    >
                      {status === 'sending' ? 'Отправляем' : 'Запросить расчёт'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
};
