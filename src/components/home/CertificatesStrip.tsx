import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CERTIFICATES } from '../../data/catalogData';
import { paths } from '../../routes';
import { RevealGroup } from '../Reveal';
import { certificateImage } from '../../lib/productImages';

/** Компактная полоса документов вместо большой секции с карточками. */
export const CertificatesStrip: React.FC = () => (
  <section className="py-14 bg-surface-soft border-y border-line">
    <div className="max-w-[1340px] mx-auto px-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <span className="text-xs font-semibold text-brand-green">
            Документы
          </span>
          <h2 className="mt-2 text-2xl font-bold text-ink tracking-tight">
            Качество подтверждено
          </h2>
        </div>

        <Link
          to={paths.certificates}
          className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
        >
          Все документы
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CERTIFICATES.slice(0, 5).map((cert) => (
          <Link
            key={cert.id}
            to={paths.certificates}
            className="block h-full group bg-white border border-line rounded-xl p-3 hover:border-brand-green hover:-translate-y-1 hover:shadow-lg transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
              <img
                src={certificateImage(cert.id, cert.image)}
                alt={cert.title}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </div>
            <span className="mt-3 block text-xs text-ink/70 leading-snug line-clamp-2">
              {cert.title}
            </span>
          </Link>
        ))}
      </RevealGroup>
    </div>
  </section>
);
