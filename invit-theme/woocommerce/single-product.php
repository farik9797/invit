<?php
/**
 * Карточка товара: снимок и галерея слева, справа раздел, название, цена,
 * характеристики и кнопка «В заявку». Ниже — описание и соседи по разделу.
 */

if (!defined('ABSPATH')) exit;

get_header();

while (have_posts()) : the_post();
    global $product;
    if (!is_a($product, 'WC_Product')) {
        $product = wc_get_product(get_the_ID());
    }

    $terms = get_the_terms(get_the_ID(), 'product_cat');
    $section = $terms && !is_wp_error($terms) ? end($terms) : null;
    $gallery = $product->get_gallery_image_ids();
    $attributes = $product->get_attributes();
    $sku = $product->get_sku();
    ?>

    <div class="bg-inv-surface-1 border-b border-inv-border">
        <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-3 text-sm text-inv-ink-muted [&_a]:text-inv-ink [&_a:hover]:text-inv-blue [&_a]:transition-colors">
            <?php woocommerce_breadcrumb(['delimiter' => ' <span class="px-1 text-inv-border">/</span> ']); ?>
        </div>
    </div>

    <section class="bg-white py-8 sm:py-12">
        <div class="max-w-[1400px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

            <div>
                <div class="rounded-[8px] border border-inv-border bg-white p-5 flex items-center justify-center min-h-[320px] sm:min-h-[420px]">
                    <?php if (has_post_thumbnail()) : ?>
                        <img data-product-image src="<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(), 'large')); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" class="max-h-[300px] sm:max-h-[400px] w-auto object-contain">
                    <?php else : ?>
                        <span class="text-inv-border"><?php echo invit_icon('layers', 'w-16 h-16'); ?></span>
                    <?php endif; ?>
                </div>

                <?php if ($gallery) : ?>
                    <ul class="mt-3 flex flex-wrap gap-2">
                        <?php
                        $thumbs = array_merge([get_post_thumbnail_id()], $gallery);
                        foreach ($thumbs as $thumb_id) :
                            if (!$thumb_id) continue;
                            ?>
                            <li>
                                <button type="button" data-product-thumb="<?php echo esc_url(wp_get_attachment_image_url($thumb_id, 'large')); ?>" class="w-[72px] h-[72px] flex items-center justify-center rounded-[6px] border border-inv-border bg-white p-1.5 cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue">
                                    <img src="<?php echo esc_url(wp_get_attachment_image_url($thumb_id, 'thumbnail')); ?>" alt="" loading="lazy" class="max-h-full w-auto object-contain">
                                </button>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>

            <div>
                <?php if ($section) : ?>
                    <a href="<?php echo esc_url(get_term_link($section)); ?>" class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">
                        <?php echo esc_html($section->name); ?>
                    </a>
                <?php endif; ?>

                <h1 class="mt-2 text-2xl sm:text-3xl font-semibold leading-tight tracking-[-0.01em] text-inv-ink">
                    <?php the_title(); ?>
                </h1>

                <div class="mt-4 text-xl font-semibold text-inv-ink">
                    <?php echo wp_kses_post($product->get_price_html()); ?>
                </div>

                <?php if ($product->get_short_description()) : ?>
                    <p class="mt-4 text-base leading-[1.55] text-inv-ink-muted">
                        <?php echo esc_html(wp_strip_all_tags($product->get_short_description())); ?>
                    </p>
                <?php endif; ?>

                <?php /* Кнопка кладёт позицию в заявку на счёт: розничной оплаты нет. */ ?>
                <form class="mt-6 flex flex-col sm:flex-row gap-3" action="<?php echo esc_url($product->add_to_cart_url()); ?>" method="post">
                    <label class="sr-only" for="quantity">Количество</label>
                    <input id="quantity" type="number" name="quantity" value="1" min="1" step="1" class="h-12 w-full sm:w-24 px-4 rounded-[4px] border border-inv-border bg-white text-base text-inv-ink focus:border-inv-blue focus-visible:outline-none">
                    <input type="hidden" name="add-to-cart" value="<?php echo esc_attr($product->get_id()); ?>">

                    <button type="submit" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 min-h-11 h-12 px-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover active:scale-[0.99] text-white text-sm font-semibold transition-[background-color,transform] duration-[120ms] cursor-pointer">
                        <?php echo invit_icon('plus', 'w-4 h-4'); ?>
                        В заявку на счёт
                    </button>

                    <button type="button" data-request class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] border border-inv-border text-inv-ink text-sm font-semibold hover:border-inv-blue hover:text-inv-blue transition-colors duration-[120ms] cursor-pointer">
                        Запросить расчёт
                    </button>
                </form>

                <?php if ($sku || $attributes) : ?>
                    <dl class="mt-8 rounded-[8px] border border-inv-border divide-y divide-inv-border-subtle overflow-hidden">
                        <?php if ($sku) : ?>
                            <div class="flex gap-4 px-4 py-3 text-sm">
                                <dt class="w-40 shrink-0 text-inv-ink-muted">Артикул</dt>
                                <dd class="text-inv-ink"><?php echo esc_html($sku); ?></dd>
                            </div>
                        <?php endif; ?>

                        <?php foreach ($attributes as $attribute) :
                            $label = wc_attribute_label($attribute->get_name());
                            $value = $product->get_attribute($attribute->get_name());
                            if (!$value) continue;
                            ?>
                            <div class="flex gap-4 px-4 py-3 text-sm">
                                <dt class="w-40 shrink-0 text-inv-ink-muted"><?php echo esc_html($label); ?></dt>
                                <dd class="text-inv-ink"><?php echo esc_html($value); ?></dd>
                            </div>
                        <?php endforeach; ?>
                    </dl>
                <?php endif; ?>

                <p class="mt-4 text-xs leading-relaxed text-inv-ink-muted">
                    Работаем с юридическими лицами и ИП по счёт-фактуре. Нетиповую ширину
                    и длину ленты считаем отдельно — пришлите запрос, посчитаем.
                </p>
            </div>
        </div>
    </section>

    <?php if ($product->get_description()) : ?>
        <section class="bg-inv-surface-1 py-10 sm:py-14">
            <div class="max-w-[1400px] mx-auto px-4 lg:px-8">
                <h2 class="text-xl sm:text-2xl font-semibold text-inv-ink">Описание</h2>
                <div class="mt-4 max-w-[70ch] text-base leading-[1.6] text-inv-ink-muted [&_p]:mt-3 [&_p:first-child]:mt-0 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
                    <?php echo wp_kses_post(wpautop($product->get_description())); ?>
                </div>
            </div>
        </section>
    <?php endif; ?>

    <?php
    /* Соседи по разделу: родные «похожие товары» Woo берут и категорию, и метки,
       из-за чего в выдачу лезут ленты из других разделов. */
    if ($section) :
        $related = new WP_Query([
            'post_type' => 'product',
            'posts_per_page' => 4,
            'post__not_in' => [get_the_ID()],
            'tax_query' => [[
                'taxonomy' => 'product_cat',
                'field' => 'term_id',
                'terms' => $section->term_id,
            ]],
            'no_found_rows' => true,
        ]);
        ?>
        <?php if ($related->have_posts()) : ?>
            <section class="bg-white py-10 sm:py-14">
                <div class="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div class="flex items-end justify-between gap-6">
                        <h2 class="text-xl sm:text-2xl font-semibold text-inv-ink">Из этого же раздела</h2>
                        <a href="<?php echo esc_url(get_term_link($section)); ?>" class="inline-flex items-center gap-2 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] whitespace-nowrap">
                            Весь раздел
                            <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
                        </a>
                    </div>

                    <ul class="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <?php while ($related->have_posts()) : $related->the_post(); ?>
                            <li><?php wc_get_template_part('content', 'product-card'); ?></li>
                        <?php endwhile; ?>
                    </ul>
                </div>
            </section>
        <?php endif; ?>
        <?php wp_reset_postdata(); ?>
    <?php endif; ?>

<?php endwhile; ?>

<?php get_footer(); ?>
