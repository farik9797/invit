<?php
/**
 * Карточка товара — перенос src/components/ProductCard.tsx: фото, подраздел
 * мелким капсом, заголовок, короткое описание, «Цена по запросу», действия.
 *
 * @var array $args ['item' => запись индекса каталога, 'compact' => bool, 'in_cart' => bool]
 */

if (!defined('ABSPATH')) exit;

$item = $args['item'];
$compact = !empty($args['compact']);
$in_cart = !empty($args['in_cart']);

$url = invit_item_url($item);
$image = invit_item_image($item);
$title = $item[INVIT_I_TITLE];
$sub = $item[INVIT_I_SUB];
$focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';
?>
<div class="h-full flex flex-col rounded-[8px] border border-inv-border bg-white overflow-hidden group transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)]">
    <a href="<?php echo esc_url($url); ?>" class="relative block overflow-hidden bg-white border-b border-inv-border-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue <?php echo $compact ? 'h-32 p-3' : 'h-48 p-4'; ?>">
        <?php if ($image) : ?>
            <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($title); ?>" loading="lazy" class="w-full h-full object-contain transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105">
        <?php else : ?>
            <?php /* Снимка нет — у поставщика он есть не для каждой позиции */ ?>
            <div class="w-full h-full flex items-center justify-center text-inv-border">
                <?php echo invit_section_icon($sub, 64, 'w-16 h-16'); ?>
            </div>
        <?php endif; ?>
        <?php echo invit_badge_html($item[INVIT_I_BADGE], 'absolute z-10 ' . ($compact ? 'top-2 left-2' : 'top-3 left-3')); ?>
    </a>

    <div class="flex flex-1 flex-col <?php echo $compact ? 'p-3' : 'p-4 sm:p-5'; ?>">
        <span class="flex items-center gap-2 text-inv-blue">
            <?php echo invit_section_icon($sub, 16, 'w-4 h-4 shrink-0'); ?>
            <span class="text-[11px] font-semibold uppercase tracking-[0.08em] line-clamp-1"><?php echo esc_html(invit_sub_name($sub)); ?></span>
        </span>

        <a href="<?php echo esc_url($url); ?>" class="mt-2 min-h-11 sm:min-h-0 font-semibold text-inv-ink leading-snug line-clamp-2 hover:text-inv-blue transition-colors duration-[120ms] <?php echo $focus; ?> <?php echo $compact ? 'text-[13px]' : 'text-[15px]'; ?>">
            <?php echo esc_html($title); ?>
        </a>

        <?php if ($item[INVIT_I_DESC] !== '') : ?>
            <p class="mt-2 leading-relaxed text-inv-ink-muted <?php echo $compact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'; ?>">
                <?php echo esc_html($item[INVIT_I_DESC]); ?>
            </p>
        <?php endif; ?>

        <?php /* Цены на витрине выключены, как в React: у всех «по запросу» */ ?>
        <span class="mt-auto block text-inv-ink-muted font-normal text-sm <?php echo $compact ? 'pt-3' : 'pt-4'; ?>">Цена по запросу</span>

        <div class="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 <?php echo $compact ? 'pt-2' : 'pt-3'; ?>">
            <a href="<?php echo esc_url($url); ?>" class="inline-flex items-center gap-1.5 min-h-11 font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] <?php echo $focus; ?> <?php echo $compact ? 'text-[13px]' : 'text-sm'; ?>">
                Подробнее
                <?php echo invit_icon('arrow-right', 'w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5'); ?>
            </a>

            <button
                type="button"
                data-add-to-quote="<?php echo (int) $item[INVIT_I_ID]; ?>"
                data-card-button
                <?php echo $compact ? 'data-compact' : ''; ?>
                aria-label="<?php echo $in_cart ? 'Уже в заявке' : 'Добавить в заявку на счёт'; ?>"
                class="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-[4px] text-sm font-semibold cursor-pointer transition-[background-color,transform] duration-[120ms] active:scale-[0.98] <?php echo $focus; ?> <?php echo $in_cart ? 'bg-inv-surface-2 text-inv-ink' : 'bg-inv-surface-1 text-inv-ink hover:bg-inv-surface-2'; ?>"
            >
                <?php echo invit_icon($in_cart ? 'check' : 'plus', 'w-4 h-4'); ?>
                <?php if (!$compact) : ?>
                    <span class="hidden sm:inline whitespace-nowrap"><?php echo $in_cart ? 'В заявке' : 'В заявку'; ?></span>
                <?php endif; ?>
            </button>
        </div>
    </div>
</div>
