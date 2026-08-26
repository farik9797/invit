import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, MapPin, Award, Check } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Fade, FadeGroup, CountUp } from '../components/home-v2/Chrome';
import { CERTIFICATES, PRODUCTS } from '../data/catalogData';
import { productImage } from '../lib/productImages';
import { useShop } from '../context/ShopContext';
import { paths } from '../routes';
import eurobandLight from '../assets/logo/euroband-light.svg';
import heroTape from '../assets/hero/tape-application.webp';

/*
 * Страница о компании.
 *
 * Всё, что здесь написано, проверяется по данным проекта или по тому, что
 * клиент публикует на invit.by/about. Выдуманных цифр прежней версии
 * (точность порезки ±0.2 мм, аккредитованная лаборатория, СТБ 1488-2004,
 * ширина до 1500 мм) здесь нет: стандарты берём из карточек товаров, ширины —
 * из размерных рядов (10-160 мм), документы — из списка сертификатов.
 *
 * Клиент попросил вернуть вкладки, как в архивной версии на `/about-old`, и
 * перенести содержимое своей страницы invit.by/about — применение лент,
 * преимущества, условия поставки и реквизиты. Год основания (2001) и
 * реквизиты он подтвердил отдельно: на invit.by они отличались от тех, что
 * стояли у нас в подвале.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';
const H2 = 'text-2xl sm:text-3xl md:text-[32px] xl:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]';
const SECTION = 'py-10 sm:py-14 lg:py-24';

const FOUNDED = 2001;
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

/** Направления применения — со страницы invit.by/about. */
const USE_CASES = [
  { area: 'Окна и двери', gain: 'Монтаж светопрозрачных конструкций из ПВХ и дерева без сквозняков' },
  { area: 'Промышленное строительство', gain: 'Здания из сэндвич-панелей, производство оборудования' },
  { area: 'Кровля и фасады', gain: 'Устройство и ремонт кровли, герметизация фасадов' },
  { area: 'Внутренняя отделка', gain: 'Перегородки из гипсокартона, монтаж систем вентиляции' },
  { area: 'Инженерные системы', gain: 'Герметизация вентиляции, защита от агрессивных сред' }
];

const ADVANTAGES = [
  ['Герметизация', 'Плотное уплотнение стыков и швов.'],
  ['Защита', 'Барьер от влаги, пыли и агрессивной химии.'],
  ['Энергоэффективность', 'Меньше теплопотерь, устойчивее конструкция.'],
  ['Стандарты', 'Продукция отвечает действующим нормам качества и безопасности.']
];

/** Условия работы — тоже с invit.by/about, без добавлений от себя. */
const SERVICE = [
  {
    title: 'Всегда в наличии',
    items: [
      'Широкий ассортимент на собственных складах — большинство позиций есть постоянно.',
      'Склад в черте Минска, недалеко от МКАД, с удобным подъездом.',
      'Документы оформляют и отгружают оперативно.'
    ]
  },
  {
    title: 'Нестандартные задачи',
    items: [
      'Заказ может быть готов к отгрузке в течение одного рабочего дня — зависит от загрузки производства.',
      'Материал под конкретные требования подбираем или разрабатываем.'
    ]
  },
  {
    title: 'Цены и условия',
    items: [
      'Для постоянных партнёров действует система скидок и рассрочка платежа.',
      'Цель — держать продукцию доступной для строительных, ремонтных и производственных компаний.'
    ]
  },
  {
    title: 'Доставка по Беларуси',
    items: [
      'Обычный срок доставки — от одного до двух дней с момента заказа.',
      'Свой транспорт и проверенные перевозчики.',
      'Условия бесплатной доставки уточняйте у менеджеров.'
    ]
  },
  {
    title: 'Документы',
    items: [
      'Технические свидетельства, декларации о соответствии, отказные письма и паспорта качества — при отгрузке.'
    ]
  }
];

/** Реквизиты приведены к тому, что опубликовано на invit.by/about. */
const REQUISITES = [
  ['Полное наименование', 'Общество с ограниченной ответственностью «ИНВИТ»'],
  ['УНП', '600500616'],
  ['ОКПО', '29040090'],
  ['Юридический адрес', 'РБ, 223710, Минская обл., г. Солигорск, ул. Строителей, 30, каб. 101'],
  ['Минское подразделение', 'РБ, 223056, Минский р-н, Сеницкий сельсовет, 84, каб. 9'],
  ['IBAN', 'BY41PJCB30121005041000000933'],
  ['Банк', 'Доп. офис 115/4 «Приорбанк» ОАО, BIC PJCBBY2X'],
  ['Адрес банка', 'РБ, 223710, Минская обл., г. Солигорск, ул. Козлова, 37']
];

const TABS = ['О компании', 'Где применяют', 'Поставки и сервис'] as const;

const STANDARDS = [
  'ТКП 45-3.02-223-2010, монтаж оконных блоков',
  'ГОСТ 30971-2002, швы монтажные узлов примыкания',
  'ГОСТ 30247.0-94, испытания на огнестойкость'
];

