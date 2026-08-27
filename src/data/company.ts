/*
 * Реквизиты ООО «ИНВИТ» — один источник на весь сайт.
 *
 * Взяты со страницы клиента invit.by/about и подтверждены им отдельно: до этого
 * в подвале стояли другие УНП и адрес, и на сайте расходились данные.
 *
 * Меняются здесь и нигде больше: список читают подвал и страница «О компании».
 */
export const COMPANY = {
  fullName: 'Общество с ограниченной ответственностью «ИНВИТ»',
  shortName: 'ООО «ИНВИТ»',
  unp: '600500616',
  okpo: '29040090',
  legalAddress: 'РБ, 223710, Минская обл., г. Солигорск, ул. Строителей, 30, каб. 101',
  minskOffice: 'РБ, 223056, Минский р-н, Сеницкий сельсовет, 84, каб. 9',
  iban: 'BY41PJCB30121005041000000933',
  bank: 'Доп. офис 115/4 «Приорбанк» ОАО',
  bic: 'PJCBBY2X',
  bankAddress: 'РБ, 223710, Минская обл., г. Солигорск, ул. Козлова, 37',
  email: 'info@invit.by',
  phoneMinsk: '+375 29 644-49-79',
  phoneSoligorsk: '+375 174 32-50-22'
};

/**
 * Компактный вид для подвала: те же данные, но четырьмя строками без подписей.
 * Полный список с подписями остаётся на странице «О компании».
 */
export const REQUISITES_COMPACT: string[] = [
  `${COMPANY.shortName}, УНП ${COMPANY.unp}, ОКПО ${COMPANY.okpo}`,
  `Юр. адрес: ${COMPANY.legalAddress}`,
  `Офис и склад: ${COMPANY.minskOffice}`,
  `${COMPANY.iban}, ${COMPANY.bank}, BIC ${COMPANY.bic}`
];

/** Тот же набор строкой «подпись — значение»: страница «О компании» рисует его списком. */
export const REQUISITES: [string, string][] = [
  ['Полное наименование', COMPANY.fullName],
  ['УНП', COMPANY.unp],
  ['ОКПО', COMPANY.okpo],
  ['Юридический адрес', COMPANY.legalAddress],
  ['Минское подразделение', COMPANY.minskOffice],
  ['IBAN', COMPANY.iban],
  ['Банк', `${COMPANY.bank}, BIC ${COMPANY.bic}`],
  ['Адрес банка', COMPANY.bankAddress]
];
