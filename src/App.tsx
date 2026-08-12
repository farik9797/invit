import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { NewsPage } from './pages/NewsPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { ContactsPage } from './pages/ContactsPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ShopProvider>
      {/* basename берётся из base сборки: '/' в разработке, '/invit/' на GitHub Pages */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:categorySlug" element={<CategoryPage />} />
            <Route path="/catalog/:categorySlug/:productSlug" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:newsId" element={<NewsArticlePage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/status" element={<OrderStatusPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShopProvider>
  );
}
