<?php
/**
 * Template Name: Контакты
 *
 * Перенос src/pages/ContactsPage.tsx: телефоны и почта сразу на тёмной
 * полосе, офисы с картами, реквизиты, форма расчёта. Только то, что клиент
 * подтвердил: адреса, телефоны, часы работы, реквизиты.
 */

if (!defined('ABSPATH')) exit;

get_header();

$wrap = 'max-w-[1400px] mx-auto px-4 lg:px-8';
$h2 = 'text-2xl sm:text-3xl md:text-[32px] xl:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]';
$section_pad = 'py-10 sm:py-14 lg:py-24';

$offices = [
    [
        'city' => 'Минск',
        'address' => 'Минский район, Сеницкий сельсовет, 84 (ТЦ «Сеница», офис 9)',
        'coords' => invit_office_coords('minsk'),
        'phones' => [['+375 29 644-49-79', 'многоканальный'], ['+375 17 343-77-36', '']],
        'hours' => ['Пн-Чт: 9:00 - 17:30', 'Пт: 9:00 - 16:00'],
    ],
    [
        'city' => 'Солигорск',
        'address' => '223701, улица Строителей, 30, офис 101',
        'coords' => invit_office_coords('soligorsk'),
        'phones' => [['+375 174 32-50-22', ''], ['+375 174 25-22-25', ''], ['+375 29 644-42-70', '']],
        'hours' => ['Пн-Пт: 8:00 - 17:00'],
    ],
];

/* Реквизиты страницы контактов — без адреса банка, как в React */
$requisites = array_values(array_filter(invit_data('requisites'), static fn($row) => $row[0] !== 'Адрес банка'));
?>

<?php get_template_part('template-parts/breadcrumbs', null, ['items' => [['label' => 'Контакты']]]); ?>

<?php /* Тёмная полоса: сразу телефон и почта, без прокрутки */ ?>
<section class="bg-inv-deep text-white">
    <div class="<?php echo $wrap; ?> py-10 sm:py-14 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
            <div class="lg:col-span-7">
                <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.15]">Позвоните или пришлите заявку</h1>
                <p class="mt-5 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[52ch]">
                    Ответим по наличию, ценам и срокам. Нетиповую ширину и длину ленты
                    считаем отдельно.
                </p>
            </div>

            <div class="lg:col-span-5 flex flex-col gap-3">
                <a href="tel:+375296444979" class="inline-flex items-baseline gap-3 min-h-11 text-2xl sm:text-3xl font-semibold text-white hover:text-inv-on-deep transition-colors duration-[120ms] whitespace-nowrap">
                    <?php echo invit_icon('phone', 'w-6 h-6 shrink-0 self-center'); ?>
                    +375 29 644-49-79
                    <span class="text-sm font-normal text-inv-on-deep">Минск</span>
                </a>
                <a href="tel:+375174325022" class="inline-flex items-baseline gap-3 min-h-11 text-xl sm:text-2xl font-semibold text-white hover:text-inv-on-deep transition-colors duration-[120ms] whitespace-nowrap">
                    <?php echo invit_icon('phone', 'w-5 h-5 shrink-0 self-center'); ?>
                    +375 174 32-50-22
                    <span class="text-sm font-normal text-inv-on-deep">Солигорск</span>
                </a>
                <a href="mailto:info@invit.by" class="inline-flex items-center gap-3 min-h-11 text-base font-semibold text-inv-on-deep hover:text-white transition-colors duration-[120ms]">
                    <?php echo invit_icon('mail', 'w-5 h-5 shrink-0'); ?>
                    info@invit.by
                </a>
                <a href="<?php echo esc_url(invit_company('telegram')); ?>" target="_blank" rel="noopener" class="inline-flex items-center gap-3 min-h-11 text-base font-semibold text-inv-on-deep hover:text-white transition-colors duration-[120ms]">
                    <img src="<?php echo esc_url(invit_asset('img/icons/telegram.svg')); ?>" alt="" aria-hidden="true" width="20" height="20" class="w-5 h-5 shrink-0">
                    Заявка в Telegram
                </a>
            </div>
        </div>
    </div>
