import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Reveal } from '../Reveal';
import { RequestForm } from '../home-v2/RequestForm';

/*
 * Раньше здесь было широкое фото на всю ширину с тёмной карточкой поверх.
 * Клиент попросил ту же композицию, что у блока «Мы работаем с 2001 года»:
 * часть информации слева на светлом, действие справа на тёмном.
 *
 * Справа стояла тёмная карточка с парой кнопок-ссылок — вместо формы.
 * Заменена на ту же форму запроса, что на /contacts и /v2 (`RequestForm`).
 */
export const ContactBanner: React.FC = () => (
  <section className="bg-surface-soft">
    <div className="max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2">
      {/* Слева: где мы и как связаться */}
      <Reveal>
        <div className="py-16 sm:py-24 lg:pr-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-tight">
            Подберём ленту под задачу и посчитаем объём
          </h2>

          <p className="mt-6 text-sm sm:text-base text-ink/70 leading-relaxed">
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
                  className="inline-flex items-center min-h-11 sm:min-h-0 font-semibold text-ink hover:text-brand-blue transition-colors whitespace-nowrap"
                >
                  +375 29 644-49-79
                </a>
                <span className="ml-2 text-ink/50">многоканальный</span>
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
                  className="inline-flex items-center min-h-11 sm:min-h-0 font-semibold text-ink hover:text-brand-blue transition-colors"
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
              <dd className="text-ink/70 leading-relaxed">
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
        <div className="py-16 sm:py-24 lg:pl-16">
          <div className="bg-white border border-inv-border rounded-[8px] p-6 sm:p-8">
            <RequestForm idPrefix="glavnaya" />
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
