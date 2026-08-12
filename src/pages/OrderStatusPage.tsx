import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { OrderStatusModule } from '../components/OrderStatusModule';

export const OrderStatusPage: React.FC = () => (
  <>
    <Breadcrumbs items={[{ label: 'Статус заказа' }]} />
    <OrderStatusModule />
  </>
);
