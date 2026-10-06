<?php
/**
 * Поиск по каталогу с подсказкой — перенос src/components/catalog/CatalogSearch.tsx.
 * Подсказка ищет по всему каталогу, Enter применяет запрос: непустой уводит
 * в весь каталог, пустой снимает запрос, оставляя раздел и бренды.
 *
 * @var array $args ['query' => string, 'category' => slug|null, 'filters' => array, 'button' => bool, 'class' => string]
 */

if (!defined('ABSPATH')) exit;

$query = $args['query'] ?? '';
$button = !empty($args['button']);
$clear_url = invit_catalog_link($args['category'] ?? null, array_merge($args['filters'], ['query' => '']));
?>
<div data-catalog-search data-clear-url="<?php echo esc_url($clear_url); ?>" class="relative <?php echo esc_attr($args['class'] ?? ''); ?>">
    <form role="search" action="<?php echo esc_url(invit_url_catalog()); ?>" method="get" class="flex gap-2">
        <span class="relative flex-1 min-w-0">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-inv-ink-muted"><?php echo invit_icon('search', 'w-4 h-4'); ?></span>
            <input
                name="q"
                value="<?php echo esc_attr($query); ?>"
                autocomplete="off"
                placeholder="Поиск: лента, ПСУЛ, артикул…"
                aria-label="Поиск по каталогу"
                class="w-full min-h-11 pl-9 pr-9 rounded-[4px] border border-inv-border bg-white text-sm text-inv-ink placeholder:text-inv-ink-muted transition-colors duration-[120ms] hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
            >
            <button type="button" data-search-clear <?php echo $query === '' ? 'hidden' : ''; ?> aria-label="Очистить поиск" class="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-inv-ink-muted hover:text-inv-ink cursor-pointer">
                <?php echo invit_icon('x', 'w-4 h-4'); ?>
            </button>
        </span>

        <?php if ($button) : ?>
            <button type="submit" class="min-h-11 px-5 rounded-[4px] bg-inv-blue text-white text-sm font-semibold whitespace-nowrap cursor-pointer transition-[background-color,transform] duration-[120ms] hover:bg-inv-blue-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                Найти
            </button>
        <?php endif; ?>
    </form>

    <?php /* В колонке поле узкое, а названия длинные: подсказку расширяем вправо */ ?>
    <div data-catalog-drop hidden class="absolute left-0 right-0 lg:min-w-[380px] top-[calc(100%+6px)] z-40 rounded-[8px] border border-inv-border bg-white shadow-[0_16px_40px_rgba(10,25,60,0.18)] overflow-hidden"></div>
</div>
