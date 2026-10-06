<?php
/**
 * Plugin Name: ИНВИТ — импорт каталога
 * Description: Заливает каталог EUROBAND из CSV (scripts/export-woocommerce.py) в WooCommerce: латинские адреса товаров и разделов, бренд и страна, снимки. Работает порциями из админки — консоль сервера не нужна.
 * Version: 1.0.0
 * Requires PHP: 8.0
 * Author: ООО «ИНВИТ»
 * Text Domain: invit-import
 */

if (!defined('ABSPATH')) exit;

require_once __DIR__ . '/includes/importer.php';

/*
 * Импорт в два прохода. Сначала товары без снимков — каталог появляется за
 * минуты. Потом снимки: каждый качается по ссылке и режется на размеры, это
 * долго, но сайт уже работает. Каждый запрос трудится не дольше BUDGET секунд,
 * так что лимит времени хостинга не мешает, а закрытая вкладка не теряет место:
 * позиция хранится в базе и импорт продолжается с неё.
 */
const INVIT_IMPORT_BUDGET = 15;
const INVIT_IMPORT_STATE = 'invit_import_state';

function invit_import_files() {
    $files = glob(__DIR__ . '/data/invit-products-*.csv') ?: [];
    sort($files);
    return $files;
}

function invit_import_state() {
    $state = get_option(INVIT_IMPORT_STATE);
    if (!is_array($state)) {
        $state = [
            'stage'    => 'products',
            'file'     => 0,
            'offset'   => 0,
            'created'  => 0,
            'updated'  => 0,
            'failed'   => 0,
            'images'   => 0,
            'skipped'  => 0,
            'finished' => false,
        ];
    }
    return $state;
}

/** Сколько строк всего во всех файлах — для полосы прогресса. */
function invit_import_total() {
    $total = get_transient('invit_import_total');
    if ($total !== false) return (int) $total;

    $total = 0;
    foreach (invit_import_files() as $file) {
        $handle = fopen($file, 'r');
        fgetcsv($handle);
        while (fgetcsv($handle) !== false) $total++;
        fclose($handle);
    }
    set_transient('invit_import_total', $total, DAY_IN_SECONDS);
    return $total;
}

/** Строки файла с позиции offset; заголовок CSV снимается с BOM. */
function invit_import_rows($file, $offset) {
    $handle = fopen($file, 'r');
    $columns = fgetcsv($handle);
    if ($columns && isset($columns[0])) {
        $columns[0] = preg_replace('/^\xEF\xBB\xBF/', '', $columns[0]);
    }

    $index = 0;
    while (($line = fgetcsv($handle)) !== false) {
        if ($index++ < $offset) continue;
        $row = @array_combine($columns, $line);
        yield $row ?: [];
    }
    fclose($handle);
}

function invit_import_step() {
    check_ajax_referer('invit_import');
    if (!current_user_can('manage_woocommerce')) {
        wp_send_json_error('Нет прав', 403);
    }

    @set_time_limit(INVIT_IMPORT_BUDGET + 30);
    wp_defer_term_counting(true);

    $state = invit_import_state();
    $files = invit_import_files();
    $started = microtime(true);

    while (!$state['finished'] && (microtime(true) - $started) < INVIT_IMPORT_BUDGET) {
        if (!isset($files[$state['file']])) {
            if ($state['stage'] === 'products') {
                // Товары заведены — второй проход за снимками с начала.
                $state['stage'] = 'images';
                $state['file'] = 0;
                $state['offset'] = 0;
                continue;
            }
            $state['finished'] = true;
            break;
        }

        $advanced = false;
        foreach (invit_import_rows($files[$state['file']], $state['offset']) as $row) {
            if ($state['stage'] === 'products') {
                $result = invit_import_row($row, false);
                $state[$result === 'failed' ? 'failed' : $result]++;
            } else {
                $result = invit_import_image_row($row);
                if ($result === 'attached') $state['images']++;
                if ($result === 'skipped') $state['skipped']++;
                if ($result === 'failed') $state['failed']++;
            }
            $state['offset']++;
            $advanced = true;

            if ((microtime(true) - $started) >= INVIT_IMPORT_BUDGET) break;
        }

        // Файл дочитан до конца — следующий.
        if (!$advanced || (microtime(true) - $started) < INVIT_IMPORT_BUDGET) {
            $state['file']++;
            $state['offset'] = 0;
        }
    }

    wp_defer_term_counting(false);
    update_option(INVIT_IMPORT_STATE, $state, false);

    $total = invit_import_total();
    $done = 0;
    foreach (array_slice($files, 0, $state['file']) as $file) {
        $done += max(0, count(file($file)) - 1);
    }
    $done += $state['offset'];

    wp_send_json_success([
        'state' => $state,
        'total' => $total,
        'done'  => min($done, $total),
    ]);
}
add_action('wp_ajax_invit_import_step', 'invit_import_step');

