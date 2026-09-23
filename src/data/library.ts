import { LibraryDoc } from '../types';

// Техническая документация со старого сайта (invit.by/docs): нормы по
// монтажным швам и воздуховодам, схемы монтажа, листовки на ленты.
// Собран scripts/fetch-docs.py, файлы лежат в public/docs/library.

export const LIBRARY: LibraryDoc[] = [

  {
    id: 'tkp-45-3-02-223-2010-02250',
    title: 'ТКП 45-3.02-223-2010 (02250)',
    text: 'Технический кодекс установившейся практики. ТКП 45-3.02-223-2010 (02250) — ЗАПОЛНЕНИЕ ОКОННЫХ И ДВЕРНЫХ ПРОЕМОВ. Правила проектирования и устройства (ВЗАМЕН ТКП 45-3.02-11-2005).',
    file: 'tkp-45-3-02-223-2010-02250.pdf',
    size: 430494
  },
  {
    id: 'gost-30971-2002',
    title: 'ГОСТ 30971-2002',
    text: 'ГОСТ 30971-2002 — Швы монтажные узлов примыканий оконных блоков к стеновым проемам.',
    file: 'gost-30971-2002.doc',
    size: 4086784
  },
  {
    id: 'gost-r-52749-2007',
    title: 'ГОСТ Р 52749-2007',
    text: 'ГОСТ Р 52749-2007 — Швы монтажные оконные с паропроницаемыми саморасширяющимися лентами. Технические условия.',
    file: 'gost-r-52749-2007.pdf',
    size: 1150412
  },
  {
    id: 'popravka-k-gost-r-52749-2007',
    title: 'ПОПРАВКА к ГОСТ Р 52749-2007',
    text: 'ПОПРАВКА к ГОСТ Р 52749-2007 — Швы монтажные оконные с паропроницаемыми саморасширяющимися лентами. Технические условия.',
    file: 'popravka-k-gost-r-52749-2007.pdf',
    size: 89988
  },
  {
    id: 'stb-1915-2008',
    title: 'СТБ 1915-2008',
    text: 'СТБ 1915-2008 — ВОЗДУХОВОДЫ МЕТАЛЛИЧЕСКИЕ ВЕНТИЛЯЦИОННЫЕ. Технические условия.',
    file: 'stb-1915-2008.pdf',
    size: 385422
  },
  {
    id: 'montazh-pryamougolnyh-vozduhovodov-kupsik',
    title: 'Монтаж прямоугольных воздуховодов (Kupsik).',
    text: 'Схема конструкции вентиляционных каналов прямоугольного сечения.',
    file: 'montazh-pryamougolnyh-vozduhovodov-kupsik.pdf',
    size: 630986
  },
  {
    id: 'montazh-sistemy-ventilyacii-dec',
    title: 'Монтаж системы вентиляции (DEC).',
    text: 'Схема монтажа системы вентиляции (DEC).',
    file: 'montazh-sistemy-ventilyacii-dec.pdf',
    size: 309379
  },
  {
    id: 'lenta-uplotnitelnaya-pes-euroband-dihtungsband',
    title: 'Лента уплотнительная ПЭС EUROBAND (Дихтунгсбанд).',
    text: 'Листовка рекламная лента ПЭС EUROBAND Дихтунгсбанд Кнауф, производство ООО ИНВИТ, г.Солигорск, тел. +375-29-644-49-79',
    file: 'lenta-uplotnitelnaya-pes-euroband-dihtungsband.pdf',
    size: 411387
  },
  {
    id: 'lenta-metallizirovannaya-germetiziruyuschaya-euroband-lba',
    title: 'Лента металлизированная герметизирующая EUROBAND ЛБА',
    text: 'Технические характеристики, листовка рекламная Лента герметизирующая пароизоляционная бутиловая металлизированная EUROBAND ЛБА, производитель ООО ИНВИТ, г.Солигорск, тел.+375-29-644-49-79.',
    file: 'lenta-metallizirovannaya-germetiziruyuschaya-euroband-lba.pdf',
    size: 115291
  },
  {
    id: 'tehnicheskij-list-nejtralnyj-germetik-tytan-neutral-pro',
    title: 'Технический лист нейтральный герметик Tytan Neutral PRO',
    text: 'Технический лист нейтральный герметик Tytan',
    file: 'tehnicheskij-list-nejtralnyj-germetik-tytan-neutral-pro.pdf',
    size: 443730
  },
  {
    id: 'lenta-paroizolyacionnaya-euroband-vl-a',
    title: 'Лента пароизоляционная EUROBAND ВЛ(а)',
    text: 'Технический лист Пароизоляционная лента Euroband ВЛ(а), производство ООО ИНВИТ, г.Солигорск, тел. +375-29-644-49-79.',
    file: 'lenta-paroizolyacionnaya-euroband-vl-a.pdf',
    size: 236664
  },
  {
    id: 'lenta-euroband-pes-pod-kontrobreshetku-krovli',
    title: 'Лента EUROBAND ПЭС под контробрешетку кровли.',
    text: 'Технический лист Лента Euroband под контробрешетку, производство ООО ИНВИТ, г.Солигорск, тел. +375-29-644-49-79.',
    file: 'lenta-euroband-pes-pod-kontrobreshetku-krovli.pdf',
    size: 271235
  },
];
