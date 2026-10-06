<?php
/**
 * Заявка на счёт — перенос src/pages/CartPage.tsx: позиции слева, реквизиты
 * справа. Цен нет: объём считает менеджер. Отправка превращает заявку в заказ
 * WooCommerce (inc/forms.php, invit_handle_order).
 */

if (!defined('ABSPATH')) exit;

$lines = [];
foreach (WC()->cart->get_cart() as $key => $line) {
    $item = invit_catalog_item_by_id($line['product_id']);
    if ($item) $lines[] = ['key' => $key, 'item' => $item, 'qty' => (int) $line['quantity']];
}
$count = count($lines);
$total = array_sum(array_column($lines, 'qty'));
invit_prime_images(array_column($lines, 'item'));

$sent = isset($_GET['sent']) && $_GET['sent'] === '1' && !$count;
$field = 'w-full min-h-11 px-3 bg-white border rounded-[4px] text-sm text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue';
$label = 'block text-xs font-semibold text-inv-ink mb-1.5';
$focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';
$summary = $count ? $count . ' ' . invit_plural($count, ['позиция', 'позиции', 'позиций']) . ', всего ' . $total . ' ед.' : 'Здесь появятся позиции, которые вы отметите в каталоге.';
?>
<div data-cart-page>

<section data-cart-done class="bg-white" <?php echo $sent ? '' : 'hidden'; ?>>
    <div class="max-w-[1340px] mx-auto px-5 py-20 sm:py-28 text-center">
        <?php echo invit_icon('check-circle-2', 'w-14 h-14 text-inv-blue mx-auto'); ?>
        <h1 class="mt-5 text-2xl sm:text-3xl font-semibold text-inv-ink">Заявка на получение счёта успешно отправлена</h1>
        <p class="mt-4 text-sm sm:text-base text-inv-ink-muted leading-relaxed max-w-xl mx-auto">
            Наши менеджеры уже проверяют наличие товара на складе и корректность
            указанного УНП. Счёт-фактура для безналичного расчёта будет выслан на ваш
            Email в течение 30 минут (в рабочее время).
        </p>
        <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="inline-flex items-center gap-2 min-h-11 px-6 mt-8 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer <?php echo $focus; ?>">
            <?php echo invit_icon('arrow-left', 'w-4 h-4'); ?>
            Вернуться в каталог
        </a>
    </div>
</section>

