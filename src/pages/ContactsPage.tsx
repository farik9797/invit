import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Fade, FadeGroup } from '../components/home-v2/Chrome';
import { RequestForm } from '../components/home-v2/RequestForm';
import { paths } from '../routes';

/*
 * Контакты. Прежняя версия обещала то, чего клиент не подтверждал:
 * «персональные цены в течение 30 минут», «персональный менеджер B2B»,
 * «выписка ТТН прямо на складе», «полная отсрочка для постоянных партнёров»,
 * «инженер коммерческого отдела». Всё это убрано — остались только адреса,
 * телефоны, часы работы и реквизиты, которые прислал клиент.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';
const H2 = 'text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]';
const SECTION = 'py-10 sm:py-14 lg:py-24';

const OFFICES = [
  {
    city: 'Минск',
    address: 'Минский район, Сеницкий сельсовет, 84 (ТЦ «Сеница», офис 9)',
    phones: [
      { label: '+375 29 644-49-79', note: 'многоканальный' },
      { label: '+375 17 343-77-36' }
    ],
    hours: ['Пн-Чт: 9:00 - 17:30', 'Пт: 9:00 - 16:00']
  },
  {
    city: 'Солигорск',
    address: '223701, улица Строителей, 30, офис 101',
    phones: [
      { label: '+375 174 32-50-22' },
      { label: '+375 174 25-22-25' },
      { label: '+375 29 644-42-70' }
    ],
    hours: ['Пн-Пт: 8:00 - 17:00']
  }
];

const REQUISITES = [
  { label: 'Полное наименование', value: 'Общество с ограниченной ответственностью «ИНВИТ»' },
  { label: 'УНП', value: '192436058' },
  { label: 'Юридический адрес', value: 'город Минск, улица Мясникова, 78, офис 6' }
];

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

export const ContactsPage: React.FC = () => (
  <>
    <Breadcrumbs items={[{ label: 'Контакты' }]} />

    {/* Тёмная полоса: сразу телефон и почта, без прокрутки */}
    <section className="bg-inv-deep text-white">
      <div className={`${WRAP} py-10 sm:py-14 lg:py-20`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.15]">
              Позвоните или пришлите заявку
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[52ch]">
              Ответим по наличию, ценам и срокам. Нетиповую ширину и длину ленты
              считаем отдельно.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <a
              href="tel:+375296444979"
              className="inline-flex items-center gap-3 min-h-11 text-2xl sm:text-3xl font-semibold text-white hover:text-inv-on-deep transition-colors duration-[120ms] whitespace-nowrap"
            >
              <Phone className="w-6 h-6 shrink-0" />
              +375 29 644-49-79
            </a>
            <a
              href="mailto:info@invit.by"
              className="inline-flex items-center gap-3 min-h-11 text-base font-semibold text-inv-on-deep hover:text-white transition-colors duration-[120ms]"
            >
              <Mail className="w-5 h-5 shrink-0" />
              info@invit.by
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* Офисы */}
    <section className="bg-white">
      <div className={`${WRAP} ${SECTION}`}>
        <Fade>
          <h2 className={`${H2} text-inv-ink`}>Офисы и склады</h2>
        </Fade>

        <FadeGroup className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {OFFICES.map((office) => (
            <div
              key={office.city}
              data-fade-item
              className="rounded-[8px] border border-inv-border bg-white p-5 sm:p-6 lg:p-8"
            >
              <h3 className="text-xl font-semibold text-inv-ink">{office.city}</h3>

              <p className="mt-4 flex items-start gap-3 text-base leading-[1.55] text-inv-ink-muted">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-inv-blue" />
                {office.address}
              </p>

              <div className="mt-4 flex flex-col">
                {office.phones.map((phone) => (
                  <a
                    key={phone.label}
                    href={telHref(phone.label)}
                    className="inline-flex items-baseline gap-2 min-h-11 sm:min-h-0 sm:py-1 text-base font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] whitespace-nowrap"
                  >
                    {phone.label}
                    {phone.note && (
                      <span className="text-sm font-normal text-inv-ink-muted">{phone.note}</span>
                    )}
                  </a>
                ))}
              </div>

              <p className="mt-4 flex items-start gap-3 text-sm text-inv-ink-muted">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{office.hours.join(' · ')}</span>
              </p>
            </div>
          ))}
        </FadeGroup>
      </div>
    </section>

    {/* Реквизиты */}
    <section className="bg-inv-surface-1">
      <div className={`${WRAP} ${SECTION}`}>
        <Fade>
          <h2 className={`${H2} text-inv-ink`}>Реквизиты</h2>
        </Fade>

        <FadeGroup className="mt-8">
          <dl className="divide-y divide-inv-border border-t border-inv-border">
            {REQUISITES.map((row) => (
              <div
                key={row.label}
                data-fade-item
                className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-4 sm:py-5"
              >
                <dt className="sm:col-span-4 text-sm text-inv-ink-muted">{row.label}</dt>
                <dd className="sm:col-span-8 text-base text-inv-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </FadeGroup>

        {/* Расчётный счёт клиент пока не присылал — добавить сюда, когда пришлёт */}
      </div>
    </section>

    {/* Форма: та же, что на главной варианта 2 */}
    <section id="zapros" className="bg-white scroll-mt-20">
      <div className={`${WRAP} ${SECTION}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <Fade className="lg:col-span-5">
            <h2 className={`${H2} text-inv-ink`}>Запросить расчёт</h2>
            <p className="mt-4 sm:mt-5 text-base leading-[1.55] text-inv-ink-muted max-w-[46ch]">
              Опишите задачу: тип ленты, размеры и объём. Если нужного типоразмера нет
              в каталоге, изготовим под заказ.
            </p>

            <Link
              to={paths.catalog}
              className="group mt-6 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
            >
              Сначала посмотреть каталог
              <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
            </Link>
          </Fade>

          <Fade className="lg:col-span-7" delay={0.06}>
            <div className="rounded-[8px] border border-inv-border bg-white p-5 sm:p-6 lg:p-8">
              <RequestForm idPrefix="kontakty" />
            </div>
          </Fade>
        </div>
      </div>
    </section>
  </>
);
