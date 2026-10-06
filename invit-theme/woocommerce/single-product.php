<?php
/**
 * Карточка товара — перенос src/pages/ProductPage.tsx: галерея слева, справа
 * подраздел, название, описание, параметры, количество и действия; ниже —
 * подробное описание блоками, спутники и соседи по разделу.
 */

if (!defined('ABSPATH')) exit;

get_header();

while (have_posts()) : the_post();
    $product = wc_get_product(get_the_ID());
    $item = invit_catalog_item_by_id(get_the_ID());
    if (!$product || !$item) {
        echo '<section class="max-w-[1340px] mx-auto px-5 py-20 text-center text-ink/60">Товар не найден.</section>';
        continue;
    }

    $slug = $item[INVIT_I_SLUG];
    $title = $item[INVIT_I_TITLE];
    $section = invit_section($item[INVIT_I_CAT]);
    $sub = $item[INVIT_I_SUB];
    $unit = invit_item_unit($item);
    $in_cart = in_array($item[INVIT_I_ID], invit_cart_product_ids(), true);

    // Полное описание: абзацы из записи, как DESCRIPTIONS в React
    $paragraphs = array_filter(array_map(
        static fn($p) => trim(html_entity_decode(wp_strip_all_tags($p), ENT_QUOTES, 'UTF-8')),
        preg_split('/<\/p>\s*/', get_post_field('post_content', get_the_ID()))
    ));
    $description = $paragraphs ? implode("\n", $paragraphs) : $item[INVIT_I_DESC];

    $content = invit_product_content($slug);
    $blocks = invit_dedupe_content_blocks($content['blocks'] ?? [], $description);

    // Галерея: снимок товара и иллюстрации из описания (они же в галерее WooCommerce)
    $gallery = [];
    if ($item[INVIT_I_THUMB]) $gallery[] = (string) wp_get_attachment_image_url($item[INVIT_I_THUMB], 'full');
    foreach ($product->get_gallery_image_ids() as $id) $gallery[] = (string) wp_get_attachment_image_url($id, 'full');
    $gallery = array_values(array_filter($gallery));

    // Подписи кадров: иллюстрации идут в хвосте галереи в порядке блоков
    $illustrations = array_values(array_filter($content['blocks'] ?? [], static fn($b) => $b['kind'] === 'image'));
    $shift = count($gallery) - count($illustrations);
    $captions = [];
    foreach ($gallery as $idx => $src) {
        $caption = ($idx >= $shift && $idx - $shift < count($illustrations)) ? ($illustrations[$idx - $shift]['title'] ?? '') : '';
        $captions[] = $caption !== '' ? $caption : $title;
    }

    $specs = [];
    if ($item[INVIT_I_SKU] !== '') $specs[] = ['Артикул', $item[INVIT_I_SKU]];
    if ($item[INVIT_I_BRAND] !== '') $specs[] = ['Бренд', $item[INVIT_I_BRAND]];
    if ($item[INVIT_I_COUNTRY] !== '') $specs[] = ['Страна', $item[INVIT_I_COUNTRY]];

    $datasheet = invit_data('datasheets')[$slug] ?? '';
    // Выбранные вручную у товара важнее правила раздела
    $companions = invit_manual_cross_sells($product) ?: invit_cross_sell($item);
    $related = invit_related($item);

    $crumbs = [['label' => 'Каталог', 'url' => invit_url_catalog()]];
    if ($section) $crumbs[] = ['label' => $section['name'], 'url' => invit_url_category($section['slug'])];
    $crumbs[] = ['label' => $title];
    ?>

    <?php get_template_part('template-parts/breadcrumbs', null, ['items' => $crumbs]); ?>

    <section class="max-w-[1340px] mx-auto px-5 py-10" data-product data-gallery="<?php echo esc_attr(wp_json_encode($gallery)); ?>" data-captions="<?php echo esc_attr(wp_json_encode($captions)); ?>">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div class="lg:col-span-4 space-y-3 lg:sticky lg:top-32 lg:self-start">
                <?php if ($gallery) : ?>
                    <button type="button" data-photo-open class="flex items-center justify-center w-full max-w-[420px] aspect-square bg-white border border-line rounded-xl overflow-hidden cursor-zoom-in hover:border-brand-sky transition-colors" aria-label="Открыть фото">
                        <img data-photo src="<?php echo esc_url($gallery[0]); ?>" alt="<?php echo esc_attr($captions[0]); ?>" width="500" height="500" class="w-auto h-auto max-w-full max-h-full object-contain p-4">
                    </button>
                <?php else : ?>
                    <div class="flex flex-col items-center justify-center gap-3 w-full max-w-[420px] aspect-square bg-white border border-line rounded-xl text-line">
                        <?php echo invit_section_icon($sub, 96, 'w-24 h-24'); ?>
                        <span class="text-xs text-ink/40">Фото уточняйте у менеджера</span>
                    </div>
                <?php endif; ?>

                <?php if (count($gallery) > 1) : ?>
                    <div class="grid grid-cols-5 gap-2 max-w-[420px]">
                        <?php foreach ($gallery as $idx => $src) : ?>
                            <button type="button" data-thumb="<?php echo (int) $idx; ?>" class="aspect-square bg-white border rounded-lg overflow-hidden transition-colors cursor-pointer <?php echo $idx === 0 ? 'border-brand-blue' : 'border-line hover:border-brand-sky'; ?>">
                                <img src="<?php echo esc_url($src); ?>" alt="<?php echo esc_attr($captions[$idx]); ?>" title="<?php echo esc_attr($captions[$idx]); ?>" loading="lazy" class="w-full h-full object-contain p-1.5">
                            </button>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>

                <?php if ($datasheet) : ?>
                    <a href="<?php echo esc_url(invit_asset(ltrim($datasheet, '/'))); ?>" target="_blank" rel="noreferrer" class="flex items-center gap-2.5 px-4 py-3.5 border border-line rounded-[4px] text-sm font-semibold text-brand-blue hover:border-brand-sky transition-colors">
                        <?php echo invit_icon('download', 'w-4 h-4 shrink-0'); ?>
                        Технический лист (PDF)
                    </a>
                <?php endif; ?>
            </div>

            <div class="lg:col-span-8 space-y-6">
                <div>
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        <a href="<?php echo esc_url(invit_url_sub($sub)); ?>" class="text-[11px] text-brand-blue hover:text-brand-blue-hover transition-colors"><?php echo esc_html(invit_sub_name($sub)); ?></a>
                    </div>

                    <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-snug"><?php echo esc_html($title); ?></h1>

                    <p class="mt-3 font-bold text-base font-semibold text-ink/60">Цена по запросу</p>
                    <?php if ($description !== '') : ?>
                        <p class="text-sm text-ink/70 mt-4 leading-relaxed whitespace-pre-line"><?php echo esc_html($description); ?></p>
                    <?php endif; ?>
                </div>

                <?php if ($specs) : ?>
                    <div class="border border-line rounded-xl overflow-hidden">
                        <div class="bg-surface-soft px-4 py-2.5 text-xs font-semibold text-ink">Параметры</div>
                        <dl class="divide-y divide-line text-sm">
                            <?php foreach ($specs as [$label, $value]) : ?>
                                <div class="flex justify-between gap-6 px-4 py-3">
                                    <dt class="text-ink/60"><?php echo esc_html($label); ?></dt>
                                    <dd class="font-semibold text-ink text-right"><?php echo esc_html($value); ?></dd>
                                </div>
                            <?php endforeach; ?>
                        </dl>
                    </div>
                <?php endif; ?>

                <div class="border border-line rounded-xl p-5 space-y-4">
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-semibold text-ink">Количество</span>
                        <div class="flex items-center rounded-lg border border-line overflow-hidden" data-qty>
                            <button type="button" data-qty-step="-1" aria-label="Убавить количество" disabled class="flex items-center justify-center w-11 h-11 text-ink hover:bg-surface-soft disabled:opacity-40 disabled:cursor-default transition-colors cursor-pointer">
                                <?php echo invit_icon('minus', 'w-4 h-4'); ?>
                            </button>
                            <input id="product-qty" type="number" min="1" value="1" aria-label="Количество" class="w-14 h-11 text-center text-sm font-semibold text-ink border-x border-line tabular-nums focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-blue">
                            <button type="button" data-qty-step="1" aria-label="Прибавить количество" class="flex items-center justify-center w-11 h-11 text-ink hover:bg-surface-soft transition-colors cursor-pointer">
                                <?php echo invit_icon('plus', 'w-4 h-4'); ?>
                            </button>
                        </div>
                        <?php /* Крепёж отгружают коробами: «1» — это короб, а не штука */ ?>
                        <span class="text-xs text-ink/50"><?php echo esc_html($unit['short']); ?><?php if ($unit['hint'] !== '') : ?><span class="ml-1 text-ink/40"><?php echo esc_html($unit['hint']); ?></span><?php endif; ?></span>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3">
                        <button type="button" data-add-to-quote="<?php echo (int) $item[INVIT_I_ID]; ?>" data-qty-from="#product-qty" data-product-button class="flex-1 px-5 py-3.5 rounded-[4px] text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer <?php echo $in_cart ? 'bg-brand-navy hover:bg-brand-navy/90 text-white' : 'bg-brand-blue hover:bg-brand-blue-hover text-white'; ?>">
                            <?php echo invit_icon($in_cart ? 'check' : 'plus', 'w-4 h-4'); ?>
                            <?php echo $in_cart ? 'Добавить ещё' : 'В заявку на счёт'; ?>
                        </button>

                        <button type="button" data-callback="<?php echo esc_attr('Запрос по позиции: ' . $title); ?>" class="flex-1 px-5 py-3.5 rounded-[4px] border border-line text-ink text-sm font-semibold hover:border-brand-sky transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <?php echo invit_icon('phone', 'w-4 h-4 text-brand-blue'); ?>
                            Уточнить цену
                        </button>
                    </div>

                    <a href="<?php echo esc_url(wc_get_cart_url()); ?>" data-go-cart <?php echo $in_cart ? '' : 'hidden'; ?> class="flex items-center justify-center gap-2 min-h-11 rounded-[4px] border border-brand-blue text-brand-blue text-sm font-semibold hover:bg-brand-blue/5 transition-colors">
                        <?php echo invit_icon('shopping-cart', 'w-4 h-4'); ?>
                        Перейти к заявке
                    </a>

                    <?php /* Документы по качеству есть только на свои ленты */ ?>
                    <?php if ($item[INVIT_I_OWN]) : ?>
                        <p class="flex items-start gap-2 text-xs text-ink/50">
                            <?php echo invit_icon('shield-check', 'w-4 h-4 text-brand-sky shrink-0'); ?>
                            Документы по качеству предоставляем с каждой партией — <a href="<?php echo esc_url(home_url('/certificates/')); ?>" class="text-brand-blue hover:underline">сертификаты</a>
                        </p>
                    <?php endif; ?>
                </div>

                <?php if ($blocks) get_template_part('template-parts/product-content', null, ['blocks' => $blocks]); ?>
            </div>
        </div>
    </section>

    <?php if ($companions) : ?>
        <section class="py-14 border-t border-line">
            <div class="max-w-[1340px] mx-auto px-5 space-y-6">
                <h2 class="text-xl font-bold text-ink tracking-tight">С этим товаром часто покупают</h2>
                <?php invit_product_grid($companions); ?>
            </div>
        </section>
    <?php endif; ?>

    <?php if ($related) : ?>
        <section class="py-14 bg-surface-soft border-t border-line">
            <div class="max-w-[1340px] mx-auto px-5 space-y-6">
                <h2 class="text-xl font-bold text-ink tracking-tight">Другие позиции раздела</h2>
                <?php invit_product_grid($related); ?>
            </div>
        </section>
    <?php endif; ?>

    <?php get_template_part('template-parts/lightbox'); ?>
<?php endwhile; ?>

<?php get_footer(); ?>
