<?php
/**
 * Форма запроса расчёта — перенос src/components/home-v2/RequestForm.tsx.
 * Одна на весь сайт: стоит на главной и на странице контактов. Проверка полей
 * та же, что в React (site.js), отправка — письмом на почту компании.
 *
 * @var array $args ['id' => префикс id полей]
 */

if (!defined('ABSPATH')) exit;

$prefix = $args['id'] ?? 'zayavka';
$id = static fn($field) => esc_attr($prefix . '-' . $field);
$field = 'w-full min-h-11 px-3 py-2.5 rounded-[4px] border bg-white text-base text-inv-ink placeholder:text-inv-ink-muted transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue';
$label = 'text-sm font-semibold text-inv-ink';
$error = 'flex items-center gap-1.5 text-sm text-inv-error';
?>
<div data-form-wrap>
    <div data-form-done hidden class="flex flex-col items-start gap-4 py-6">
        <span class="flex items-center justify-center w-11 h-11 rounded-full bg-inv-success/10">
            <?php echo invit_icon('check', 'w-6 h-6 text-inv-success'); ?>
        </span>
        <h3 class="text-xl font-semibold text-inv-ink">Заявка принята</h3>
        <p class="text-base text-inv-ink-muted max-w-[46ch]">
            Перезвоним в рабочее время: пн-чт с 9:00 до 17:30, пт с 9:00 до 16:00.
        </p>
        <button type="button" data-form-again class="min-h-11 text-sm font-semibold text-inv-blue cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
            Отправить ещё одну
        </button>
    </div>

    <form data-form="request" novalidate method="post" action="<?php echo esc_url(add_query_arg('wc-ajax', 'invit_request', home_url('/'))); ?>" class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <input type="hidden" name="kind" value="request">
        <input type="hidden" name="source" value="<?php echo esc_attr($prefix); ?>">
        <?php wp_nonce_field('invit_form', 'invit_nonce', false); ?>
        <p class="hidden" aria-hidden="true"><label>Не заполняйте <input type="text" name="invit_website" tabindex="-1" autocomplete="off"></label></p>

        <div class="flex flex-col gap-2">
            <label for="<?php echo $id('name'); ?>" class="<?php echo $label; ?>">Имя</label>
            <input id="<?php echo $id('name'); ?>" name="name" class="<?php echo $field; ?> border-inv-border">
            <p data-error-for="name" hidden class="<?php echo $error; ?>"></p>
        </div>

        <div class="flex flex-col gap-2">
            <label for="<?php echo $id('company'); ?>" class="<?php echo $label; ?>">Компания</label>
            <input id="<?php echo $id('company'); ?>" name="company" class="<?php echo $field; ?> border-inv-border">
            <p data-error-for="company" hidden class="<?php echo $error; ?>"></p>
        </div>

        <div class="flex flex-col gap-2">
            <label for="<?php echo $id('phone'); ?>" class="<?php echo $label; ?>">Телефон</label>
            <input id="<?php echo $id('phone'); ?>" name="phone" type="tel" inputmode="tel" aria-describedby="<?php echo $id('phone-hint'); ?>" class="<?php echo $field; ?> border-inv-border">
            <p data-error-for="phone" hidden class="<?php echo $error; ?>"></p>
            <p id="<?php echo $id('phone-hint'); ?>" data-hint-for="phone" class="text-sm text-inv-ink-muted">Например, +375 29 000-00-00</p>
        </div>

        <div class="flex flex-col gap-2">
            <label for="<?php echo $id('email'); ?>" class="<?php echo $label; ?>">Email</label>
            <input id="<?php echo $id('email'); ?>" name="email" type="email" inputmode="email" class="<?php echo $field; ?> border-inv-border">
            <p data-error-for="email" hidden class="<?php echo $error; ?>"></p>
        </div>

        <div class="flex flex-col gap-2 sm:col-span-2">
            <label for="<?php echo $id('task'); ?>" class="<?php echo $label; ?>">Что нужно</label>
            <textarea id="<?php echo $id('task'); ?>" name="task" rows="3" class="<?php echo $field; ?> border-inv-border resize-y"></textarea>
            <p class="text-sm text-inv-ink-muted">Тип ленты, ширина и толщина, объём в метрах или рулонах.</p>
        </div>

        <p class="sm:col-span-2 text-xs leading-relaxed text-inv-ink-muted">
            Сайт носит информационный характер, не является интернет-магазином и публичной
            офертой. Расчёт готовим для юридических лиц и индивидуальных предпринимателей;
            розничная продажа физическим лицам не ведётся.
        </p>

        <div class="sm:col-span-2">
            <button type="submit" class="inline-flex items-center justify-center w-full sm:w-auto min-h-11 px-8 rounded-[4px] bg-inv-blue text-white text-sm font-semibold cursor-pointer transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-inv-blue-hover active:bg-inv-blue-pressed active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                Запросить расчёт
            </button>
            <?php /* Сбой отправки: в React сервера не было, здесь он есть и может не ответить */ ?>
            <p data-form-error hidden role="alert" class="mt-3 flex items-center gap-1.5 text-sm text-inv-error"></p>
        </div>
    </form>
</div>
