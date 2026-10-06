<?php
/**
 * Заявка на счёт-фактуру вместо розничного оформления заказа.
 *
 * Сайт не торгует в розницу: покупатель — юрлицо или ИП, поэтому вместо адреса
 * доставки и оплаты картой спрашиваем реквизиты, по которым выставляется счёт.
 */

if (!defined('ABSPATH')) exit;

/** Поля заявки: лишние поля Woo убираем, нужные переименовываем. */
function invit_checkout_fields($fields) {
    $fields['billing'] = [
        'billing_company' => [
            'label'       => 'Наименование организации / ИП',
            'placeholder' => 'ООО «Вектор» или ИП Иванов И. И.',
            'required'    => true,
            'class'       => ['form-row-wide'],
            'priority'    => 10,
        ],
        'billing_unp' => [
            'label'       => 'УНП',
            'placeholder' => '600500616',
            'required'    => true,
            'class'       => ['form-row-wide'],
            'priority'    => 20,
            'custom_attributes' => ['inputmode' => 'numeric', 'maxlength' => '9'],
        ],
        'billing_first_name' => [
            'label'       => 'Контактное лицо (ФИО)',
            'placeholder' => 'Иванов Иван Иванович',
            'required'    => true,
            'class'       => ['form-row-wide'],
            'priority'    => 30,
        ],
        'billing_email' => [
            'label'       => 'Email для отправки счёта',
            'placeholder' => 'zakupki@company.by',
            'required'    => true,
            'type'        => 'email',
            'class'       => ['form-row-wide'],
            'priority'    => 40,
        ],
        'billing_phone' => [
            'label'       => 'Номер телефона',
            'placeholder' => '+375 29 000-00-00',
            'required'    => true,
            'type'        => 'tel',
            'class'       => ['form-row-wide'],
            'priority'    => 50,
        ],
        'billing_address_1' => [
            'label'       => 'Юридический адрес',
            'placeholder' => 'Минск, ул. Примерная, 1, оф. 2',
            'required'    => false,
            'class'       => ['form-row-wide'],
            'priority'    => 60,
        ],
        // Страна Woo нужна для расчётов, но спрашивать её не за чем.
        'billing_country' => [
            'type'     => 'hidden',
            'required' => false,
            'default'  => 'BY',
        ],
    ];

    unset($fields['shipping']);
    $fields['order']['order_comments'] = [
        'label'       => 'Комментарий к заявке',
        'placeholder' => 'Нужна лента ПСУЛ 20×10, 300 м. Самовывоз со склада в Минске.',
        'required'    => false,
        'type'        => 'textarea',
        'priority'    => 10,
    ];

    return $fields;
}
add_filter('woocommerce_checkout_fields', 'invit_checkout_fields');

/** Адрес доставки не нужен: отгружаем по счёту. */
add_filter('woocommerce_cart_needs_shipping_address', '__return_false');
add_filter('woocommerce_ship_to_different_address_checked', '__return_false');

/** УНП — ровно девять цифр, иначе бухгалтерия не выставит счёт. */
function invit_validate_unp() {
    $unp = isset($_POST['billing_unp']) ? preg_replace('/\D/', '', wp_unslash($_POST['billing_unp'])) : '';

    if (strlen($unp) !== 9) {
        wc_add_notice('УНП состоит из девяти цифр — проверьте номер.', 'error');
    }

    if (empty($_POST['invit_agree'])) {
        wc_add_notice('Подтвердите, что заявку отправляет юридическое лицо или ИП.', 'error');
    }
}
add_action('woocommerce_checkout_process', 'invit_validate_unp');

/** УНП и согласие сохраняем в заказе: менеджеру они нужны для счёта. */
function invit_save_unp($order_id) {
    if (!empty($_POST['billing_unp'])) {
        $unp = preg_replace('/\D/', '', wp_unslash($_POST['billing_unp']));
        update_post_meta($order_id, '_billing_unp', sanitize_text_field($unp));
    }
    if (!empty($_POST['invit_agree'])) {
        update_post_meta($order_id, '_invit_agree', 'yes');
    }
}
add_action('woocommerce_checkout_update_order_meta', 'invit_save_unp');

