<?php
/**
 * Каталог и разделы — перенос src/pages/CatalogPage.tsx: слева разделы и поиск,
 * сверху управление выдачей, справа плитка или список. Отбор считается из
 * индекса (inc/catalog.php) той же логикой, что в React.
 */

if (!defined('ABSPATH')) exit;

[$category, $filters] = invit_catalog_context();
$section = $category ? invit_section($category) : null;
$view = invit_catalog_view();
$page_size = invit_catalog_page_size($view);
$result = invit_catalog_select($category, $filters);
$products = $result['products'];
$total = count($products);

/* «Показать ещё»: следующая порция карточек без обвязки страницы */
if (isset($_GET['invit_more'])) {
    $offset = max(0, (int) $_GET['invit_more']);
    header('X-Invit-Remaining: ' . max(0, $total - $offset - $page_size));
    invit_catalog_render_items(array_slice($products, $offset, $page_size), $view, $offset);
    exit;
}

get_header();

$shown = min($page_size, $total);
$visible = array_slice($products, 0, $page_size);
$filtered = invit_catalog_is_filtered($filters);
$active = invit_catalog_active_count($filters);
$reset_url = invit_catalog_link($category, invit_catalog_empty_filters());
$wrap = 'max-w-[1400px] mx-auto px-4 lg:px-8';
$counter = 'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-inv-blue text-white text-[11px] font-semibold tabular-nums';

$crumbs = $section
    ? [['label' => 'Каталог', 'url' => invit_url_catalog()], ['label' => $section['name']]]
    : [['label' => 'Каталог']];

/* Плашки выбранного отбора: видно, что сузило выдачу, снимается одним нажатием */
$chips = [];
$without = static function (array $patch) use ($category, $filters) {
    return invit_catalog_link($category, array_merge($filters, $patch));
};
if ($filters['sub']) $chips[] = [invit_sub_name($filters['sub']) ?: $filters['sub'], $without(['sub' => null])];
if ($filters['query'] !== '') $chips[] = ['«' . $filters['query'] . '»', $without(['query' => ''])];
foreach ($filters['brands'] as $value) $chips[] = [$value, invit_catalog_toggle_link($category, $filters, 'brands', $value)];
foreach ($filters['countries'] as $value) $chips[] = [$value, invit_catalog_toggle_link($category, $filters, 'countries', $value)];
foreach (['diameter', 'length'] as $axis) {
    foreach ($filters['sizes'][$axis] as $value) $chips[] = [invit_size_chip($axis, $value), invit_catalog_toggle_link($category, $filters, $axis, $value)];
}

$facets = [
    ['key' => 'brands', 'title' => 'Бренд', 'options' => $result['brands'], 'selected' => $filters['brands'], 'preview' => 8],
    ['key' => 'countries', 'title' => 'Страна', 'options' => $result['countries'], 'selected' => $filters['countries'], 'preview' => 6],
];
foreach ($result['sizes'] as $size) {
    $facets[] = ['key' => $size['axis'], 'title' => invit_size_label($size['axis']), 'options' => $size['options'], 'selected' => $filters['sizes'][$size['axis']], 'preview' => 10];
}

$sort_labels = invit_sort_labels();
$sort_urls = [];
foreach (array_keys($sort_labels) as $mode) $sort_urls[$mode] = invit_catalog_link($category, array_merge($filters, ['sort' => $mode]));

$views = [
    ['mode' => 'dense', 'icon' => 'grid-3x3', 'label' => 'Плотной плиткой'],
    ['mode' => 'grid', 'icon' => 'grid-2x2', 'label' => 'Плиткой'],
    ['mode' => 'list', 'icon' => 'rows-3', 'label' => 'Списком'],
];
?>
<div data-catalog data-total="<?php echo (int) $total; ?>" data-page-size="<?php echo (int) $page_size; ?>">

<?php get_template_part('template-parts/breadcrumbs', null, ['items' => $crumbs]); ?>

<section class="bg-inv-deep text-white">
    <div class="<?php echo $wrap; ?> py-8 sm:py-10 lg:py-12">
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]"><?php echo esc_html($section ? $section['name'] : 'Каталог'); ?></h1>
        <p class="mt-3 text-base leading-[1.55] text-inv-on-deep max-w-[70ch]">
            <?php echo esc_html($section ? $section['description'] : 'Ленты EUROBAND собственного производства и сопутствующие материалы прямой поставки.'); ?>
        </p>
    </div>
