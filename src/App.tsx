import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { paths } from './routes';
import { HomePage } from './pages/HomePage';

// Второй вариант главной тянет за собой GSAP. Грузим его отдельным чанком,
// чтобы посетители основного сайта не качали то, чем не пользуются.
const HomePageV2 = lazy(() =>
  import('./pages/HomePageV2').then((m) => ({ default: m.HomePageV2 }))
);
const LayoutV2 = lazy(() =>
  import('./components/home-v2/LayoutV2').then((m) => ({ default: m.LayoutV2 }))
);

const v2Fallback = <div className="min-h-screen bg-white" />;
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
          <Route
            path={paths.homeV2}
            element={<Suspense fallback={v2Fallback}>{<HomePageV2 />}</Suspense>}
          />

          {/* Весь сайт в синем с красным: обвязка варианта 2 и класс theme-v2,
              который подменяет переменные бренда (см. src/index.css) */}
          <Route element={<Suspense fallback={v2Fallback}>{<LayoutV2 />}</Suspense>}>
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
