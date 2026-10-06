<?php
/**
 * Хлебные крошки — перенос Breadcrumbs из src/components/Breadcrumbs.tsx.
 *
 * @var array $args ['items' => [['label' => ..., 'url' => ...|null], ...]]
 */

if (!defined('ABSPATH')) exit;

$items = $args['items'] ?? [];
?>
<nav aria-label="Хлебные крошки" class="bg-surface-soft border-b border-line">
    <div class="max-w-[1340px] mx-auto px-5 py-3 flex items-center gap-1.5 text-xs text-ink/55 flex-wrap">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="min-h-11 sm:min-h-0 hover:text-brand-blue transition-colors flex items-center gap-1">
            <?php echo invit_icon('home', 'w-3.5 h-3.5'); ?>
            <span>Главная</span>
        </a>
        <?php foreach ($items as $item) : ?>
            <?php echo invit_icon('chevron-right', 'w-3.5 h-3.5 text-ink/45 shrink-0'); ?>
            <?php if (!empty($item['url'])) : ?>
                <a href="<?php echo esc_url($item['url']); ?>" class="inline-flex items-center min-h-11 sm:min-h-0 hover:text-brand-blue transition-colors"><?php echo esc_html($item['label']); ?></a>
            <?php else : ?>
                <span class="text-ink font-semibold"><?php echo esc_html($item['label']); ?></span>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>
</nav>