</section>

<section class="bg-white">
    <div class="<?php echo $wrap; ?> py-6 sm:py-8 lg:py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <aside class="hidden lg:block lg:col-span-4">
                <div class="relative z-10">
                    <div class="space-y-4">
                        <?php get_template_part('template-parts/catalog-sections', null, ['category' => $category, 'filters' => $filters]); ?>
                    </div>
                </div>
            </aside>

            <div class="lg:col-span-8">
                <?php /* На телефоне колонки нет, поэтому поиск остаётся над выдачей */ ?>
                <?php get_template_part('template-parts/catalog-search', null, ['query' => $filters['query'], 'category' => $category, 'filters' => $filters, 'button' => true, 'class' => 'lg:hidden']); ?>

                <div class="mt-4 flex items-center gap-2 sm:gap-3 flex-wrap">
                    <button type="button" data-drawer-open class="order-1 sm:order-2 lg:hidden inline-flex items-center gap-2 min-h-11 px-3.5 rounded-[4px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue hover:text-inv-blue">
                        <?php echo invit_icon('sliders-horizontal', 'w-4 h-4'); ?>
                        <span class="hidden sm:inline">Разделы и фильтр</span>
                        <span class="sm:hidden">Фильтр</span>
                        <?php if ($active > 0) : ?><span class="<?php echo $counter; ?>"><?php echo (int) $active; ?></span><?php endif; ?>
                    </button>

                    <button type="button" data-filterbar-toggle aria-expanded="<?php echo $filtered ? 'true' : 'false'; ?>" class="hidden lg:inline-flex order-2 lg:ml-auto items-center gap-2 min-h-11 px-3.5 rounded-[4px] border bg-white text-sm font-semibold cursor-pointer transition-colors duration-[120ms] <?php echo ($filtered || $active > 0) ? 'border-inv-blue text-inv-ink' : 'border-inv-border text-inv-ink hover:border-inv-blue'; ?>">
                        <?php echo invit_icon('sliders-horizontal', 'w-4 h-4'); ?>
                        Фильтры
                        <?php if ($active > 0) : ?><span class="<?php echo $counter; ?>"><?php echo (int) $active; ?></span><?php endif; ?>
                        <span data-chevron class="inline-flex transition-transform duration-[240ms] <?php echo $filtered ? 'rotate-180' : ''; ?>"><?php echo invit_icon('chevron-down', 'w-4 h-4'); ?></span>
                    </button>

                    <span class="order-4 w-full text-sm text-inv-ink-muted sm:order-1 sm:w-auto" data-shown-label>
                        <?php echo $total
                            ? esc_html('Показано ' . $shown . ' из ' . $total . ' ' . invit_plural($total, ['позиции', 'позиций', 'позиций']))
                            : 'Ничего не нашлось'; ?>
                    </span>

                    <span class="relative order-3 w-full sm:w-auto sm:ml-auto lg:ml-0">
                        <label class="sr-only" for="catalog-sort">Сортировать по</label>
                        <select id="catalog-sort" data-sort class="appearance-none w-full sm:w-auto min-h-11 pl-4 pr-10 rounded-[4px] border border-inv-border bg-white text-sm text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue">
                            <?php foreach ($sort_labels as $mode => $label) : ?>
                                <option value="<?php echo esc_attr($mode); ?>" data-url="<?php echo esc_url($sort_urls[$mode]); ?>" <?php selected($filters['sort'], $mode); ?>><?php echo esc_html($label); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <span aria-hidden="true" class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-inv-ink-muted"><?php echo invit_icon('chevron-down', 'w-4 h-4'); ?></span>
                    </span>

                    <?php /* Вид выдачи: значки без подписей, выбранный красный */ ?>
                    <span role="group" aria-label="Вид выдачи" class="order-2 ml-auto shrink-0 sm:order-4 sm:ml-0 flex items-center gap-1 p-1 rounded-[10px] border border-inv-border bg-white">
                        <?php foreach ($views as $item) : $on = $view === $item['mode']; ?>
                            <button type="button" data-view="<?php echo esc_attr($item['mode']); ?>" aria-pressed="<?php echo $on ? 'true' : 'false'; ?>" aria-label="<?php echo esc_attr($item['label']); ?>" title="<?php echo esc_attr($item['label']); ?>" class="w-9 h-9 flex items-center justify-center rounded-[4px] cursor-pointer transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue <?php echo $on ? 'bg-inv-red text-white' : 'text-inv-ink-muted hover:text-inv-ink hover:bg-inv-surface-1'; ?>">
                                <?php echo invit_icon($item['icon'], 'w-[18px] h-[18px]'); ?>
                            </button>
                        <?php endforeach; ?>
                    </span>
                </div>

                <?php /* Строка фильтров над выдачей (FilterBar) */ ?>
                <div data-filterbar class="hidden lg:block" <?php echo $filtered ? '' : 'hidden'; ?>>
                    <div class="mt-3 rounded-[10px] border border-inv-border bg-inv-surface-1 p-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
                            <?php foreach ($facets as $facet) : if (!$facet['options']) continue; $n = count($facet['selected']); ?>
                                <div class="relative" data-facet="<?php echo esc_attr($facet['key']); ?>">
                                    <button type="button" data-facet-toggle aria-expanded="false" class="w-full flex items-center gap-2 min-h-11 px-3.5 rounded-[4px] border bg-white text-sm cursor-pointer transition-colors duration-[120ms] <?php echo $n ? 'border-inv-blue text-inv-ink' : 'border-inv-border text-inv-ink hover:border-inv-blue'; ?>">
                                        <span class="flex-1 text-left truncate"><?php echo esc_html($facet['title']); ?></span>
                                        <?php if ($n) : ?><span class="<?php echo $counter; ?>"><?php echo (int) $n; ?></span><?php endif; ?>
                                        <span data-chevron class="inline-flex transition-transform duration-[240ms]"><?php echo invit_icon('chevron-down', 'w-4 h-4 shrink-0 text-inv-ink-muted'); ?></span>
                                    </button>
                                    <div data-facet-pop hidden class="absolute left-0 top-[calc(100%+6px)] z-30 w-[min(320px,calc(100vw-2rem))] max-h-[60vh] overflow-y-auto rounded-[10px] border border-inv-border bg-white p-3 shadow-[0_16px_40px_rgba(10,25,60,0.18)]" data-facet-body="<?php echo esc_attr($facet['key']); ?>"></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <?php if ($filtered) : ?>
                    <div class="mt-3 flex items-center gap-2 flex-wrap">
                        <?php foreach ($chips as [$label, $url]) : ?>
                            <a href="<?php echo esc_url($url); ?>" data-soft class="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full border border-inv-border bg-inv-surface-1 text-[13px] text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-red hover:text-inv-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                                <?php echo esc_html($label); ?>
                                <?php echo invit_icon('x', 'w-3.5 h-3.5'); ?>
                            </a>
                        <?php endforeach; ?>
                        <a href="<?php echo esc_url($reset_url); ?>" data-soft class="inline-flex items-center gap-1.5 h-8 px-2 text-[13px] font-semibold text-inv-red hover:text-inv-red-hover cursor-pointer transition-colors duration-[120ms]">Сбросить всё</a>
                    </div>
                <?php endif; ?>

                <?php if ($total) : ?>
                    <div class="mt-4">
                        <?php if ($view === 'list') : ?>
                            <ul data-results class="rounded-[8px] border border-inv-border divide-y divide-inv-border-subtle">
                                <?php invit_catalog_render_items($visible, $view); ?>
                            </ul>
                        <?php else : ?>
                            <?php $grid = $view === 'dense'
                                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch'
                                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch'; ?>
                            <div data-results class="<?php echo esc_attr($grid); ?>">
                                <?php invit_catalog_render_items($visible, $view); ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <?php if ($shown < $total) : ?>
                        <div class="mt-8 flex justify-center" data-more-wrap>
                            <button type="button" data-more="<?php echo (int) $shown; ?>" class="min-h-11 px-6 rounded-[4px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue hover:text-inv-blue">
                                Показать ещё (<?php echo (int) ($total - $shown); ?>)
                            </button>
                        </div>
                    <?php endif; ?>
                <?php else : ?>
                    <div class="mt-6 rounded-[8px] border border-inv-border bg-inv-surface-1 p-8 text-center">
                        <p class="text-base text-inv-ink">
                            <?php echo $filters['query'] !== ''
                                ? esc_html('По запросу «' . $filters['query'] . '» ничего не нашлось.')
                                : 'Под выбранный фильтр ничего не подошло.'; ?>
                        </p>
                        <p class="mt-2 text-sm text-inv-ink-muted">Снимите часть условий или позвоните — подскажем по наличию.</p>
                        <?php if ($filtered) : ?>
                            <a href="<?php echo esc_url($reset_url); ?>" data-soft class="mt-4 inline-flex items-center gap-1.5 min-h-11 px-5 rounded-[4px] bg-inv-blue text-white text-sm font-semibold cursor-pointer transition-colors duration-[120ms] hover:bg-inv-blue-hover">Сбросить фильтр</a>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<?php /* Значения признаков: список рисует скрипт при раскрытии, как FacetList в React */ ?>
