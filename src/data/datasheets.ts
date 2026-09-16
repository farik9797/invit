/*
 * Технические листы (PDF).
 *
 * Лежат у нас в public/docs: invit.by заменяется на новый сайт, и ссылки на
 * его /download отвалились бы вместе со старым. Файлы скачаны как есть,
 * скриптом scripts/fetch-euroband-specs.py собраны их исходные адреса.
 *
 * Ключ — идентификатор товара, путь строится от BASE_URL: на GitHub Pages
 * сайт живёт в подпапке /invit/, и абсолютный «/docs/…» туда не попал бы.
 */
const FILES: Record<string, string> = {
  'paroizoljacionnaja-lenta-euroband-vla': 'lenta-euroband-vla.pdf',
  'lenta-butilovaja-euroband-lba': 'lenta-euroband-lba.pdf',
  'zvukoizoljacionnaja-lenta-pjes-euroband-dihtungsband': 'lenta-pes-euroband-dihtungsband.pdf',
  'lenta-pod-kontrobreshjotku-krovli': 'lenta-euroband-pod-kontrobreshetku.pdf',
  'germetik-nejtral%27nyj-tytan-professional-neutral-600-ml': 'germetik-tytan-neutral.pdf'
};

export const DATASHEETS: Record<string, string> = Object.fromEntries(
  Object.entries(FILES).map(([id, file]) => [id, `${import.meta.env.BASE_URL}docs/${file}`])
);
