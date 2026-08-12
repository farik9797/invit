import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ManufacturingSection } from '../components/ManufacturingSection';
import { useShop } from '../context/ShopContext';
import { paths } from '../routes';

export const AboutPage: React.FC = () => {
  const shop = useShop();
  const navigate = useNavigate();

  return (
    <>
      <Breadcrumbs items={[{ label: 'О компании' }]} />
      <ManufacturingSection
        onOpenCallback={() => shop.openCallback('Запрос презентации компании')}
        onOpenCertificates={() => navigate(paths.certificates)}
      />
    </>
  );
};