<script type="application/json" data-facets><?php echo wp_json_encode(array_column(array_map(static fn($f) => [$f['key'], [
    'title' => $f['title'],
    'preview' => $f['preview'],
    'options' => $f['options'],
    'selected' => array_values($f['selected']),
]], $facets), 1, 0), JSON_UNESCAPED_UNICODE | JSON_HEX_TAG); ?></script>

<?php /* Разделы и фильтр на телефоне */ ?>
<div data-drawer class="lg:hidden fixed inset-0 z-50 pointer-events-none" aria-hidden="true">
    <div data-drawer-backdrop class="absolute inset-0 bg-inv-deep/50 transition-opacity duration-[240ms] motion-reduce:transition-none opacity-0"></div>
    <div role="dialog" aria-modal="true" aria-label="Разделы и фильтр" data-drawer-panel class="absolute inset-y-0 left-0 w-[min(92vw,380px)] bg-white shadow-[0_0_40px_rgba(22,44,88,0.25)] overflow-y-auto transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none -translate-x-full">
        <header class="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-white border-b border-inv-border">
            <span class="flex-1 text-sm font-semibold text-inv-ink">Разделы и фильтр</span>
            <button type="button" data-drawer-close aria-label="Закрыть" class="w-11 h-11 -mr-2 flex items-center justify-center text-inv-ink-muted hover:text-inv-ink cursor-pointer">
                <?php echo invit_icon('x', 'w-5 h-5'); ?>
            </button>
        </header>

        <div class="p-3">
            <div class="space-y-4">
                <?php get_template_part('template-parts/catalog-tree', null, ['category' => $category, 'filters' => $filters]); ?>

                <div class="rounded-[8px] border border-inv-border bg-white overflow-hidden">
                    <h2 class="bg-inv-surface-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">Фильтр</h2>

                    <?php foreach ($facets as $facet) : if (!$facet['options']) continue; $n = count($facet['selected']); ?>
                        <div class="border-t border-inv-border px-4 py-1" data-block="<?php echo esc_attr($facet['key']); ?>">
                            <button type="button" data-block-toggle aria-expanded="<?php echo $n ? 'true' : 'false'; ?>" class="w-full flex items-center gap-2 min-h-11 text-left cursor-pointer group">
                                <span class="flex-1 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted group-hover:text-inv-ink transition-colors duration-[120ms]"><?php echo esc_html($facet['title']); ?></span>
                                <?php if ($n) : ?><span class="<?php echo $counter; ?>"><?php echo (int) $n; ?></span><?php endif; ?>
                                <span data-chevron class="inline-flex transition-transform duration-[240ms] <?php echo $n ? '' : '-rotate-90'; ?>"><?php echo invit_icon('chevron-down', 'w-4 h-4 shrink-0 text-inv-ink-muted'); ?></span>
                            </button>
                            <div data-block-body class="pb-3" <?php echo $n ? '' : 'hidden'; ?> data-facet-body="<?php echo esc_attr($facet['key']); ?>"></div>
                        </div>
                    <?php endforeach; ?>

                    <?php if ($filtered) : ?>
                        <div class="border-t border-inv-border p-4">
                            <a href="<?php echo esc_url($reset_url); ?>" data-soft class="w-full inline-flex items-center justify-center gap-1.5 min-h-11 rounded-[4px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-red hover:text-inv-red">
                                <?php echo invit_icon('x', 'w-4 h-4'); ?>
                                Сбросить фильтр
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <div class="sticky bottom-0 p-3 bg-white border-t border-inv-border">
            <button type="button" data-drawer-close class="w-full min-h-11 rounded-[4px] bg-inv-blue text-white text-sm font-semibold cursor-pointer transition-colors duration-[120ms] hover:bg-inv-blue-hover">
                Показать <?php echo esc_html($total . ' ' . invit_plural($total, ['позицию', 'позиции', 'позиций'])); ?>
            </button>
        </div>
    </div>
</div>

</div>
<?php get_footer(); ?>
