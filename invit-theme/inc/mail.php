<?php
/**
 * Почта сайта. Письма уходят через sendmail хостинга (конверт
 * webmaster@invit.by), SPF домена сервер разрешает. Здесь — отправитель и
 * содержание писем WooCommerce о заявке на счёт.
 */

if (!defined('ABSPATH')) exit;

/* Отправитель писем WordPress: вместо «WordPress <wordpress@invit.by>» — ящик компании */
function invit_mail_from($from) {
    return str_starts_with($from, 'wordpress@') ? invit_company('email') : $from;
}
add_filter('wp_mail_from', 'invit_mail_from');

function invit_mail_from_name($name) {
    return $name === 'WordPress' ? 'Сайт invit.by' : $name;
}
add_filter('wp_mail_from_name', 'invit_mail_from_name');

/* Письма WooCommerce: от ООО «ИНВИТ» с ящика компании — покупатель отвечает менеджеру */
function invit_woo_from_address() {
    return invit_company('email');
}
add_filter('woocommerce_email_from_address', 'invit_woo_from_address');

function invit_woo_from_name() {
    return 'ООО «ИНВИТ»';
}
add_filter('woocommerce_email_from_name', 'invit_woo_from_name');

/** УНП покупателя — в письмах о заказе, рядом с реквизитами. */
function invit_email_unp($fields, $sent_to_admin, $order) {
    $unp = $order->get_meta('_billing_unp');
    if ($unp !== '') $fields['invit_unp'] = ['label' => 'УНП', 'value' => $unp];
    return $fields;
}
add_filter('woocommerce_email_order_meta_fields', 'invit_email_unp', 10, 3);

/*
 * Письмо покупателю — без цен: на витрине у всех «Цена по запросу», итог
 * подтверждает менеджер в счёте. Менеджеру («Новый заказ») цены видны.
 * Таблица позиций выводится между этими двумя действиями.
 */
function invit_email_hide_prices($order, $sent_to_admin) {
    $GLOBALS['invit_email_hide_prices'] = !$sent_to_admin;
}
add_action('woocommerce_email_before_order_table', 'invit_email_hide_prices', 1, 2);

function invit_email_table_done() {
    $GLOBALS['invit_email_hide_prices'] = false;
    $GLOBALS['invit_email_sku'] = false;
}
add_action('woocommerce_email_after_order_table', 'invit_email_table_done', 99);

function invit_email_line_price($subtotal) {
    return empty($GLOBALS['invit_email_hide_prices']) ? $subtotal : 'по запросу';
}
add_filter('woocommerce_order_formatted_line_subtotal', 'invit_email_line_price', 99);

function invit_email_totals($rows) {
    if (empty($GLOBALS['invit_email_hide_prices'])) return $rows;
    return array_intersect_key($rows, ['payment_method' => 1, 'customer_note' => 1]);
}
add_filter('woocommerce_get_order_item_totals', 'invit_email_totals', 99);

/*
 * Артикул в письме менеджеру — только настоящий: у товаров без артикула
 * поставщика служебный равен адресу товара (invit_real_sku в inc/catalog.php).
 */
function invit_email_items_args($args) {
    $GLOBALS['invit_email_sku'] = !empty($args['show_sku']);
    $args['show_sku'] = false;
    return $args;
}
add_filter('woocommerce_email_order_items_args', 'invit_email_items_args');

function invit_email_item_sku($item_id, $item, $order, $plain_text) {
    if (empty($GLOBALS['invit_email_sku'])) return;
    $product = $item->get_product();
    if (!$product) return;
    $sku = invit_real_sku($product->get_sku(), $product->get_slug());
    if ($sku !== '') echo esc_html(' (арт. ' . $sku . ')');
}
add_action('woocommerce_order_item_meta_start', 'invit_email_item_sku', 10, 4);

/** Обращение в письме покупателю: «Здравствуйте», а не «Привет» — покупатели здесь компании. */
function invit_email_strings($translated, $text, $domain) {
    static $map = ['Hi %s,' => 'Здравствуйте, %s!', 'Hi,' => 'Здравствуйте!'];
    return $domain === 'woocommerce' && isset($map[$text]) ? $map[$text] : $translated;
}
add_filter('gettext', 'invit_email_strings', 10, 3);
