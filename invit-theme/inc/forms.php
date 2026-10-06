<?php
/**
 * Обработчики запросов со страниц сайта: заявки на расчёт и звонок, живой
 * поиск, заявка на счёт (корзина WooCommerce) и её отправка заказом.
 *
 * Идут через wc-ajax, а не admin-ajax: там у посетителя уже поднята сессия
 * WooCommerce, и корзина та же, что на странице. Без скриптов формы тоже
 * работают — обычной отправкой с возвратом на страницу.
 */

if (!defined('ABSPATH')) exit;

/** Ответ: скрипту — JSON, обычной форме — возврат туда, откуда пришли. */
function invit_respond($ok, array $data = []) {
    if (!empty($_REQUEST['ajax'])) {
        $ok ? wp_send_json_success($data) : wp_send_json_error($data, 400);
    }
    $back = wp_get_referer() ?: home_url('/');
    wp_safe_redirect(add_query_arg('sent', $ok ? '1' : '0', $back) . ($data['anchor'] ?? ''));
    exit;
}

function invit_field_value($key) {
    return isset($_POST[$key]) ? trim(sanitize_textarea_field(wp_unslash($_POST[$key]))) : '';
}

/* --------------------------------------------- заявка на расчёт и звонок */

function invit_handle_request() {
    if (!wp_verify_nonce($_POST['invit_nonce'] ?? '', 'invit_form')) invit_respond(false, ['message' => 'Обновите страницу и отправьте ещё раз.']);
    // Ловушка для роботов: поле скрыто, человек его не заполняет
    if (!empty($_POST['invit_website'])) invit_respond(true);

    $fields = [
        'name' => invit_field_value('name'),
        'company' => invit_field_value('company'),
        'phone' => invit_field_value('phone'),
        'email' => invit_field_value('email'),
        'task' => invit_field_value('task'),
        'source' => invit_field_value('source'),
    ];

    $errors = [];
    if ($fields['name'] === '') $errors['name'] = 'Укажите, как к вам обращаться';
    if ($fields['company'] === '') $errors['company'] = 'Укажите название организации или ИП';
    if (strlen(preg_replace('/\D/', '', $fields['phone'])) < 9) $errors['phone'] = 'Введите номер телефона полностью';
    if (!is_email($fields['email'])) $errors['email'] = 'Введите адрес почты, например mail@company.by';
    if ($errors) invit_respond(false, ['errors' => $errors]);

    $kind = invit_field_value('kind') === 'callback' ? 'Обратный звонок' : 'Запрос расчёта';
    $lines = [
        "Имя: {$fields['name']}",
        "Компания: {$fields['company']}",
        "Телефон: {$fields['phone']}",
        "Email: {$fields['email']}",
        'Что нужно: ' . ($fields['task'] !== '' ? $fields['task'] : '—'),
        'Откуда: ' . ($fields['source'] !== '' ? $fields['source'] : (wp_get_referer() ?: '—')),
    ];

    $sent = wp_mail(
        invit_company('email'),
        "{$kind} с сайта — {$fields['company']}",
        implode("\n", $lines),
        ['Reply-To: ' . $fields['name'] . ' <' . $fields['email'] . '>']
    );

    invit_respond($sent, $sent ? [] : ['message' => 'Не удалось отправить. Позвоните нам, пожалуйста.']);
}
add_action('wc_ajax_invit_request', 'invit_handle_request');

/* --------------------------------------------------------- живой поиск */

function invit_handle_search() {
    $query = isset($_GET['q']) ? sanitize_text_field(wp_unslash($_GET['q'])) : '';
    $found = $query === '' ? [] : invit_search(invit_catalog_items(), $query);
    $top = array_slice($found, 0, 6);
    invit_prime_images($top);

    wp_send_json([
        'count' => count($found),
        'items' => array_map(static fn($item) => [
            'title' => $item[INVIT_I_TITLE],
            'url' => invit_item_url($item),
            'image' => invit_item_image($item),
            'sku' => $item[INVIT_I_SKU],
            // Снимка нет — в подсказке каталога стоит знак подраздела
            'icon' => $item[INVIT_I_THUMB] ? '' : invit_section_icon($item[INVIT_I_SUB], 22, 'w-[22px] h-[22px] text-inv-border'),
        ], $top),
    ]);
}
add_action('wc_ajax_invit_search', 'invit_handle_search');

/* ---------------------------------------------------- заявка на счёт */

/** Состояние заявки для шапки и кнопок: число позиций и что уже лежит. */
function invit_cart_state() {
    $cart = WC()->cart;
    $lines = [];
    foreach ($cart->get_cart() as $key => $line) {
        $lines[] = ['key' => $key, 'id' => (int) $line['product_id'], 'qty' => (int) $line['quantity']];
    }
    return ['count' => count($lines), 'units' => (int) $cart->get_cart_contents_count(), 'lines' => $lines];
}

