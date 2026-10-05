<?php
/**
 * Шапка: залипающая строка с логотипом, поиском и телефоном, под ней — кнопка
 * каталога с выпадающим меню разделов, пункты сайта, заявка и кнопка расчёта.
 * На узком экране всё сворачивается в одну строку с бургером.
 */

if (!defined('ABSPATH')) exit;

$contacts = invit_contacts();
$logo = get_template_directory_uri() . '/assets/img/invit-color.svg';
$sections = invit_catalog_sections();
$cart_count = invit_cart_count();
$cart_url = function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/cart/');

$nav_fallback = [
    ['label' => 'Главная', 'url' => home_url('/')],
    ['label' => 'О компании', 'url' => home_url('/about/')],
    ['label' => 'Документация', 'url' => home_url('/certificates/')],
    ['label' => 'Новости', 'url' => home_url('/news/')],
    ['label' => 'Контакты', 'url' => home_url('/contacts/')],
];

$nav_link = 'inline-flex items-center min-h-10 px-3.5 rounded-[4px] text-[15px] text-inv-ink whitespace-nowrap '
    . 'transition-colors duration-[120ms] hover:bg-inv-blue hover:text-white '
    . 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-white text-inv-ink antialiased'); ?>>
<?php wp_body_open(); ?>

<a href="#content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-[4px] focus:bg-inv-blue focus:px-4 focus:py-2 focus:text-white">
    К содержимому
</a>

