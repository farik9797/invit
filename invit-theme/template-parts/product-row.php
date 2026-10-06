<?php
/**
 * Строка списка — перенос Row из src/components/catalog/ProductList.tsx:
 * снимок (крупно при наведении), подраздел, название, бренд и артикул.
 *
 * @var array $args ['item' => запись индекса, 'in_cart' => bool]
 */

if (!defined('ABSPATH')) exit;

$item = $args['item'];
$in_cart = !empty($args['in_cart']);
$url = invit_item_url($item);
$image = invit_item_image($item);
$title = $item[INVIT_I_TITLE];
$sub = $item[INVIT_I_SUB];
$focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';
$button = static function ($size) use ($item, $in_cart, $focus) {
    $base = $size === 'sm'
        ? 'inline-flex items-center gap-1.5 min-h-11 px-3 rounded-[4px] text-[13px] font-semibold bg-inv-surface-1 text-inv-ink cursor-pointer active:scale-[0.98] transition-transform duration-[120ms]'
        : 'inline-flex items-center gap-1.5 min-h-11 px-4 rounded-[4px] text-sm font-semibold whitespace-nowrap cursor-pointer transition-[background-color,transform] duration-[120ms] active:scale-[0.98] ' . $focus . ' '
            . ($in_cart ? 'bg-inv-surface-2 text-inv-ink' : 'bg-inv-surface-1 text-inv-ink hover:bg-inv-surface-2');
    return sprintf(
        '<button type="button" data-add-to-quote="%d" data-row-button aria-label="%s" class="%s">%s<span>%s</span></button>',
        (int) $item[INVIT_I_ID],
        $in_cart ? 'Уже в заявке' : 'Добавить в заявку на счёт',
        esc_attr($base),
        invit_icon($in_cart ? 'check' : 'plus', 'w-4 h-4'),
        $in_cart ? 'В заявке' : 'В заявку'
    );
};
?>
<li class="group flex gap-3 sm:gap-5 p-3 sm:p-4 bg-white transition-colors duration-[120ms] hover:bg-inv-surface-1 first:rounded-t-[8px] last:rounded-b-[8px]">
    <span class="relative shrink-0 group/photo">
        <a href="<?php echo esc_url($url); ?>" class="block w-16 h-16 sm:w-24 sm:h-24 rounded-[4px] border border-inv-border-subtle bg-white p-1.5 sm:p-2 overflow-hidden <?php echo $focus; ?>">
            <?php if ($image) : ?>
                <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($title); ?>" loading="lazy" class="w-full h-full object-contain">
            <?php else : ?>
                <span class="w-full h-full flex items-center justify-center text-inv-border"><?php echo invit_section_icon($sub, 40, 'w-9 h-9'); ?></span>
            <?php endif; ?>
        </a>
        <?php if ($image) : ?>
            <span class="pointer-events-none absolute left-full top-1/2 z-30 ml-3 hidden w-60 -translate-y-1/2 rounded-[8px] border border-inv-border bg-white p-3 opacity-0 shadow-[0_12px_40px_rgba(22,44,88,0.18)] transition-opacity duration-[160ms] lg:block group-hover/photo:opacity-100">
                <img src="<?php echo esc_url($image); ?>" alt="" aria-hidden="true" loading="lazy" class="w-full aspect-square object-contain">
            </span>
        <?php endif; ?>
    </span>

    <div class="flex-1 min-w-0">
        <span class="flex items-center gap-2 text-inv-blue">
            <?php echo invit_section_icon($sub, 14, 'w-3.5 h-3.5 shrink-0'); ?>
            <span class="text-[11px] font-semibold uppercase tracking-[0.08em] line-clamp-1"><?php echo esc_html(invit_sub_name($sub)); ?></span>
        </span>

        <a href="<?php echo esc_url($url); ?>" class="mt-1 block text-[15px] font-semibold text-inv-ink leading-snug line-clamp-3 sm:line-clamp-none hover:text-inv-blue transition-colors duration-[120ms] <?php echo $focus; ?>"><?php echo esc_html($title); ?></a>

        <span class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-inv-ink-muted">
            <?php if ($item[INVIT_I_BRAND] !== '') : ?>
                <span>Бренд: <span class="text-inv-ink"><?php echo esc_html($item[INVIT_I_BRAND]); ?></span></span>
            <?php endif; ?>
            <?php if ($item[INVIT_I_SKU] !== '') : ?>
                <span class="tabular-nums">Артикул: <span class="text-inv-ink"><?php echo esc_html($item[INVIT_I_SKU]); ?></span></span>
            <?php endif; ?>
        </span>

        <?php if ($item[INVIT_I_DESC] !== '') : ?>
            <p class="mt-1.5 text-[13px] leading-relaxed text-inv-ink-muted line-clamp-2 sm:line-clamp-1"><?php echo esc_html($item[INVIT_I_DESC]); ?></p>
        <?php endif; ?>

        <span class="mt-1.5 flex sm:hidden font-semibold text-[13px] font-normal text-inv-ink-muted">Цена по запросу</span>

        <span class="mt-1 flex sm:hidden items-center gap-3">
            <a href="<?php echo esc_url($url); ?>" class="inline-flex items-center gap-1.5 min-h-11 text-[13px] font-semibold text-inv-blue">
                Подробнее
                <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
            </a>
            <?php echo $button('sm'); ?>
        </span>
    </div>

    <div class="hidden sm:flex shrink-0 flex-col items-end justify-center gap-2">
        <span class="whitespace-nowrap font-semibold text-[13px] font-normal text-inv-ink-muted">Цена по запросу</span>
        <?php echo $button('lg'); ?>
        <a href="<?php echo esc_url($url); ?>" class="inline-flex items-center gap-1.5 min-h-9 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] <?php echo $focus; ?>">
            Подробнее
            <?php echo invit_icon('arrow-right', 'w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5'); ?>
        </a>
    </div>
</li>
