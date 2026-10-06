<?php
/**
 * Разделы в боковой колонке — перенос src/components/catalog/SectionsMenu.tsx:
 * поиск, «Все позиции», «Ленты EUROBAND», разделы (открытый — первым);
 * подразделы выезжают панелью сбоку при наведении.
 *
 * @var array $args ['category' => slug|null, 'filters' => array]
 */

if (!defined('ABSPATH')) exit;

$category = $args['category'];
$filters = $args['filters'];
$counts = invit_catalog_counts();
$own_only = ($_GET['brand'] ?? '') === INVIT_OWN_BRAND;

$sections = invit_sections();
if ($category) {
    $here = array_values(array_filter($sections, static fn($s) => $s['slug'] === $category));
    $sections = array_merge($here, array_values(array_filter($sections, static fn($s) => $s['slug'] !== $category)));
}
$row = 'flex items-center gap-2.5 min-h-11 px-2.5 rounded-[4px] text-sm transition-colors duration-[120ms]';
?>
<div data-sections class="relative rounded-[8px] border border-inv-border bg-white">
    <div class="p-3 border-b border-inv-border" data-sections-calm>
        <?php get_template_part('template-parts/catalog-search', null, ['query' => $filters['query'], 'category' => $category, 'filters' => $filters]); ?>
    </div>

    <h2 class="bg-inv-surface-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted border-b border-inv-border">Разделы</h2>

    <nav class="p-2">
        <a href="<?php echo esc_url(invit_url_catalog()); ?>" data-sections-calm class="<?php echo $row; ?> <?php echo $category ? 'text-inv-ink hover:bg-inv-blue hover:text-white' : 'bg-inv-surface-1 text-inv-red font-semibold'; ?>">
            <span aria-hidden="true" class="w-8 shrink-0"></span>
            <span class="flex-1">Все позиции</span>
            <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo (int) $counts['all']; ?></span>
        </a>

        <a href="<?php echo esc_url(invit_url_catalog(['brand' => INVIT_OWN_BRAND])); ?>" data-sections-calm class="mt-0.5 <?php echo $row; ?> <?php echo $own_only ? 'text-inv-red font-semibold' : 'text-inv-ink hover:bg-inv-blue hover:text-white'; ?>">
            <?php echo invit_section_mark('tapes', 32, 'w-8 h-8 shrink-0'); ?>
            <span class="flex-1 leading-snug">Ленты EUROBAND</span>
            <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo (int) $counts['own']; ?></span>
        </a>

        <?php foreach ($sections as $section) : $is_here = $section['slug'] === $category; ?>
            <a
                href="<?php echo esc_url(invit_url_category($section['slug'])); ?>"
                data-sections-row="<?php echo esc_attr($section['slug']); ?>"
                aria-current="<?php echo $is_here ? 'true' : 'false'; ?>"
                class="mt-0.5 <?php echo $row; ?> focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue <?php echo $is_here ? 'text-inv-red font-semibold' : 'text-inv-ink'; ?>"
                data-idle="<?php echo $is_here ? 'text-inv-red font-semibold' : 'text-inv-ink'; ?>"
            >
                <span data-mark class="contents"><?php echo invit_section_mark($section['slug'], 32, 'w-8 h-8 shrink-0'); ?></span>
                <span class="flex-1 leading-snug"><?php echo esc_html($section['name']); ?></span>
                <span data-count class="text-xs tabular-nums text-inv-ink-muted"><?php echo (int) ($counts['cat'][$section['slug']] ?? 0); ?></span>
                <span data-arrow class="inline-flex text-inv-ink-muted/60 transition-colors duration-[120ms]"><?php echo invit_icon('chevron-right', 'w-4 h-4 shrink-0'); ?></span>
            </a>
        <?php endforeach; ?>
    </nav>

    <?php /* Подразделы раздела, на который навели: панель поверх выдачи */ ?>
    <?php foreach ($sections as $section) :
        // Подразделы одной группы («Дюбельная техника») идут одним блоком
        $blocks = [];
        foreach ($section['subcategories'] as $sub) {
            $last = count($blocks) - 1;
            if ($sub['group'] !== '' && $last >= 0 && $blocks[$last]['group'] === $sub['group']) $blocks[$last]['items'][] = $sub;
            else $blocks[] = ['group' => $sub['group'], 'items' => [$sub]];
        }
        $same = $section['slug'] === $category;
        ?>
        <div data-sections-panel="<?php echo esc_attr($section['slug']); ?>" hidden class="absolute left-full z-40 pl-2 w-[min(720px,calc(100vw-22rem))]">
            <div class="rounded-[8px] border border-inv-border bg-white shadow-[0_6px_24px_rgba(22,44,88,0.16)] p-5 max-h-[70vh] overflow-y-auto">
                <a href="<?php echo esc_url(invit_url_category($section['slug'])); ?>" class="inline-flex items-center gap-2 text-sm font-semibold text-inv-ink hover:text-inv-blue transition-colors duration-[120ms]">
                    <?php echo esc_html($section['name']); ?>
                    <?php echo invit_icon('chevron-right', 'w-4 h-4'); ?>
                </a>

                <ul class="mt-3 columns-2 gap-6">
                    <?php foreach ($blocks as $block) : ?>
                        <li class="break-inside-avoid">
                            <?php if ($block['group'] !== '') : ?>
                                <span class="mt-2 mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-inv-ink-muted"><?php echo esc_html($block['group']); ?></span>
                            <?php endif; ?>
                            <?php foreach ($block['items'] as $sub) :
                                $chosen = $same && $filters['sub'] === $sub['slug'];
                                // Свой раздел — это отбор, а не переход: бренд и поиск остаются
                                $href = $same
                                    ? invit_catalog_link($category, array_merge($filters, ['sub' => $chosen ? null : $sub['slug']]))
                                    : invit_url_category($section['slug'], ['sub' => $sub['slug']]);
                                ?>
                                <a href="<?php echo esc_url($href); ?>" <?php echo $same ? 'data-soft' : ''; ?> class="group/sub flex items-center gap-2.5 min-h-10 px-2 py-1 rounded-[4px] text-[13px] leading-snug transition-colors duration-[120ms] hover:bg-inv-blue hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue <?php echo $chosen ? 'text-inv-red font-semibold' : 'text-inv-ink'; ?>">
                                    <span class="contents <?php echo $chosen ? 'text-inv-red' : 'text-inv-blue'; ?>"><?php echo invit_section_mark($sub['slug'], 24, 'w-6 h-6 shrink-0 group-hover/sub:text-white'); ?></span>
                                    <span class="flex-1"><?php echo esc_html($sub['name']); ?></span>
                                    <span class="text-[11px] tabular-nums text-inv-ink-muted group-hover/sub:text-white/70"><?php echo (int) ($counts['sub'][$sub['slug']] ?? 0); ?></span>
                                </a>
                            <?php endforeach; ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    <?php endforeach; ?>
</div>
