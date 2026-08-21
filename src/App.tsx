import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { paths } from './routes';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { HomePageV2 } from './pages/HomePageV2';
import { CatalogPage } from './pages/CatalogPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { NewsPage } from './pages/NewsPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { ContactsPage } from './pages/ContactsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ShopProvider>
      {/* basename берётся из base сборки: '/' в разработке, '/invit/' на GitHub Pages */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Второй вариант главной: своя шапка и подвал, поэтому вне Layout */}
          <Route path={paths.homeV2} element={<HomePageV2 />} />

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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShopProvider>
  );
}
