<?php
/**
 * Template Name: Контакты
 *
 * Телефоны, почта и два адреса с картами. Карты — виджеты Яндекса: сторонний
 * скрипт грузится только там, где он нужен.
 */

if (!defined('ABSPATH')) exit;

get_header();

$contacts = invit_contacts();
$lead = invit_field('lead', 'Ответим по наличию, ценам и срокам. Нетиповую ширину и длину ленты считаем отдельно.');

$offices = invit_field('offices', [
    [
        'city'    => 'Минск',
        'address' => '223056, Минский район, Сеницкий сельсовет, 84 (ТЦ «Сеница», офис 9)',
        'phones'  => "+375 29 644-49-79\n+375 17 388-05-50",
        'hours'   => 'Пн–Пт: 8:00 – 17:00',
        'map'     => 'https://yandex.by/map-widget/v1/?ll=27.5052139,53.8356976&z=16&pt=27.5052139,53.8356976',
    ],
    [
        'city'    => 'Солигорск',
        'address' => '223701, улица Строителей, 30, офис 101',
        'phones'  => "+375 174 32-50-22\n+375 174 25-22-25",
        'hours'   => 'Пн–Пт: 8:00 – 17:00',
        'map'     => 'https://yandex.by/map-widget/v1/?ll=27.5370123,52.7942092&z=16&pt=27.5370123,52.7942092',
    ],
]);
?>

<section class="bg-inv-deep text-white">
    <div class="max-w-[1340px] mx-auto px-5 py-10 sm:py-14">
        <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.1] max-w-3xl">
            <?php the_title(); ?>
        </h1>
        <p class="mt-4 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[60ch]">
            <?php echo esc_html($lead); ?>
        </p>

        <div class="mt-8 space-y-3">
            <a href="tel:<?php echo esc_attr(invit_tel($contacts['phone_minsk'])); ?>" class="flex items-center gap-3 min-h-11 text-xl sm:text-2xl font-semibold text-white hover:text-inv-on-deep transition-colors duration-[120ms]">
                <?php echo invit_icon('phone', 'w-5 h-5 text-inv-on-deep'); ?>
                <?php echo esc_html($contacts['phone_minsk']); ?>
                <span class="text-xs font-normal text-white/55">Минск</span>
            </a>

            <a href="tel:<?php echo esc_attr(invit_tel($contacts['phone_soligorsk'])); ?>" class="flex items-center gap-3 min-h-11 text-xl sm:text-2xl font-semibold text-white hover:text-inv-on-deep transition-colors duration-[120ms]">
                <?php echo invit_icon('phone', 'w-5 h-5 text-inv-on-deep'); ?>
                <?php echo esc_html($contacts['phone_soligorsk']); ?>
                <span class="text-xs font-normal text-white/55">Солигорск</span>
            </a>

            <a href="mailto:<?php echo esc_attr($contacts['email']); ?>" class="flex items-center gap-3 min-h-11 text-base text-inv-on-deep hover:text-white transition-colors duration-[120ms]">
                <?php echo invit_icon('mail', 'w-5 h-5'); ?>
                <?php echo esc_html($contacts['email']); ?>
            </a>

            <a href="<?php echo esc_url($contacts['telegram']); ?>" target="_blank" rel="noopener" class="flex items-center gap-3 min-h-11 text-base text-inv-on-deep hover:text-white transition-colors duration-[120ms]">
                <?php echo invit_icon('send', 'w-5 h-5'); ?>
                Заявка в Telegram
            </a>
        </div>

        <button type="button" data-request class="mt-8 inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] bg-white text-inv-deep text-sm font-semibold hover:bg-inv-surface-1 transition-colors duration-[120ms] cursor-pointer">
            Запросить расчёт
        </button>
    </div>
</section>

<?php if ($offices) : ?>
    <section class="bg-white py-12 sm:py-16">
        <div class="max-w-[1340px] mx-auto px-5">
            <h2 class="text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-inv-ink">Офисы и склады</h2>

            <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <?php foreach ($offices as $office) : ?>
                    <article class="rounded-[8px] border border-inv-border bg-white overflow-hidden">
                        <div class="p-5 sm:p-6">
                            <h3 class="text-lg font-semibold text-inv-ink"><?php echo esc_html($office['city']); ?></h3>

                            <p class="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-inv-ink-muted">
                                <span class="mt-0.5 text-inv-blue shrink-0"><?php echo invit_icon('map-pin', 'w-4 h-4'); ?></span>
                                <?php echo esc_html($office['address']); ?>
                            </p>

                            <?php if (!empty($office['phones'])) : ?>
                                <div class="mt-3 flex flex-col">
                                    <?php foreach (preg_split('/\r\n|\r|\n/', $office['phones']) as $phone) :
                                        $phone = trim($phone);
                                        if ($phone === '') continue; ?>
                                        <a href="tel:<?php echo esc_attr(invit_tel($phone)); ?>" class="flex items-center min-h-11 sm:min-h-10 text-base font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">
                                            <?php echo esc_html($phone); ?>
                                        </a>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>

                            <?php if (!empty($office['hours'])) : ?>
                                <p class="mt-3 flex items-center gap-2.5 text-sm text-inv-ink-muted">
                                    <span class="text-inv-blue"><?php echo invit_icon('clock', 'w-4 h-4'); ?></span>
                                    <?php echo esc_html($office['hours']); ?>
                                </p>
                            <?php endif; ?>
                        </div>

                        <?php if (!empty($office['map'])) : ?>
                            <iframe
                                src="<?php echo esc_url($office['map']); ?>"
                                width="100%"
                                height="300"
                                frameborder="0"
                                loading="lazy"
                                title="Карта: <?php echo esc_attr($office['city']); ?>"
                                class="block w-full border-t border-inv-border"
                            ></iframe>
                        <?php endif; ?>
                    </article>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
<?php endif; ?>

<?php if (get_the_content()) : ?>
    <section class="bg-inv-surface-1 py-12 sm:py-16">
        <div class="max-w-[1340px] mx-auto px-5">
            <div class="max-w-[70ch] text-base leading-[1.6] text-inv-ink-muted [&_p]:mt-4 [&_p:first-child]:mt-0">
                <?php while (have_posts()) : the_post(); the_content(); endwhile; ?>
            </div>
        </div>
    </section>
<?php endif; ?>

<?php get_footer(); ?>