function invit_import_reset() {
    check_ajax_referer('invit_import');
    if (!current_user_can('manage_woocommerce')) {
        wp_send_json_error('Нет прав', 403);
    }
    delete_option(INVIT_IMPORT_STATE);
    delete_transient('invit_import_total');
    wp_send_json_success();
}
add_action('wp_ajax_invit_import_reset', 'invit_import_reset');

function invit_import_menu() {
    add_management_page('Импорт каталога ИНВИТ', 'Импорт каталога', 'manage_woocommerce', 'invit-import', 'invit_import_screen');
}
add_action('admin_menu', 'invit_import_menu');

function invit_import_screen() {
    $state = invit_import_state();
    $files = invit_import_files();
    ?>
    <div class="wrap">
        <h1>Импорт каталога ИНВИТ</h1>

        <p>
            Файлов с товарами: <strong><?php echo count($files); ?></strong>,
            позиций: <strong><?php echo esc_html(invit_import_total()); ?></strong>.
            Сначала заводятся товары без снимков — каталог появится быстро, затем
            подтягиваются снимки. Вкладку можно закрыть: импорт продолжится с того же
            места, когда вы снова нажмёте «Продолжить».
        </p>

        <p>
            <button type="button" class="button button-primary button-hero" id="invit-import-start">
                <?php echo $state['finished'] ? 'Импорт завершён' : ($state['created'] || $state['images'] ? 'Продолжить импорт' : 'Начать импорт'); ?>
            </button>
            <button type="button" class="button" id="invit-import-reset">Начать заново</button>
        </p>

        <div style="max-width:640px;background:#fff;border:1px solid #c3c4c7;border-radius:4px;padding:16px;margin-top:12px">
            <p style="margin-top:0"><strong id="invit-import-stage">—</strong></p>
            <div style="height:12px;background:#f0f0f1;border-radius:6px;overflow:hidden">
                <div id="invit-import-bar" style="height:100%;width:0;background:#3f5b9e;transition:width .3s"></div>
            </div>
            <p id="invit-import-numbers" style="margin-bottom:0;color:#50575e"></p>
        </div>
    </div>

    <script>
    (function () {
        var nonce = <?php echo wp_json_encode(wp_create_nonce('invit_import')); ?>;
        var ajax = <?php echo wp_json_encode(admin_url('admin-ajax.php')); ?>;
        var running = false;
        var stageEl = document.getElementById('invit-import-stage');
        var bar = document.getElementById('invit-import-bar');
        var numbers = document.getElementById('invit-import-numbers');
        var start = document.getElementById('invit-import-start');

        function show(data) {
            var s = data.state;
            var pct = data.total ? Math.round(data.done / data.total * 100) : 0;
            stageEl.textContent = s.finished ? 'Готово'
                : (s.stage === 'products' ? 'Шаг 1 из 2: товары — ' : 'Шаг 2 из 2: снимки — ') + pct + '%';
            bar.style.width = (s.finished ? 100 : pct) + '%';
            numbers.textContent = 'Заведено ' + s.created + ', обновлено ' + s.updated
                + ', снимков ' + s.images + ', ошибок ' + s.failed;
        }

        function step() {
            var body = new FormData();
            body.append('action', 'invit_import_step');
            body.append('_ajax_nonce', nonce);
            fetch(ajax, { method: 'POST', body: body, credentials: 'same-origin' })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    if (!res.success) throw new Error(res.data || 'ошибка');
                    show(res.data);
                    if (!res.data.state.finished && running) step();
                    else { running = false; start.disabled = false; start.textContent = 'Импорт завершён'; }
                })
                .catch(function (e) {
                    // Сеть или хостинг споткнулись — пробуем ещё раз через паузу.
                    stageEl.textContent = 'Пауза: ' + e.message + '. Повтор через 10 секунд…';
                    if (running) setTimeout(step, 10000);
                });
        }

        start.addEventListener('click', function () {
            if (running) return;
            running = true;
            start.disabled = true;
            start.textContent = 'Идёт импорт…';
            step();
        });

        document.getElementById('invit-import-reset').addEventListener('click', function () {
            if (!confirm('Сбросить позицию импорта и пройти все файлы заново? Товары не удаляются — повторный проход их обновит.')) return;
            var body = new FormData();
            body.append('action', 'invit_import_reset');
            body.append('_ajax_nonce', nonce);
            fetch(ajax, { method: 'POST', body: body, credentials: 'same-origin' }).then(function () { location.reload(); });
        });
    })();
    </script>
    <?php
}
