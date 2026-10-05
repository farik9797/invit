<?php
/**
 * Тема ООО «ИНВИТ»: подключение стилей, поддержка WooCommerce, помощники
 * вывода полей ACF. Разметка страниц лежит в шаблонах рядом.
 */

if (!defined('ABSPATH')) exit;

define('INVIT_VERSION', '1.0.0');

require_once get_template_directory() . '/inc/icons.php';
require_once get_template_directory() . '/inc/nav-walker.php';
require_once get_template_directory() . '/inc/acf-fields.php';

/**
 * Значение поля ACF с запасным вариантом.
 *
 * Запасной текст — тот же, что стоит на нынешнем сайте: страница выглядит
 * правильно ещё до того, как редактор заполнит поля.
 */
function invit_field($key, $default = '', $post_id = null) {
    if (function_exists('get_field')) {
        $value = get_field($key, $post_id);
        if ($value !== null && $value !== '' && $value !== false && $value !== []) {
            return $value;
        }
    }
    return $default;
}

/** Значение из общих настроек сайта (ACF Options Page). */
function invit_option($key, $default = '') {
    return invit_field($key, $default, 'option');
}

/** Телефон в виде, пригодном для ссылки tel:. */
function invit_tel($phone) {
    return preg_replace('/[^\d+]/', '', $phone);
}

function invit_setup() {
    load_theme_textdomain('invit', get_template_directory() . '/languages');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('custom-logo', ['height' => 44, 'flex-width' => true]);

    // Витрину рисуем своими шаблонами, но галерея карточки — родная Woo.
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    register_nav_menus([
        'primary' => 'Меню в шапке',
        'footer'  => 'Меню в подвале',
    ]);
}
add_action('after_setup_theme', 'invit_setup');

function invit_assets() {
    $css = get_template_directory() . '/assets/css/app.css';
    wp_enqueue_style(
        'invit-app',
        get_template_directory_uri() . '/assets/css/app.css',
        [],
        file_exists($css) ? filemtime($css) : INVIT_VERSION
    );

    // Onest — шрифт нынешнего сайта.
    wp_enqueue_style(
        'invit-fonts',
        'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap',
        [],
        null
    );

    $js = get_template_directory() . '/assets/js/site.js';
    wp_enqueue_script(
        'invit-site',
        get_template_directory_uri() . '/assets/js/site.js',
        [],
        file_exists($js) ? filemtime($js) : INVIT_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', 'invit_assets');

/** Телефон и почта из настроек — чтобы шаблоны не повторяли значения. */
function invit_contacts() {
    return [
        'phone_minsk'     => invit_option('phone_minsk', '+375 29 644-49-79'),
        'phone_soligorsk' => invit_option('phone_soligorsk', '+375 174 32-50-22'),
        'email'           => invit_option('email', 'info@invit.by'),
        'telegram'        => invit_option('telegram', 'https://t.me/invitby'),
    ];
}

/**
 * Разделы каталога для меню: верхний уровень категорий WooCommerce.
 */
function invit_catalog_sections($limit = 0) {
    if (!taxonomy_exists('product_cat')) return [];

    $terms = get_terms([
        'taxonomy'   => 'product_cat',
        'parent'     => 0,
        'hide_empty' => true,
        'number'     => $limit ?: 0,
    ]);

    return is_wp_error($terms) ? [] : $terms;
}

/** Подразделы одного раздела. */
function invit_catalog_children($parent_id) {
    $terms = get_terms([
        'taxonomy'   => 'product_cat',
        'parent'     => $parent_id,
        'hide_empty' => true,
    ]);

    return is_wp_error($terms) ? [] : $terms;
}

/**
 * Корзина у нас не розничная: это лист заявки на счёт-фактуру. Поэтому цены
 * скрывать не надо, а вот подписи кнопок меняем на «В заявку».
 */
function invit_add_to_cart_text() {
    return 'В заявку';
}
add_filter('woocommerce_product_add_to_cart_text', 'invit_add_to_cart_text');
add_filter('woocommerce_product_single_add_to_cart_text', 'invit_add_to_cart_text');

/** Товары без цены показываем с пометкой, а не с пустым местом. */
function invit_empty_price($price, $product) {
    if ($price === '' || $product->get_price() === '') {
        return '<span class="text-inv-ink-muted">Цена по запросу</span>';
    }
    return $price;
}
add_filter('woocommerce_get_price_html', 'invit_empty_price', 10, 2);

/** Сколько позиций в заявке — для значка в шапке. */
function invit_cart_count() {
    if (!function_exists('WC') || !WC()->cart) return 0;
    return WC()->cart->get_cart_contents_count();
}
