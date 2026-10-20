<?php
/**
 * 301 со старого invit.by на новые адреса — карта data/redirects.json,
 * её собирает scripts/build-redirects.py из утверждённой клиентом таблицы.
 * Срабатывает раньше, чем WordPress угадывает страницу по похожему адресу.
 * Неизвестный подадрес старой категории ведёт туда же, куда сама категория.
 */

if (!defined('ABSPATH')) exit;

function invit_old_redirects() {
    $file = get_template_directory() . '/data/redirects.json';
    if (!is_readable($file)) return;

    // WordPress экранирует $_SERVER: апостроф старых адресов приходит как «\'»
    $uri = wp_unslash((string) ($_SERVER['REQUEST_URI'] ?? ''));
    $path = mb_strtolower(trim(rawurldecode((string) parse_url($uri, PHP_URL_PATH))));
    if (mb_strlen($path) > 1) $path = rtrim($path, '/');
    $query = mb_strtolower(trim(rawurldecode((string) parse_url($uri, PHP_URL_QUERY))));

    $map = json_decode(file_get_contents($file), true);
    $target = $map['exact'][$path . ($query !== '' ? '?' . $query : '')] ?? $map['exact'][$path] ?? null;

    // Старый товар или подраздел, которого нет в таблице, — в его категорию
    if ($target === null && is_404()) {
        $best = '';
        foreach ($map['prefix'] as $prefix => $to) {
            if (str_starts_with($path, $prefix . '/') && strlen($prefix) > strlen($best)) $best = $prefix;
        }
        if ($best !== '') $target = $map['prefix'][$best];
    }

    // Уже на нужном адресе (/about/ при записи «/about» -> «/about/») — не зацикливаем
    if ($target === null || untrailingslashit($target) === untrailingslashit((string) parse_url($uri, PHP_URL_PATH))) return;

    wp_redirect(home_url($target), 301);
    exit;
}
add_action('template_redirect', 'invit_old_redirects', 1);
