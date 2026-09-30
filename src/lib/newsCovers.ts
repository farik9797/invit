import windowMaterials from '../assets/news/vse-materialy-dlya-okon.webp';
import phoneNotice from '../assets/news/izmenilsya-nomer-telefona.webp';
import certificates from '../assets/news/sertifikaty.webp';
import iban from '../assets/news/novye-rekvizity-iban.webp';
import plant from '../assets/banners/euroband-plant.webp';
import rangeNavy from '../assets/banners/euroband-range-navy.webp';
import rangeWhite from '../assets/banners/euroband-range-white.webp';

/*
 * Обложки новостей.
 *
 * К заметкам на invit.by приложен клипарт нулевых (эмблема палаты, картинка
 * телефона, печать «важная информация») — его мы не переносили. Настоящих
 * фотографий к событиям у клиента нет, поэтому обложка подбирается по теме:
 * переезд получает снимок производства, складская программа — ассортимент,
 * остальные — кадры продукции.
 *
 * Двум новостям про сертификацию клиент прислал свою картинку со стопкой
 * документов — она и стоит обложкой вместо сканов, к заметке о реквизитах —
 * баннер IBAN.
 *
 * Если клиент пришлёт настоящие фото, менять надо только эту карту: к заметке
 * о переезде он прислал плакат «Все материалы для монтажа окон», к заметке о
 * телефонах — «Внимание! У нас изменился номер телефона», к заметке о
 * реквизитах — карточку IBAN.
 */
const COVERS: Record<string, string> = {
  'sertifikat-invit-2025-2027': certificates,
  'sertifikat-beltpp-2014': certificates,
  'rasshirenie-skladskoj-programmy': rangeWhite,
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
