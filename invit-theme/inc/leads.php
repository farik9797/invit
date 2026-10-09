<?php
/**
 * Заявки с сайта в админке: «Обратный звонок» и «Запрос расчёта». Каждая
 * сохраняется до отправки письма — если письмо не ушло, заявка не теряется.
 * Заявки на счёт-фактуру — заказы WooCommerce (WooCommerce → Заказы).
 */

if (!defined('ABSPATH')) exit;

/** Поля заявки: ключ — подпись в админке и в письме. */
function invit_lead_fields() {
    return [
        'name' => 'Имя',
        'company' => 'Компания',
        'phone' => 'Телефон',
        'email' => 'Email',
        'task' => 'Что нужно',
        'source' => 'Откуда',
    ];
}

function invit_register_leads() {
    register_post_type('invit_lead', [
        'labels' => [
            'name' => 'Заявки',
            'singular_name' => 'Заявка',
            'menu_name' => 'Заявки с сайта',
            'all_items' => 'Все заявки',
            'edit_item' => 'Заявка',
            'search_items' => 'Найти заявку',
            'not_found' => 'Заявок нет',
            'not_found_in_trash' => 'В корзине заявок нет',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 54,
        'menu_icon' => 'dashicons-email-alt',
        'supports' => ['title'],
        'capability_type' => 'post',
        'capabilities' => ['create_posts' => 'do_not_allow'],
        'map_meta_cap' => true,
    ]);
}
add_action('init', 'invit_register_leads');

/** Сохраняет заявку; возвращает её номер или 0. */
function invit_save_lead($kind, array $fields) {
    $lines = [];
    foreach (invit_lead_fields() as $key => $label) {
        $lines[] = $label . ': ' . (($fields[$key] ?? '') !== '' ? $fields[$key] : '—');
    }
    $id = wp_insert_post([
        'post_type' => 'invit_lead',
        'post_status' => 'publish',
        'post_title' => $kind . ' — ' . $fields['company'],
        // Текстом — чтобы поиск в админке находил по телефону и почте
        'post_content' => implode("\n", $lines),
    ]);
    if (!$id || is_wp_error($id)) return 0;
    update_post_meta($id, '_invit_lead_kind', $kind);
    foreach (invit_lead_fields() as $key => $label) {
        update_post_meta($id, '_invit_lead_' . $key, $fields[$key] ?? '');
    }
    return $id;
}

/* Список заявок: тип, компания, контакт, письмо */
function invit_lead_columns($columns) {
    return [
        'cb' => $columns['cb'],
        'title' => 'Заявка',
        'invit_contact' => 'Контакт',
        'invit_task' => 'Что нужно',
        'invit_mail' => 'Письмо',
        'date' => 'Дата',
    ];
}
add_filter('manage_invit_lead_posts_columns', 'invit_lead_columns');

function invit_lead_column($column, $id) {
    $get = static fn($key) => (string) get_post_meta($id, '_invit_lead_' . $key, true);
    if ($column === 'invit_contact') {
        echo esc_html($get('name')), '<br>';
        echo '<a href="', esc_attr(invit_tel_href($get('phone'))), '">', esc_html($get('phone')), '</a><br>';
        echo '<a href="mailto:', esc_attr($get('email')), '">', esc_html($get('email')), '</a>';
    } elseif ($column === 'invit_task') {
        echo esc_html(wp_trim_words($get('task'), 20, '…') ?: '—');
    } elseif ($column === 'invit_mail') {
        $mail = $get('mail');
        echo $mail === 'sent' ? 'отправлено' : ($mail === 'failed' ? '<strong style="color:#b32d2e">не ушло</strong>' : '—');
    }
}
add_action('manage_invit_lead_posts_custom_column', 'invit_lead_column', 10, 2);

/* Карточка заявки: все поля только для чтения */
function invit_lead_meta_box() {
    add_meta_box('invit_lead_details', 'Данные заявки', 'invit_lead_details', 'invit_lead', 'normal', 'high');
}
add_action('add_meta_boxes', 'invit_lead_meta_box');

function invit_lead_details($post) {
    echo '<table class="form-table" role="presentation"><tbody>';
    echo '<tr><th scope="row">Тип</th><td>', esc_html(get_post_meta($post->ID, '_invit_lead_kind', true)), '</td></tr>';
    foreach (invit_lead_fields() as $key => $label) {
        $value = (string) get_post_meta($post->ID, '_invit_lead_' . $key, true);
        if ($value === '') $html = '—';
        elseif ($key === 'phone') $html = '<a href="' . esc_attr(invit_tel_href($value)) . '">' . esc_html($value) . '</a>';
        elseif ($key === 'email') $html = '<a href="mailto:' . esc_attr($value) . '">' . esc_html($value) . '</a>';
        elseif ($key === 'source' && wp_http_validate_url($value)) $html = '<a href="' . esc_url($value) . '" target="_blank" rel="noopener">' . esc_html($value) . '</a>';
        else $html = nl2br(esc_html($value));
        echo '<tr><th scope="row">', esc_html($label), '</th><td>', $html, '</td></tr>';
    }
    $mail = get_post_meta($post->ID, '_invit_lead_mail', true);
    echo '<tr><th scope="row">Письмо на ', esc_html(invit_company('email')), '</th><td>',
        $mail === 'sent' ? 'отправлено' : ($mail === 'failed' ? 'не ушло' : '—'), '</td></tr>';
    echo '</tbody></table>';
}
