<?php
/**
 * Дерево разделов для выдвижной панели на телефоне — SectionsTree и SubList из
 * src/components/catalog/CatalogSidebar.tsx. Подразделы раскрываются только
 * у выбранного раздела; длинный список — восемь строк и «Ещё N».
 *
 * @var array $args ['category' => slug|null, 'filters' => array]
 */

if (!defined('ABSPATH')) exit;

$category = $args['category'];
$filters = $args['filters'];
$counts = invit_catalog_counts();
$section = $category ? invit_section($category) : null;
$row = 'flex items-center gap-2.5 min-h-11 px-2.5 rounded-[4px] text-sm transition-colors duration-[120ms]';
$preview = 8;
?>
<div data-tree class="rounded-[8px] border border-inv-border bg-white overflow-hidden">
    <button type="button" data-tree-toggle aria-expanded="true" class="w-full flex items-center gap-2 bg-inv-surface-1 px-4 py-3 cursor-pointer group border-b border-inv-border">
        <span class="text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted group-hover:text-inv-ink transition-colors duration-[120ms]">Разделы</span>
        <?php /* Свёрнутое дерево всё равно отвечает, где мы находимся */ ?>
        <span data-tree-where hidden class="flex-1 min-w-0 text-left text-[11px] text-inv-ink-muted truncate"><?php echo esc_html($section ? $section['name'] : 'Все позиции'); ?></span>
        <span data-tree-spacer class="flex-1"></span>
        <span data-chevron class="inline-flex transition-transform duration-[240ms]"><?php echo invit_icon('chevron-down', 'w-4 h-4 shrink-0 text-inv-ink-muted'); ?></span>
    </button>

    <nav data-tree-body class="p-2">
        <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="<?php echo $row; ?> <?php echo $section ? 'text-inv-ink hover:bg-inv-blue hover:text-white' : 'bg-inv-surface-1 text-inv-red font-semibold'; ?>">
            <span aria-hidden="true" class="w-8 shrink-0"></span>
            <span class="flex-1">Все позиции</span>
            <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo (int) $counts['all']; ?></span>
        </a>

        <?php /* Свои ленты лежат в четырёх разделах — строка ведёт на отбор по бренду */ ?>
        <a href="<?php echo esc_url(invit_url_catalog(['brand' => INVIT_OWN_BRAND])); ?>" class="mt-1 <?php echo $row; ?> text-inv-ink hover:bg-inv-blue hover:text-white">
            <?php echo invit_section_mark('tapes', 32, 'w-8 h-8 shrink-0'); ?>
            <span class="flex-1 leading-snug">Ленты EUROBAND</span>
            <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo (int) $counts['own']; ?></span>
        </a>

        <?php foreach (invit_sections() as $cat) : $open = $cat['slug'] === $category; ?>
            <div class="mt-1">
                <a href="<?php echo esc_url(invit_url_category($cat['slug'])); ?>" class="<?php echo $row; ?> <?php echo $open ? 'bg-inv-surface-1 text-inv-red font-semibold' : 'text-inv-ink hover:bg-inv-blue hover:text-white'; ?>">
                    <?php echo invit_section_mark($cat['slug'], 32, 'w-8 h-8 shrink-0'); ?>
                    <span class="flex-1 leading-snug"><?php echo esc_html($cat['name']); ?></span>
                    <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo (int) ($counts['cat'][$cat['slug']] ?? 0); ?></span>
                    <?php echo invit_icon('chevron-right', 'w-4 h-4 shrink-0 transition-transform duration-[240ms] ' . ($open ? 'rotate-90' : '')); ?>
                </a>

                <?php if ($open) :
                    $subs = $cat['subcategories'];
                    $long = count($subs) > $preview + 2;
                    $hidden = 0;
                    ?>
                    <ul class="mt-1 ml-3 border-l border-inv-border" data-sublist>
                        <?php foreach ($subs as $idx => $sub) :
                            $active = $filters['sub'] === $sub['slug'];
                            // Выбранный подраздел виден всегда, остальные после восьмого — под катом
                            $tail = $long && $idx >= $preview && !$active;
                            if ($tail) $hidden++;
                            $prev_group = $idx > 0 ? $subs[$idx - 1]['group'] : null;
                            ?>
                            <li <?php echo $tail ? 'data-sub-tail hidden' : ''; ?>>
                                <?php if ($sub['group'] !== '' && $sub['group'] !== $prev_group) : ?>
                                    <span class="mt-2 mb-0.5 block pl-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-inv-ink-muted"><?php echo esc_html($sub['group']); ?></span>
                                <?php endif; ?>
                                <a href="<?php echo esc_url(invit_catalog_link($category, array_merge($filters, ['sub' => $active ? null : $sub['slug']]))); ?>" data-soft aria-pressed="<?php echo $active ? 'true' : 'false'; ?>" class="group/sub w-full flex items-center gap-2.5 min-h-11 pl-2 pr-2.5 rounded-[4px] text-left text-sm cursor-pointer transition-colors duration-[120ms] hover:bg-inv-blue hover:text-white <?php echo $active ? 'text-inv-red font-semibold' : 'text-inv-ink-muted'; ?>">
                                    <span class="contents <?php echo $active ? 'text-inv-red' : 'text-inv-blue'; ?>"><?php echo invit_section_mark($sub['slug'], 24, 'w-6 h-6 shrink-0 group-hover/sub:text-white'); ?></span>
                                    <span class="flex-1 leading-snug"><?php echo esc_html($sub['name']); ?></span>
                                    <span class="text-xs tabular-nums group-hover/sub:text-white/70"><?php echo (int) ($counts['sub'][$sub['slug']] ?? 0); ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>

                    <?php if ($hidden > 0) : ?>
                        <button type="button" data-sub-more class="ml-5 min-h-9 text-[13px] font-semibold text-inv-blue hover:text-inv-blue-pressed cursor-pointer transition-colors duration-[120ms]">
                            Ещё <?php echo esc_html($hidden . ' ' . invit_plural($hidden, ['подраздел', 'подраздела', 'подразделов'])); ?>
                        </button>
                        <button type="button" data-sub-less hidden class="ml-5 min-h-9 text-[13px] font-semibold text-inv-blue hover:text-inv-blue-pressed cursor-pointer transition-colors duration-[120ms]">
                            Свернуть подразделы
                        </button>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </nav>
</div>