<header class="site-header sticky top-0 z-30 bg-white border-b border-inv-border" data-header>
    <?php /* Десктоп: обе строки — одна сетка из трёх колонок, поэтому меню во
             второй строке встаёт ровно по ширине поля поиска в первой. */ ?>
    <div class="hidden lg:grid max-w-[1400px] mx-auto px-4 lg:px-8 grid-cols-[auto_minmax(0,560px)_auto] grid-rows-[76px_1px_56px] items-center gap-x-6">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
            <img src="<?php echo esc_url($logo); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>" class="h-11 w-auto" width="160" height="44">
        </a>

        <form role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>" class="relative">
            <input type="hidden" name="post_type" value="product">
            <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-inv-ink-muted">
                <?php echo invit_icon('search', 'w-4 h-4'); ?>
            </span>
            <label class="sr-only" for="header-search">Поиск по каталогу</label>
            <input
                id="header-search"
                type="search"
                name="s"
                value="<?php echo esc_attr(get_search_query()); ?>"
                placeholder="Поиск по названию или артикулу"
                class="w-full h-11 pl-11 pr-4 rounded-[4px] border border-inv-border bg-inv-surface-1 text-sm text-inv-ink placeholder:text-inv-ink-muted transition-[background-color,border-color] duration-[120ms] focus:bg-white focus:border-inv-blue focus-visible:outline-none"
            >
        </form>

        <a href="tel:<?php echo esc_attr(invit_tel($contacts['phone_minsk'])); ?>" class="flex items-center gap-2 justify-self-end text-sm font-semibold text-inv-ink hover:text-inv-blue transition-colors duration-[120ms] whitespace-nowrap">
            <?php echo invit_icon('phone', 'w-4 h-4'); ?>
            <?php echo esc_html($contacts['phone_minsk']); ?>
        </a>

        <div class="col-span-3 h-px bg-inv-border-subtle"></div>

        <?php get_template_part('template-parts/mega-menu', null, ['sections' => $sections]); ?>

        <nav class="flex items-center justify-between" aria-label="Основное меню">
            <?php
            if (has_nav_menu('primary')) {
                wp_nav_menu([
                    'theme_location' => 'primary',
                    'container'      => false,
                    'items_wrap'     => '%3$s',
                    'depth'          => 1,
                    'walker'         => new Invit_Nav_Walker($nav_link),
                ]);
            } else {
                foreach ($nav_fallback as $item) {
                    printf(
                        '<a href="%s" class="%s">%s</a>',
                        esc_url($item['url']),
                        esc_attr($nav_link),
                        esc_html($item['label'])
                    );
                }
            }
            ?>
        </nav>

        <div class="flex items-center gap-3 justify-self-end">
            <a href="<?php echo esc_url($cart_url); ?>" class="relative flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink hover:text-inv-blue hover:bg-inv-surface-1 transition-colors duration-[120ms]" aria-label="Заявка на счёт">
                <?php echo invit_icon('shopping-cart', 'w-5 h-5'); ?>
                <?php if ($cart_count) : ?>
                    <span class="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-inv-red text-[11px] font-semibold text-white"><?php echo esc_html($cart_count); ?></span>
                <?php endif; ?>
            </a>

            <button type="button" data-request class="inline-flex items-center justify-center min-h-11 px-5 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover active:scale-[0.99] text-white text-sm font-semibold transition-[background-color,transform] duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                Запросить расчёт
            </button>
        </div>
    </div>

    <?php /* Мобильная строка: логотип, поиск, заявка, бургер */ ?>
    <div class="lg:hidden max-w-[1400px] mx-auto px-4 h-[68px] flex items-center gap-4">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="shrink-0 flex items-center min-h-11">
            <img src="<?php echo esc_url($logo); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>" class="h-10 w-auto" width="150" height="40">
        </a>

        <div class="flex items-center gap-1 ml-auto">
            <button type="button" data-search-open aria-label="Поиск по каталогу" class="flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink hover:text-inv-blue hover:bg-inv-surface-1 transition-colors duration-[120ms] cursor-pointer">
                <?php echo invit_icon('search', 'w-5 h-5'); ?>
            </button>

            <a href="<?php echo esc_url($cart_url); ?>" class="relative flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink" aria-label="Заявка на счёт">
                <?php echo invit_icon('shopping-cart', 'w-5 h-5'); ?>
                <?php if ($cart_count) : ?>
                    <span class="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-inv-red text-[11px] font-semibold text-white"><?php echo esc_html($cart_count); ?></span>
                <?php endif; ?>
            </a>

            <button type="button" data-menu-toggle aria-expanded="false" aria-label="Открыть меню" class="w-11 h-11 -mr-2 flex items-center justify-center rounded-[4px] text-inv-ink cursor-pointer">
                <span data-menu-icon="open"><?php echo invit_icon('menu', 'w-6 h-6'); ?></span>
                <span data-menu-icon="close" hidden><?php echo invit_icon('x', 'w-6 h-6'); ?></span>
            </button>
        </div>
    </div>

    <?php /* Список длиннее экрана, а шапка залипающая: своя прокрутка, иначе
             нижние разделы недостижимы. */ ?>
    <div data-menu-panel hidden class="lg:hidden border-t border-inv-border bg-white px-4 py-4 space-y-1.5 max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain">
        <span class="block pt-1 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">Каталог товаров</span>
        <?php foreach ($sections as $section) : ?>
            <a href="<?php echo esc_url(get_term_link($section)); ?>" class="flex items-center min-h-11 py-2 -mx-2 px-2 rounded-[4px] text-base font-semibold leading-snug text-inv-ink active:bg-inv-surface-1">
                <?php echo esc_html($section->name); ?>
            </a>
        <?php endforeach; ?>

        <span class="block pt-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">Разделы сайта</span>
        <?php foreach ($nav_fallback as $item) : ?>
            <a href="<?php echo esc_url($item['url']); ?>" class="flex items-center min-h-11 py-2 -mx-2 px-2 rounded-[4px] text-base leading-snug text-inv-ink active:bg-inv-surface-1">
                <?php echo esc_html($item['label']); ?>
            </a>
        <?php endforeach; ?>

        <a href="tel:<?php echo esc_attr(invit_tel($contacts['phone_minsk'])); ?>" class="flex items-center min-h-11 py-2 -mx-2 px-2 rounded-[4px] text-base font-semibold text-inv-ink active:bg-inv-surface-1">
            <?php echo esc_html($contacts['phone_minsk']); ?>
        </a>

        <button type="button" data-request class="w-full mt-2 inline-flex items-center justify-center min-h-11 px-5 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors duration-[120ms] cursor-pointer">
            Запросить расчёт
        </button>
    </div>
</header>

<main id="content">
