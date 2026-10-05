<?php
/**
 * Иконки темы — набор Lucide (lucide.dev, ISC), скопирован из пакета
 * lucide-react, на котором собран нынешний сайт. Рисовать пути руками нельзя:
 * любой новый значок добавляется сюда копией из набора.
 */

if (!defined('ABSPATH')) exit;

/** Содержимое <svg> по имени значка Lucide. */
function invit_icon_body($name) {
    $icons = [
    'phone' => '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />',
    'search' => '<path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />',
    'shopping-cart' => '<circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />',
    'menu' => '<path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" />',
    'x' => '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
    'chevron-right' => '<path d="m9 18 6-6-6-6" />',
    'chevron-down' => '<path d="m6 9 6 6 6-6" />',
    'arrow-right' => '<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />',
    'arrow-down' => '<path d="M12 5v14" /><path d="m19 12-7 7-7-7" />',
    'mail' => '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" />',
    'map-pin' => '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />',
    'clock' => '<path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" />',
    'file-text' => '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />',
    'check' => '<path d="M20 6 9 17l-5-5" />',
    'plus' => '<path d="M5 12h14" /><path d="M12 5v14" />',
    'minus' => '<path d="M5 12h14" />',
    'trash-2' => '<path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />',
    'send' => '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" />',
    'sliders-horizontal' => '<path d="M10 5H3" /><path d="M12 19H3" /><path d="M14 3v4" /><path d="M16 17v4" /><path d="M21 12h-9" /><path d="M21 19h-5" /><path d="M21 5h-7" /><path d="M8 10v4" /><path d="M8 12H3" />',
    'layers' => '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />',
    ];
    return $icons[$name] ?? '';
}

/**
 * Готовый <svg>. Цвет наследуется от текста (currentColor), размер задаётся
 * классами Tailwind на самом элементе.
 */
function invit_icon($name, $class = 'w-5 h-5') {
    $body = invit_icon_body($name);
    if ($body === '') return '';
    return sprintf(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        . 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%s" aria-hidden="true">%s</svg>',
        esc_attr($class),
        $body
    );
}

/** Список значков для выбора в ACF. */
function invit_icon_choices() {
    $names = array_keys([
    'phone' => '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />',
    'search' => '<path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />',
    'shopping-cart' => '<circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />',
    'menu' => '<path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" />',
    'x' => '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
    'chevron-right' => '<path d="m9 18 6-6-6-6" />',
    'chevron-down' => '<path d="m6 9 6 6 6-6" />',
    'arrow-right' => '<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />',
    'arrow-down' => '<path d="M12 5v14" /><path d="m19 12-7 7-7-7" />',
    'mail' => '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" />',
    'map-pin' => '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />',
    'clock' => '<path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" />',
    'file-text' => '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />',
    'check' => '<path d="M20 6 9 17l-5-5" />',
    'plus' => '<path d="M5 12h14" /><path d="M12 5v14" />',
    'minus' => '<path d="M5 12h14" />',
    'trash-2' => '<path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />',
    'send' => '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" />',
    'sliders-horizontal' => '<path d="M10 5H3" /><path d="M12 19H3" /><path d="M14 3v4" /><path d="M16 17v4" /><path d="M21 12h-9" /><path d="M21 19h-5" /><path d="M21 5h-7" /><path d="M8 10v4" /><path d="M8 12H3" />',
    'layers' => '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />',
    ]);
    return array_combine($names, $names);
}
