import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { paths } from '../routes';

/*
 * Политика конфиденциальности.
 *
 * Текст описывает только то, что сайт делает на самом деле, — это проверялось
 * по коду: аналитики, пикселей и рекламных куки нет, единственное хранилище —
 * корзина в localStorage браузера. Ничего про «передаём партнёрам», «храним
 * 5 лет» и прочее, чего клиент не подтверждал, здесь нет.
 *
 * ВНИМАНИЕ: типовой текст, юридически с клиентом не согласован. Перед боевым
 * запуском его должен посмотреть юрист компании — особенно если появятся
 * аналитика, рассылки или передача заявок в CRM.
 */

const WRAP = 'max-w-[840px] mx-auto px-5';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-10 first:mt-0">
    <h2 className="text-lg sm:text-xl font-semibold text-inv-ink">{title}</h2>
    <div className="mt-3 space-y-3 text-sm sm:text-base leading-relaxed text-inv-ink-muted">
      {children}
    </div>
  </section>
);

export const PrivacyPage: React.FC = () => (
  <>
    <Breadcrumbs items={[{ label: 'Политика конфиденциальности' }]} />

    <section className="bg-inv-deep text-white">
      <div className={`${WRAP} py-8 sm:py-12`}>
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">
          Политика конфиденциальности
        </h1>
        <p className="mt-3 text-sm sm:text-base text-white/70">
          Как ООО «ИНВИТ» обращается с данными, которые вы оставляете на сайте.
        </p>
      </div>
    </section>

    <section className="bg-white">
      <div className={`${WRAP} py-10 sm:py-14`}>
        <Section title="Кто обрабатывает данные">
          <p>
            Оператор — общество с ограниченной ответственностью «ИНВИТ», УНП 192436058,
            г. Минск, ул. Мясникова, 78, оф. 6. Связаться по вопросам о данных:{' '}
            <a
              href="mailto:info@invit.by"
              className="text-inv-blue hover:text-inv-blue-pressed transition-colors"
            >
              info@invit.by
            </a>
            , телефон +375 29 644-49-79.
          </p>
        </Section>

        <Section title="Какие данные мы получаем">
          <p>
            Только те, что вы сами вводите в формы на сайте: имя или название компании,
            телефон, при желании — комментарий к заявке и перечень позиций, которые вы
            отметили в каталоге.
          </p>
          <p>
            Мы не просим паспортные данные, адрес проживания и реквизиты карт — на сайте нет
            ни оплаты, ни регистрации.
          </p>
        </Section>

        <Section title="Зачем они нужны">
          <p>
            Чтобы ответить на заявку: посчитать объём и цены, уточнить типоразмеры и сроки,
            связаться с вами по указанному телефону. Для других целей данные не используются.
          </p>
          <p>Мы не продаём и не передаём их третьим лицам для рекламы.</p>
        </Section>

        <Section title="Корзина хранится в вашем браузере">
          <p>
            Позиции, которые вы отметили, лежат в памяти вашего браузера (localStorage) — чтобы
            заказ не пропал при обновлении страницы. Эти данные не уходят на сервер, пока вы не
            отправите заявку, и удаляются вместе с очисткой данных сайта в браузере.
          </p>
        </Section>

        <Section title="Аналитики и рекламных счётчиков нет">
          <p>
            Сайт не подключён к системам веб-аналитики и рекламным пикселям, не ставит
            рекламные и аналитические cookie и не отслеживает вас на других сайтах.
          </p>
        </Section>

        <Section title="Ваши права">
          <p>
            Вы можете попросить показать, исправить или удалить данные, которые вы нам
            оставили. Напишите на{' '}
            <a
              href="mailto:info@invit.by"
              className="text-inv-blue hover:text-inv-blue-pressed transition-colors"
            >
              info@invit.by
            </a>{' '}
            — ответим и выполним запрос.
          </p>
        </Section>

        <Section title="Изменения">
          <p>
            Если состав данных или порядок их обработки изменится — например, появится
            рассылка или аналитика, — мы обновим эту страницу.
          </p>
        </Section>

        <div className="mt-12 pt-6 border-t border-inv-border">
          <Link
            to={paths.contacts}
            className="inline-flex items-center min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors"
          >
            Остались вопросы — напишите нам
          </Link>
        </div>
      </div>
    </section>
  </>
);
