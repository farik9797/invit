<?php
/**
 * Содержимое мега-меню: слева разделы, справа колонки подразделов. Отдаётся
 * по запросу при первом наведении на кнопку (wc-ajax=invit_mega): в разметке
 * каждой страницы полтысячи ссылок меню были бы лишним весом.
 */

if (!defined('ABSPATH')) exit;

$sections = invit_mega_sections();
?>
<div class="flex rounded-[8px] border border-inv-border bg-white/92 backdrop-blur-md shadow-[0_6px_24px_rgba(22,44,88,0.16)] overflow-hidden">
    <ul class="w-[350px] shrink-0 border-r border-inv-border bg-inv-surface-1/70 py-2 max-h-[70vh] overflow-y-auto">
        <?php foreach ($sections as $idx => $item) : ?>
            <li>
                <a
                    href="<?php echo esc_url($item['href']); ?>"
                    data-mega-row="<?php echo (int) $idx; ?>"
                    aria-current="<?php echo $idx === 0 ? 'true' : 'false'; ?>"
                    class="flex items-center gap-3 min-h-12 px-5 text-[15px] transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue <?php echo $idx === 0 ? 'bg-inv-blue text-white' : 'text-inv-ink'; ?>"
                >
                    <span data-mega-mark class="contents <?php echo $idx === 0 ? 'text-white' : 'text-inv-blue'; ?>">
                        <?php echo invit_section_mark($item['id'], 28, 'w-7 h-7 shrink-0'); ?>
                    </span>
                    <span class="flex-1"><?php echo esc_html($item['label']); ?></span>
                    <?php echo invit_icon('chevron-right', 'w-4 h-4 shrink-0 opacity-60'); ?>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>

    <?php foreach ($sections as $idx => $item) : ?>
        <div data-mega-section="<?php echo (int) $idx; ?>" <?php echo $idx === 0 ? '' : 'hidden'; ?> class="flex-1 p-6 max-h-[70vh] overflow-y-auto">
            <div class="columns-2 xl:columns-3 gap-8">
                <?php foreach ($item['groups'] as $group) : ?>
                    <div class="break-inside-avoid mb-6">
                        <a href="<?php echo esc_url($group['href']); ?>" class="flex items-center gap-2.5 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-inv-border bg-white">
                                <?php echo invit_section_mark($group['slug'], 36, 'w-9 h-9'); ?>
                            </span>
                            <span class="leading-snug"><?php echo esc_html($group['name']); ?></span>
                        </a>

                        <ul class="mt-2 space-y-1">
                            <?php foreach ($group['items'] as $product) : ?>
                                <li class="flex gap-1.5 text-[13px] leading-snug">
                                    <span aria-hidden="true" class="text-inv-ink-muted/50">-</span>
                                    <a href="<?php echo esc_url($product['href']); ?>" class="text-inv-ink hover:text-inv-blue transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                                        <?php echo esc_html($product['title']); ?>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endforeach; ?>
            </div>

            <a href="<?php echo esc_url($item['href']); ?>" class="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                Все позиции раздела
                <?php echo invit_icon('chevron-right', 'w-4 h-4'); ?>
            </a>
        </div>
    <?php endforeach; ?>
</div>
