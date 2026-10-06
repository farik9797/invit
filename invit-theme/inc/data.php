<?php
/**
 * Данные React-сайта, которые тема показывает как есть: разделы с группами и
 * описаниями, знаки разделов, новости, документы, реквизиты, подробные описания
 * товаров. Файл data/site.json собирает scripts/build-theme-data.sh из src/ —
 * правки вносятся там, иначе два сайта разойдутся.
 */

if (!defined('ABSPATH')) exit;

/** Весь site.json или один его ключ. */
function invit_data($key = null) {
    static $data = null;
    if ($data === null) {
        $file = get_template_directory() . '/data/site.json';
        $data = is_readable($file) ? json_decode(file_get_contents($file), true) : [];
        if (!is_array($data)) $data = [];
    }
    return $key === null ? $data : ($data[$key] ?? []);
}

/** Адрес файла темы: картинки, документы. */
function invit_asset($path) {
    return get_template_directory_uri() . '/assets/' . ltrim($path, '/');
}

/** Реквизиты ООО «ИНВИТ» — один источник с React-сайтом (src/data/company.ts). */
function invit_company($key = null) {
    $company = invit_data('company');
    return $key === null ? $company : ($company[$key] ?? '');
}

/** Телефон для ссылки tel: — только цифры и плюс. */
function invit_tel_href($phone) {
    return 'tel:' . preg_replace('/[^\d+]/', '', $phone);
}

/** Русское склонение: invit_plural(5, ['позиция', 'позиции', 'позиций']). */
function invit_plural($n, array $forms) {
    $n = abs((int) $n);
    $mod100 = $n % 100;
    if ($mod100 >= 11 && $mod100 <= 14) return $forms[2];
    $mod10 = $n % 10;
    if ($mod10 === 1) return $forms[0];
    if ($mod10 >= 2 && $mod10 <= 4) return $forms[1];
    return $forms[2];
}

/** Разделы каталога в порядке React-сайта. */
function invit_sections() {
    return invit_data('categories');
}

function invit_section($slug) {
    foreach (invit_sections() as $section) {
        if ($section['slug'] === $slug) return $section;
    }
    return null;
}

/** Раздел, которому принадлежит подраздел. */
function invit_section_of_sub($sub_slug) {
    static $map = null;
    if ($map === null) {
        $map = [];
        foreach (invit_sections() as $section) {
            foreach ($section['subcategories'] as $sub) $map[$sub['slug']] = $section['slug'];
        }
    }
    return $map[$sub_slug] ?? '';
}

function invit_sub_name($sub_slug) {
    static $map = null;
    if ($map === null) {
        $map = [];
        foreach (invit_sections() as $section) {
            foreach ($section['subcategories'] as $sub) $map[$sub['slug']] = $sub['name'];
        }
    }
    return $map[$sub_slug] ?? '';
}

/** Адреса страниц — те же, что у React-сайта, только без префикса /invit/. */
function invit_url_catalog(array $query = []) {
    $url = home_url('/catalog/');
    return $query ? add_query_arg(array_map('rawurlencode', $query), $url) : $url;
}

function invit_url_category($slug, array $query = []) {
    $url = home_url('/catalog/' . $slug . '/');
    return $query ? add_query_arg(array_map('rawurlencode', $query), $url) : $url;
}

function invit_url_sub($sub_slug) {
    return invit_url_category(invit_section_of_sub($sub_slug), ['sub' => $sub_slug]);
}

/*
 * Кнопки из Chrome.tsx. Правило радиусов на всём сайте: кнопки и поля 4px,
 * карточки и фото 8px. shine — блик при наведении (source.css).
 */
function invit_button_base() {
    return 'inline-flex items-center justify-center min-h-11 px-6 rounded-[4px] text-sm font-semibold whitespace-nowrap cursor-pointer transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2';
}

function invit_blue_button($extra = '') {
    return trim(invit_button_base() . ' shine bg-inv-blue text-white hover:bg-inv-blue-hover active:bg-inv-blue-pressed focus-visible:outline-inv-blue ' . $extra);
}

/** Та же кнопка на тёмной подложке: синяя там сливается с фоном. */
function invit_white_button($extra = '') {
    return trim(invit_button_base() . ' bg-white text-inv-deep hover:bg-inv-surface-2 focus-visible:outline-white ' . $extra);
}

/** Координаты офисов (AddressMap.tsx): найдены геокодером по адресам клиента. */
function invit_office_coords($office) {
    $coords = [
        'minsk' => ['lat' => 53.8356976, 'lon' => 27.5052139],
        'soligorsk' => ['lat' => 52.7942092, 'lon' => 27.5370123],
    ];
    return $coords[$office];
}
