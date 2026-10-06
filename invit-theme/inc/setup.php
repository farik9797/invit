<?php
/**
 * Первичная настройка сайта одной кнопкой: «Инструменты → Настройка ИНВИТ».
 *
 * Всё, что после чистой установки WordPress + WooCommerce пришлось бы выставлять
 * руками в десятке разных экранов: страницы и их шаблоны, главная, адреса
 * каталога как на прежнем сайте, классическая заявка вместо блочной корзины,
 * рубли, способ оплаты «Счёт-фактура», выключение заглушки «Скоро открытие».
 *
 * Повторный запуск безопасен: существующие страницы находятся по адресу и
 * обновляются, а не дублируются.
 */

if (!defined('ABSPATH')) exit;

function invit_setup_menu() {
    add_management_page(
        'Настройка ИНВИТ',
        'Настройка ИНВИТ',
        'manage_options',
        'invit-setup',
        'invit_setup_screen'
    );
}
add_action('admin_menu', 'invit_setup_menu');

/** Страница по адресу: находит существующую или создаёт новую. */
function invit_setup_page($slug, $title, $content = '', $template = '') {
    $page = get_page_by_path($slug);

    $data = [
        'post_type'    => 'page',
        'post_status'  => 'publish',
        'post_title'   => $title,
        'post_name'    => $slug,
    ];

    if ($page) {
        $data['ID'] = $page->ID;
        if ($content !== '') $data['post_content'] = $content;
        $id = wp_update_post($data);
    } else {
        $data['post_content'] = $content;
        $id = wp_insert_post($data);
    }

    if ($id && !is_wp_error($id) && $template !== '') {
        update_post_meta($id, '_wp_page_template', $template);
    }

    return is_wp_error($id) ? 0 : (int) $id;
}

/** Страница WooCommerce: та, что Woo создал при активации, — переименовываем. */
function invit_setup_wc_page($option, $slug, $title, $content) {
    $id = (int) get_option($option);
    $page = $id ? get_post($id) : null;

    if (!$page || $page->post_status === 'trash') {
        $id = invit_setup_page($slug, $title, $content);
    } else {
        wp_update_post([
            'ID'           => $id,
            'post_title'   => $title,
            'post_name'    => $slug,
            'post_status'  => 'publish',
            'post_content' => $content,
        ]);
    }

    update_option($option, $id);
    return $id;
}

function invit_run_setup() {
    $log = [];

    // Заглушка WooCommerce «Скоро открытие» — сайт должен быть виден.
    update_option('woocommerce_coming_soon', 'no');
    update_option('woocommerce_store_pages_only', 'no');
    $log[] = 'Заглушка «Скоро открытие» выключена';

    // Страницы сайта и их шаблоны.
    $home = invit_setup_page('glavnaya', 'Главная');
    invit_setup_page('about', 'О компании', '', 'page-about.php');
    invit_setup_page('contacts', 'Контакты', '', 'page-contacts.php');
    invit_setup_page('certificates', 'Документация', '', 'page-certificates.php');
    $news = invit_setup_page('news', 'Новости');
    invit_setup_page('privacy', 'Политика конфиденциальности');
    $log[] = 'Страницы: Главная, О компании, Контакты, Документация, Новости, Политика';

    update_option('show_on_front', 'page');
    update_option('page_on_front', $home);
    update_option('page_for_posts', $news);
    $log[] = 'Главная и страница новостей назначены';

    // Страницы магазина: классические шорткоды — блочная корзина не берёт
    // шаблоны темы, и заявка на счёт выглядела бы как обычный магазин.
    invit_setup_wc_page('woocommerce_shop_page_id', 'catalog', 'Каталог', '');
    invit_setup_wc_page('woocommerce_cart_page_id', 'cart', 'Заявка на счёт', '[woocommerce_cart]');
    invit_setup_wc_page('woocommerce_checkout_page_id', 'checkout', 'Оформление заявки', '[woocommerce_checkout]');
    $log[] = 'Каталог, заявка на счёт и её оформление настроены';

    // Адреса как на прежнем сайте: /catalog/<раздел>/<товар>/.
    update_option('permalink_structure', '/%postname%/');
    update_option('woocommerce_permalinks', [
        'product_base'           => '/catalog/%product_cat%',
        'category_base'          => 'catalog',
        'tag_base'               => 'product-tag',
        'attribute_base'         => '',
        'use_verbose_page_rules' => false,
    ]);
    $log[] = 'Адреса: /catalog/, /catalog/<раздел>/, /catalog/<раздел>/<товар>/';

    // Белорусские рубли; формат «26,47 р.» задаёт functions.php темы.
    update_option('woocommerce_currency', 'BYN');
    update_option('woocommerce_default_country', 'BY');
    update_option('woocommerce_price_decimal_sep', ',');
    update_option('woocommerce_price_thousand_sep', ' ');
    update_option('woocommerce_price_num_decimals', '2');
    $log[] = 'Валюта BYN, разделители «,» и пробел';

    // Оплата — только счёт-фактурой: штатный способ «при доставке» переименован.
    $cod = get_option('woocommerce_cod_settings', []);
    $cod = is_array($cod) ? $cod : [];
    $cod['enabled'] = 'yes';
    $cod['title'] = 'Счёт-фактура';
    $cod['description'] = 'Менеджер выставит счёт-фактуру и пришлёт его на указанную почту.';
    update_option('woocommerce_cod_settings', $cod);
    $log[] = 'Способ оплаты «Счёт-фактура» включён';

    // Регистрация покупателей не нужна: заявка оформляется без личного кабинета.
    update_option('woocommerce_enable_guest_checkout', 'yes');
    update_option('woocommerce_enable_signup_and_login_from_checkout', 'no');
    update_option('woocommerce_enable_myaccount_registration', 'no');

    flush_rewrite_rules();
    $log[] = 'Правила адресов пересобраны';

    update_option('invit_setup_done', current_time('mysql'));

    return $log;
}

function invit_setup_screen() {
    if (!current_user_can('manage_options')) return;

    $log = [];
    if (isset($_POST['invit_setup']) && check_admin_referer('invit_setup')) {
        $log = invit_run_setup();
    }

    $done = get_option('invit_setup_done');
    ?>
    <div class="wrap">
        <h1>Настройка ИНВИТ</h1>

        <p>
            Одна кнопка выставляет всё, что нужно сайту после чистой установки:
            страницы и их шаблоны, главную, адреса каталога как на прежнем сайте,
            заявку на счёт-фактуру, рубли и выключает заглушку «Скоро открытие».
            Повторный запуск ничего не дублирует.
        </p>

        <?php if ($done) : ?>
            <p><strong>Последний запуск:</strong> <?php echo esc_html($done); ?></p>
        <?php endif; ?>

        <?php if ($log) : ?>
            <div class="notice notice-success"><p><strong>Готово:</strong></p><ul style="list-style:disc;padding-left:20px">
                <?php foreach ($log as $line) : ?>
                    <li><?php echo esc_html($line); ?></li>
                <?php endforeach; ?>
            </ul></div>
        <?php endif; ?>

        <form method="post">
            <?php wp_nonce_field('invit_setup'); ?>
            <p><button type="submit" name="invit_setup" value="1" class="button button-primary button-hero">Настроить сайт</button></p>
        </form>
    </div>
    <?php
}
