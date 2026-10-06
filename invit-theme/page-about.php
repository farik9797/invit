<?php
/**
 * Template Name: О компании
 *
 * Перенос src/pages/AboutPage.tsx: тёмная полоса с маркой, факты, вкладки,
 * производство и отгрузка, стандарты и документы, реквизиты, адреса с картами.
 * Блок «Что мы производим сами» клиент попросил временно убрать (05.10).
 */

if (!defined('ABSPATH')) exit;

get_header();

$wrap = 'max-w-[1400px] mx-auto px-4 lg:px-8';
$h2 = 'text-2xl sm:text-3xl md:text-[32px] xl:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]';
$section_pad = 'py-10 sm:py-14 lg:py-24';
$items = invit_catalog_items();
$certificates = invit_data('certificates');

$facts = [
    ['value' => (int) wp_date('Y') - 2001, 'label' => 'лет на рынке'],
    ['value' => count(array_filter($items, static fn($i) => $i[INVIT_I_OWN])), 'label' => 'лент собственного производства'],
    ['value' => count($items), 'label' => 'позиций в каталоге'],
    ['value' => count($certificates), 'label' => 'документов на продукцию'],
];

/* Ширину реза (10-500 мм) и города складов дал клиент */
$production = [
    ['value' => '10-500 мм', 'title' => 'Ширина ленты', 'text' => 'Режем под задачу. Если типоразмера в каталоге нет, изготовим нетиповой размер под ваш проект.'],
    ['value' => 'Акрил и бутилкаучук', 'title' => 'Клеевые слои', 'text' => 'Наносим клейкие полосы с одной или с двух сторон, на разных основах и подложках.'],
    ['value' => '2 склада', 'title' => 'Отгрузка', 'text' => 'Минск, Солигорск.'],
];

$use_cases = [
    ['Окна и двери', 'Монтаж светопрозрачных конструкций из ПВХ и дерева без сквозняков'],
    ['Промышленное строительство', 'Здания из сэндвич-панелей, производство оборудования'],
    ['Кровля и фасады', 'Устройство и ремонт кровли, герметизация фасадов'],
    ['Внутренняя отделка', 'Перегородки из гипсокартона, монтаж систем вентиляции'],
    ['Инженерные системы', 'Герметизация вентиляции, защита от агрессивных сред'],
];

$advantages = [
    ['Герметизация', 'Плотное уплотнение стыков и швов.'],
    ['Защита', 'Барьер от влаги, пыли и агрессивной химии.'],
    ['Энергоэффективность', 'Меньше теплопотерь, устойчивее конструкция.'],
    ['Стандарты', 'Продукция отвечает действующим нормам качества и безопасности.'],
];

$service = [
    ['Всегда в наличии', [
        'Широкий ассортимент на собственных складах — большинство позиций есть постоянно.',
        'Склад в черте Минска, недалеко от МКАД, с удобным подъездом.',
        'Документы оформляют и отгружают оперативно.',
    ]],
    ['Нестандартные задачи', [
        'Заказ может быть готов к отгрузке в течение одного рабочего дня — зависит от загрузки производства.',
        'Материал под конкретные требования подбираем или разрабатываем.',
    ]],
    ['Цены и условия', [
        'Для постоянных партнёров действует система скидок и рассрочка платежа.',
        'Цель — держать продукцию доступной для строительных, ремонтных и производственных компаний.',
    ]],
    ['Доставка по Беларуси', [
        'Обычный срок доставки — от одного до двух дней с момента заказа.',
        'Свой транспорт и проверенные перевозчики.',
        'Условия бесплатной доставки уточняйте у менеджеров.',
    ]],
    ['Документы', [
        'Технические свидетельства, декларации о соответствии, отказные письма и паспорта качества — при отгрузке.',
    ]],
];

$standards = [
    'ТКП 45-3.02-223-2010, монтаж оконных блоков',
    'ГОСТ 30971-2002, швы монтажные узлов примыкания',
    'ГОСТ 30247.0-94, испытания на огнестойкость',
];

$tabs = ['О компании', 'Где применяют', 'Поставки и сервис'];
$tab_on = 'bg-inv-blue text-white';
$tab_off = 'bg-white text-inv-ink border border-inv-border hover:border-inv-blue hover:text-inv-blue';
?>

<?php get_template_part('template-parts/breadcrumbs', null, ['items' => [['label' => 'О компании']]]); ?>