/** УНП в карточке заказа в админке. */
function invit_show_unp_admin($order) {
    // Заказы WooCommerce живут в своих таблицах (HPOS): мета — через сам заказ
    $unp = $order->get_meta('_billing_unp');
    if ($unp) {
        echo '<p><strong>УНП:</strong> ' . esc_html($unp) . '</p>';
    }
}
add_action('woocommerce_admin_order_data_after_billing_address', 'invit_show_unp_admin');

/** Оговорка и подтверждение статуса — прямо перед кнопкой отправки. */
function invit_checkout_agreement() {
    ?>
    <div class="mt-6 rounded-[8px] border border-inv-border bg-inv-surface-1 px-4 py-4 text-xs leading-relaxed text-inv-ink-muted">
        Сайт носит информационный характер, не является интернет-магазином и публичной
        офертой. Розничная продажа физическим лицам не осуществляется: работаем с
        юридическими лицами и индивидуальными предпринимателями по счёт-фактуре.
    </div>

    <label class="mt-4 flex items-start gap-3 text-sm text-inv-ink cursor-pointer">
        <input type="checkbox" name="invit_agree" value="1" required class="mt-1 w-5 h-5 shrink-0 rounded-[3px] border border-inv-border accent-[color:var(--color-inv-blue)] cursor-pointer">
        <span>
            Подтверждаю, что заявку отправляет юридическое лицо или индивидуальный
            предприниматель, и соглашаюсь на обработку персональных данных.
        </span>
    </label>
    <?php
}
add_action('woocommerce_review_order_before_submit', 'invit_checkout_agreement');

/**
 * Позиции «по запросу» тоже должны попадать в заявку. WooCommerce считает товар
 * без цены непродаваемым и отвечает «этот товар нельзя купить», но у нас не
 * магазин: цену на такие позиции ставит менеджер при выставлении счёта.
 */
add_filter('woocommerce_is_purchasable', '__return_true');

/**
 * В листе заявки позиции без цены показываем словами, а не нулём: «0,00 р.»
 * читается как бесплатно, хотя цену на такие позиции ставит менеджер.
 */
function invit_cart_price_html($html, $cart_item) {
    $product = $cart_item['data'] ?? null;
    if ($product && $product->get_price() === '') {
        return '<span class="text-inv-ink-muted">Цена по запросу</span>';
    }
    return $html;
}
add_filter('woocommerce_cart_item_price', 'invit_cart_price_html', 10, 2);
add_filter('woocommerce_cart_item_subtotal', 'invit_cart_price_html', 10, 2);

/** Итог тоже предварительный, пока в заявке есть позиции по запросу. */
function invit_cart_total_html($html) {
    foreach (WC()->cart->get_cart() as $item) {
        if (isset($item['data']) && $item['data']->get_price() === '') {
            return $html . '<br><span class="text-xs font-normal text-inv-ink-muted">часть позиций — по запросу, итог подтвердит менеджер</span>';
        }
    }
    return $html;
}
add_filter('woocommerce_cart_totals_order_total_html', 'invit_cart_total_html');

/** Купонов у нас нет: цены согласовывает менеджер при выставлении счёта. */
add_filter('woocommerce_coupons_enabled', '__return_false');

/** Кнопка отправки: не «оплатить», а «получить счёт». */
function invit_order_button_text() {
    return 'Получить счёт-фактуру';
}
add_filter('woocommerce_order_button_text', 'invit_order_button_text');

/** Корзина — это лист заявки, так её и называем в уведомлениях Woo. */
function invit_cart_strings($translated, $text, $domain) {
    if ($domain !== 'woocommerce') return $translated;

    $map = [
        'View cart'            => 'Открыть заявку',
        'Proceed to checkout'  => 'Оформить заявку',
        'Add to cart'          => 'В заявку',
        'Your cart is currently empty.' => 'В заявке пока ничего нет.',
    ];

    return $map[$text] ?? $translated;
}
add_filter('gettext', 'invit_cart_strings', 10, 3);
