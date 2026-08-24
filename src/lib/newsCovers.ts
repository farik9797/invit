import { PRODUCTS } from '../data/catalogData';
import { certificateImage, productImage } from './productImages';
import heroRoof from '../assets/hero/roof-standing-seam.webp';
import heroTape from '../assets/hero/tape-application.webp';
import heroSheets from '../assets/hero/roof-profile-sheets.webp';
import heroSlab from '../assets/hero/tape-slab-joint.webp';

/*
 * Обложки новостей.
 *
 * К заметкам на invit.by приложен клипарт нулевых (эмблема палаты, картинка
 * телефона, печать «важная информация») — его мы не переносили. Настоящих
 * фотографий к событиям у клиента нет, поэтому обложка подбирается по теме:
 * новости про сертификацию получают скан самого сертификата, новость про
 * расширение складской программы — фото той ленты, о которой в ней речь,
 * остальные — кадры производства.
 *
 * Если клиент пришлёт настоящие фото, менять надо только эту карту.
 */

const sandwichTape = PRODUCTS.find((p) => p.id === 'lenta-dlja-sjendvich-panelej');

const COVERS: Record<string, string> = {
  'sertifikat-invit-2025-2027': certificateImage('cert-1', ''),
  'sertifikat-beltpp-2014': certificateImage('cert-2', ''),
  'rasshirenie-skladskoj-programmy': sandwichTape ? productImage(sandwichTape) : heroSlab,
  'invit-pereezd-na-mkad': heroSlab,
  'invit-novye-nomera-telefonov': heroTape,
  'invit-novye-rekvizity-2017': heroSheets
};

export const newsCover = (id: string) => COVERS[id] || heroRoof;

/** Сканы документов вписываем целиком, фото — кадрируем по месту. */
export const newsCoverFit = (id: string) =>
  id.startsWith('sertifikat') ? 'object-contain p-3 bg-inv-surface-2' : 'object-cover';
