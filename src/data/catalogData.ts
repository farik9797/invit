import { Category, Product, HeroSlide, OrderStatus, CertificateItem, NewsArticle } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-window-tapes',
    name: 'Монтажные ленты EUROBAND',
    slug: 'montazhnye-lenty',
    division: 'windows',
    description: 'Пароизоляционные, гидроизоляционные и бутиловые ленты для защиты монтажного шва оконных и дверных блоков.',
    iconName: 'Layers',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      { id: 'sub-1', name: 'Монтажные ленты', count: 18 },
      { id: 'sub-2', name: 'ПСУЛ', count: 12 },
      { id: 'sub-3', name: 'Пена и очистители', count: 15 },
      { id: 'sub-4', name: 'Герметики и клея', count: 10 },
      { id: 'sub-5', name: 'Крепёж', count: 24 },
      { id: 'sub-6', name: 'Кровельные уплотнители', count: 8 },
      { id: 'sub-7', name: 'Ленты ПЭС', count: 14 },
      { id: 'sub-8', name: 'Инструмент и СИЗ', count: 11 },
      { id: 'sub-9', name: 'Резиновый уплотнитель', count: 9 },
      { id: 'sub-10', name: 'Пенополиэтилен ППЭ', count: 16 }
    ]
  },
  {
    id: 'cat-hvac-components',
    name: 'Комплектующие для систем вентиляции',
    slug: 'komplektuyushchie-ventilyacii',
    division: 'hvac',
    description: 'Профили фланцевые, монтажные уголки, траверсы и специальный крепёж для производства и монтажа воздуховодов.',
    iconName: 'Wind',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      { id: 'sub-11', name: 'Фланцевый профиль', count: 8 },
      { id: 'sub-12', name: 'Монтажные уголки', count: 12 },
      { id: 'sub-13', name: 'Крепёжные детали', count: 22 },
      { id: 'sub-14', name: 'Траверса', count: 6 },
      { id: 'sub-15', name: 'Уплотнительные ленты', count: 14 },
      { id: 'sub-16', name: 'Антикоррозийный спрей', count: 5 }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'EB-IN-70',
    title: 'Лента EUROBAND BASIC Внутренняя пароизоляционная',
    categorySlug: 'montazhnye-lenty',
    subcategoryName: 'Монтажные ленты',
    division: 'windows',
    description: 'Полнобутиловая пароизоляционная лента на дублированной спанбондом основе для защиты монтажного пены от влаги изнутри помещения.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600',
    badge: 'Собственное производство',
    specs: {
      width: '70 мм (под заказ 10-1500 мм)',
      length: '25 м',
      density: '140 г/м²',
      tempRange: '-40°C ... +90°C',
      material: 'Спанбонд + бутиловый слой',
      packaging: 'Коробка 12 рулонов'
    },
    features: [
      'Высочайшая адгезия к бетону, кирпичу, ПВХ и дереву',
      'Защищает монтажный шов от проникновения пара',
      'Легко штукатурится и окрашивается',
      'Соответствует требованиями СТБ 1488-2004'
    ],
    inStock: true
  },
  {
    id: 'prod-2',
    code: 'EB-OUT-70',
    title: 'Лента EUROBAND BASIC Наружная гидро-паропроницаемая',
    categorySlug: 'montazhnye-lenty',
    subcategoryName: 'Монтажные ленты',
    division: 'windows',
    description: 'Диффузионная мембранная лента для вывода влаги из оконного шва наружу. Устойчива к УФ-излучению и прямому воздействию осадков.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    badge: 'Хит',
    specs: {
      width: '70 мм / 100 мм / 150 мм',
      length: '25 м',
      density: '135 г/м²',
      tempRange: '-40°C ... +80°C',
      material: 'Паропроницаемая мембрана',
      packaging: 'Коробка 12 рулонов'
    },
    features: [
      'Обеспечивает естественное высыхание пены',
      'Высокая стойкость к ультрафиолету (до 4 месяцев)',
      'Две клейкие полосы для быстрого монтажа',
      'Производится на оборудовании ООО «ИНВИТ»'
    ],
    inStock: true
  },
  {
    id: 'prod-3',
    code: 'EB-PSUL-154',
    title: 'Лента ПСУЛ EUROBAND 15/4-20 Уплотнительная саморасширяющаяся',
    categorySlug: 'montazhnye-lenty',
    subcategoryName: 'ПСУЛ',
    division: 'windows',
    description: 'Паропроницаемая саморасширяющаяся уплотнительная лента из вспененного полиуретана, пропитанного акриловым составом.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    badge: 'Хит',
    specs: {
      width: '15 мм',
      thickness: '4 мм (в сжатом) / до 20 мм (при расширении)',
      length: '8 м в рулоне',
      material: 'Пенополиуретан с акриловой пропиткой',
      packaging: 'Упаковка 30 рулонов'
    },
    features: [
      'Устойчивость к ливневому грозовому дождю (до 600 Па)',
      'Надежная герметизация фасадных и оконных стыков',
      'Сохраняет эластичность весь срок службы зданий',
      'Не подвержена старению и гниению'
    ],
    inStock: true
  },
  {
    id: 'prod-4',
    code: 'EB-FOAM-70',
    title: 'Профессиональная монтажная пена EUROBAND PRO 70L',
    categorySlug: 'montazhnye-lenty',
    subcategoryName: 'Пена и очистители',
    division: 'windows',
    description: 'Всесезонная однокомпонентная полиуретановая монтажная пена повышенного выхода под пистолет.',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=600',
    badge: 'Новинка',
    specs: {
      width: 'Баллон 1000 мл',
      density: 'Выход пены до 70 литров',
      tempRange: '-10°C ... +35°C',
      packaging: 'Коробка 12 баллонов'
    },
    features: [
      'Низкое вторичное расширение (без деформации рам)',
      'Высокая тепло- и звукоизоляция (до 62 дБ)',
      'Быстрая полимеризация и первичная застываемость',
      'Идеальная адгезия к большинству строительных материалов'
    ],
    inStock: true
  },
  {
    id: 'prod-5',
    code: 'EB-FL20-3M',
    title: 'Фланцевый профиль (Шинорейка) №20 (длина 3м)',
    categorySlug: 'komplektuyushchie-ventilyacii',
    subcategoryName: 'Фланцевый профиль',
    division: 'hvac',
    description: 'Оцинкованный стальной профиль для соединения прямоугольных воздуховодов и фасонных изделий вентиляционных систем.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    badge: 'Собственное производство',
    specs: {
      width: 'Профиль №20 (высота 20 мм)',
      length: '3000 мм (3 метра)',
      thickness: '0.6 мм / 0.7 мм',
      material: 'Сталь оцинкованная по ГОСТ 14918-80',
      packaging: 'Пачка 100 п.м.'
    },
    features: [
      'Обеспечивает герметичность класса В и С по СТБ ЕН 1507',
      'Строго выдержанный геометрия гиба',
      'Защита от коррозии за счет высокой цинковой массы',
      'Прямые поставки от производителя ООО «ИНВИТ»'
    ],
    inStock: true
  },
  {
    id: 'prod-6',
    code: 'EB-UG20-HEAVY',
    title: 'Монтажные уголки УГ-20 для прямоугольных воздуховодов',
    categorySlug: 'komplektuyushchie-ventilyacii',
    subcategoryName: 'Монтажные уголки',
    division: 'hvac',
    description: 'Штампованный уголок из оцинкованной стали для жесткого скрепления фланцевого профиля №20 по углам.',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    badge: 'Хит',
    specs: {
      width: 'Размер 65х65х20 мм',
      thickness: '2.0 мм / 2.5 мм',
      material: 'Сталь оцинкованная',
      packaging: 'Коробка 500 шт'
    },
    features: [
      'Высокая жесткость на изгиб и кручение',
      'Четкие технологические отверстия под болты М8',
      'Защита от коррозии во влажных средах',
      'Всегда в наличии на складе в Минске'
    ],
    inStock: true
  },
  {
    id: 'prod-7',
    code: 'EB-TR20-30',
    title: 'Траверса монтажная C-образная 20х30х2.0 (3м)',
    categorySlug: 'komplektuyushchie-ventilyacii',
    subcategoryName: 'Траверса',
    division: 'hvac',
    description: 'Перфорированный профиль для подвеса тяжелых элементов вентиляции, кабельных лотков и трубопроводов.',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
    badge: 'Собственное производство',
    specs: {
      width: '20 х 30 мм',
      length: '3000 мм',
      thickness: '1.5 мм / 2.0 мм',
      material: 'Оцинкованная сталь',
      packaging: 'Связка 10 шт'
    },
    features: [
      'Удобная регулярная перфорация для быстрой сборки',
      'Совместима со шпильками М8, М10 и гайками',
      'Высокая несущая способность'
    ],
    inStock: true
  },
  {
    id: 'prod-8',
    code: 'EB-PES-10',
    title: 'Межфланцевая уплотнительная лента ПЭС (Пеноэтилен) 10х4',
    categorySlug: 'komplektuyushchie-ventilyacii',
    subcategoryName: 'Уплотнительные ленты',
    division: 'hvac',
    description: 'Самоклеящаяся лента из вспененного полиэтилена для герметизации стыков фланцевых соединений воздуховодов.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=600',
    badge: 'Хит',
    specs: {
      width: '10 мм / 15 мм / 20 мм',
      thickness: '4 мм / 5 мм',
      length: '10 м в рулоне',
      material: 'Вспененный ПЭ с клеевым слоем',
      packaging: 'Коробка 50 рулонов'
    },
    features: [
      'Исключает утечки воздуха в системах вентиляции',
      'Стойкость к вибрации и перепадам температур',
      'Защитный антиадгезионный лайнер легко снимается'
    ],
    inStock: true
  }
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Белорусский производитель уплотнительных и герметизирующих лент EUROBAND',
    subtitle: 'ООО «ИНВИТ» с 2009 года выпускает в Минске бутилкаучуковые, пароизоляционные и диффузионные ленты для монтажа окон, фасадов и кровли.',
    highlight: 'Собственное производство: порезка любых ширин от 10 до 1500 мм под ваши размеры.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200',
    categoryLink: 'montazhnye-lenty',
    features: ['Сертификат собственного производства', 'Сертификация СТБ и ГОСТ', 'Прямые цены завода']
  },
  {
    id: 'slide-2',
    title: 'Пароизоляционные и диффузионные оконные ленты',
    subtitle: 'Комплексная защита монтажного шва по стандартам качественного монтажа.',
    highlight: 'Полная защита полиуретановой пены от влаги, УФ-излучения и промерзания.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
    categoryLink: 'montazhnye-lenty',
    features: ['Непрерывная адгезия', 'Высокая паропроницаемость снаружи', 'Удобный нахлест']
  },
  {
    id: 'slide-3',
    title: 'Профессиональная монтажная пена и герметики',
    subtitle: 'Пена EUROBAND PRO 70L — максимальный выход, низкое вторичное расширение и плотный шов.',
    highlight: 'Всесезонные формулы для работы при температурах от -15°C.',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=1200',
    categoryLink: 'montazhnye-lenty',
    features: ['Звукоизоляция до 62 дБ', 'Быстрое время подрезки', 'Устойчивость к сырости']
  },
  {
    id: 'slide-4',
    title: 'Фланцевый профиль и комплектующие для воздуховодов',
    subtitle: 'Шинорейка №20/№30, монтажные уголки УГ, траверсы и межфланцевые уплотнители ПЭС.',
    highlight: 'Идеальная геометрия профилирования из оцинкованной стали высокой плотности.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    categoryLink: 'komplektuyushchie-ventilyacii',
    features: ['Класс герметичности B и C', 'Оптовые отгрузки со склада', 'Полный комплект крепежа']
  }
];

