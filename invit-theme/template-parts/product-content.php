<?php
/**
 * Описание товара как на invit.by — src/components/ProductContentBlocks.tsx:
 * заголовки, абзацы, списки, таблицы и иллюстрации. Подряд идущие картинки
 * собираются в сетку по три.
 *
 * @var array $args ['blocks' => [...]]
 */

if (!defined('ABSPATH')) exit;

$groups = [];
foreach ($args['blocks'] as $block) {
    $last = count($groups) - 1;
    if ($block['kind'] === 'image') {
        $image = ['src' => $block['src'], 'title' => $block['title'] ?? ''];
        if ($last >= 0 && $groups[$last]['kind'] === 'gallery') $groups[$last]['images'][] = $image;
        else $groups[] = ['kind' => 'gallery', 'images' => [$image]];
    } else {
        $groups[] = $block;
    }
}
?>
<div class="space-y-5">
    <?php foreach ($groups as $block) : ?>
        <?php if ($block['kind'] === 'heading') : ?>
            <h2 class="text-lg font-semibold text-ink pt-3 first:pt-0 tracking-tight"><?php echo esc_html($block['text']); ?></h2>
        <?php elseif ($block['kind'] === 'text') : ?>
            <p class="text-sm text-ink/75 leading-relaxed"><?php echo esc_html($block['text']); ?></p>
        <?php elseif ($block['kind'] === 'list') : ?>
            <ul class="space-y-2">
                <?php foreach ($block['items'] as $li) : ?>
                    <li class="flex gap-2.5 text-sm text-ink/75 leading-relaxed">
                        <span class="mt-2 w-1.5 h-1.5 rounded-full bg-brand-sky shrink-0"></span>
                        <span><?php echo esc_html($li); ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php elseif ($block['kind'] === 'links') : ?>
            <?php /* «Также … доступны:» — ссылки на сопутствующие товары (invit_product_also) */ ?>
            <ul class="space-y-2">
                <?php foreach ($block['items'] as $link) : ?>
                    <li class="flex gap-2.5 text-sm text-ink/75 leading-relaxed">
                        <span class="mt-2 w-1.5 h-1.5 rounded-full bg-brand-sky shrink-0"></span>
                        <?php if ($link['href'] !== '') : ?>
                            <a href="<?php echo esc_url($link['href']); ?>" class="text-inv-blue hover:text-inv-blue-pressed underline-offset-2 hover:underline transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"><?php echo esc_html($link['label']); ?></a>
                        <?php else : ?>
                            <span><?php echo esc_html($link['label']); ?></span>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php elseif ($block['kind'] === 'table') : ?>
            <div class="border border-line rounded-xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-xs min-w-[520px]">
                        <thead>
                            <tr class="bg-surface-soft text-left">
                                <?php foreach ($block['headers'] as $header) : ?>
                                    <th class="px-3 py-2.5 font-medium text-ink/60 align-bottom"><?php echo esc_html($header); ?></th>
                                <?php endforeach; ?>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-line">
                            <?php foreach ($block['rows'] as $row) : ?>
                                <tr>
                                    <?php foreach ($row as $c => $cell) : ?>
                                        <td class="px-3 py-2.5 <?php echo $c === 0 ? 'font-semibold text-ink' : 'text-ink/75'; ?>"><?php echo esc_html($cell); ?></td>
                                    <?php endforeach; ?>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php elseif ($block['kind'] === 'gallery') : $alone = count($block['images']) === 1; ?>
            <?php /* Одиночная иллюстрация — отдельно и не шире 420px, иначе огрызок в сетке */ ?>
            <div class="<?php echo $alone ? '' : 'grid grid-cols-2 sm:grid-cols-3 gap-3'; ?>">
                <?php foreach ($block['images'] as $image) : $local = invit_content_image($image['src']); ?>
                    <figure class="<?php echo $alone ? 'w-full max-w-[420px]' : ''; ?>">
                        <button type="button" data-content-image="<?php echo esc_attr(pathinfo($local, PATHINFO_FILENAME)); ?>" <?php echo $image['title'] !== '' ? 'title="' . esc_attr($image['title']) . '"' : ''; ?> class="w-full aspect-4/3 flex items-center justify-center border border-line rounded-xl overflow-hidden bg-white hover:border-brand-sky transition-colors cursor-zoom-in">
                            <img src="<?php echo esc_url($local); ?>" alt="<?php echo esc_attr($image['title']); ?>" loading="lazy" class="w-full h-full object-contain p-2">
                        </button>
                        <?php if ($image['title'] !== '') : ?>
                            <figcaption class="pt-1.5 text-xs text-ink/55 leading-snug"><?php echo esc_html($image['title']); ?></figcaption>
                        <?php endif; ?>
                    </figure>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    <?php endforeach; ?>
</div>
