import { certificateImage } from './productImages';
import plant from '../assets/banners/euroband-plant.webp';
import rangeNavy from '../assets/banners/euroband-range-navy.webp';
import rangeWhite from '../assets/banners/euroband-range-white.webp';
import aluPesRolls from '../assets/banners/alu-pes-rolls.webp';
import pesTapeWindow from '../assets/banners/pes-tape-window.webp';

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
 * Если клиент пришлёт настоящие фото, менять надо только эту карту.
 */
const COVERS: Record<string, string> = {
  'sertifikat-invit-2025-2027': certificateImage('cert-1', ''),
  'sertifikat-beltpp-2014': certificateImage('cert-2', ''),
  'rasshirenie-skladskoj-programmy': rangeWhite,
  'invit-pereezd-na-mkad': plant,
  'invit-novye-nomera-telefonov': pesTapeWindow,
  'invit-novye-rekvizity-2017': aluPesRolls
};

export const newsCover = (id: string) => COVERS[id] || rangeNavy;

/** Сканы документов вписываем целиком, фото — кадрируем по месту. */
export const newsCoverFit = (id: string) =>
  id.startsWith('sertifikat') ? 'object-contain p-3 bg-inv-surface-2' : 'object-cover';
