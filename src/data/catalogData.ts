import { HeroSlide, CertificateItem, NewsArticle, Product } from '../types';
import { CATEGORIES as SECTIONS, RAW_PRODUCTS } from './catalog.generated';

/*
 * Витрина каталога. Разделы и товары собраны скриптом scripts/build-catalog.py
 * из сведённой выгрузки, здесь только достраиваются поля, которые выводятся из
 * других: держать их в данных значило таскать лишние полтора мегабайта.
 */

export const CATEGORIES = SECTIONS;

const SUB_NAME: Record<string, string> = {};
const DIVISION: Record<string, Product['division']> = {};
for (const section of SECTIONS) {
  DIVISION[section.slug] = section.division;
  for (const sub of section.subcategories) SUB_NAME[sub.slug] = sub.name;
}

/** Заголовок для карточки: длинные названия поставщика режем по слову. */
const short = (title: string, limit = 70) =>
  title.length <= limit ? title : `${title.slice(0, limit).replace(/\s+\S*$/, '')}...`;

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  // Идентификатор — ключ подробных описаний, адрес — то, что уходит в ссылку.
  // Расходятся они у позиций с invit.by: там в идентификаторе остался «%27».
  slug: p.slug ?? p.id,
  shortTitle: short(p.title),
  subcategoryName: SUB_NAME[p.subcategorySlug] ?? '',
  division: DIVISION[p.categorySlug] ?? 'windows',
  // Фото лежит в public/products под именем товара; адрес собирает
  // productImage(), поэтому здесь остаётся только признак «снимок есть».
  image: p.photo ? `${p.slug ?? p.id}.webp` : '',
  features: [],
  sourceUrl: ''
}));

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Белорусский производитель уплотнительных и герметизирующих лент EUROBAND',
    subtitle:
      'ООО «ИНВИТ» с 2001 года выпускает в Минске бутилкаучуковые, пароизоляционные и диффузионные ленты для монтажа окон, фасадов и кровли.',
    highlight: 'Собственное производство: изготовим ленты нетипичных размеров под ваш проект.',
    image: 'https://invit.by/image/cache/data/slides/slide-invit-euroband-1092x337.jpg',
    categoryLink: 'materialy-dlya-okon',
    features: ['Сертификат собственного производства', 'Соответствие ТКП и ГОСТ', 'Прямые цены завода']
  },
  {
    id: 'slide-2',
    title: 'Пароизоляционные ленты EUROBAND ВЛ(а) и ВЛ',
    subtitle:
      'Внутренний слой монтажного шва: металлизированная плёнка, дублированная нетканым полотном, две монтажные полосы — акрил и бутилкаучук.',
    highlight: 'Пять типоразмеров по ширине: от 70 до 150 мм, в рулоне 25 мп.',
    image: 'https://invit.by/image/cache/data/slides/lenta_vla_euroband_pil-1092x337.jpg',
    categoryLink: 'materialy-dlya-okon',
    features: ['Высокая пароизоляция', 'Под штукатурку и сухую отделку', 'Монтаж на любые поверхности']
  },
  {
    id: 'slide-3',
    title: 'Саморасширяющаяся лента ПСУЛ EUROBAND',
    subtitle:
      'Предварительно сжатая уплотнительная лента для защиты стыков от воды, шума и холода. Соответствует ТКП 45-3.02-223-2010 и ГОСТ 30971-2002.',
    highlight: 'Производится по ТУ BY 600500616.001-2010.',
    image: 'https://invit.by/image/cache/data/slides/psul-euroband-1092x337.jpg',
    categoryLink: 'materialy-dlya-okon',
    features: ['Паропроницаемость', 'Защита от косого дождя', 'Уплотнение подвижных стыков']
  },
  {
    id: 'slide-4',
    title: 'Комплектующие для воздуховодов и систем вентиляции',
    subtitle:
      'Фланцевый профиль и шинорейка, монтажные уголки, траверсы, крепёжные детали и уплотнительные ленты — со склада в Минске.',
    highlight: 'Прямые поставки от ведущих производителей.',
    image: 'https://invit.by/image/cache/data/slides/lenta_pe_euroband-1092x337.jpg',
    categoryLink: 'ventilyaciya',
    features: ['Профиль PQ и система «К»', 'Уголки к профилю 20/30/40', 'Полный комплект крепежа']
  }
];

