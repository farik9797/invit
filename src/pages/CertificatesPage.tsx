import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CertificateModal } from '../components/Modals/CertificateModal';
import { Fade, FadeGroup } from '../components/home-v2/Chrome';
import { CERTIFICATES } from '../data/catalogData';
import { certificateImage } from '../lib/productImages';
import { CertificateItem } from '../types';

/*
 * Документация. Прежняя версия была плоской сеткой из десяти карточек, на
 * каждом скане поверх лежала синяя кнопка «ПРОСМОТР», а внизу шла полоса из
 * четырёх разноцветных иконок (там же прятался последний зелёный цвет на сайте).
 *
 * Сейчас документы сгруппированы по типу: сразу видно, что есть сертификат
 * производства, свидетельство компетентности, четыре технических свидетельства
 * и четыре декларации. Сканы лежат локально, поэтому страница не зависит
 * от доступности invit.by.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';
const SECTION = 'py-10 sm:py-14 lg:py-20';

/*
 * Группы: сертификат производства и свидетельство компетентности сведены
 * в одну секцию — по отдельности каждая давала одну карточку и три пустые
 * колонки. Дальше идут технические свидетельства и декларации, по четыре.
 */
const GROUPS = [
  { title: 'Документы компании', types: ['Сертификат', 'Свидетельство'] },
  { title: 'Технические свидетельства', types: ['Техническое свидетельство'] },
  { title: 'Декларации о соответствии', types: ['Декларация о соответствии'] }
]
  .map((group) => ({
    ...group,
    items: CERTIFICATES.filter((c) => group.types.includes(c.type))
  }))
  .filter((group) => group.items.length);

const plural = (n: number) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'документов';
  const mod10 = n % 10;
  if (mod10 === 1) return 'документ';
  if (mod10 >= 2 && mod10 <= 4) return 'документа';
  return 'документов';
};

export const CertificatesPage: React.FC = () => {
  const [selected, setSelected] = useState<CertificateItem | null>(null);

  return (
    <>
      <Breadcrumbs items={[{ label: 'Документация' }]} />

      <section className="bg-inv-deep text-white">
        <div className={`${WRAP} py-10 sm:py-14 lg:py-20`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end">
            <h1 className="lg:col-span-7 text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.15]">
              Документы на продукцию EUROBAND
            </h1>
            <p className="lg:col-span-5 text-base leading-[1.55] text-inv-on-deep">
              Технические свидетельства, декларации о соответствии, сертификат продукции
              собственного производства и свидетельство технической компетентности.
              Паспорт качества прикладываем к каждой партии.
            </p>
          </div>
        </div>
      </section>

      {GROUPS.map((group, groupIdx) => (
        <section
          key={group.title}
          className={groupIdx % 2 ? 'bg-inv-surface-1' : 'bg-white'}
        >
          <div className={`${WRAP} ${SECTION}`}>
            <Fade className="flex items-baseline justify-between gap-4 flex-wrap md:pr-24 xl:pr-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-inv-ink tracking-[-0.01em]">
                {group.title}
              </h2>
              <span className="text-sm text-inv-ink-muted tabular-nums">
                {group.items.length} {plural(group.items.length)}
              </span>
            </Fade>

            <FadeGroup
              className={`mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${
                group.items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'
              }`}
            >
              {group.items.map((cert) => (
                <button
                  key={cert.id}
                  type="button"
                  data-fade-item
                  onClick={() => setSelected(cert)}
                  className="group flex flex-col text-left rounded-[8px] border border-inv-border bg-white overflow-hidden cursor-zoom-in transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  <span className="relative block bg-inv-surface-2">
                    <img
                      src={certificateImage(cert.id, cert.image)}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-[240px] object-contain p-3"
                    />
                    <span
                      aria-hidden
                      className="absolute right-3 bottom-3 flex items-center justify-center w-9 h-9 rounded-[4px] bg-white/90 text-inv-blue opacity-0 group-hover:opacity-100 transition-opacity duration-[240ms]"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </span>

                  <span className="flex-1 p-4 sm:p-5 border-t border-inv-border-subtle">
                    <span className="block text-sm font-semibold text-inv-ink leading-snug">
                      {cert.title}
                    </span>
                    {cert.validUntil && (
                      <span className="mt-1.5 block text-sm text-inv-ink-muted">
                        действует до {cert.validUntil}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </FadeGroup>
          </div>
        </section>
      ))}

      <CertificateModal certificate={selected} onClose={() => setSelected(null)} />
    </>
  );
};