<?php /* Тёмная полоса: марка, суть компании и два действия */ ?>
<section class="bg-inv-deep text-white">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?>">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div class="lg:col-span-6">
                <?php /* Плашка обязательна: «BAND» в марке тёмно-серый и на тёмной полосе пропадает */ ?>
                <span class="inline-flex items-center rounded-[4px] bg-white px-4 py-2.5 mb-6">
                    <img src="<?php echo esc_url(invit_asset('img/logo/euroband-color.svg')); ?>" alt="EUROBAND" class="h-6 sm:h-7 lg:h-8 w-auto">
                </span>

                <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.15]">Производим ленты, а не перепродаём их</h1>

                <p class="mt-5 sm:mt-6 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[52ch]">
                    ООО «ИНВИТ» выпускает уплотнительные и герметизирующие ленты под
                    собственной маркой EUROBAND с 2001 года. Сопутствующие материалы
                    поставляем напрямую от производителей.
                </p>

                <div class="mt-8 flex flex-col sm:flex-row gap-3">
                    <button type="button" data-callback="Запрос презентации компании" class="inline-flex items-center justify-center min-h-11 px-6 rounded-[4px] bg-white text-inv-deep text-sm font-semibold cursor-pointer transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-inv-surface-2 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        Запросить презентацию
                    </button>
                    <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="inline-flex items-center justify-center min-h-11 px-6 rounded-[4px] border border-white/40 text-white text-sm font-semibold transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        Смотреть каталог
                    </a>
                </div>
            </div>

            <div class="lg:col-span-6">
                <img src="<?php echo esc_url(invit_asset('img/banners/euroband-production.webp')); ?>" alt="Ленты EUROBAND собственного производства" width="1200" height="800" class="w-full h-[240px] sm:h-[340px] lg:h-[420px] object-cover rounded-[8px]">
            </div>
        </div>
    </div>
</section>

<?php /* Полоса фактов: все четыре числа считаются по данным каталога */ ?>
<section class="bg-white border-b border-inv-border">
    <div class="<?php echo $wrap; ?> py-8 sm:py-12" data-fade-group>
        <dl class="grid grid-cols-2 lg:grid-cols-4 gap-y-6 sm:gap-y-8">
            <?php foreach ($facts as $idx => $fact) : ?>
                <div data-fade-item class="<?php echo $idx > 0 ? 'lg:pl-8 lg:border-l lg:border-inv-border' : ''; ?>">
                    <dt class="text-[26px] sm:text-[32px] font-semibold text-inv-ink leading-none">
                        <span data-countup="<?php echo (int) $fact['value']; ?>" class="inline-block tabular-nums" style="min-width: <?php echo strlen((string) $fact['value']); ?>ch"><?php echo (int) $fact['value']; ?></span>
                    </dt>
                    <dd class="mt-2 text-sm text-inv-ink-muted max-w-[22ch]"><?php echo esc_html($fact['label']); ?></dd>
                </div>
            <?php endforeach; ?>
        </dl>
    </div>
</section>