// Сканы сертификатов взяты из галереи invit.by (Документы -> Сертификаты).
export const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Сертификат продукции собственного производства на ленты EUROBAND',
    type: 'Сертификат',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/sertifikat_produkcii_sobstvennogo_proizvodstva_invit_2023-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/sertifikat_produkcii_sobstvennogo_proizvodstva_invit_2023.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-2',
    title: 'Свидетельство от технической компетентности ООО «ИНВИТ»',
    type: 'Свидетельство',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/svidetel%27stvo_tehnicheskoj_kompetencii_invit_2028-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/svidetel%27stvo_tehnicheskoj_kompetencii_invit_2028.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-3',
    title: 'Техническое свидетельство ВЛ, ВЛ(а)',
    type: 'Техническое свидетельство',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/tehnicheskoe_svidetel%27stvo_evroband_vla_2028-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/tehnicheskoe_svidetel%27stvo_evroband_vla_2028.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-4',
    title: 'Техническое свидетельство на НЛ',
    type: 'Техническое свидетельство',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/tehnicheskoe_svidetel%27stvo_evroband_nl_2028-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/tehnicheskoe_svidetel%27stvo_evroband_nl_2028.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-5',
    title: 'Техническое свидетельство на ПСУЛ',
    type: 'Техническое свидетельство',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/tehnicheskoe_svidetel%27stvo_evroband_psul_2028-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/tehnicheskoe_svidetel%27stvo_evroband_psul_2028.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-6',
    title: 'Техническое свидетельство на ПЭС',
    type: 'Техническое свидетельство',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/tehnicheskoe_svidetel%27stvo_evroband_pes_2028-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/tehnicheskoe_svidetel%27stvo_evroband_pes_2028.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-7',
    title: 'Декларация на ленту НЛ',
    type: 'Декларация о соответствии',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/deklaracija_o_sootvetstvii_lenta_evroband_nl_2028-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/deklaracija_o_sootvetstvii_lenta_evroband_nl_2028.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-8',
    title: 'Декларация на ленту ПСУЛ',
    type: 'Декларация о соответствии',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/deklaracija_o_sootvetstvii_lenta_evroband_psul_2028-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/deklaracija_o_sootvetstvii_lenta_evroband_psul_2028.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-9',
    title: 'Декларация на ленту ПЭС',
    type: 'Декларация о соответствии',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/deklaracija_o_sootvetstvii_lenta_evroband_pjes_2028-500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/deklaracija_o_sootvetstvii_lenta_evroband_pjes_2028.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
  {
    id: 'cert-10',
    title: 'Декларация на ленты ВЛ(а) и ВЛ',
    type: 'Декларация о соответствии',
    image: 'https://invit.by/image/cache/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/deklaracija_o_sootvetstvii_lenta_evroband_vla_vl_lba_lb_lbn_2028--500x500.jpg',
    imageFull: 'https://invit.by/image/data/news/%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D1%8B%202018-2023/deklaracija_o_sootvetstvii_lenta_evroband_vla_vl_lba_lb_lbn_2028-.jpg',
    sourceUrl: 'https://invit.by/index.php?route=information/gallery'
  },
];

