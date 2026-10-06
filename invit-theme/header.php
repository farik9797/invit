<?php
/**
 * Шапка — перенос HeaderV2 из src/components/home-v2/Chrome.tsx.
 *
 * Десктоп с 1024px: обе строки — одна сетка из трёх колонок, поэтому меню во
 * второй строке встаёт ровно по ширине поля поиска в первой. Разделитель —
 * обычная ячейка на всю ширину сетки. Ниже 1024 — строка с бургером.
 */

if (!defined('ABSPATH')) exit;

$phone = invit_company('phoneMinsk');
$cart_count = invit_cart_count();
$cart_url = function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/cart/');
$logo = invit_asset('img/logo/invit-color.svg');

/* «Каталог» вынесен в мега-меню, поэтому в текстовом меню шапки его нет. */
$nav = [
    ['label' => 'Главная', 'url' => home_url('/')],
    ['label' => 'О компании', 'url' => home_url('/about/')],
    ['label' => 'Документация', 'url' => home_url('/certificates/')],
    ['label' => 'Новости', 'url' => home_url('/news/')],
    ['label' => 'Контакты', 'url' => home_url('/contacts/')],
];

$nav_link = 'inline-flex items-center min-h-10 px-3.5 rounded-[4px] text-[15px] text-inv-ink whitespace-nowrap '
    . 'transition-colors duration-[120ms] hover:bg-inv-blue hover:text-white '
    . 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';

$cart_button = 'relative flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink hover:text-inv-blue hover:bg-inv-surface-1 transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';
$cart_label = $cart_count ? 'Заявка на счёт, позиций: ' . $cart_count : 'Заявка пуста';
$cart_badge = '<span data-cart-count class="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-inv-red text-white text-[11px] font-semibold leading-[18px] text-center tabular-nums"' . ($cart_count ? '' : ' hidden') . '>' . (int) $cart_count . '</span>';
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/svg+xml" href="<?php echo esc_url(invit_asset('img/favicon.svg')); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script>document.documentElement.classList.add('js');</script>
    <?php wp_head(); ?>
</head>
<body <?php body_class('theme-v2 font-v2 min-h-screen flex flex-col bg-white text-inv-ink antialiased selection:bg-inv-blue selection:text-white'); ?>>
<?php wp_body_open(); ?>

