<?php
/**
 * Экран после отправки: что произошло и чего ждать. Слово «оплата» здесь не
 * звучит — счёт выставляет менеджер, сайт платежей не принимает.
 *
 * @var WC_Order $order
 */

if (!defined('ABSPATH')) exit;

$contacts = invit_contacts();
?>

<div class="max-w-[760px]">
    <?php if ($order) : ?>
        <div class="rounded-[8px] border border-inv-border bg-white p-6 sm:p-8">
            <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-inv-success/10 text-inv-success">
                <?php echo invit_icon('check', 'w-6 h-6'); ?>
            </span>

            <h2 class="mt-4 text-2xl font-semibold text-inv-ink">Заявка на счёт принята</h2>

            <p class="mt-3 text-base leading-[1.55] text-inv-ink-muted">
                Менеджер проверит наличие позиций и УНП, после чего пришлёт счёт-фактуру
                на указанную почту — в течение 30 минут в рабочее время.
            </p>

            <dl class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div class="rounded-[6px] border border-inv-border-subtle bg-inv-surface-1 px-4 py-3">
                    <dt class="text-inv-ink-muted">Номер заявки</dt>
                    <dd class="mt-1 font-semibold text-inv-ink"><?php echo esc_html($order->get_order_number()); ?></dd>
                </div>

                <div class="rounded-[6px] border border-inv-border-subtle bg-inv-surface-1 px-4 py-3">
                    <dt class="text-inv-ink-muted">Почта для счёта</dt>
                    <dd class="mt-1 font-semibold text-inv-ink break-words"><?php echo esc_html($order->get_billing_email()); ?></dd>
                </div>

                <?php if ($order->get_billing_company()) : ?>
                    <div class="rounded-[6px] border border-inv-border-subtle bg-inv-surface-1 px-4 py-3">
                        <dt class="text-inv-ink-muted">Организация</dt>
                        <dd class="mt-1 font-semibold text-inv-ink"><?php echo esc_html($order->get_billing_company()); ?></dd>
                    </div>
                <?php endif; ?>

                <?php $unp = get_post_meta($order->get_id(), '_billing_unp', true); ?>
                <?php if ($unp) : ?>
                    <div class="rounded-[6px] border border-inv-border-subtle bg-inv-surface-1 px-4 py-3">
                        <dt class="text-inv-ink-muted">УНП</dt>
                        <dd class="mt-1 font-semibold text-inv-ink"><?php echo esc_html($unp); ?></dd>
                    </div>
                <?php endif; ?>
            </dl>

            <p class="mt-6 text-sm text-inv-ink-muted">
                Что-то поправить в заявке — позвоните:
                <a href="tel:<?php echo esc_attr(invit_tel($contacts['phone_minsk'])); ?>" class="font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]"><?php echo esc_html($contacts['phone_minsk']); ?></a>
                (Минск) или
                <a href="tel:<?php echo esc_attr(invit_tel($contacts['phone_soligorsk'])); ?>" class="font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]"><?php echo esc_html($contacts['phone_soligorsk']); ?></a>
                (Солигорск).
            </p>

            <div class="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors duration-[120ms]">
                    Вернуться в каталог
                </a>
                <a href="<?php echo esc_url(home_url('/contacts/')); ?>" class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] border border-inv-border text-inv-ink text-sm font-semibold hover:border-inv-blue hover:text-inv-blue transition-colors duration-[120ms]">
                    Контакты
                </a>
            </div>
        </div>

        <h3 class="mt-10 text-lg font-semibold text-inv-ink">Что в заявке</h3>
        <div class="mt-4 [&_table]:w-full [&_table]:text-sm [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_th]:text-inv-ink-muted [&_td]:py-2 [&_td]:text-inv-ink [&_tfoot]:border-t [&_tfoot]:border-inv-border">
            <?php do_action('woocommerce_thankyou_' . $order->get_payment_method(), $order->get_id()); ?>
            <?php do_action('woocommerce_thankyou', $order->get_id()); ?>
        </div>
    <?php else : ?>
        <p class="text-base text-inv-ink-muted">Спасибо! Заявка принята.</p>
    <?php endif; ?>
</div>
