<?php
/**
 * Подвал и всё, что висит поверх страницы, — перенос FooterV2, AwardBadge и
 * FloatingActions из src/components/home-v2/Chrome.tsx и модалок LayoutV2.
 */

if (!defined('ABSPATH')) exit;

$company = invit_company();
$requisites = invit_data('requisitesCompact');

/* В подвале мега-меню нет, поэтому там перечисляем все разделы сайта. */
$footer_nav = [
    ['label' => 'Главная', 'url' => home_url('/')],
    ['label' => 'Каталог', 'url' => invit_url_catalog()],
    ['label' => 'О компании', 'url' => home_url('/about/')],
    ['label' => 'Документация', 'url' => home_url('/certificates/')],
    ['label' => 'Новости', 'url' => home_url('/news/')],
    ['label' => 'Контакты', 'url' => home_url('/contacts/')],
];

$telegram_icon = invit_asset('img/icons/telegram.svg');
$viber_icon = invit_asset('img/icons/viber.svg');
$in_catalog = invit_is_catalog_page();
?>
</main>

<footer class="bg-inv-deep text-inv-on-deep">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 pr-20 sm:pr-4 lg:pr-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div class="space-y-4">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <img src="<?php echo esc_url(invit_asset('img/logo/invit-light.svg')); ?>" alt="ООО «ИНВИТ»" class="h-10 w-auto">
            </a>
            <p class="text-sm leading-relaxed max-w-xs">
                Белорусский производитель уплотнительных и герметизирующих лент EUROBAND.
                Сопутствующие материалы поставляем напрямую от производителей.
            </p>

            <div class="flex flex-col sm:gap-1">
                <a href="<?php echo esc_attr(invit_tel_href($company['phoneMinsk'])); ?>" class="flex items-baseline gap-2 min-h-11 sm:min-h-0 text-base font-semibold text-white hover:text-white/80 transition-colors duration-[120ms] whitespace-nowrap">
                    <?php echo esc_html($company['phoneMinsk']); ?>
                    <span class="text-xs font-normal text-white/55">Минск</span>
                </a>
                <a href="<?php echo esc_attr(invit_tel_href($company['phoneSoligorsk'])); ?>" class="flex items-baseline gap-2 min-h-11 sm:min-h-0 text-base font-semibold text-white hover:text-white/80 transition-colors duration-[120ms] whitespace-nowrap">
                    <?php echo esc_html($company['phoneSoligorsk']); ?>
                    <span class="text-xs font-normal text-white/55">Солигорск</span>
                </a>
                <a href="mailto:<?php echo esc_attr($company['email']); ?>" class="flex items-center min-h-11 sm:min-h-0 text-sm hover:text-white transition-colors duration-[120ms]">
                    <?php echo esc_html($company['email']); ?>
                </a>
                <a href="<?php echo esc_url($company['telegram']); ?>" target="_blank" rel="noopener" class="flex items-center gap-2 min-h-11 sm:min-h-0 sm:mt-1 text-sm hover:text-white transition-colors duration-[120ms]">
                    <img src="<?php echo esc_url($telegram_icon); ?>" alt="" aria-hidden="true" width="16" height="16" class="w-4 h-4 shrink-0">
                    Заявка в Telegram
                </a>
            </div>
        </div>

        <div class="space-y-3 text-sm">
            <h2 class="text-white font-semibold">Разделы</h2>
            <nav class="flex flex-col sm:gap-3">
                <?php foreach ($footer_nav as $item) : ?>
                    <a href="<?php echo esc_url($item['url']); ?>" class="flex items-center min-h-11 sm:min-h-0 hover:text-white transition-colors duration-[120ms]">
                        <?php echo esc_html($item['label']); ?>
                    </a>
                <?php endforeach; ?>
            </nav>
        </div>

        <div class="space-y-3 text-sm xl:pr-24">
            <h2 class="text-white font-semibold">Реквизиты</h2>
            <ul class="space-y-2 text-[13px] leading-[1.5] text-white/70">
                <?php foreach ($requisites as $line) : ?>
                    <li class="break-words"><?php echo esc_html($line); ?></li>
                <?php endforeach; ?>
            </ul>
            <a href="<?php echo esc_url(home_url('/about/')); ?>" class="inline-flex items-center min-h-11 sm:min-h-0 text-sm hover:text-white transition-colors duration-[120ms]">
                Все реквизиты и документы
            </a>
        </div>
    </div>

    <div class="border-t border-white/15">
        <div class="max-w-[1400px] mx-auto px-4 lg:px-8 pr-20 sm:pr-24 lg:pr-28 py-4 text-xs leading-relaxed text-white/60">
            Сайт носит информационный характер, не является интернет-магазином и публичной
            офертой. Продажа товаров физическим лицам (розничная торговля) не осуществляется:
            работаем с юридическими лицами и индивидуальными предпринимателями по счёт-фактуре.
        </div>
    </div>

    <div class="border-t border-white/15">
        <div class="max-w-[1400px] mx-auto px-4 lg:px-8 pr-20 sm:pr-24 lg:pr-28 py-5 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6">
            <span>© 2001-<?php echo esc_html(wp_date('Y')); ?> ООО «ИНВИТ». Все права защищены.</span>
            <a href="<?php echo esc_url(home_url('/privacy/')); ?>" class="inline-flex items-center min-h-11 sm:min-h-0 hover:text-white transition-colors duration-[120ms] whitespace-nowrap">
                Политика конфиденциальности
            </a>
        </div>
    </div>
