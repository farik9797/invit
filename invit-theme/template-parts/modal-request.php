<?php
/**
 * Окно «Запросить расчёт». Поля повторяют нынешнюю форму: имя, компания,
 * телефон и почта обязательны — по ним менеджер выставляет счёт.
 */

if (!defined('ABSPATH')) exit;

$field = 'w-full h-12 px-4 rounded-[4px] border border-inv-border bg-white text-base text-inv-ink '
    . 'placeholder:text-inv-ink-muted transition-[border-color] duration-[120ms] focus:border-inv-blue focus-visible:outline-none';
$label = 'block text-sm font-medium text-inv-ink';
?>
<div data-modal="request" hidden class="fixed inset-0 z-50 bg-inv-deep/55 backdrop-blur-sm">
    <div class="flex min-h-full items-start justify-center px-4 py-6 sm:py-[10vh]">
        <div role="dialog" aria-modal="true" aria-labelledby="request-title" class="relative w-full max-w-[560px] max-h-[calc(100dvh-3rem)] sm:max-h-[80vh] overflow-y-auto overscroll-contain rounded-[8px] bg-white shadow-[0_24px_60px_rgba(10,25,60,0.35)]">
            <button type="button" data-modal-close aria-label="Закрыть" class="absolute top-2 right-2 flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink-muted hover:text-inv-ink hover:bg-inv-surface-1 transition-colors cursor-pointer">
                <?php echo invit_icon('x', 'w-5 h-5'); ?>
            </button>

            <div class="px-5 pt-6 pb-6 sm:px-7 sm:pt-7">
                <h2 id="request-title" class="text-xl font-semibold text-inv-ink">Обратный звонок / консультация</h2>
                <p class="mt-2 text-sm text-inv-ink-muted">
                    Ответим по наличию, ценам и срокам. Нетиповую ширину и длину ленты считаем отдельно.
                </p>

                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="mt-5 space-y-4">
                    <input type="hidden" name="action" value="invit_request">
                    <?php wp_nonce_field('invit_request', 'invit_request_nonce'); ?>
                    <input type="hidden" name="source" value="<?php echo esc_attr(home_url(add_query_arg([]))); ?>">
                    <?php /* Ловушка для роботов: живой человек поле не видит и не заполняет. */ ?>
                    <p class="hidden" aria-hidden="true">
                        <label>Не заполняйте это поле <input type="text" name="invit_website" tabindex="-1" autocomplete="off"></label>
                    </p>

                    <div>
                        <label class="<?php echo esc_attr($label); ?>" for="request-name">Ваше имя <span class="text-inv-red">*</span></label>
                        <input id="request-name" name="name" type="text" required class="mt-1.5 <?php echo esc_attr($field); ?>" placeholder="Иван Иванов">
                    </div>

                    <div>
                        <label class="<?php echo esc_attr($label); ?>" for="request-company">Компания <span class="text-inv-red">*</span></label>
                        <input id="request-company" name="company" type="text" required class="mt-1.5 <?php echo esc_attr($field); ?>" placeholder="ООО «Вектор» или ИП Иванов И. И.">
                    </div>

                    <div>
                        <label class="<?php echo esc_attr($label); ?>" for="request-phone">Номер телефона <span class="text-inv-red">*</span></label>
                        <input id="request-phone" name="phone" type="tel" required class="mt-1.5 <?php echo esc_attr($field); ?>" placeholder="+375 29 000-00-00">
                    </div>

                    <div>
                        <label class="<?php echo esc_attr($label); ?>" for="request-email">Email <span class="text-inv-red">*</span></label>
                        <input id="request-email" name="email" type="email" required class="mt-1.5 <?php echo esc_attr($field); ?>" placeholder="zakupki@company.by">
                    </div>

                    <div>
                        <label class="<?php echo esc_attr($label); ?>" for="request-comment">Комментарий / запрос</label>
                        <textarea id="request-comment" name="comment" rows="3" class="mt-1.5 w-full px-4 py-3 rounded-[4px] border border-inv-border bg-white text-base text-inv-ink placeholder:text-inv-ink-muted focus:border-inv-blue focus-visible:outline-none" placeholder="Нужна лента ПСУЛ 20×10, 300 м"></textarea>
                    </div>

                    <button type="submit" class="w-full inline-flex items-center justify-center gap-2 min-h-11 h-12 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover active:scale-[0.99] text-white text-sm font-semibold transition-[background-color,transform] duration-[120ms] cursor-pointer">
                        Отправить запрос
                    </button>

                    <p class="text-xs leading-relaxed text-inv-ink-muted">
                        Отправляя форму, вы соглашаетесь на обработку персональных данных.
                        Работаем с юридическими лицами и ИП: розничной продажи нет.
                    </p>
                </form>
            </div>
        </div>
    </div>
</div>