/**
 * Три вкладки с содержимым страницы клиента. Панели переключаются кнопками,
 * невидимые остаются в разметке только тогда, когда активны: так на телефоне
 * страница не растёт втрое.
 */
const AboutTabs: React.FC = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);

  return (
    <section className="bg-inv-surface-1 border-b border-inv-border">
      <div className={`${WRAP} py-10 sm:py-14`}>
        <div role="tablist" aria-label="О компании" className="flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={`inline-flex items-center min-h-11 px-5 rounded-[4px] text-sm font-semibold transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${
                tab === item
                  ? 'bg-inv-blue text-white'
                  : 'bg-white text-inv-ink border border-inv-border hover:border-inv-blue hover:text-inv-blue'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[8px] border border-inv-border bg-white p-5 sm:p-8">
          {tab === 'О компании' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed text-inv-ink-muted">
                <p>
                  ООО «ИНВИТ» — белорусский производитель уплотнительных и герметизирующих
                  лент для строительства под собственной маркой EUROBAND. Компания работает
                  с {FOUNDED} года, продукция расходится по Беларуси и за её пределы.
                </p>
                <p>
                  Специализация — клейкие ленты из современных синтетических материалов и
                  комплексное снабжение объектов монтажными материалами: одна поставка вместо
                  нескольких поставщиков.
                </p>
                <p>
                  Кроме лент компания поставляет пену, герметики, крепёж, инструмент и
                  комплектующие для вентиляции — напрямую от производителей.
                </p>
              </div>

              <div className="lg:col-span-5">
                <Link
                  to={paths.bestProduct}
                  className="group flex h-full flex-col justify-between gap-4 rounded-[8px] border border-inv-border bg-inv-surface-1 p-5 transition-[border-color,transform] duration-[240ms] hover:-translate-y-0.5 hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-inv-ink">
                    <Award className="w-5 h-5 text-inv-red" />
                    Лучший строительный продукт года — 2013
                  </span>
                  <span className="text-sm leading-relaxed text-inv-ink-muted">
                    Монтажные ленты EUROBAND победили в категории «Клеевые и герметизирующие
                    материалы» республиканского конкурса.
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-inv-blue">
                    Подробнее о награде
                    <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </div>
          )}

          {tab === 'Где применяют' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-inv-ink">Направления</h2>
                <dl className="mt-3 divide-y divide-inv-border border border-inv-border rounded-[8px] overflow-hidden">
                  {USE_CASES.map(({ area, gain }) => (
                    <div key={area} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 px-4 py-3">
                      <dt className="sm:col-span-4 text-sm font-semibold text-inv-ink">{area}</dt>
                      <dd className="sm:col-span-8 text-sm text-inv-ink-muted">{gain}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-inv-ink">Что даёт лента</h2>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ADVANTAGES.map(([title, text]) => (
                    <li key={title} className="flex gap-3 rounded-[8px] border border-inv-border p-4">
                      <Check className="w-5 h-5 shrink-0 text-inv-blue" />
                      <span>
                        <span className="block text-sm font-semibold text-inv-ink">{title}</span>
                        <span className="mt-1 block text-sm text-inv-ink-muted">{text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'Поставки и сервис' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICE.map(({ title, items }) => (
                <div key={title} className="rounded-[8px] border border-inv-border p-5">
                  <h2 className="text-base font-semibold text-inv-ink">{title}</h2>
                  <ul className="mt-3 space-y-2">
                    {items.map((line) => (
                      <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-inv-ink-muted">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-inv-blue" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

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
                собственной маркой EUROBAND с 2001 года. Сопутствующие материалы
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

      {/* Вкладки: клиент попросил вернуть их, как в архивной версии на /about-old */}
      <AboutTabs />

      {/* Что мы производим: текст и четыре реальных фото лент */}
      <section className="bg-white">
        <div className={`${WRAP} ${SECTION} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center`}>
          <Fade className="lg:col-span-6">
            <h2 className={`${H2} text-inv-ink`}>Что мы производим сами</h2>

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
              <h2 className={`${H2} text-inv-ink`}>Производство и отгрузка</h2>
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

      {/* Полные реквизиты — как на invit.by/about */}
      <section className="bg-inv-surface-1 border-y border-inv-border">
        <div className={`${WRAP} py-10 sm:py-14`}>
          <h2 className={`${H2} text-inv-ink`}>Реквизиты компании</h2>

          <dl className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-12 divide-y divide-inv-border border-y border-inv-border lg:border-t-0">
            {REQUISITES.map(([label, value]) => (
              <div key={label} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 py-3">
                <dt className="sm:col-span-5 text-sm text-inv-ink-muted">{label}</dt>
                <dd className="sm:col-span-7 text-sm font-medium text-inv-ink break-words">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-sm text-inv-ink-muted">
            Почта{' '}
            <a
              href="mailto:info@invit.by"
              className="text-inv-blue hover:text-inv-blue-pressed transition-colors"
            >
              info@invit.by
            </a>
            , сайт invit.by
          </p>
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
                УНП 600500616, юридический адрес: Минская область, город Солигорск, улица
                Строителей, 30, кабинет 101
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