</section>

<?php /* Офисы */ ?>
<section class="bg-white">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?>">
        <div data-fade>
            <h2 class="<?php echo $h2; ?> text-inv-ink">Офисы и склады</h2>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" data-fade-group>
            <?php foreach ($offices as $office) : ?>
                <div data-fade-item class="rounded-[8px] border border-inv-border bg-white p-5 sm:p-6 lg:p-8">
                    <h3 class="text-xl font-semibold text-inv-ink"><?php echo esc_html($office['city']); ?></h3>

                    <p class="mt-4 flex items-start gap-3 text-base leading-[1.55] text-inv-ink-muted">
                        <?php echo invit_icon('map-pin', 'w-5 h-5 shrink-0 mt-0.5 text-inv-blue'); ?>
                        <?php echo esc_html($office['address']); ?>
                    </p>

                    <div class="mt-4 flex flex-col">
                        <?php foreach ($office['phones'] as [$phone, $note]) : ?>
                            <a href="<?php echo esc_attr(invit_tel_href($phone)); ?>" class="inline-flex items-baseline gap-2 min-h-11 sm:min-h-0 sm:py-1 text-base font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] whitespace-nowrap">
                                <?php echo esc_html($phone); ?>
                                <?php if ($note !== '') : ?><span class="text-sm font-normal text-inv-ink-muted"><?php echo esc_html($note); ?></span><?php endif; ?>
                            </a>
                        <?php endforeach; ?>
                    </div>

                    <p class="mt-4 flex items-start gap-3 text-sm text-inv-ink-muted">
                        <?php echo invit_icon('clock', 'w-4 h-4 shrink-0 mt-0.5'); ?>
                        <span><?php echo esc_html(implode(' · ', $office['hours'])); ?></span>
                    </p>

                    <?php get_template_part('template-parts/address-map', null, $office['coords'] + [
                        'title' => $office['city'],
                        'address' => $office['address'],
                        'caption' => false,
                        'size' => 'tall',
                        'class' => 'mt-5',
                    ]); ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php /* Реквизиты */ ?>
<section class="bg-inv-surface-1">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?>">
        <div data-fade>
            <h2 class="<?php echo $h2; ?> text-inv-ink">Реквизиты</h2>
        </div>

        <div class="mt-8" data-fade-group>
            <dl class="divide-y divide-inv-border border-t border-inv-border">
                <?php foreach ($requisites as [$label, $value]) : ?>
                    <div data-fade-item class="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-4 sm:py-5">
                        <dt class="sm:col-span-4 text-sm text-inv-ink-muted"><?php echo esc_html($label); ?></dt>
                        <dd class="sm:col-span-8 text-base text-inv-ink"><?php echo esc_html($value); ?></dd>
                    </div>
                <?php endforeach; ?>
            </dl>
        </div>
    </div>
</section>

<?php /* Форма: та же, что на главной */ ?>
<section id="zapros" class="bg-white scroll-mt-20">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?>">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div data-fade class="lg:col-span-5">
                <h2 class="<?php echo $h2; ?> text-inv-ink">Запросить расчёт</h2>
                <p class="mt-4 sm:mt-5 text-base leading-[1.55] text-inv-ink-muted max-w-[46ch]">
                    Опишите задачу: тип ленты, размеры и объём. Если нужного типоразмера нет
                    в каталоге, изготовим под заказ.
                </p>
                <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="group mt-6 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                    Сначала посмотреть каталог
                    <?php echo invit_icon('arrow-right', 'w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1'); ?>
                </a>
            </div>

            <div data-fade data-delay="0.06" class="lg:col-span-7">
                <div class="rounded-[8px] border border-inv-border bg-white p-5 sm:p-6 lg:p-8">
                    <?php get_template_part('template-parts/request-form', null, ['id' => 'kontakty']); ?>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
