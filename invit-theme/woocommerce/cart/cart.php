<?php
/**
 * Лист заявки: что набрали в каталоге. Цен к оплате здесь нет — счёт выставляет
 * менеджер, поэтому вместо «Итого к оплате» показываем количество позиций.
 */

if (!defined('ABSPATH')) exit;

do_action('woocommerce_before_cart');
?>

<form class="woocommerce-cart-form" action="<?php echo esc_url(wc_get_cart_url()); ?>" method="post">
    <?php do_action('woocommerce_before_cart_table'); ?>

    <ul class="rounded-[8px] border border-inv-border divide-y divide-inv-border-subtle overflow-hidden">
        <?php
        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            $_product = apply_filters('woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key);
            $product_id = apply_filters('woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key);

            if (!$_product || !$_product->exists() || $cart_item['quantity'] <= 0) continue;

            $permalink = apply_filters('woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink($cart_item) : '', $cart_item, $cart_item_key);
            $thumbnail = $_product->get_image('woocommerce_thumbnail', ['class' => 'max-h-full w-auto object-contain']);
            ?>
            <li class="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4">
                <span class="flex items-center justify-center w-20 h-20 shrink-0 rounded-[6px] border border-inv-border bg-white p-2">
                    <?php echo $permalink ? '<a href="' . esc_url($permalink) . '">' . wp_kses_post($thumbnail) . '</a>' : wp_kses_post($thumbnail); ?>
                </span>

                <span class="flex-1 min-w-[180px]">
                    <?php if ($permalink) : ?>
                        <a href="<?php echo esc_url($permalink); ?>" class="block text-sm font-semibold leading-snug text-inv-ink hover:text-inv-blue transition-colors duration-[120ms]">
                            <?php echo wp_kses_post($_product->get_name()); ?>
                        </a>
                    <?php else : ?>
                        <span class="block text-sm font-semibold leading-snug text-inv-ink"><?php echo wp_kses_post($_product->get_name()); ?></span>
                    <?php endif; ?>

                    <?php if ($_product->get_sku()) : ?>
                        <span class="mt-1 block text-xs text-inv-ink-muted">Артикул <?php echo esc_html($_product->get_sku()); ?></span>
                    <?php endif; ?>

                    <span class="mt-1 block text-sm text-inv-ink"><?php echo wp_kses_post(apply_filters('woocommerce_cart_item_price', WC()->cart->get_product_price($_product), $cart_item, $cart_item_key)); ?></span>
                </span>

                <span class="flex items-center gap-3">
                    <?php
                    echo woocommerce_quantity_input([
                        'input_name'  => "cart[{$cart_item_key}][qty]",
                        'input_value' => $cart_item['quantity'],
                        'max_value'   => $_product->get_max_purchase_quantity(),
                        'min_value'   => '0',
                        'classes'     => ['h-11', 'w-20', 'px-3', 'rounded-[4px]', 'border', 'border-inv-border', 'text-sm', 'text-inv-ink'],
                    ], $_product, false);
                    ?>
                    <span class="text-sm text-inv-ink-muted">шт.</span>

                    <a href="<?php echo esc_url(wc_get_cart_remove_url($cart_item_key)); ?>" aria-label="Убрать из заявки" class="flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink-muted hover:text-inv-error hover:bg-inv-surface-1 transition-colors duration-[120ms]">
                        <?php echo invit_icon('trash-2', 'w-4 h-4'); ?>
                    </a>
                </span>
            </li>
        <?php } ?>
    </ul>

    <div class="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" name="update_cart" value="1" class="inline-flex items-center justify-center min-h-11 px-5 rounded-[4px] border border-inv-border bg-white text-sm font-semibold text-inv-ink hover:border-inv-blue hover:text-inv-blue transition-colors duration-[120ms] cursor-pointer">
            Пересчитать
        </button>

        <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">
            <?php echo invit_icon('arrow-right', 'w-4 h-4 rotate-180'); ?>
            Продолжить выбор
        </a>

        <?php wp_nonce_field('woocommerce-cart', 'woocommerce-cart-nonce'); ?>
    </div>

    <?php do_action('woocommerce_after_cart_table'); ?>
</form>

<div class="mt-8 rounded-[8px] border border-inv-border bg-inv-surface-1 p-5 sm:p-6">
    <h2 class="text-lg font-semibold text-inv-ink">Заявка на счёт-фактуру</h2>

    <dl class="mt-4 space-y-2 text-sm">
        <div class="flex items-center justify-between gap-4">
            <dt class="text-inv-ink-muted">Позиций</dt>
            <dd class="font-semibold text-inv-ink"><?php echo esc_html(count(WC()->cart->get_cart())); ?></dd>
        </div>
        <div class="flex items-center justify-between gap-4">
            <dt class="text-inv-ink-muted">Всего единиц</dt>
            <dd class="font-semibold text-inv-ink"><?php echo esc_html(WC()->cart->get_cart_contents_count()); ?></dd>
        </div>
    </dl>

    <p class="mt-4 text-xs leading-relaxed text-inv-ink-muted">
        Итоговую сумму подтверждает менеджер: часть позиций идёт по запросу, на объём
        считаем отдельно. Оплата — по счёт-фактуре, розничной продажи нет.
    </p>

    <a href="<?php echo esc_url(wc_get_checkout_url()); ?>" class="mt-5 w-full inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover active:scale-[0.99] text-white text-sm font-semibold transition-[background-color,transform] duration-[120ms]">
        Оформить заявку
    </a>
</div>

<?php do_action('woocommerce_after_cart'); ?>
