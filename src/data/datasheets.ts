/*
 * Технические листы (PDF) на invit.by.
 *
 * Лежат они не в описании товара, а отдельной ссылкой, и при переносе каталога
 * из админки потерялись вместе с разметкой. Файлы живые — проверено запросом,
 * все пять отдают application/pdf. Адреса приведены к https: по http браузер
 * заблокировал бы их как смешанное содержимое.
 *
 * Собрано scripts/fetch-euroband-specs.py и снимком старого сайта.
 */
export const DATASHEETS: Record<string, string> = {
  'paroizoljacionnaja-lenta-euroband-vla':
    'https://invit.by/download/paroizoljacionnaja-lenta-euroband-vla.pdf',
  'lenta-butilovaja-euroband-lba':
    'https://invit.by/download/lenta-germetizirujushhaja-butilovaja-EUROBAND-LBA%20.pdf',
  'zvukoizoljacionnaja-lenta-pjes-euroband-dihtungsband':
    'https://invit.by/download/lenta-pes-euroband-dihtungsband.pdf',
  'lenta-pod-kontrobreshjotku-krovli':
    'https://invit.by/download/lenta-euroband-pod-kontrobreshetku.pdf',
  'germetik-nejtral%27nyj-tytan-professional-neutral-600-ml':
    "https://invit.by/download/tehnicheskij-list-nejtral%27nyj-germetik-tytan.pdf"
};
