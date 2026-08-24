import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, MapPin } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Fade, FadeGroup, CountUp } from '../components/home-v2/Chrome';
import { CERTIFICATES, PRODUCTS } from '../data/catalogData';
import { productImage } from '../lib/productImages';
import { useShop } from '../context/ShopContext';
import { paths } from '../routes';
import eurobandLight from '../assets/logo/euroband-light.svg';
import heroTape from '../assets/hero/tape-application.webp';

/*
 * Страница о компании. Всё, что здесь написано, проверяется по данным проекта
 * или по тому, что клиент сам публикует на invit.by. Прежняя версия жила во
 * вкладках и содержала выдуманные цифры (точность порезки ±0.2 мм,
 * аккредитованная лаборатория, СТБ 1488-2004, ширина до 1500 мм) — они убраны.
 * Реальные стандарты берём из карточек товаров, реальные ширины — из размерных
 * рядов (10-160 мм), документы — из списка сертификатов.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';
const H2 = 'text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]';
const SECTION = 'py-10 sm:py-14 lg:py-24';

const FOUNDED = 2009;
const OWN_TAPES = PRODUCTS.filter((p) => p.badge === 'Собственное производство');

const FACTS = [
  { value: new Date().getFullYear() - FOUNDED, label: 'лет на рынке' },
  { value: OWN_TAPES.length, label: 'лент собственного производства' },
  { value: PRODUCTS.length, label: 'позиций в каталоге' },
  { value: CERTIFICATES.length, label: 'документов на продукцию' }
];

/** Ширины взяты из размерных рядов лент, стандарты — из описаний товаров. */
const PRODUCTION = [
  {
    value: '10-160 мм',
    title: 'Ширина ленты',
    text: 'Режем под задачу. Если типоразмера в каталоге нет, изготовим нетиповой размер под ваш проект.'
  },
  {
    value: 'Акрил и бутилкаучук',
    title: 'Клеевые слои',
    text: 'Наносим клейкие полосы с одной или с двух сторон, на разных основах и подложках.'
  },
  {
    value: '2 склада',
    title: 'Отгрузка',
    text: 'Минский район, Сеницкий сельсовет, 84 (ТЦ «Сеница») и Солигорск, улица Строителей, 30.'
  }
];

const STANDARDS = [
  'ТКП 45-3.02-223-2010, монтаж оконных блоков',
  'ГОСТ 30971-2002, швы монтажные узлов примыкания',
  'ГОСТ 30247.0-94, испытания на огнестойкость'
];

