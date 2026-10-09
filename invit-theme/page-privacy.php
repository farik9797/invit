<?php
/**
 * Политика конфиденциальности — перенос src/pages/PrivacyPage.tsx.
 *
 * Отличий от React два: там заявка жила в localStorage браузера, здесь — в
 * сессии WooCommerce на сервере (с cookie сессии); здесь стоят Яндекс.Метрика
 * и Google Analytics (functions.php: invit_counters), включаются после
 * согласия в плашке о cookie. Текст описывает то, что сайт делает на самом
 * деле. Типовой, юристом клиента не согласован.
 */

if (!defined('ABSPATH')) exit;

get_header();

$wrap = 'max-w-[840px] mx-auto px-5';
$sections = [
    ['Кто обрабатывает данные', [
        'Оператор — общество с ограниченной ответственностью «ИНВИТ», УНП 600500616, Минская обл., г. Солигорск, ул. Строителей, 30, каб. 101. Связаться по вопросам о данных: <a href="mailto:info@invit.by" class="text-inv-blue hover:text-inv-blue-pressed transition-colors">info@invit.by</a>, телефон +375 29 644-49-79.',
    ]],
    ['Какие данные мы получаем', [
        'Только те, что вы сами вводите в формы на сайте: имя или название компании, телефон, при желании — комментарий к заявке и перечень позиций, которые вы отметили в каталоге.',
        'Мы не просим паспортные данные, адрес проживания и реквизиты карт — на сайте нет ни оплаты, ни регистрации.',
    ]],
    ['Зачем они нужны', [
        'Чтобы ответить на заявку: посчитать объём и цены, уточнить типоразмеры и сроки, связаться с вами по указанному телефону. Для других целей данные не используются.',
        'Мы не продаём и не передаём их третьим лицам для рекламы.',
    ]],
    ['Заявка хранится в сессии на сайте', [
        'Позиции, которые вы отметили, сохраняются в сессии на нашем сайте, чтобы список не пропал при переходах и обновлении страницы. Сессию узнаёт служебный cookie: в нём нет ваших данных, только номер сессии. Отмеченные позиции удаляются, когда сессия истекает или вы очищаете заявку.',
    ]],
    ['Статистика посещений и карты', [
        'На сайте стоит счётчик Яндекс.Метрики: он учитывает, откуда пришли посетители, какие страницы смотрели, куда нажимали, и записывает действия на странице (Вебвизор), чтобы мы видели, что в каталоге неудобно. Для этого Яндекс ставит свои cookie. Мы видим эти данные в отчётах Метрики и используем только для улучшения сайта. Как Яндекс обрабатывает эти данные — в его <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer" class="text-inv-blue hover:text-inv-blue-pressed transition-colors">политике конфиденциальности</a>;',
        'Так же работает Google Analytics: Google ставит свои cookie и учитывает посещения и переходы по страницам. Как Google обрабатывает эти данные — в его <a href="https://policies.google.com/privacy?hl=ru" target="_blank" rel="noopener noreferrer" class="text-inv-blue hover:text-inv-blue-pressed transition-colors">политике конфиденциальности</a>.',
        'Оба счётчика включаются, только если вы нажали «Принять» в плашке о cookie. При «Отклонить» сайт ставит лишь служебные cookie: сессии заявки и вашего выбора. <button type="button" data-cookie-settings class="font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors cursor-pointer">Изменить выбор</button>',
        'Рекламных пикселей на сайте нет, на других сайтах мы вас не отслеживаем.',
        'На страницах «Контакты» и «О компании» встроен виджет Яндекс.Карт. Пока карта на экране, браузер обращается к серверам Яндекса, и Яндекс может сохранять свои cookie по своим правилам.',
    ]],
    ['Ваши права', [
        'Вы можете попросить показать, исправить или удалить данные, которые вы нам оставили. Напишите на <a href="mailto:info@invit.by" class="text-inv-blue hover:text-inv-blue-pressed transition-colors">info@invit.by</a> — ответим и выполним запрос.',
    ]],
    ['Изменения', [
        'Если состав данных или порядок их обработки изменится — например, появится рассылка, — мы обновим эту страницу.',
    ]],
];
?>

<?php get_template_part('template-parts/breadcrumbs', null, ['items' => [['label' => 'Политика конфиденциальности']]]); ?>

<section class="bg-inv-deep text-white">
    <div class="<?php echo $wrap; ?> py-8 sm:py-12">
        <h1 class="text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">Политика конфиденциальности</h1>
        <p class="mt-3 text-sm sm:text-base text-white/70">Как ООО «ИНВИТ» обращается с данными, которые вы оставляете на сайте.</p>
    </div>
</section>

<section class="bg-white">
    <div class="<?php echo $wrap; ?> py-10 sm:py-14">
        <?php foreach ($sections as [$title, $paragraphs]) : ?>
            <section class="mt-10 first:mt-0">
                <h2 class="text-lg sm:text-xl font-semibold text-inv-ink"><?php echo esc_html($title); ?></h2>
                <div class="mt-3 space-y-3 text-sm sm:text-base leading-relaxed text-inv-ink-muted">
                    <?php foreach ($paragraphs as $paragraph) : ?>
                        <p><?php echo wp_kses($paragraph, [
                            'a' => ['href' => [], 'class' => [], 'target' => [], 'rel' => []],
                            'button' => ['type' => [], 'class' => [], 'data-cookie-settings' => []],
                        ]); ?></p>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endforeach; ?>

        <div class="mt-12 pt-6 border-t border-inv-border">
            <a href="<?php echo esc_url(home_url('/contacts/')); ?>" class="inline-flex items-center min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors">
                Остались вопросы — напишите нам
            </a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
