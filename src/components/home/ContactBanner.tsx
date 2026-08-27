import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Reveal } from '../Reveal';
import { RequestForm } from '../home-v2/RequestForm';
import tapeApplication from '../../assets/hero/tape-application.webp';

/*
 * Раньше здесь было широкое фото на всю ширину с тёмной карточкой поверх,
 * потом — светлый блок без фото вовсе. Клиент попросил вернуть фон-фото,
 * форму оставить справа. Фото и градиент — тот же приём, что в Hero:
 * тёмный слева под текстом, светлее к центру, где стоит карточка формы.
 */
export const ContactBanner: React.FC = () => (
  <section className="relative bg-ink overflow-hidden">
    <img
      src={tapeApplication}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-ink/90 from-10% via-ink/60 via-45% to-ink/20 to-80%" />
    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 via-35% to-ink/30 lg:hidden" />

    <div className="relative max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2 gap-10 lg:gap-16 py-16 sm:py-24 items-center">
      {/* Слева: где мы и как связаться */}
      <Reveal>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            Подберём ленту под задачу и посчитаем объём
          </h2>

          <p className="mt-6 text-sm sm:text-base text-white/75 leading-relaxed">
            Если нужен нетиповой размер или вы не уверены, какая лента подойдёт, опишите
            задачу. Ответим по наличию, ценам и срокам.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <dt className="mt-0.5">
                <Phone className="w-4 h-4 text-brand-blue" />
                <span className="sr-only">Телефон</span>
              </dt>
              <dd>
                <a
                  href="tel:+375296444979"
                  className="inline-flex items-center min-h-11 sm:min-h-0 font-semibold text-white hover:text-white/70 transition-colors whitespace-nowrap"
                >
                  +375 29 644-49-79
                </a>
                <span className="ml-2 text-white/50">многоканальный</span>
              </dd>
            </div>

            <div className="flex items-start gap-3">
              <dt className="mt-0.5">
                <Mail className="w-4 h-4 text-brand-blue" />
                <span className="sr-only">Почта</span>
              </dt>
              <dd>
                <a
                  href="mailto:info@invit.by"
                  className="inline-flex items-center min-h-11 sm:min-h-0 font-semibold text-white hover:text-white/70 transition-colors"
                >
                  info@invit.by
                </a>
              </dd>
            </div>

            <div className="flex items-start gap-3">
              <dt className="mt-0.5">
                <MapPin className="w-4 h-4 text-brand-blue" />
                <span className="sr-only">Адрес</span>
              </dt>
              <dd className="text-white/75 leading-relaxed">
                Минский район, Сеницкий сельсовет, 84 (ТЦ «Сеница», офис 9)
                <br />
                Солигорск, улица Строителей, 30, офис 101
              </dd>
            </div>
          </dl>
        </div>
      </Reveal>

      {/* Справа: форма запроса расчёта */}
      <Reveal delay={0.12}>
        <div className="bg-white border border-inv-border rounded-[8px] p-6 sm:p-8 shadow-xl">
          <RequestForm idPrefix="glavnaya" />
        </div>
      </Reveal>
    </div>
  </section>
);
