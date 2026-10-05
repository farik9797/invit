<?php
/**
 * Поля реквизитов без родного заголовка «Billing details»: свой заголовок
 * «Реквизиты для счёта» стоит выше, в form-checkout.php.
 */

if (!defined('ABSPATH')) exit;
?>
<div class="woocommerce-billing-fields">
    <?php do_action('woocommerce_before_checkout_billing_form', $checkout); ?>

    <div class="woocommerce-billing-fields__field-wrapper space-y-4">
        <?php foreach ($checkout->get_checkout_fields('billing') as $key => $field) : ?>
            <?php woocommerce_form_field($key, $field, $checkout->get_value($key)); ?>
        <?php endforeach; ?>
    </div>

    <?php do_action('woocommerce_after_checkout_billing_form', $checkout); ?>
</div>
