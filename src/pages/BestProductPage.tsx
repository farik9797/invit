import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Maximize2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Lightbox } from '../components/Lightbox';
import { paths } from '../routes';
import diplom2013 from '../assets/awards/diplom-2013.webp';

/*
 * Страница про победу в конкурсе 2013 года — открывается по клику на знак,
 * который висит у правого края (`AwardBadge` в `home-v2/Chrome.tsx`).
 *
 * Факты взяты со страницы клиента invit.by/bestsel: конкурс, номинация,
 * какие четыре ленты подавались, где объявляли результаты. Ничего сверх этого
 * не добавлено — цифр и оценок, которых у клиента нет, здесь быть не должно.
 *
 * Скан диплома тоже с их сайта, лежит локально: `src/assets/awards/`.
 */

const WRAP = 'max-w-[1100px] mx-auto px-5';

/** Что подавали на конкурс — все четыре позиции с сайта клиента. */
const ENTRIES = [
  { name: 'EUROBAND ВЛ и ВЛ(а)', note: 'герметизирующие ленты внутреннего слоя шва' },
  { name: 'EUROBAND НЛ', note: 'герметизирующая лента наружного слоя' },
  { name: 'EUROBAND ПСУЛ', note: 'саморасширяющаяся уплотнительная лента' }
];

export const BestProductPage: React.FC = () => {
  const [zoom, setZoom] = useState(false);

  return (
    <>
      <Breadcrumbs items={[{ label: 'Лучший строительный продукт года — 2013' }]} />

      <section className="bg-inv-deep text-white">
        <div className={`${WRAP} py-10 sm:py-14`}>
          <span className="inline-flex items-center gap-2 text-sm text-white/70">
            <Award className="w-4 h-4" />
            Республиканский профессиональный конкурс
          </span>

          <h1 className="mt-4 text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">
            Лучший строительный продукт года — 2013
          </h1>

          <p className="mt-4 max-w-[60ch] text-sm sm:text-base leading-[1.55] text-inv-on-deep">
            Монтажные ленты EUROBAND для установки светопрозрачных конструкций признаны
            лучшим продуктом года в категории «Клеевые и герметизирующие материалы».
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${WRAP} py-10 sm:py-14`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Диплом */}
            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={() => setZoom(true)}
                aria-label="Открыть диплом крупнее"
                className="group relative block w-full rounded-[8px] border border-inv-border bg-white p-3 cursor-pointer transition-[transform,box-shadow] duration-[240ms] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                <img
                  src={diplom2013}
                  alt="Диплом конкурса «Лучший строительный продукт года — 2013»"
                  className="w-full h-auto rounded-[4px]"
                />
                <span className="absolute right-5 bottom-5 flex items-center justify-center w-9 h-9 rounded-[4px] bg-white/90 text-inv-blue opacity-0 group-hover:opacity-100 transition-opacity duration-[240ms]">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </button>
            </div>

            {/* Текст */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3 text-sm sm:text-base leading-relaxed text-inv-ink-muted">
                <p>
                  ООО «ИНВИТ» впервые участвовало в десятом, юбилейном Республиканском
                  профессиональном конкурсе «Лучший строительный продукт года — 2013» и подало
                  на рассмотрение конкурсной комиссии сразу четыре своих продукта.
                </p>
                <p>
                  Победу принесли монтажные ленты для установки светопрозрачных конструкций —
                  в категории «Клеевые и герметизирующие материалы».
                </p>
                <p>
                  Итоги объявили на строительной выставке «Будпрагрэс-2013» — крупнейшей
                  ежегодной специализированной выставке республики.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-inv-ink">Что подавали на конкурс</h2>
                <ul className="mt-3 divide-y divide-inv-border border border-inv-border rounded-[8px] overflow-hidden">
                  {ENTRIES.map((item) => (
                    <li key={item.name} className="px-4 py-3">
                      <span className="block text-sm font-semibold text-inv-ink">{item.name}</span>
                      <span className="block mt-0.5 text-sm text-inv-ink-muted">{item.note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[8px] border border-inv-border bg-inv-surface-1 p-5">
                <h2 className="text-base font-semibold text-inv-ink">
                  Зачем нужны герметизирующие ленты
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-inv-ink-muted">
                  Они герметизируют и уплотняют монтажный шов при установке окон по современным
                  нормам. Внутренняя пароизоляционная и наружная паропроницаемая ленты — часть
                  системы тёплого монтажа светопрозрачных конструкций, того самого «монтажа по
                  ГОСТу».
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`${paths.category('materialy-dlya-okon')}?sub=montazhnye-lenty-dlya-okon`}
                  className="inline-flex items-center gap-2 min-h-11 px-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  Монтажные ленты в каталоге
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={paths.certificates}
                  className="inline-flex items-center min-h-11 px-6 rounded-[4px] border border-inv-border text-inv-ink text-sm font-semibold hover:border-inv-blue hover:text-inv-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  Документы на продукцию
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {zoom && (
        <Lightbox
          images={[diplom2013]}
          index={0}
          alt="Диплом конкурса «Лучший строительный продукт года — 2013»"
          onClose={() => setZoom(false)}
          onChange={() => undefined}
        />
      )}
    </>
  );
};