<div data-cart-main <?php echo $sent ? 'hidden' : ''; ?>>
    <?php get_template_part('template-parts/breadcrumbs', null, ['items' => [['label' => 'Заявка на счёт']]]); ?>

    <section class="bg-inv-deep text-white">
        <div class="max-w-[1340px] mx-auto px-5 py-8 sm:py-12">
            <h1 class="text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">Заявка на счёт</h1>
            <p class="mt-3 text-sm sm:text-base text-white/70" data-cart-summary><?php echo esc_html($summary); ?></p>
        </div>
    </section>

    <section class="bg-white">
        <div class="max-w-[1340px] mx-auto px-5 py-8 sm:py-12">
            <div data-cart-empty class="py-16 text-center rounded-[8px] border border-inv-border bg-inv-surface-1" <?php echo $count ? 'hidden' : ''; ?>>
                <?php echo invit_icon('shopping-cart', 'w-12 h-12 text-inv-ink-muted/50 mx-auto'); ?>
                <h2 class="mt-4 text-base font-semibold text-inv-ink">Заявка пока пуста</h2>
                <p class="mt-2 text-sm text-inv-ink-muted max-w-sm mx-auto leading-relaxed">
                    Нажмите «В заявку» в каталоге, чтобы собрать список нужных материалов.
                    Нужные размеры и объём укажите в комментарии к заявке.
                </p>
                <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="inline-flex items-center gap-2 min-h-11 px-6 mt-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer <?php echo $focus; ?>">
                    Перейти в каталог
                </a>
            </div>

            <?php if ($count) : ?>
                <div data-cart-filled class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                    <div class="lg:col-span-7 xl:col-span-8">
                        <div class="divide-y divide-inv-border border border-inv-border rounded-[8px] overflow-hidden">
                            <?php foreach ($lines as $line) :
                                $item = $line['item'];
                                $url = invit_item_url($item);
                                $title = $item[INVIT_I_TITLE];
                                ?>
                                <div data-cart-line="<?php echo esc_attr($line['key']); ?>" class="p-4 flex flex-wrap sm:flex-nowrap items-center gap-4">
                                    <a href="<?php echo esc_url($url); ?>" class="shrink-0 <?php echo $focus; ?>">
                                        <img src="<?php echo esc_url(invit_item_image($item)); ?>" alt="<?php echo esc_attr($title); ?>" loading="lazy" class="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white rounded-[4px] border border-inv-border-subtle p-1.5">
                                    </a>

                                    <div class="flex-1 min-w-[160px]">
                                        <a href="<?php echo esc_url($url); ?>" class="inline-block min-h-11 sm:min-h-0 text-sm font-semibold text-inv-ink leading-snug hover:text-inv-blue transition-colors <?php echo $focus; ?>"><?php echo esc_html($title); ?></a>
                                    </div>

                                    <div class="flex items-center rounded-[4px] border border-inv-border overflow-hidden shrink-0">
                                        <button type="button" data-line-step="-1" aria-label="<?php echo esc_attr('Убавить: ' . $title); ?>" <?php disabled($line['qty'] <= 1); ?> class="flex items-center justify-center w-11 h-11 text-inv-ink hover:bg-inv-surface-1 disabled:opacity-40 disabled:cursor-default transition-colors cursor-pointer">
                                            <?php echo invit_icon('minus', 'w-4 h-4'); ?>
                                        </button>
                                        <input type="number" min="1" value="<?php echo (int) $line['qty']; ?>" data-line-qty aria-label="<?php echo esc_attr('Количество: ' . $title); ?>" class="w-14 h-11 text-center text-sm font-semibold text-inv-ink border-x border-inv-border tabular-nums focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue">
                                        <button type="button" data-line-step="1" aria-label="<?php echo esc_attr('Прибавить: ' . $title); ?>" class="flex items-center justify-center w-11 h-11 text-inv-ink hover:bg-inv-surface-1 transition-colors cursor-pointer">
                                            <?php echo invit_icon('plus', 'w-4 h-4'); ?>
                                        </button>
                                    </div>

                                    <?php /* Единица своя у каждой позиции: крепёж отгружают коробами */ ?>
                                    <span class="text-xs text-inv-ink-muted whitespace-nowrap"><?php echo esc_html(invit_item_unit($item)['short']); ?></span>

                                    <button type="button" data-line-remove aria-label="<?php echo esc_attr('Убрать: ' . $title); ?>" class="flex items-center justify-center w-11 h-11 shrink-0 rounded-[4px] text-inv-ink-muted hover:text-inv-red hover:bg-inv-surface-1 transition-colors cursor-pointer">
                                        <?php echo invit_icon('trash-2', 'w-4 h-4'); ?>
                                    </button>
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors <?php echo $focus; ?>">
                                <?php echo invit_icon('arrow-left', 'w-4 h-4'); ?>
                                Продолжить выбор
                            </a>

                            <span data-clear-confirm hidden class="flex items-center gap-2 text-sm">
                                <span class="text-inv-ink-muted">Удалить все позиции?</span>
                                <button type="button" data-clear-yes class="inline-flex items-center min-h-11 px-4 rounded-[4px] bg-inv-red hover:brightness-95 text-white font-semibold transition-[filter] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-red">Да, удалить</button>
                                <button type="button" data-clear-no class="inline-flex items-center min-h-11 px-3 text-inv-ink-muted hover:text-inv-ink transition-colors cursor-pointer">Отмена</button>
                            </span>
                            <button type="button" data-clear class="inline-flex items-center gap-2 min-h-11 px-4 rounded-[4px] border border-inv-border text-sm font-semibold text-inv-ink-muted hover:text-inv-red hover:border-inv-red transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-red">
                                <?php echo invit_icon('trash-2', 'w-4 h-4'); ?>
                                Очистить заявку
                            </button>
                        </div>
                    </div>

                    <form data-order-form novalidate method="post" action="<?php echo esc_url(add_query_arg('wc-ajax', 'invit_order', home_url('/'))); ?>" class="lg:col-span-5 xl:col-span-4 rounded-[8px] border border-inv-border bg-inv-surface-1 p-5 sm:p-6 space-y-4">
                        <?php wp_nonce_field('invit_form', 'invit_nonce', false); ?>
                        <h2 class="text-lg font-semibold text-inv-ink">Заявка на счёт-фактуру</h2>

                        <dl class="text-sm space-y-1.5">
                            <div class="flex justify-between gap-4">
                                <dt class="text-inv-ink-muted">Позиций</dt>
                                <dd class="font-semibold text-inv-ink tabular-nums" data-cart-lines><?php echo (int) $count; ?></dd>
                            </div>
                            <div class="flex justify-between gap-4">
                                <dt class="text-inv-ink-muted">Всего единиц</dt>
                                <dd class="font-semibold text-inv-ink tabular-nums" data-cart-units><?php echo (int) $total; ?></dd>
                            </div>
                        </dl>

                        <?php /* Реквизиты — те, без которых счёт не выписать */ ?>
                        <div class="space-y-3 pt-1">
                            <?php
                            $fields = [
                                ['company', 'zayavka-org', 'Наименование организации / ИП', true, 'text', 'ООО «Вектор» или ИП Иванов И. И.', ''],
                                ['unp', 'zayavka-unp', 'УНП', true, 'text', '9 цифр', 'inputmode="numeric" maxlength="9"'],
                                ['person', 'zayavka-person', 'Контактное лицо (ФИО)', true, 'text', 'Иванов Иван Иванович', ''],
                                ['email', 'zayavka-email', 'Email для отправки счёта', true, 'email', 'buh@company.by', 'inputmode="email"'],
                                ['phone', 'zayavka-phone', 'Номер телефона', true, 'tel', '+375 29 000-00-00', 'inputmode="tel"'],
                                ['address', 'zayavka-address', 'Юридический адрес', false, 'text', 'Необязательно', ''],
                            ];
                            foreach ($fields as [$name, $id, $title, $required, $type, $placeholder, $extra]) : ?>
                                <div>
                                    <label for="<?php echo esc_attr($id); ?>" class="<?php echo $label; ?>">
                                        <?php echo esc_html($title); ?><?php if ($required) : ?> <span class="text-inv-error">*</span><?php endif; ?>
                                    </label>
                                    <input id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr($name); ?>" type="<?php echo esc_attr($type); ?>" placeholder="<?php echo esc_attr($placeholder); ?>" <?php echo $extra; ?> class="<?php echo $field; ?> <?php echo $name === 'unp' ? 'tabular-nums ' : ''; ?>border-inv-border">
                                    <?php if ($required) : ?>
                                        <p data-error-for="<?php echo esc_attr($name); ?>" hidden class="mt-1.5 flex items-center gap-1.5 text-xs text-inv-error"></p>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>

                            <div>
                                <label for="zayavka-note" class="<?php echo $label; ?>">Комментарий к заявке</label>
                                <textarea id="zayavka-note" name="note" rows="3" placeholder="Сроки, доставка, нетиповые размеры" class="<?php echo $field; ?> border-inv-border py-2.5 resize-y"></textarea>
                            </div>
                        </div>

                        <?php /* Оговорка стоит перед кнопкой: её читают там, где решают отправить */ ?>
                        <div class="rounded-[4px] border border-inv-border bg-white p-4">
                            <p class="text-xs font-semibold text-inv-ink">Важная информация для клиентов</p>
                            <p class="mt-1.5 text-xs leading-relaxed text-inv-ink-muted">
                                Сайт носит исключительно информационный характер, не является
                                интернет-магазином и публичной офертой. Продажа товаров физическим
                                лицам (розничная торговля) не осуществляется.
                            </p>
                            <p class="mt-2 text-xs leading-relaxed text-inv-ink-muted">
                                Оформляя данную заявку, вы подтверждаете, что являетесь юридическим
                                лицом или индивидуальным предпринимателем. На основании
                                предоставленных данных вам будет сформирован и выслан счёт-фактура
                                для безналичной оплаты.
                            </p>
                        </div>

                        <label class="flex gap-2.5 items-start cursor-pointer">
                            <input type="checkbox" name="agree" value="1" data-agree class="mt-0.5 w-4 h-4 shrink-0 accent-inv-blue cursor-pointer">
                            <span class="text-xs leading-relaxed text-inv-ink">
                                Я подтверждаю, что оформляю заказ от имени юридического лица (ИП), и
                                даю согласие на обработку персональных данных в целях формирования
                                индивидуального счёта-фактуры.
                            </span>
                        </label>

                        <button type="submit" disabled class="w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer disabled:bg-inv-border disabled:text-inv-ink-muted disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                            <?php echo invit_icon('send', 'w-4 h-4'); ?>
                            Получить счёт-фактуру
                        </button>
                        <p data-form-error hidden role="alert" class="flex items-center gap-1.5 text-xs text-inv-error"></p>

                        <p class="text-xs text-inv-ink-muted leading-relaxed">
                            Нужные размеры и объём напишите в комментарии — менеджер посчитает и
                            пришлёт счёт. Нетиповые размеры считаем отдельно.
                        </p>
                    </form>
                </div>
            <?php endif; ?>
        </div>
    </section>
</div>

</div>
