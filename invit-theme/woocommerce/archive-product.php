<?php
/**
 * Каталог: тёмная шапка раздела, колонка разделов слева, панель с поиском и
 * сортировкой, сетка карточек. Раскладка Woo по умолчанию не используется —
 * весь макет свой, как на нынешнем сайте.
 */

if (!defined('ABSPATH')) exit;

get_header();

$term = is_product_category() ? get_queried_object() : null;
$shop_url = wc_get_page_permalink('shop');

$title = $term ? $term->name : 'Каталог';
$subtitle = $term && $term->description
    ? $term->description
    : 'Ленты EUROBAND собственного производства и сопутствующие материалы прямой поставки.';

if (is_search()) {
    $title = 'Поиск: ' . get_search_query();
    $subtitle = 'Ищем по названию и артикулу.';
}

$sorts = [
    'menu_order' => 'Сортировать по',
    'price'      => 'Цена: сначала дешёвые',
    'price-desc' => 'Цена: сначала дорогие',
    'title'      => 'Название: А → Я',
];
$current_sort = isset($_GET['orderby']) ? sanitize_text_field(wp_unslash($_GET['orderby'])) : 'menu_order';

$total = (int) wc_get_loop_prop('total');
$shown = (int) wc_get_loop_prop('total_pages') > 0 ? min((int) wc_get_loop_prop('per_page'), $total) : $total;
?>

<?php /* Хлебные крошки Woo, но в наших цветах. */ ?>
<div class="bg-inv-surface-1 border-b border-inv-border">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-3 text-sm text-inv-ink-muted [&_a]:text-inv-ink [&_a:hover]:text-inv-blue [&_a]:transition-colors">
        <?php woocommerce_breadcrumb(['delimiter' => ' <span class="px-1 text-inv-border">/</span> ']); ?>
    </div>
</div>

<section class="bg-inv-deep text-white">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 sm:py-10 lg:py-12">
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">
            <?php echo esc_html($title); ?>
        </h1>
        <p class="mt-3 text-base leading-[1.55] text-inv-on-deep max-w-[70ch]">
            <?php echo esc_html(wp_strip_all_tags($subtitle)); ?>
        </p>
    </div>
</section>

<section class="bg-white py-6 sm:py-10">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">

        <?php /* На телефоне колонка разделов складывается в раскрывающийся блок. */ ?>
        <div class="lg:hidden">
            <button type="button" data-aside-toggle aria-expanded="false" class="w-full flex items-center justify-between gap-2 min-h-11 px-4 rounded-[8px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer">
                Разделы и фильтр
                <?php echo invit_icon('chevron-down', 'w-4 h-4'); ?>
            </button>
            <div data-aside-panel hidden class="mt-3">
                <?php get_template_part('template-parts/catalog-sidebar'); ?>
            </div>
        </div>

        <div class="hidden lg:block lg:sticky lg:top-[150px]">
            <?php get_template_part('template-parts/catalog-sidebar'); ?>
        </div>

        <div>
            <?php /* Панель: поиск по каталогу и сортировка. */ ?>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <form role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>" class="flex-1 flex gap-2">
                    <input type="hidden" name="post_type" value="product">
                    <span class="relative flex-1">
                        <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-inv-ink-muted">
                            <?php echo invit_icon('search', 'w-4 h-4'); ?>
                        </span>
                        <label class="sr-only" for="catalog-search">Поиск по каталогу</label>
                        <input id="catalog-search" type="search" name="s" value="<?php echo esc_attr(get_search_query()); ?>" placeholder="Поиск: лента, ПСУЛ, артикул…" class="w-full h-12 pl-11 pr-4 rounded-[4px] border border-inv-border bg-white text-sm text-inv-ink placeholder:text-inv-ink-muted focus:border-inv-blue focus-visible:outline-none">
                    </span>
                    <button type="submit" class="inline-flex items-center justify-center min-h-11 h-12 px-5 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors duration-[120ms] cursor-pointer">
                        Найти
                    </button>
                </form>

                <form method="get" class="sm:w-[240px]">
                    <?php foreach ($_GET as $key => $value) :
                        if ($key === 'orderby' || !is_string($value)) continue; ?>
                        <input type="hidden" name="<?php echo esc_attr($key); ?>" value="<?php echo esc_attr(wp_unslash($value)); ?>">
                    <?php endforeach; ?>
                    <label class="sr-only" for="catalog-sort">Сортировать по</label>
                    <select id="catalog-sort" name="orderby" onchange="this.form.submit()" class="w-full h-12 px-4 rounded-[4px] border border-inv-border bg-white text-sm text-inv-ink cursor-pointer focus:border-inv-blue focus-visible:outline-none">
                        <?php foreach ($sorts as $value => $label) : ?>
                            <option value="<?php echo esc_attr($value); ?>" <?php selected($current_sort, $value); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </form>
            </div>

            <?php if (woocommerce_product_loop()) : ?>
                <p class="mt-4 text-sm text-inv-ink-muted">
                    <?php
                    printf(
                        'Показано %d из %d %s',
                        (int) wc_get_loop_prop('per_page') > $total ? $total : (int) wc_get_loop_prop('per_page'),
                        $total,
                        esc_html(_n('позиции', 'позиций', $total, 'invit'))
                    );
                    ?>
                </p>

                <ul class="mt-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    <?php while (have_posts()) : the_post(); ?>
                        <li><?php wc_get_template_part('content', 'product-card'); ?></li>
                    <?php endwhile; ?>
                </ul>

                <div class="mt-8 [&_.page-numbers]:inline-flex [&_.page-numbers]:items-center [&_.page-numbers]:justify-center [&_.page-numbers]:min-w-11 [&_.page-numbers]:h-11 [&_.page-numbers]:px-3 [&_.page-numbers]:rounded-[4px] [&_.page-numbers]:border [&_.page-numbers]:border-inv-border [&_.page-numbers]:text-sm [&_.page-numbers]:text-inv-ink [&_.page-numbers:hover]:bg-inv-blue [&_.page-numbers:hover]:text-white [&_.page-numbers:hover]:border-inv-blue [&_.current]:bg-inv-blue [&_.current]:text-white [&_.current]:border-inv-blue [&_ul]:flex [&_ul]:flex-wrap [&_ul]:gap-2 [&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0">
                    <?php woocommerce_pagination(); ?>
                </div>
            <?php else : ?>
                <div class="mt-6 rounded-[8px] border border-inv-border bg-inv-surface-1 px-5 py-8 text-center">
                    <p class="text-base text-inv-ink">По этому запросу ничего не нашлось.</p>
                    <p class="mt-2 text-sm text-inv-ink-muted">Попробуйте короче или введите артикул — подскажем, где искать нужную позицию.</p>
                    <a href="<?php echo esc_url($shop_url); ?>" class="mt-5 inline-flex items-center justify-center min-h-11 px-5 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors duration-[120ms]">
                        Весь каталог
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
