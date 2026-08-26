import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ManufacturingSection } from '../components/ManufacturingSection';
import { useShop } from '../context/ShopContext';
import { paths } from '../routes';

/*
 * АРХИВ. Первая версия страницы «О компании» — та, что была до редизайна:
 * весь текст в трёх вкладках внутри одной белой карточки.
 *
 * Клиент попросил сохранить её на отдельном адресе `/about-old`, чтобы можно
 * было сравнить с новой. Живая страница — `AboutPage.tsx`.
 *
 * Внимание: часть фактов здесь не подтверждена клиентом (точность порезки,
 * оборудование, лаборатория, стандарты) — из-за этого страницу и переписали.
 * Ничего отсюда переносить в живые страницы без проверки нельзя.
 */
export const AboutOldPage: React.FC = () => {
  const shop = useShop();
  const navigate = useNavigate();

  return (
    <>
      <Breadcrumbs items={[{ label: 'О компании — старая версия' }]} />
      <ManufacturingSection
        onOpenCallback={() => shop.openCallback('Запрос презентации компании')}
        onOpenCertificates={() => navigate(paths.certificates)}
      />
    </>
  );
};
