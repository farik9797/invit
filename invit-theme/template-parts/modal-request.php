<?php
/**
 * «Обратный звонок / консультация» — перенос src/components/Modals/CallbackModal.tsx.
 *
 * Метка «откуда открыли окно» (шапка, главная, карточка товара) уходит скрытым
 * полем source, а не в комментарий: там её видел посетитель и отправлял как
 * свой текст. Заявка уходит письмом на почту компании (inc/forms.php).
 */

if (!defined('ABSPATH')) exit;

$field = 'w-full p-2.5 bg-surface-soft border border-line rounded-[4px] text-ink font-medium';
?>
<div data-modal="callback" hidden class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
    <div class="relative bg-white rounded-xl max-w-md w-full shadow-lg border border-line overflow-hidden" data-modal-card>
        <div class="bg-brand-blue text-white p-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <?php echo invit_icon('phone-call', 'w-5 h-5 text-white'); ?>
                <span class="font-semibold text-sm uppercase tracking-wide">Обратный звонок / консультация</span>
            </div>
            <button type="button" data-modal-close aria-label="Закрыть" class="p-1 rounded-[4px] hover:bg-white/20 text-white transition-colors cursor-pointer">
                <?php echo invit_icon('x', 'w-5 h-5'); ?>
            </button>
        </div>

        <div class="p-6">
            <div data-form-done hidden class="py-6 text-center space-y-3">
                <?php echo invit_icon('check-circle-2', 'w-12 h-12 text-emerald-600 mx-auto'); ?>
                <h3 class="text-lg font-bold text-ink">Заявка принята!</h3>
                <p class="text-xs text-ink/70">Специалист ООО «ИНВИТ» перезвонит вам в течение 10 минут.</p>
                <button type="button" data-modal-close class="bg-brand-blue text-white font-bold text-xs px-4 py-2 rounded-[4px] cursor-pointer">Закрыть</button>
            </div>

            <form data-form="callback" class="space-y-4 text-xs" method="post" action="<?php echo esc_url(add_query_arg('wc-ajax', 'invit_request', home_url('/'))); ?>">
                <input type="hidden" name="kind" value="callback">
                <input type="hidden" name="source" value="" data-callback-source>
                <?php wp_nonce_field('invit_form', 'invit_nonce'); ?>
                <p class="hidden" aria-hidden="true"><label>Не заполняйте <input type="text" name="invit_website" tabindex="-1" autocomplete="off"></label></p>

                <p class="text-ink/70 text-xs leading-relaxed">
                    Оставьте контактный номер телефона для консультации по выбору лент EUROBAND и согласованию оптовых скидок.
                </p>

                <div>
                    <label class="block font-bold text-ink/80 mb-1">Ваше имя <span class="text-red-500">*</span></label>
                    <input type="text" name="name" required placeholder="Анатолий" class="<?php echo esc_attr($field); ?>">
                </div>

                <div>
                    <label class="block font-bold text-ink/80 mb-1">Компания <span class="text-red-500">*</span></label>
                    <input type="text" name="company" required placeholder="ООО «Вектор» или ИП Иванов И. И." class="<?php echo esc_attr($field); ?>">
                </div>

                <div>
                    <label class="block font-bold text-ink/80 mb-1">Номер телефона <span class="text-red-500">*</span></label>
                    <input type="tel" name="phone" required placeholder="+375 (29) 000-00-00" class="<?php echo esc_attr($field); ?> text-sm">
                </div>

                <div>
                    <label class="block font-bold text-ink/80 mb-1">Email <span class="text-red-500">*</span></label>
                    <input type="email" name="email" required placeholder="mail@company.by" class="<?php echo esc_attr($field); ?>">
                </div>

                <div>
                    <label class="block font-bold text-ink/80 mb-1">Комментарий / запрос</label>
                    <textarea name="task" rows="2" placeholder="Например: запросить прайс или консультацию по ПСУЛ…" class="<?php echo esc_attr($field); ?>"></textarea>
                </div>

                <button type="submit" class="w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3 px-4 rounded-[4px] shadow transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <?php echo invit_icon('send', 'w-4 h-4'); ?>
                    <span>Жду звонка инженера</span>
                </button>
                <p data-form-error hidden role="alert" class="flex items-center gap-1.5 text-xs text-inv-error"></p>
            </form>
        </div>
    </div>
</div>