<header class="site-header sticky top-0 z-30 bg-white border-b border-inv-border transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-0" data-header>
    <div class="hidden lg:grid max-w-[1400px] mx-auto px-4 lg:px-8 grid-cols-[auto_minmax(0,560px)_auto] grid-rows-[76px_1px_56px] items-center gap-x-6">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
            <img src="<?php echo esc_url($logo); ?>" alt="ООО «ИНВИТ»" class="h-11 w-auto">
        </a>

        <?php /* Поиск полем прямо в шапке: подсказка с товарами раскрывается под ним */ ?>
        <div class="relative" data-search-field>
            <form role="search" action="<?php echo esc_url(invit_url_catalog()); ?>" method="get">
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-inv-ink-muted"><?php echo invit_icon('search', 'w-4 h-4'); ?></span>
                <input
                    type="search"
                    name="q"
                    autocomplete="off"
                    placeholder="Поиск по названию или артикулу"
                    aria-label="Поиск по каталогу"
                    class="w-full h-11 pl-10 pr-3 rounded-[4px] border border-inv-border bg-inv-surface-1 text-sm text-inv-ink placeholder:text-inv-ink-muted transition-[background-color,border-color] duration-[120ms] focus:bg-white focus:border-inv-blue focus-visible:outline-none"
                >
            </form>
            <div data-search-drop hidden class="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-[8px] border border-inv-border bg-white shadow-[0_16px_40px_rgba(10,25,60,0.18)] overflow-hidden"></div>
        </div>

        <a href="<?php echo esc_attr(invit_tel_href($phone)); ?>" class="flex items-center gap-2 justify-self-end text-sm font-semibold text-inv-ink hover:text-inv-blue transition-colors duration-[120ms] whitespace-nowrap">
            <?php echo invit_icon('phone', 'w-4 h-4'); ?>
            <?php echo esc_html($phone); ?>
        </a>

        <div class="col-span-3 h-px bg-inv-border-subtle"></div>

        <?php get_template_part('template-parts/mega-menu'); ?>

        <nav class="flex items-center justify-between">
            <?php foreach ($nav as $item) : ?>
                <a href="<?php echo esc_url($item['url']); ?>" class="<?php echo esc_attr($nav_link); ?>"><?php echo esc_html($item['label']); ?></a>
            <?php endforeach; ?>
        </nav>

        <div class="flex items-center gap-3 justify-self-end">
            <a href="<?php echo esc_url($cart_url); ?>" data-cart-link aria-label="<?php echo esc_attr($cart_label); ?>" class="<?php echo esc_attr($cart_button); ?>">
                <?php echo invit_icon('shopping-cart', 'w-5 h-5'); ?>
                <?php echo $cart_badge; ?>
            </a>

            <button type="button" data-callback="Запрос из шапки" class="<?php echo esc_attr(invit_blue_button()); ?>">
                Запросить расчёт
            </button>
        </div>
    </div>

    <?php /* Мобильная строка: логотип, поиск, корзина, бургер */ ?>
    <div class="lg:hidden max-w-[1400px] mx-auto px-4 h-[68px] flex items-center gap-4">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="shrink-0 flex items-center min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
            <img src="<?php echo esc_url($logo); ?>" alt="ООО «ИНВИТ»" class="h-10 w-auto">
        </a>

        <div class="flex items-center gap-1 ml-auto">
            <button type="button" data-search-open aria-label="Поиск по каталогу" aria-expanded="false" class="flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink hover:text-inv-blue hover:bg-inv-surface-1 transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                <?php echo invit_icon('search', 'w-5 h-5'); ?>
            </button>

            <a href="<?php echo esc_url($cart_url); ?>" data-cart-link aria-label="<?php echo esc_attr($cart_label); ?>" class="<?php echo esc_attr($cart_button); ?>">
                <?php echo invit_icon('shopping-cart', 'w-5 h-5'); ?>
                <?php echo $cart_badge; ?>
            </a>

            <button type="button" data-menu-toggle aria-expanded="false" aria-label="Открыть меню" class="w-11 h-11 -mr-2 flex items-center justify-center rounded-[4px] text-inv-ink cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue">
                <span data-menu-icon="open" class="contents"><?php echo invit_icon('menu', 'w-6 h-6'); ?></span>
                <span data-menu-icon="close" class="contents" hidden><?php echo invit_icon('x', 'w-6 h-6'); ?></span>
            </button>
        </div>
    </div>

    <?php /* Отбивка между пунктами, а не только высота строки: у длинных названий
             подпись переносится на две строки. Список длиннее экрана, а шапка
             залипающая: без своей прокрутки нижние разделы были недостижимы. */ ?>
    <div data-menu-panel hidden class="lg:hidden border-t border-inv-border bg-white px-4 py-4 space-y-1.5 max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain">
        <span class="block pt-1 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">Каталог товаров</span>
        <?php foreach (invit_menu_links() as $item) : ?>
            <a href="<?php echo esc_url($item['href']); ?>" class="flex items-center min-h-11 py-2 -mx-2 px-2 rounded-[4px] text-base font-semibold leading-snug text-inv-ink active:bg-inv-surface-1">
                <?php echo esc_html($item['label']); ?>
            </a>
        <?php endforeach; ?>

        <span class="block pt-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">Разделы сайта</span>
        <?php foreach ($nav as $item) : ?>
            <a href="<?php echo esc_url($item['url']); ?>" class="flex items-center min-h-11 py-2 -mx-2 px-2 rounded-[4px] text-base leading-snug text-inv-ink active:bg-inv-surface-1">
                <?php echo esc_html($item['label']); ?>
            </a>
        <?php endforeach; ?>
        <a href="<?php echo esc_attr(invit_tel_href($phone)); ?>" class="flex items-center min-h-11 py-2 -mx-2 px-2 rounded-[4px] text-base font-semibold text-inv-ink active:bg-inv-surface-1">
            <?php echo esc_html($phone); ?>
        </a>
        <button type="button" data-callback="Запрос из шапки" class="<?php echo esc_attr(invit_blue_button('w-full mt-2')); ?>">
            Запросить расчёт
        </button>
    </div>
</header>

<main id="content" class="flex-1">