<?php /* Вкладки, как в архивной версии на /about-old */ ?>
<section class="bg-inv-surface-1 border-b border-inv-border" data-tabs>
    <div class="<?php echo $wrap; ?> py-10 sm:py-14">
        <div role="tablist" aria-label="О компании" class="flex flex-wrap gap-2">
            <?php foreach ($tabs as $idx => $tab) : ?>
                <button type="button" role="tab" data-tab="<?php echo (int) $idx; ?>" aria-selected="<?php echo $idx === 0 ? 'true' : 'false'; ?>" data-on="<?php echo esc_attr($tab_on); ?>" data-off="<?php echo esc_attr($tab_off); ?>" class="inline-flex items-center min-h-11 px-5 rounded-[4px] text-sm font-semibold transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue <?php echo $idx === 0 ? $tab_on : $tab_off; ?>">
                    <?php echo esc_html($tab); ?>
                </button>
            <?php endforeach; ?>
        </div>

        <div class="mt-6 rounded-[8px] border border-inv-border bg-white p-5 sm:p-8">
            <div data-tab-panel="0" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div class="lg:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed text-inv-ink-muted">
                    <p>
                        ООО «ИНВИТ» — белорусский производитель уплотнительных и герметизирующих
                        лент для строительства под собственной маркой EUROBAND. Компания работает
                        с 2001 года, продукция расходится по Беларуси и за её пределы.
                    </p>
                    <p>
                        Специализация — клейкие ленты из современных синтетических материалов и
                        комплексное снабжение объектов монтажными материалами: одна поставка вместо
                        нескольких поставщиков.
                    </p>
                    <p>
                        Кроме лент компания поставляет пену, герметики, крепёж, инструмент и
                        комплектующие для вентиляции — напрямую от производителей.
                    </p>
                </div>

                <div class="lg:col-span-5">
                    <a href="<?php echo esc_url(home_url('/bestsel/')); ?>" class="group flex h-full flex-col justify-between gap-4 rounded-[8px] border border-inv-border bg-inv-surface-1 p-5 transition-[border-color,transform] duration-[240ms] hover:-translate-y-0.5 hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                        <span class="flex items-center gap-2 text-sm font-semibold text-inv-ink">
                            <?php echo invit_icon('award', 'w-5 h-5 text-inv-red'); ?>
                            Лучший строительный продукт года — 2013
                        </span>
                        <span class="text-sm leading-relaxed text-inv-ink-muted">
                            Монтажные ленты EUROBAND победили в категории «Клеевые и герметизирующие
                            материалы» республиканского конкурса.
                        </span>
                        <span class="inline-flex items-center gap-2 text-sm font-semibold text-inv-blue">
                            Подробнее о награде
                            <?php echo invit_icon('arrow-right', 'w-4 h-4 transition-transform duration-[240ms] group-hover:translate-x-0.5'); ?>
                        </span>
                    </a>
                </div>
            </div>

            <div data-tab-panel="1" hidden class="space-y-8">
                <div>
                    <h2 class="text-lg font-semibold text-inv-ink">Направления</h2>
                    <dl class="mt-3 divide-y divide-inv-border border border-inv-border rounded-[8px] overflow-hidden">
                        <?php foreach ($use_cases as [$area, $gain]) : ?>
                            <div class="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 px-4 py-3">
                                <dt class="sm:col-span-4 text-sm font-semibold text-inv-ink"><?php echo esc_html($area); ?></dt>
                                <dd class="sm:col-span-8 text-sm text-inv-ink-muted"><?php echo esc_html($gain); ?></dd>
                            </div>
                        <?php endforeach; ?>
                    </dl>
                </div>

                <div>
                    <h2 class="text-lg font-semibold text-inv-ink">Что даёт лента</h2>
                    <ul class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <?php foreach ($advantages as [$title, $text]) : ?>
                            <li class="flex gap-3 rounded-[8px] border border-inv-border p-4">
                                <?php echo invit_icon('check', 'w-5 h-5 shrink-0 text-inv-blue'); ?>
                                <span>
                                    <span class="block text-sm font-semibold text-inv-ink"><?php echo esc_html($title); ?></span>
                                    <span class="mt-1 block text-sm text-inv-ink-muted"><?php echo esc_html($text); ?></span>
                                </span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>

            <div data-tab-panel="2" hidden class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <?php foreach ($service as [$title, $lines]) : ?>
                    <div class="rounded-[8px] border border-inv-border p-5">
                        <h2 class="text-base font-semibold text-inv-ink"><?php echo esc_html($title); ?></h2>
                        <ul class="mt-3 space-y-2">
                            <?php foreach ($lines as $line) : ?>
                                <li class="flex gap-2.5 text-sm leading-relaxed text-inv-ink-muted"><?php echo invit_icon('check', 'w-4 h-4 shrink-0 mt-0.5 text-inv-blue'); ?><?php echo esc_html($line); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>

<?php /* Производство: только те цифры, которые видно в каталоге */ ?>
<section class="bg-inv-surface-1">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?> grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <div data-fade class="lg:col-span-5">
            <div class="lg:sticky lg:top-24">
                <h2 class="<?php echo $h2; ?> text-inv-ink">Производство и отгрузка</h2>
                <p class="mt-5 sm:mt-6 text-base leading-[1.55] text-inv-ink-muted max-w-[46ch]">
                    Режем ленты под задачу заказчика и держим ходовые позиции на складе.
                    Нетиповой размер считаем отдельно.
                </p>
            </div>
        </div>

        <div class="lg:col-span-7" data-fade-group data-stagger="0.08">
            <ul class="divide-y divide-inv-border">
                <?php foreach ($production as $item) : ?>
                    <li data-fade-item class="py-5 sm:py-7 first:pt-0 last:pb-0">
                        <span class="block text-xl sm:text-2xl font-semibold text-inv-blue"><?php echo esc_html($item['value']); ?></span>
                        <h3 class="mt-1 text-base font-semibold text-inv-ink"><?php echo esc_html($item['title']); ?></h3>
                        <p class="mt-1.5 text-base leading-[1.55] text-inv-ink-muted max-w-[52ch]"><?php echo esc_html($item['text']); ?></p>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>