export const MOCK_ORDERS: Record<string, OrderStatus> = {
  'INV-2026-9041': {
    orderNumber: 'INV-2026-9041',
    companyName: 'ЗАО «МинскПромСтрой»',
    date: '10.08.2026',
    status: 'cutting',
    statusText: 'В производстве / Порезка нестандартных рулонов',
    estimatedDelivery: '12.08.2026 (14:00)',
    destination: 'г. Минск, ул. Промышленная, 28 (Склад №4)',
    itemsCount: 120,
    weight: '340 кг',
    steps: [
      { title: 'Заказ принят и согласован менеджером', date: '10.08.2026 09:30', completed: true },
      { title: 'Счет оплачен / Включен в производственный план', date: '10.08.2026 11:15', completed: true },
      { title: 'Порезка и намотка лент на станочной линии EUROBAND', date: '11.08.2026 08:00', completed: true, current: true },
      { title: 'Упаковка и маркировка паллет', date: '11.08.2026 16:00', completed: false },
      { title: 'Отгрузка со склада (г. Минск, ТЦ Сеница)', date: '12.08.2026 10:00', completed: false }
    ]
  },
  'INV-2026-8812': {
    orderNumber: 'INV-2026-8812',
    companyName: 'ООО «ВентМонтажФасад»',
    date: '08.08.2026',
    status: 'shipped',
    statusText: 'Отгружен / В пути к заказчику',
    estimatedDelivery: '11.08.2026 (Сегодня)',
    destination: 'г. Брест, ул. Коммерческая, 12',
    itemsCount: 45,
    weight: '180 кг',
    steps: [
      { title: 'Заказ принят и согласован', date: '08.08.2026 14:20', completed: true },
      { title: 'Оплата получена', date: '08.08.2026 16:00', completed: true },
      { title: 'Производство комплектующих завершено', date: '09.08.2026 17:30', completed: true },
      { title: 'Передано в транспортную компанию', date: '10.08.2026 09:00', completed: true, current: true },
      { title: 'Доставлено получателю', date: '11.08.2026 15:00', completed: false }
    ]
  }
};