export const NEWS: NewsArticle[] = [
  {
    id: 'sertifikat-invit-2025-2027',
    title: 'ООО "ИНВИТ" получило сертификат продукции собственного производства | 2025-2027',
    date: '8 декабря 2025',
    category: 'Сертификация',
    summary: 'ООО «ИНВИТ» подтвердило статус отечественного производителя, обновив сертификат продукции собственного производства на период 2025–2027 годов. Сертификацию провела Белорусская торгово-промышленная пал',
    content: 'ООО «ИНВИТ» подтвердило статус отечественного производителя, обновив сертификат продукции собственного производства на период 2025–2027 годов. Сертификацию провела Белорусская торгово-промышленная палата (БелТПП), которая регулярно верифицирует производственные мощности нашей компании.',
    image: 'https://invit.by/image/data/news/BelTPP_emblem.png',
    sourceUrl: 'https://invit.by/sertifikat-invit-2025-2027'
  },
  {
    id: 'invit-pereezd-na-mkad',
    title: 'Мы переехали в новый офис на МКАД. Приглашаем!',
    date: '1 июля 2024',
    category: 'Компания',
    summary: 'Уважаемые клиенты! Мы рады сообщить вам, что минское подразделение ООО "ИНВИТ" переехало в новый просторный офис по адресу: Минский район, Сеницкий сельсовет, 84 (Торговый центр "Сеница" на пересечени',
    content: 'Мы рады сообщить вам, что минское подразделение ООО "ИНВИТ" переехало в новый просторный офис по адресу: Минский район, Сеницкий сельсовет, 84 (Торговый центр "Сеница" на пересечении ул.Казинца и МКАД). А новый современный склад с удобными подъездными путями с разных направлений МКАД, оборудованный погрузочной рампой, позволяет облегчить и ускорить погрузочные операции. Мы всегда рады видеть вас в новом офисе нашей компании ИНВИТ.',
    image: 'https://invit.by/image/data/news/invit-pereezd.png',
    sourceUrl: 'https://invit.by/invit-pereezd-na-mkad'
  },
  {
    id: 'invit-novye-nomera-telefonov',
    title: 'Изменились номера контактных телефонов ООО "ИНВИТ"',
    date: '30 апреля 2020',
    category: 'Компания',
    summary: 'Уважаемые партнеры! Просим вас принять во внимание, что с 30.04.2020г. в минском офисе ООО "ИНВИТ" изменились номера контактных телефонов. Теперь номера наших телефонов следующие: +375-17-343-77-36 +3',
    content: 'Просим вас принять во внимание, что с 30.04.2020г. в минском офисе ООО "ИНВИТ" изменились номера контактных телефонов. Теперь номера наших телефонов следующие:\n+375-17-343-77-36\n+375-17-378-57-00\n+375-17-399-28-40\nМы по прежнему рады слышать и видеть именно вас в офисах нашей компании ООО "ИНВИТ". Давайте общаться чаще.',
    image: 'https://invit.by/image/data/news/phone-invit.png',
    sourceUrl: 'https://invit.by/invit-novye-nomera-telefonov'
  },
  {
    id: 'invit-novye-rekvizity-2017',
    title: 'ВАЖНО! Новые банковские реквизиты в международном формате (IBAN, БИК)',
    date: '4 июля 2017',
    category: 'Компания',
    summary: 'Уважаемые партнеры! В связи с принятием Постановления Правления Национального банка Республики Беларусь от 27.07.2015 № 440 (ред. от 02.02.2016) "О структуре номера счета" и переходом на использование',
    content: 'В связи с принятием Постановления Правления Национального банка Республики Беларусь от 27.07.2015 № 440 (ред. от 02.02.2016) "О структуре номера счета" и переходом на использование международной структуры номера счета в формате IBAN и банковского идентификационного кода БИК в Республике Беларусь, обращаем ваше внимание, что c 4 июля 2017 года для проведения расчетов будут использоваться новые банковские реквизиты ООО "ИНВИТ": Республика Беларусь, 223710, Минская область, г.Солигорск, ул.Строителей, 30, каб.101 Р/с BY 41PJCB30121005041000000933 в ЦБУ №104 "Приорбанк" ОАО, банковский идентификационный код (БИК) – PJCBBY2X, г.Солигорск, ул.Богомолова, 16-А. УНП 600500616, тел.: +375 (174) 22-64-22 Скачать и распечатать уведомление о смене реквизитов вы можете здесь. Благодарим за сотрудничество!',
    image: 'https://invit.by/image/data/news/icon_4.gif',
    sourceUrl: 'https://invit.by/invit-novye-rekvizity-2017'
  },
  {
    id: 'sertifikat-beltpp-2014',
    title: 'ООО "ИНВИТ" получило сертификат продукции собственного производства',
    date: '3 декабря 2014',
    category: 'Сертификация',
    summary: 'Компания ИНВИТ в очередной раз получила сертификат продукции собственного производства №49-8/1048-1 от 03.12.2014 года в Белоруской торгово-промышленной палате. Тем самым мы подтверждаем статус белору',
    content: 'Компания ИНВИТ в очередной раз получила сертификат продукции собственного производства №49-8/1048-1 от 03.12.2014 года в Белоруской торгово-промышленной палате. Тем самым мы подтверждаем статус белорусского производителя. В перечне выпускаемой продукции нашей компанией вы найдёте товары под собственным брендом EUROBAND, такие как: -лента уплотнительная EUROBAND ПЭС, -лента уплотнительная EUROBAND ПСУЛ, -лента герметизирующая EUROBAND ВЛ, ВЛ(а) для внутреннего слоя монтажного шва, -лента герметизирующая EUROBAND ВЛ, ВЛ(а) для наружного слоя монтажного шва. Ленты EUROBAND используются для уплотнения и герметизации всевозможных строительных систем и соответствуют всем строительным стандартам и нормам.',
    image: 'https://invit.by/image/data/news/-1.png',
    sourceUrl: 'https://invit.by/sertifikat-beltpp-2014'
  },
  {
    id: 'rasshirenie-skladskoj-programmy',
    title: 'Внимание! Расширение складской программы.',
    date: '28 августа 2014',
    category: 'Новости',
    summary: 'В продаже появились ленты уплотнительные для монтажа сэндвич-панелей. Подробности у менеджеров в офисе компании.',
    content: 'В продаже появились ленты уплотнительные для монтажа сэндвич-панелей. Подробности у менеджеров в офисе компании.',
    image: 'https://invit.by/image/data/news/skidka.png',
    sourceUrl: 'https://invit.by/index.php?route=information/news&news_id=2'
  },
];
