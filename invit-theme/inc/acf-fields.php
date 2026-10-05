<?php
/**
 * Поля ACF Pro: глобальные настройки и содержимое главной страницы.
 * Значения по умолчанию в шаблонах повторяют нынешний сайт, поэтому страница
 * выглядит правильно ещё до того, как редактор что-то заполнит.
 */

if (!defined('ABSPATH')) exit;

add_action('acf/init', 'invit_register_acf_fields');

function invit_register_acf_fields() {
    if (!function_exists('acf_add_local_field_group')) return;

    invit_acf_options();
    invit_acf_home();
}

function invit_acf_options() {
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title' => 'Настройки сайта',
            'menu_title' => 'Настройки сайта',
            'menu_slug'  => 'invit-settings',
            'icon_url'   => 'dashicons-admin-generic',
            'position'   => 59,
        ]);
    }

    acf_add_local_field_group([
        'key'    => 'group_invit_options',
        'title'  => 'Контакты и подвал',
        'fields' => [
            ['key' => 'field_invit_phone_minsk', 'name' => 'phone_minsk', 'label' => 'Телефон, Минск', 'type' => 'text', 'default_value' => '+375 29 644-49-79'],
            ['key' => 'field_invit_phone_soligorsk', 'name' => 'phone_soligorsk', 'label' => 'Телефон, Солигорск', 'type' => 'text', 'default_value' => '+375 174 32-50-22'],
            ['key' => 'field_invit_email', 'name' => 'email', 'label' => 'Почта', 'type' => 'email', 'default_value' => 'info@invit.by'],
            ['key' => 'field_invit_telegram', 'name' => 'telegram', 'label' => 'Ссылка на Telegram', 'type' => 'url', 'default_value' => 'https://t.me/invitby'],
            ['key' => 'field_invit_footer_about', 'name' => 'footer_about', 'label' => 'Описание в подвале', 'type' => 'textarea', 'rows' => 3],
            [
                'key' => 'field_invit_requisites', 'name' => 'requisites', 'label' => 'Реквизиты в подвале',
                'type' => 'repeater', 'layout' => 'table', 'button_label' => 'Добавить строку',
                'sub_fields' => [
                    ['key' => 'field_invit_requisites_line', 'name' => 'line', 'label' => 'Строка', 'type' => 'text'],
                ],
            ],
            [
                'key' => 'field_invit_disclaimer', 'name' => 'disclaimer', 'label' => 'Оговорка на всех страницах',
                'type' => 'textarea', 'rows' => 3,
                'instructions' => 'Сайт не интернет-магазин и не публичная оферта: текст стоит в подвале каждой страницы.',
            ],
        ],
        'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'invit-settings']]],
    ]);
}

function invit_acf_home() {
    acf_add_local_field_group([
        'key'    => 'group_invit_home',
        'title'  => 'Главная страница',
        'fields' => [
            [
                'key' => 'field_invit_slides', 'name' => 'slides', 'label' => 'Слайды первого экрана',
                'type' => 'repeater', 'layout' => 'block', 'button_label' => 'Добавить слайд',
                'sub_fields' => [
                    ['key' => 'field_invit_slide_lead', 'name' => 'lead', 'label' => 'Заголовок', 'type' => 'text'],
                    ['key' => 'field_invit_slide_accent', 'name' => 'accent', 'label' => 'Окончание заголовка (с подчёркиванием)', 'type' => 'text'],
                    ['key' => 'field_invit_slide_text', 'name' => 'text', 'label' => 'Описание', 'type' => 'textarea', 'rows' => 4],
                    ['key' => 'field_invit_slide_image', 'name' => 'image', 'label' => 'Кадр', 'type' => 'image', 'return_format' => 'url', 'preview_size' => 'medium'],
                    ['key' => 'field_invit_slide_cta', 'name' => 'cta', 'label' => 'Подпись кнопки', 'type' => 'text'],
                    ['key' => 'field_invit_slide_url', 'name' => 'url', 'label' => 'Ссылка кнопки', 'type' => 'page_link', 'post_type' => ['page', 'product'], 'taxonomy' => ['product_cat'], 'allow_archives' => 1],
                ],
            ],
            [
                'key' => 'field_invit_benefits', 'name' => 'benefits', 'label' => 'Полоса преимуществ',
                'type' => 'repeater', 'layout' => 'block', 'button_label' => 'Добавить преимущество',
                'sub_fields' => [
                    ['key' => 'field_invit_benefit_image', 'name' => 'image', 'label' => 'Значок', 'type' => 'image', 'return_format' => 'url', 'preview_size' => 'thumbnail'],
                    ['key' => 'field_invit_benefit_title', 'name' => 'title', 'label' => 'Заголовок', 'type' => 'text'],
                    ['key' => 'field_invit_benefit_text', 'name' => 'text', 'label' => 'Текст', 'type' => 'textarea', 'rows' => 2],
                ],
            ],
            ['key' => 'field_invit_cats_title', 'name' => 'categories_title', 'label' => 'Заголовок блока категорий', 'type' => 'text', 'default_value' => 'Категории продукции'],
            ['key' => 'field_invit_cats_text', 'name' => 'categories_text', 'label' => 'Подзаголовок блока категорий', 'type' => 'textarea', 'rows' => 2],
            ['key' => 'field_invit_about_title', 'name' => 'about_title', 'label' => 'Заголовок блока о компании', 'type' => 'text'],
            ['key' => 'field_invit_about_text', 'name' => 'about_text', 'label' => 'Текст блока о компании', 'type' => 'wysiwyg', 'media_upload' => 0, 'tabs' => 'visual'],
            ['key' => 'field_invit_about_image', 'name' => 'about_image', 'label' => 'Кадр блока о компании', 'type' => 'image', 'return_format' => 'url'],
        ],
        'location' => [[['param' => 'page_type', 'operator' => '==', 'value' => 'front_page']]],
    ]);
}