</footer>

<?php /* В каталоге медали нет: она висит поверх выдачи и ложится на снимки. */ ?>
<?php if (!$in_catalog) : ?>
    <a
        href="<?php echo esc_url(home_url('/bestsel/')); ?>"
        aria-label="Лучший строительный продукт года 2013 — подробнее"
        style="clip-path: circle(50%)"
        class="hidden md:block fixed right-4 top-[35%] -translate-y-1/2 xl:right-6 z-20 w-20 xl:w-24 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inv-blue"
    >
        <img src="<?php echo esc_url(invit_asset('img/awards/award-2013.webp')); ?>" alt="Лучший строительный продукт года 2013" width="96" height="96" class="w-full h-auto select-none drop-shadow-[0_4px_14px_rgba(22,44,88,0.22)]">
    </a>
<?php endif; ?>

<?php
/* Плавающие кнопки: наверх, каналы связи и звонок (FloatingActions). */
$round = 'w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-[0_6px_24px_rgba(22,44,88,0.22)] flex items-center justify-center cursor-pointer transition-[background-color,transform,opacity] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.96]';
$hidden_state = 'opacity-0 scale-75 translate-y-3 pointer-events-none';
$channels = [
    ['label' => 'Написать в Telegram', 'href' => $company['telegram'], 'bg' => 'bg-[#26A5E4] hover:bg-[#1e8fc7]', 'icon' => $telegram_icon],
    ['label' => 'Написать в Viber', 'href' => 'viber://chat?number=%2B375296444979', 'bg' => 'bg-[#7360F2] hover:bg-[#5f4ce0]', 'icon' => $viber_icon],
];
?>
<button type="button" data-to-top hidden aria-label="Наверх" class="<?php echo esc_attr($round); ?> fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 bg-white border border-inv-border text-inv-ink hover:text-inv-blue hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
    <?php echo invit_icon('chevron-up', 'w-5 h-5 sm:w-6 sm:h-6'); ?>
</button>

<div data-fab class="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-3">
    <?php foreach ($channels as $idx => $channel) : ?>
        <a
            href="<?php echo esc_attr($channel['href']); ?>"
            target="_blank"
            rel="noopener"
            data-fab-item
            data-delay="<?php echo (int) ($idx * 30); ?>"
            aria-label="<?php echo esc_attr($channel['label']); ?>"
            aria-hidden="true"
            tabindex="-1"
            class="<?php echo esc_attr($round . ' ' . $channel['bg'] . ' text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ' . $hidden_state); ?>"
        >
            <img src="<?php echo esc_url($channel['icon']); ?>" alt="" aria-hidden="true" width="24" height="24" class="w-6 h-6 sm:w-7 sm:h-7">
        </a>
    <?php endforeach; ?>

    <a
        href="<?php echo esc_attr(invit_tel_href($company['phoneMinsk'])); ?>"
        data-fab-item
        data-delay="<?php echo (int) (count($channels) * 30); ?>"
        aria-label="Позвонить"
        aria-hidden="true"
        tabindex="-1"
        class="<?php echo esc_attr($round . ' bg-inv-blue hover:bg-inv-blue-hover text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ' . $hidden_state); ?>"
    >
        <?php echo invit_icon('phone', 'w-5 h-5 sm:w-6 sm:h-6'); ?>
    </a>

    <button type="button" data-fab-toggle aria-expanded="false" aria-label="Связаться с нами" class="<?php echo esc_attr($round); ?> bg-inv-blue hover:bg-inv-blue-hover text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
        <span data-fab-icon="open" class="contents"><?php echo invit_icon('message-circle', 'w-5 h-5 sm:w-6 sm:h-6'); ?></span>
        <span data-fab-icon="close" class="contents" hidden><?php echo invit_icon('x', 'w-5 h-5 sm:w-6 sm:h-6'); ?></span>
    </button>
</div>

<?php get_template_part('template-parts/modal-search'); ?>
<?php get_template_part('template-parts/modal-request'); ?>

<?php invit_icon_sprite(); ?>

<?php /* Значки для скриптов: из того же набора Lucide, без ручных путей */ ?>
<template id="invit-icon-alert-circle"><?php echo invit_icon('alert-circle', 'w-4 h-4 shrink-0'); ?></template>
<template id="invit-icon-check"><?php echo invit_icon('check', 'w-4 h-4'); ?></template>
<template id="invit-icon-search"><?php echo invit_icon('search', 'w-4 h-4'); ?></template>

<?php wp_footer(); ?>
</body>
</html>
