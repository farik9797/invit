<?php
/**
 * Импорт каталога в WooCommerce из CSV, который делает scripts/export-woocommerce.py.
 *
 * Встроенный импортёр Woo работает через админку и на общем хостинге часто
 * отваливается по памяти, поэтому тот же CSV заливаем из командной строки:
 *
 *     wp eval-file scripts/wp-import-products.php files/woocommerce-export/invit-products-01.csv
 *     wp eval-file scripts/wp-import-products.php <файл> no-images   # без снимков, быстрее
 *
 * Признак без дефисов: «--no-images» WP-CLI принимает за свой параметр и
 * отказывается запускать файл.
 *
 * Повторный запуск того же файла не плодит дубли: товар ищется по артикулу и
 * обновляется.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    exit("Запускать только через wp eval-file\n");
}

$args = $args ?? [];
$path = $args[0] ?? '';
$skip_images = in_array('no-images', $args, true);

if (!$path || !file_exists($path)) {
    WP_CLI::error('не найден CSV: ' . $path);
}

// Разбор строки — общий с плагином импорта (invit-import), чтобы логика
// жила в одном месте.
require_once dirname(__DIR__) . '/invit-import/includes/importer.php';

$handle = fopen($path, 'r');
$columns = fgetcsv($handle);
// CSV пишется с BOM, иначе Excel ломает кириллицу: снимаем его с первой колонки.
if ($columns && isset($columns[0])) {
    $columns[0] = preg_replace('/^\xEF\xBB\xBF/', '', $columns[0]);
}

$counts = ['created' => 0, 'updated' => 0, 'failed' => 0];

while (($line = fgetcsv($handle)) !== false) {
    $row = @array_combine($columns, $line);
    if (!$row || empty($row['Name'])) continue;

    $counts[invit_import_row($row, !$skip_images)]++;

    if ((($counts['created'] + $counts['updated']) % 100) === 0) {
        WP_CLI::log('обработано: ' . ($counts['created'] + $counts['updated']));
    }
}

fclose($handle);
WP_CLI::success("создано: {$counts['created']}, обновлено: {$counts['updated']}, пропущено: {$counts['failed']}");
