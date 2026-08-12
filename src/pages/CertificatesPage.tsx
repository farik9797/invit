import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CertificatesSection } from '../components/CertificatesSection';
import { CertificateModal } from '../components/Modals/CertificateModal';
import { CertificateItem } from '../types';

export const CertificatesPage: React.FC = () => {
  const [selected, setSelected] = useState<CertificateItem | null>(null);

  return (
    <>
      <Breadcrumbs items={[{ label: 'Сертификаты' }]} />
      <CertificatesSection onSelectCertificate={setSelected} />
      <CertificateModal certificate={selected} onClose={() => setSelected(null)} />
    </>
  );
};
