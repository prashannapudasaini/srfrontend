// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';

// Global Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import FloatingChat from './components/FloatingChat'; 

// Public Facing Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import NoticesPage from './pages/NoticesPage';
import AvailabilityPage from './pages/AvailabilityPage'; // <--- NEW IMPORT
import OutletsPage from './pages/OutletsPage';           // <--- NEW IMPORT

// Shopping, Checkout & History
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Authentication Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Dashboard & Management (Nested Routes)
import Dashboard from './admin/Dashboard';
import Overview from './admin/Overview'; 
import ProductManagement from './admin/ProductManagement';
import MilkStockManagement from './admin/MilkStockManagement'; 
import OrderManagement from './admin/OrderManagement';
import BannerManagement from './admin/BannerManagement';
import UserManagement from './admin/UserManagement'; 

/**
 * ScrollToTop Utility Component
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/**
 * PublicLayout Wrapper
 * Ensures Header, Footer, and Floating Chat only appear on user-facing pages.
 */
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen relative">
    <Header />
    <main className="flex-grow bg-[#FDF8E7]">
      {children}
    </main>
    <Footer />
    
    {/* This will float over all public pages */}
    <FloatingChat /> 
  </div>
);

function App() {
  return (
    <Router 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      {/* Global Scroll Handler */}
      <ScrollToTop />

      <Routes>
        {/* === PUBLIC USER ROUTES === */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
        <Route path="/notices" element={<PublicLayout><NoticesPage /></PublicLayout>} />
        
        {/* === NEWLY ADDED PAGES === */}
        <Route path="/availability" element={<PublicLayout><AvailabilityPage /></PublicLayout>} />
        <Route path="/outlets" element={<PublicLayout><OutletsPage /></PublicLayout>} />
        
        {/* === AUTHENTICATION === */}
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

        {/* === SHOPPING FLOW === */}
        <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
        <Route path="/history" element={<PublicLayout><OrderHistoryPage /></PublicLayout>} />

        {/* === ADMIN PANEL (NESTED) === */}
        {/* We use a separate layout/Dashboard here, so FloatingChat won't show up */}
        <Route path="/admin" element={<Dashboard />}>
          <Route index element={<Overview />} /> 
          <Route path="products" element={<ProductManagement />} />
          <Route path="milk" element={<MilkStockManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* === 404 NOT FOUND === */}
        <Route path="*" element={
          <PublicLayout>
            <div className="flex flex-col items-center justify-center py-40 text-center px-6">
              <h1 className="text-[12rem] font-serif font-black text-[#9e111a]/5 leading-none">404</h1>
              <div className="relative -mt-20">
                <h2 className="text-4xl font-serif font-black text-[#1A1A1A] mb-4">Lost in the pasture?</h2>
                <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">
                  The page you are looking for has moved to a different pasture or no longer exists.
                </p>
                <Link to="/" className="inline-flex items-center gap-3 bg-[#9e111a] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#1A1A1A] transition-all shadow-xl">
                  Return to Farm Home
                </Link>
              </div>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;