<?php /* Документы: перечисляем текстом */ ?>
<section class="bg-inv-deep text-white">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?> grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <div data-fade class="lg:col-span-5">
            <h2 class="<?php echo $h2; ?> text-white">Стандарты и документы</h2>
            <p class="mt-4 sm:mt-5 text-base leading-[1.55] text-inv-on-deep max-w-[46ch]">
                Ленты применяются при монтаже светопрозрачных конструкций и соответствуют
                нормам, на которые ссылаются технические свидетельства:
            </p>

            <ul class="mt-6 space-y-3">
                <?php foreach ($standards as $item) : ?>
                    <li class="flex gap-3 text-sm text-white leading-relaxed"><span aria-hidden="true" class="mt-2 w-1.5 h-1.5 rounded-full bg-inv-red shrink-0"></span><?php echo esc_html($item); ?></li>
                <?php endforeach; ?>
            </ul>

            <a href="<?php echo esc_url(home_url('/certificates/')); ?>" class="mt-8 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <?php echo invit_icon('file-text', 'w-4 h-4'); ?>
                Открыть все документы
                <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
            </a>
        </div>

        <div class="lg:col-span-7" data-fade-group data-stagger="0.04">
            <ul class="divide-y divide-white/15 border-t border-white/15">
                <?php foreach (array_slice($certificates, 0, 6) as $cert) : ?>
                    <li data-fade-item>
                        <a href="<?php echo esc_url(home_url('/certificates/')); ?>" class="flex items-baseline justify-between gap-6 py-4 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                            <span class="text-sm text-white leading-snug group-hover:text-inv-on-deep transition-colors duration-[120ms]"><?php echo esc_html($cert['title']); ?></span>
                            <span class="text-xs text-inv-on-deep whitespace-nowrap shrink-0"><?php echo esc_html($cert['type']); ?></span>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>

<?php /* Полные реквизиты — как на invit.by/about */ ?>
<section class="bg-inv-surface-1 border-y border-inv-border">
    <div class="<?php echo $wrap; ?> py-10 sm:py-14">
        <h2 class="<?php echo $h2; ?> text-inv-ink">Реквизиты компании</h2>

        <dl class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-12 divide-y divide-inv-border border-y border-inv-border lg:border-t-0">
            <?php foreach (invit_data('requisites') as [$label, $value]) : ?>
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 py-3">
                    <dt class="sm:col-span-5 text-sm text-inv-ink-muted"><?php echo esc_html($label); ?></dt>
                    <dd class="sm:col-span-7 text-sm font-medium text-inv-ink break-words"><?php echo esc_html($value); ?></dd>
                </div>
            <?php endforeach; ?>
        </dl>

        <p class="mt-5 text-sm text-inv-ink-muted">Почта <a href="mailto:info@invit.by" class="text-inv-blue hover:text-inv-blue-pressed transition-colors">info@invit.by</a>, сайт invit.by</p>
    </div>
</section>

<?php /* Куда приехать и с кем говорить */ ?>
<section class="bg-white">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?>">
        <div data-fade>
            <h2 class="<?php echo $h2; ?> text-inv-ink">Приезжайте или напишите</h2>
        </div>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6" data-fade-group>
            <div data-fade-item>
                <?php echo invit_icon('map-pin', 'w-5 h-5 text-inv-blue'); ?>
                <h3 class="mt-3 text-base font-semibold text-inv-ink">Минск</h3>
                <p class="mt-1.5 text-sm text-inv-ink-muted leading-relaxed max-w-[30ch]">Минский район, Сеницкий сельсовет, 84 (ТЦ «Сеница», офис 9)</p>
                <a href="tel:+375296444979" class="mt-2 inline-flex items-center min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">+375 29 644-49-79</a>
            </div>

            <div data-fade-item>
                <?php echo invit_icon('map-pin', 'w-5 h-5 text-inv-blue'); ?>
                <h3 class="mt-3 text-base font-semibold text-inv-ink">Солигорск</h3>
                <p class="mt-1.5 text-sm text-inv-ink-muted leading-relaxed max-w-[30ch]">улица Строителей, 30, офис 101</p>
                <a href="tel:+375174325022" class="mt-2 inline-flex items-center min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">+375 174 32-50-22</a>
            </div>

            <div data-fade-item>
                <?php echo invit_icon('file-text', 'w-5 h-5 text-inv-blue'); ?>
                <h3 class="mt-3 text-base font-semibold text-inv-ink">Реквизиты</h3>
                <p class="mt-1.5 text-sm text-inv-ink-muted leading-relaxed max-w-[30ch]">
                    УНП 600500616, юридический адрес: Минская область, город Солигорск, улица
                    Строителей, 30, кабинет 101
                </p>
                <a href="<?php echo esc_url(home_url('/contacts/')); ?>" class="mt-2 inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">
                    Все контакты
                    <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
                </a>
            </div>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <?php get_template_part('template-parts/address-map', null, invit_office_coords('minsk') + ['title' => 'Минск', 'address' => 'Минский район, Сеницкий сельсовет, 84 — ТЦ «Сеница», офис 9']); ?>
            <?php get_template_part('template-parts/address-map', null, invit_office_coords('soligorsk') + ['title' => 'Солигорск', 'address' => 'улица Строителей, 30, офис 101']); ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
