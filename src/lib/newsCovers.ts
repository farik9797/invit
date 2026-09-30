import { certificateImage } from './productImages';
import windowMaterials from '../assets/news/vse-materialy-dlya-okon.webp';
import plant from '../assets/banners/euroband-plant.webp';
import rangeNavy from '../assets/banners/euroband-range-navy.webp';
import rangeWhite from '../assets/banners/euroband-range-white.webp';
import aluPesRolls from '../assets/banners/alu-pes-rolls.webp';

/*
 * Обложки новостей.
 *
 * К заметкам на invit.by приложен клипарт нулевых (эмблема палаты, картинка
 * телефона, печать «важная информация») — его мы не переносили. Настоящих
 * фотографий к событиям у клиента нет, поэтому обложка подбирается по теме:
 * переезд получает снимок производства, складская программа — ассортимент,
 * остальные — кадры продукции.
 *
 * Две новости про сертификацию оставлены со сканами самих документов: скан
 * говорит о событии больше, чем любой товарный кадр.
 *
 * Если клиент пришлёт настоящие фото, менять надо только эту карту: к заметке
 * о переезде он прислал свой плакат «Все материалы для монтажа окон», он и
 * стоит обложкой.
 */
const COVERS: Record<string, string> = {
  'sertifikat-invit-2025-2027': certificateImage('cert-1', ''),
  'sertifikat-beltpp-2014': certificateImage('cert-2', ''),
  'rasshirenie-skladskoj-programmy': rangeWhite,
  'invit-pereezd-na-mkad': windowMaterials,
  'invit-novye-nomera-telefonov': plant,
  'invit-novye-rekvizity-2017': aluPesRolls
};

export const newsCover = (id: string) => COVERS[id] || rangeNavy;

/*
 * Где на обложке есть текст — скан сертификата, плакат клиента, — кадр
 * показываем целиком: обрезка съела бы заголовок. Фотографии кадрируем.
 */
const WHOLE = new Set(['invit-pereezd-na-mkad']);

export const newsCoverFit = (id: string) =>
  id.startsWith('sertifikat') || WHOLE.has(id)
    ? 'object-contain p-3 bg-inv-surface-2'
    : 'object-cover';