export const AboutPage: React.FC = () => {
  const shop = useShop();

  return (
    <>
      <Breadcrumbs items={[{ label: 'О компании' }]} />

      {/* Тёмная полоса: марка, суть компании и два действия */}
      <section className="bg-inv-deep text-white">
        <div className={`${WRAP} ${SECTION}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <img src={eurobandLight} alt="EUROBAND" className="h-6 sm:h-7 lg:h-8 w-auto mb-6" />

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.15]">
                Производим ленты, а не перепродаём их
              </h1>

              <p className="mt-5 sm:mt-6 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[52ch]">
                ООО «ИНВИТ» выпускает уплотнительные и герметизирующие ленты под
                собственной маркой EUROBAND с 2009 года. Сопутствующие материалы
                поставляем напрямую от производителей.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => shop.openCallback('Запрос презентации компании')}
                  className="inline-flex items-center justify-center min-h-11 px-6 rounded-[4px] bg-inv-blue text-white text-sm font-semibold cursor-pointer transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-inv-blue-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Запросить презентацию
                </button>
                <Link
                  to={paths.catalog}
                  className="inline-flex items-center justify-center min-h-11 px-6 rounded-[4px] border border-white/40 text-white text-sm font-semibold transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Смотреть каталог
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <img
                src={heroTape}
                alt="Монтаж уплотнительной ленты EUROBAND"
                width={1920}
                height={1279}
                className="w-full h-[240px] sm:h-[340px] lg:h-[420px] object-cover rounded-[8px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Полоса фактов: все четыре числа считаются по данным каталога */}
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

      {/* Что мы производим: текст и четыре реальных фото лент */}
      <section className="bg-white">
        <div className={`${WRAP} ${SECTION} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center`}>
          <Fade className="lg:col-span-6">
            <h2 className={`${H2} text-inv-ink max-w-[20ch]`}>Что мы производим сами</h2>

            <p className="mt-5 sm:mt-6 text-base leading-[1.55] text-inv-ink-muted max-w-[60ch]">
              Строительные клейкие ленты и уплотнители из синтетических материалов, в том
              числе монтажные ленты для установки окон под маркой EUROBAND. Это
              пароизоляционные ВЛ и ВЛ(а), наружная НЛ, саморасширяющаяся ПСУЛ,
              бутилкаучуковые ЛБ и ЛБА, уплотнительные ПЭС.
            </p>

            <p className="mt-4 text-base leading-[1.55] text-inv-ink-muted max-w-[60ch]">
              Пену, герметики, крепёж, инструмент и комплектующие для вентиляции мы не
              производим: это прямые поставки от производителей.
            </p>

            <Link
              to={`${paths.catalog}`}
              className="group mt-6 sm:mt-8 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
            >
              Все ленты в каталоге
              <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
            </Link>
          </Fade>

          <FadeGroup className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            {OWN_TAPES.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={paths.product(product)}
                data-fade-item
                className="group flex flex-col rounded-[8px] border border-inv-border bg-white overflow-hidden transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                <img
                  src={productImage(product)}
                  alt={product.shortTitle}
                  loading="lazy"
                  className="w-full h-[130px] sm:h-[160px] object-contain bg-white p-3"
                />
                <span className="px-4 pb-4 text-[13px] font-semibold text-inv-ink leading-snug">
                  {product.shortTitle}
                </span>
              </Link>
            ))}
          </FadeGroup>
        </div>
      </section>

      {/* Производство: только те цифры, которые видно в каталоге */}
      <section className="bg-inv-surface-1">
        <div className={`${WRAP} ${SECTION} grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16`}>
          <Fade className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h2 className={`${H2} text-inv-ink max-w-[16ch]`}>Производство и отгрузка</h2>
              <p className="mt-5 sm:mt-6 text-base leading-[1.55] text-inv-ink-muted max-w-[46ch]">
                Режем ленты под задачу заказчика и держим ходовые позиции на складе.
                Нетиповой размер считаем отдельно.
              </p>
            </div>
          </Fade>

          <FadeGroup className="lg:col-span-7" stagger={0.08}>
            <ul className="divide-y divide-inv-border">
              {PRODUCTION.map((item) => (
                <li key={item.title} data-fade-item className="py-5 sm:py-7 first:pt-0 last:pb-0">
                  <span className="block text-xl sm:text-2xl font-semibold text-inv-blue">
                    {item.value}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-inv-ink">{item.title}</h3>
                  <p className="mt-1.5 text-base leading-[1.55] text-inv-ink-muted max-w-[52ch]">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </FadeGroup>
        </div>
      </section>

      {/* Документы: перечисляем текстом, чтобы блок работал независимо от invit.by */}
      <section className="bg-inv-deep text-white">
        <div className={`${WRAP} ${SECTION} grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16`}>
          <Fade className="lg:col-span-5">
            <h2 className={`${H2} text-white`}>Стандарты и документы</h2>
            <p className="mt-4 sm:mt-5 text-base leading-[1.55] text-inv-on-deep max-w-[46ch]">
              Ленты применяются при монтаже светопрозрачных конструкций и соответствуют
              нормам, на которые ссылаются технические свидетельства:
            </p>

            <ul className="mt-6 space-y-3">
              {STANDARDS.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white leading-relaxed">
                  <span aria-hidden className="mt-2 w-1.5 h-1.5 rounded-full bg-inv-red shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to={paths.certificates}
              className="mt-8 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FileText className="w-4 h-4" />
              Открыть все документы
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Fade>

          <FadeGroup className="lg:col-span-7" stagger={0.04}>
            <ul className="divide-y divide-white/15 border-t border-white/15">
              {CERTIFICATES.slice(0, 6).map((cert) => (
                <li key={cert.id} data-fade-item>
                  <Link
                    to={paths.certificates}
                    className="flex items-baseline justify-between gap-6 py-4 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="text-sm text-white leading-snug group-hover:text-inv-on-deep transition-colors duration-[120ms]">
                      {cert.title}
                    </span>
                    <span className="text-xs text-inv-on-deep whitespace-nowrap shrink-0">
                      {cert.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </FadeGroup>
        </div>
      </section>

      {/* Куда приехать и с кем говорить */}
      <section className="bg-white">
        <div className={`${WRAP} ${SECTION}`}>
          <Fade>
            <h2 className={`${H2} text-inv-ink`}>Приезжайте или напишите</h2>
          </Fade>

          <FadeGroup className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div data-fade-item>
              <MapPin className="w-5 h-5 text-inv-blue" />
              <h3 className="mt-3 text-base font-semibold text-inv-ink">Минск</h3>
              <p className="mt-1.5 text-sm text-inv-ink-muted leading-relaxed max-w-[30ch]">
                Минский район, Сеницкий сельсовет, 84 (ТЦ «Сеница», офис 9)
              </p>
              <a
                href="tel:+375296444979"
                className="mt-2 inline-flex items-center min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]"
              >
                +375 29 644-49-79
              </a>
            </div>

            <div data-fade-item>
              <MapPin className="w-5 h-5 text-inv-blue" />
              <h3 className="mt-3 text-base font-semibold text-inv-ink">Солигорск</h3>
              <p className="mt-1.5 text-sm text-inv-ink-muted leading-relaxed max-w-[30ch]">
                улица Строителей, 30, офис 101
              </p>
              <a
                href="tel:+375174325022"
                className="mt-2 inline-flex items-center min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]"
              >
                +375 174 32-50-22
              </a>
            </div>

            <div data-fade-item>
              <FileText className="w-5 h-5 text-inv-blue" />
              <h3 className="mt-3 text-base font-semibold text-inv-ink">Реквизиты</h3>
              <p className="mt-1.5 text-sm text-inv-ink-muted leading-relaxed max-w-[30ch]">
                УНП 192436058, юридический адрес: город Минск, улица Мясникова, 78, офис 6
              </p>
              <Link
                to={paths.contacts}
                className="mt-2 inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]"
              >
                Все контакты
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeGroup>
        </div>
      </section>
    </>
  );
};
