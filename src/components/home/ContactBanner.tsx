import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { paths } from '../../routes';
import { Reveal } from '../Reveal';

/*
 * Раньше здесь было широкое фото на всю ширину с тёмной карточкой поверх.
 * Клиент попросил ту же композицию, что у блока «Мы работаем с 2001 года»:
 * часть информации слева на светлом, действие справа на тёмном.
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

      {/* Справа: тёмная карточка с действием */}
      <Reveal delay={0.12} className="h-full">
        <div className="h-full lg:-mr-5">
          <div className="h-full bg-brand-navy text-white/75 p-8 sm:p-12 lg:py-24">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Спасибо, что выбрали нас!
            </h3>

            <p className="mt-6 text-sm sm:text-base leading-relaxed">
              Пришлите спецификацию или просто перечень позиций. Нетиповую ширину и длину
              считаем отдельно, по объёму даём цену производителя.
            </p>

            <p className="mt-4 text-sm sm:text-base leading-relaxed">
              Документы по качеству прикладываем к каждой партии.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to={paths.contacts}
                className="inline-flex justify-center items-center min-h-11 bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-semibold px-7 transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]"
              >
                Связаться с нами
              </Link>
              <Link
                to={paths.certificates}
                className="inline-flex justify-center items-center min-h-11 border border-white/25 hover:bg-white/10 text-white text-sm font-semibold px-7 whitespace-nowrap transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]"
              >
                Документы
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
