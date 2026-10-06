<?php
/**
 * Карта адреса на Яндекс.Картах — src/components/AddressMap.tsx. Виджет
 * map-widget/v1 не требует ключа; координаты найдены геокодером по адресам.
 *
 * @var array $args ['lat', 'lon', 'title', 'address', 'caption' => true, 'size' => 'default'|'tall', 'class' => '']
 */

if (!defined('ABSPATH')) exit;

$lat = $args['lat'];
$lon = $args['lon'];
$caption = $args['caption'] ?? true;
$span = $args['span'] ?? 0.008;
$zoom = $span <= 0.004 ? 18 : ($span <= 0.008 ? 17 : 16);
$point = $lon . ',' . $lat;
$embed = "https://yandex.by/map-widget/v1/?ll={$point}&z={$zoom}&pt={$point},pm2rdm";
$full = "https://yandex.by/maps/?ll={$point}&z={$zoom}&pt={$point}";
$height = ($args['size'] ?? 'default') === 'tall' ? 'h-[300px] sm:h-[380px] lg:h-[440px]' : 'h-[220px] sm:h-[280px]';
?>
<div class="rounded-[8px] border border-inv-border bg-white overflow-hidden <?php echo esc_attr($args['class'] ?? ''); ?>">
    <iframe src="<?php echo esc_url($embed); ?>" title="<?php echo esc_attr('Карта: ' . $args['title']); ?>" loading="lazy" class="w-full border-0 <?php echo $height; ?>"></iframe>

    <div class="flex flex-wrap items-start gap-3 p-4 border-t border-inv-border <?php echo $caption ? 'justify-between' : 'justify-end'; ?>">
        <?php if ($caption) : ?>
            <span class="flex gap-2.5 min-w-0">
                <?php echo invit_icon('map-pin', 'w-4 h-4 shrink-0 mt-0.5 text-inv-blue'); ?>
                <span class="min-w-0">
                    <span class="block text-sm font-semibold text-inv-ink"><?php echo esc_html($args['title']); ?></span>
                    <span class="block mt-0.5 text-sm text-inv-ink-muted"><?php echo esc_html($args['address']); ?></span>
                </span>
            </span>
        <?php endif; ?>

        <a href="<?php echo esc_url($full); ?>" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
            Открыть карту
            <?php echo invit_icon('external-link', 'w-4 h-4'); ?>
        </a>
    </div>
</div>
