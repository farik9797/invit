import React from 'react';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';
import { Reveal } from '../Reveal';

/** Широкое фото с тёмной карточкой-обращением поверх — блок с invit.belinfo.by. */
export const ContactBanner: React.FC = () => (
  <section className="relative bg-ink">
    <img
      src="https://invit.by/image/cache/data/slides/lenta_pe_euroband-1092x337.jpg"
      alt=""
      aria-hidden
      className="absolute inset-0 w-full h-full object-cover opacity-45"
    />

    <div className="relative max-w-[1340px] mx-auto px-5 py-16 sm:py-24 flex lg:justify-end">
      <Reveal>
        <div className="bg-ink/95 backdrop-blur-sm p-8 sm:p-12 max-w-xl">
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            Если у вас есть вопросы по ассортименту, нужны нестандартные размеры или расчёт объёма —
            напишите нам. Подберём ленту под задачу и подготовим коммерческое предложение.
          </p>

          <p className="mt-6 text-xl sm:text-2xl font-bold text-brand-green">
            Спасибо, что выбрали нас!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to={paths.contacts}
              className="inline-flex justify-center items-center bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold px-7 py-3.5 transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]"
            >
              Связаться с нами
            </Link>
            <a
              href="tel:+375296444979"
              className="inline-flex justify-center items-center border border-white/25 hover:bg-white/10 text-white text-sm font-semibold px-7 py-3.5 whitespace-nowrap transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]"
            >
              +375 (29) 644-49-79
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
