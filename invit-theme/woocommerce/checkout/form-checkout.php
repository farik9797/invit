<?php
/**
 * Оформление заявки: слева реквизиты для счёта, справа — состав заявки,
 * оговорка, подтверждение статуса и кнопка «Получить счёт-фактуру».
 */

if (!defined('ABSPATH')) exit;

do_action('woocommerce_before_checkout_form', $checkout);

if (!$checkout->is_registration_enabled() && $checkout->is_registration_required() && !is_user_logged_in()) {
    echo esc_html(apply_filters('woocommerce_checkout_must_be_logged_in_message', __('You must be logged in to checkout.', 'woocommerce')));
    return;
}
?>

<form name="checkout" method="post" class="checkout woocommerce-checkout grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start" action="<?php echo esc_url(wc_get_checkout_url()); ?>" enctype="multipart/form-data">

    <div class="rounded-[8px] border border-inv-border bg-white p-5 sm:p-6">
        <h2 class="text-lg font-semibold text-inv-ink">Реквизиты для счёта</h2>
        <p class="mt-2 text-sm text-inv-ink-muted">
            По ним выставим счёт-фактуру. Поля со звёздочкой обязательны.
        </p>

        <div class="mt-5 space-y-4 [&_.form-row]:block [&_label]:block [&_label]:text-sm [&_label]:font-medium [&_label]:text-inv-ink [&_.required]:text-inv-red [&_input]:mt-1.5 [&_input]:w-full [&_input]:h-12 [&_input]:px-4 [&_input]:rounded-[4px] [&_input]:border [&_input]:border-inv-border [&_input]:bg-white [&_input]:text-base [&_input:focus]:border-inv-blue [&_input:focus]:outline-none [&_textarea]:mt-1.5 [&_textarea]:w-full [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:rounded-[4px] [&_textarea]:border [&_textarea]:border-inv-border [&_textarea:focus]:border-inv-blue [&_textarea:focus]:outline-none [&_.woocommerce-invalid_input]:border-inv-error">
            <?php do_action('woocommerce_checkout_before_customer_details'); ?>
            <?php do_action('woocommerce_checkout_billing'); ?>
            <?php do_action('woocommerce_checkout_shipping'); ?>
            <?php do_action('woocommerce_checkout_after_customer_details'); ?>
        </div>
    </div>

    <div class="rounded-[8px] border border-inv-border bg-inv-surface-1 p-5 sm:p-6 lg:sticky lg:top-[150px]">
        <h2 class="text-lg font-semibold text-inv-ink">Состав заявки</h2>

        <div id="order_review" class="woocommerce-checkout-review-order mt-4 [&_table]:w-full [&_table]:text-sm [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_th]:text-inv-ink-muted [&_td]:py-2 [&_td]:text-right [&_td]:text-inv-ink [&_tfoot_th]:text-inv-ink [&_tfoot]:border-t [&_tfoot]:border-inv-border">
            <?php do_action('woocommerce_checkout_order_review'); ?>
        </div>
    </div>
</form>

<?php do_action('woocommerce_after_checkout_form', $checkout); ?>
