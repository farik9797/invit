import React, { useState } from 'react';
import { Maximize2, FileText, Download } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CertificateModal } from '../components/Modals/CertificateModal';
import { Fade, FadeGroup } from '../components/home-v2/Chrome';
import { CERTIFICATES } from '../data/catalogData';
import { LIBRARY } from '../data/library';
import { certificateImage } from '../lib/productImages';
import { CertificateItem } from '../types';

/*
 * Документация. Сначала сертификаты одним списком — клиент попросил не делить
 * их по типу: для покупателя это один набор документов на продукцию. Ниже
 * техническая библиотека: ГОСТы, ТКП и СТБ по монтажным швам и воздуховодам,
 * схемы монтажа и листовки на ленты.
 *
 * Все файлы лежат у нас, поэтому страница не зависит от invit.by.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';
const SECTION = 'py-10 sm:py-14 lg:py-20';

/** Размер файла человеку: «1,1 МБ», «87 КБ». */
const fileSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} МБ`
    : `${Math.round(bytes / 1024)} КБ`;

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

      {/* Сертификаты одним списком: делить их по типу клиент не просил */}
      <section className="bg-white">
        <div className={`${WRAP} ${SECTION}`}>
          <Fade className="flex items-baseline justify-between gap-4 flex-wrap md:pr-24 xl:pr-28">
            <h2 className="text-2xl sm:text-3xl font-semibold text-inv-ink tracking-[-0.01em]">
              Сертификаты и декларации
            </h2>
            <span className="text-sm text-inv-ink-muted tabular-nums">
              {CERTIFICATES.length} {plural(CERTIFICATES.length)}
            </span>
          </Fade>

          <FadeGroup className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CERTIFICATES.map((cert) => (
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
                  <span className="mt-1.5 block text-sm text-inv-ink-muted">
                    {cert.validUntil ? `действует до ${cert.validUntil}` : cert.type}
                  </span>
                </span>
              </button>
            ))}
          </FadeGroup>
        </div>
      </section>

      {/* Техническая библиотека: нормы, схемы монтажа и листовки на ленты */}
      <section className="bg-inv-surface-1">
        <div className={`${WRAP} ${SECTION}`}>
          <Fade className="flex items-baseline justify-between gap-4 flex-wrap md:pr-24 xl:pr-28">
            <h2 className="text-2xl sm:text-3xl font-semibold text-inv-ink tracking-[-0.01em]">
              Техническая документация
            </h2>
            <span className="text-sm text-inv-ink-muted tabular-nums">
              {LIBRARY.length} {plural(LIBRARY.length)}
            </span>
          </Fade>

          <p className="mt-3 max-w-[680px] text-base leading-[1.55] text-inv-ink-muted">
            Нормы по монтажным швам и воздуховодам, схемы монтажа и технические листы
            на наши ленты. Файлы скачиваются с нашего сайта.
          </p>

          <FadeGroup className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {LIBRARY.map((doc) => (
              <a
                key={doc.id}
                data-fade-item
                href={`${import.meta.env.BASE_URL}docs/library/${doc.file}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 rounded-[8px] border border-inv-border bg-white p-4 sm:p-5 transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-inv-surface-1 text-inv-blue">
                  <FileText className="w-5 h-5" />
                </span>

                <span className="flex-1">
                  <span className="block text-sm font-semibold text-inv-ink leading-snug group-hover:text-inv-blue transition-colors duration-[120ms]">
                    {doc.title}
                  </span>
                  {doc.text && (
                    <span className="mt-1.5 block text-[13px] leading-[1.5] text-inv-ink-muted">
                      {doc.text}
                    </span>
                  )}
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-inv-blue">
                    <Download className="w-3.5 h-3.5" />
                    Скачать · {doc.file.split('.').pop()?.toUpperCase()}, {fileSize(doc.size)}
                  </span>
                </span>
              </a>
            ))}
          </FadeGroup>
        </div>
      </section>

      <CertificateModal certificate={selected} onClose={() => setSelected(null)} />
    </>
  );
};
