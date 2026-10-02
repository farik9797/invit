import windowMaterials from '../assets/news/vse-materialy-dlya-okon.webp';
import phoneNotice from '../assets/news/izmenilsya-nomer-telefona.webp';
import certificate2025 from '../assets/news/sertifikat-invit-2025-2027.webp';
import certificate2014 from '../assets/news/sertifikat-beltpp-2014.webp';
import iban from '../assets/news/novye-rekvizity-iban.webp';
import rangeNavy from '../assets/banners/euroband-range-navy.webp';
import stockRange from '../assets/news/skladskaya-programma.webp';

/*
 * Обложки новостей.
 *
 * Кадры обрезаны по содержимому: у исходного снимка складской программы
 * половина высоты была пустым белым полем, и в карточке он показывался
 * обрезком — товар уезжал за край.
 *
 * К заметкам на invit.by приложен клипарт нулевых (эмблема палаты, картинка
 * телефона, печать «важная информация») — его мы не переносили. Настоящих
 * фотографий к событиям у клиента нет, поэтому обложка подбирается по теме:
 * переезд получает снимок производства, складская программа — ассортимент,
 * остальные — кадры продукции.
 *
 * К обеим заметкам о сертификации клиент прислал сканы самих документов:
 * сертификат 2025–2027 и пару сертификатов 2014 года. К заметке о
 * реквизитах — баннер IBAN.
 *
 * Если клиент пришлёт настоящие фото, менять надо только эту карту: к заметке
 * о переезде он прислал плакат «Все материалы для монтажа окон», к заметке о
 * телефонах — «Внимание! У нас изменился номер телефона», к заметке о
 * реквизитах — карточку IBAN.
 */
const COVERS: Record<string, string> = {
  'sertifikat-invit-2025-2027': certificate2025,
  'sertifikat-beltpp-2014': certificate2014,
  'rasshirenie-skladskoj-programmy': stockRange,
  'invit-pereezd-na-mkad': windowMaterials,
  'invit-novye-nomera-telefonov': phoneNotice,
  'invit-novye-rekvizity-2017': iban
};

export const newsCover = (id: string) => COVERS[id] || rangeNavy;

/*
 * Где на обложке есть текст — скан сертификата, плакат клиента, — кадр
 * показываем целиком: обрезка съела бы заголовок. Фотографии кадрируем.
 */
const WHOLE = new Set(['invit-pereezd-na-mkad', 'invit-novye-nomera-telefonov']);

export const newsCoverFit = (id: string) =>
  id.startsWith('sertifikat') || WHOLE.has(id)
    ? 'object-contain p-3 bg-inv-surface-2'
    : 'object-cover';