function invit_handle_cart() {
    if (!WC()->cart) wp_send_json_error([], 400);
    $cart = WC()->cart;
    $op = sanitize_key($_POST['op'] ?? '');
    $key = sanitize_text_field(wp_unslash($_POST['key'] ?? ''));
    $qty = max(1, (int) ($_POST['qty'] ?? 1));

    if ($op === 'add') {
        $id = (int) ($_POST['id'] ?? 0);
        if (!$id || !wc_get_product($id)) wp_send_json_error([], 400);
        $cart->add_to_cart($id, $qty);
        // Уведомление Woo «добавлено в корзину» здесь лишнее: кнопка сама
        // меняется на «В заявке», а счётчик в шапке растёт.
        wc_clear_notices();
    } elseif ($op === 'qty' && $key !== '') {
        $cart->set_quantity($key, $qty);
    } elseif ($op === 'remove' && $key !== '') {
        $cart->remove_cart_item($key);
    } elseif ($op === 'clear') {
        $cart->empty_cart();
    }

    wp_send_json_success(invit_cart_state());
}
add_action('wc_ajax_invit_cart', 'invit_handle_cart');

/* ---------------------------------------------- отправка заявки на счёт */

/**
 * Заявка на счёт-фактуру превращается в заказ WooCommerce: менеджер видит её
 * в админке со всеми позициями и реквизитами, покупателю уходит письмо Woo.
 * Цены в заявке не показываются, итог подтверждает менеджер.
 */
function invit_handle_order() {
    if (!wp_verify_nonce($_POST['invit_nonce'] ?? '', 'invit_form')) invit_respond(false, ['message' => 'Обновите страницу и отправьте ещё раз.']);
    $cart = WC()->cart;
    if (!$cart || $cart->is_empty()) invit_respond(false, ['message' => 'Заявка пуста.']);

    $f = [
        'company' => invit_field_value('company'),
        'unp' => preg_replace('/\D/', '', invit_field_value('unp')),
        'person' => invit_field_value('person'),
        'email' => invit_field_value('email'),
        'phone' => invit_field_value('phone'),
        'address' => invit_field_value('address'),
        'note' => invit_field_value('note'),
    ];

    $errors = [];
    if ($f['company'] === '') $errors['company'] = 'Укажите организацию или ИП';
    if (!preg_match('/^\d{9}$/', $f['unp'])) $errors['unp'] = 'УНП — ровно девять цифр';
    if ($f['person'] === '') $errors['person'] = 'Укажите, с кем связаться';
    if (!is_email($f['email'])) $errors['email'] = 'Счёт придёт на этот адрес — проверьте его';
    if (strlen(preg_replace('/\D/', '', $f['phone'])) < 9) $errors['phone'] = 'Введите номер телефона полностью';
    if (empty($_POST['agree'])) $errors['agree'] = 'Подтвердите статус покупателя';
    if ($errors) invit_respond(false, ['errors' => $errors]);

    try {
        $order = wc_create_order(['status' => 'pending']);
        foreach ($cart->get_cart() as $line) {
            $order->add_product($line['data'], (int) $line['quantity']);
        }
        $order->set_billing_company($f['company']);
        $order->set_billing_first_name($f['person']);
        $order->set_billing_email($f['email']);
        $order->set_billing_phone($f['phone']);
        $order->set_billing_address_1($f['address']);
        $order->set_billing_country('BY');
        $order->set_customer_note($f['note']);
        $order->update_meta_data('_billing_unp', $f['unp']);
        $order->set_payment_method('cod');
        $order->set_payment_method_title('Счёт-фактура');
        $order->set_created_via('invit-cart');
        $order->calculate_totals();
        $order->save();
        // В обработке: письма Woo «Новый заказ» менеджеру и «Заказ получен» покупателю
        $order->update_status('processing', 'Заявка на счёт-фактуру с сайта.');
    } catch (Exception $e) {
        invit_respond(false, ['message' => 'Не удалось отправить заявку. Позвоните нам, пожалуйста.']);
    }

    $cart->empty_cart();
    invit_respond(true, ['order' => $order->get_order_number()]);
}
add_action('wc_ajax_invit_order', 'invit_handle_order');

/** Адреса запросов для скриптов. */
function invit_script_config() {
    return [
        'search' => add_query_arg('wc-ajax', 'invit_search', home_url('/')),
        'cart' => add_query_arg('wc-ajax', 'invit_cart', home_url('/')),
        'mega' => add_query_arg(['wc-ajax' => 'invit_mega', 'v' => substr(md5(invit_catalog_cache_file()), 0, 8)], home_url('/')),
        'catalog' => invit_url_catalog(),
    ];
}

/* ------------------------------------------------- содержимое мега-меню */

function invit_handle_mega() {
    // Меню меняется вместе с каталогом: ключ кэша — файл индекса
    $key = 'invit_mega_' . md5(invit_catalog_cache_file());
    $html = get_transient($key);
    if ($html === false) {
        ob_start();
        get_template_part('template-parts/mega-panel');
        $html = ob_get_clean();
        set_transient($key, $html, DAY_IN_SECONDS);
    }
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: public, max-age=600');
    echo $html;
    exit;
}
add_action('wc_ajax_invit_mega', 'invit_handle_mega');