export const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Сертификат соответствия СТБ 1488-2004 (Монтажные ленты EUROBAND)',
    type: 'Сертификат соответствия РБ',
    validUntil: '2027-11-20',
    issuedBy: 'Орган по сертификации РУП «Стройтехнорм»',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cert-2',
    title: 'Декларация о соответствии ЕАЭС (Профиль фланцевый и уголки)',
    type: 'Декларация ТР ТС / ЕАЭС',
    validUntil: '2028-04-15',
    issuedBy: 'Госстандарт Республики Беларусь',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cert-3',
    title: 'Сертификат продукции собственного производства (2025–2027)',
    type: 'Сертификат собственного производства',
    validUntil: '2027-12-31',
    issuedBy: 'Белорусская торгово-промышленная палата',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cert-4',
    title: 'Протокол акустических и теплотехнических испытаний ПСУЛ EUROBAND',
    type: 'Протокол НИИ Стройэкономики',
    validUntil: 'Бессрочно',
    issuedBy: 'Лаборатория физики строительных конструкций',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600'
  }
];

export const NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Сертификат продукции собственного производства на 2025–2027 годы успешно обновлен',
    date: '02 Августа 2026',
    category: 'Сертификация',
    summary: 'Белорусская торгово-промышленная палата подтвердила статус ООО «ИНВИТ» как официального белорусского производителя лент EUROBAND.',
    content: 'ООО «ИНВИТ» успешно прошло ежегодный аудиторский контроль БелТПП. Мы обновили Сертификат продукции собственного производства на всю линейку строительных гидро-, пароизоляционных и уплотнительных лент EUROBAND. Данный документ подтверждает локализацию технологического цикла в Республике Беларусь.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'news-2',
    title: 'Переезд офисно-складского комплекса в ТЦ «Сеница» на МКАД',
    date: '18 Июля 2026',
    category: 'Компания',
    summary: 'Отгрузка продукции EUROBAND стала еще удобнее и быстрее благодаря современной логистической рампе на южном полукольце МКАД.',
    content: 'Для удобства оптовых клиентов и логистических партнеров центральный офис и главный распределительный склад ООО «ИНВИТ» переехали по новому адресу: г. Минск, ТЦ Сеница, оф. 9 (пересечение МКАД и слуцкого направления). К вашим услугам удобный подъезд еврофур и ускоренная выписка ТТН.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'news-3',
    title: 'Запуск высокоточного резательного станка для лент шириной от 10 мм',
    date: '25 Июня 2026',
    category: 'Производство',
    summary: 'Новая автоматическая бобинорезательная линия EUROBAND позволяет нарезать ролики с допуском ±0.2 мм под любые чертежи заказчика.',
    content: 'В рамках модернизации производственного цеха ООО «ИНВИТ» введен в эксплуатацию высокоскоростной станок дисковой порезки клейких лент. Теперь мы принимаем индивидуальные заказы на изготовление узких и нестандартно широких рулонов (от 10 мм до 1500 мм) со сроком выполнения до 24 часов.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
  }
];
