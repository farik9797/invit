import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Breadcrumbs, PageHeading } from '../components/Breadcrumbs';
import { QuoteFormSection } from '../components/QuoteFormSection';

const OFFICES = [
  {
    city: 'Минск',
    address: 'Минский р-н, Сеницкий с/с, 84 (ТЦ Сеница, оф. 9)',
    phones: [
      { label: '+375 (29) 644-49-79', href: 'tel:+375296444979', note: 'многоканальный' },
      { label: '+375 (17) 343-77-36', href: 'tel:+375173437736' }
    ],
    hours: ['Пн–Чт: 9:00 – 17:30', 'Пт: 9:00 – 16:00']
  },
  {
    city: 'Солигорск',
    address: '223701, ул. Строителей, 30, оф. 101',
    phones: [
      { label: '+375 (174) 32-50-22', href: 'tel:+375174325022' },
      { label: '+375 (174) 25-22-25', href: 'tel:+375174252225' },
      { label: '+375 (29) 644-42-70', href: 'tel:+375296444270' }
    ],
    hours: ['Пн–Пт: 8:00 – 17:00']
  }
];

export const ContactsPage: React.FC = () => (
  <>
    <Breadcrumbs items={[{ label: 'Контакты' }]} />
    <PageHeading
      eyebrow="Связаться с нами"
      title="Контакты ООО «ИНВИТ»"
      description="Получите консультацию о наличии и стоимости продукции по телефону или пришлите заявку на электронную почту — подготовим коммерческое предложение."
    />

    <section className="max-w-[1340px] mx-auto px-5 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OFFICES.map((office) => (
          <div
            key={office.city}
            className="bg-white rounded-xl border border-line shadow-xs p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-ink tracking-tight">{office.city}</h2>

            <div className="flex items-start gap-2.5 text-sm text-ink/70">
              <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
              <span>{office.address}</span>
            </div>

            <div className="space-y-1.5">
              {office.phones.map((phone) => (
                <div key={phone.href} className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-brand-red shrink-0" />
                  <a
                    href={phone.href}
                    className="font-bold text-ink hover:text-brand-blue transition-colors whitespace-nowrap"
                  >
                    {phone.label}
                  </a>
                  {phone.note && <span className="text-xs text-ink/45">({phone.note})</span>}
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 text-xs text-ink/55">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{office.hours.join(' · ')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-brand-sky-soft border border-line rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm text-ink/80">
          <Mail className="w-4 h-4 text-brand-blue shrink-0" />
          <span>
            Заявки и вопросы —{' '}
            <a href="mailto:info@invit.by" className="font-bold text-brand-blue hover:underline">
              info@invit.by
            </a>
          </span>
        </div>
        <span className="text-xs text-ink/55">ООО «ИНВИТ» · EUROBAND — собственная торговая марка</span>
      </div>

      {/* Реквизиты для договоров и счетов */}
      <div className="mt-6 bg-white border border-line rounded-xl p-6">
        <h2 className="text-sm font-semibold text-ink">Реквизиты</h2>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
          <div>
            <dt className="text-xs text-ink/55">Полное наименование</dt>
            <dd className="mt-1 text-ink">
              Общество с ограниченной ответственностью «ИНВИТ»
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink/55">УНП</dt>
            <dd className="mt-1 font-semibold text-ink">192436058</dd>
          </div>
          <div>
            <dt className="text-xs text-ink/55">Юридический адрес</dt>
            <dd className="mt-1 text-ink">г. Минск, ул. Мясникова, 78, оф. 6</dd>
          </div>
        </dl>
      </div>
    </section>

    <QuoteFormSection />
  </>
);
