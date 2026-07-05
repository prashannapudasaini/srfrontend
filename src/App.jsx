// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { XCircle } from 'lucide-react';

import DeliveryDashboard from './delivery/DeliveryDashboard';

// Global Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import FloatingChat from './components/FloatingChat'; 
import ProtectedRoute from './components/ProtectedRoute'; // <-- ADDED IMPORT

// Public Facing Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import NoticesPage from './pages/NoticesPage';
import MediaPage from './pages/MediaPage';         
import AvailabilityPage from './pages/AvailabilityPage'; 
import OutletsPage from './pages/OutletsPage';          
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage'; 
import BlogPage from './pages/BlogPage';
import BlogPostDetail from './pages/BlogPostDetail';
import PaymentSuccess from './pages/PaymentSuccess';

// Shopping, Checkout & History
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Authentication Pages
import LoginPage from './pages/LoginPage';

// Admin Dashboard & Management (Nested Routes)
import Dashboard from './admin/Dashboard';
import AdminOverview from './admin/AdminOverview'; 
import ProductManagement from './admin/ProductManagement';
import MilkStockManagement from './admin/MilkStockManagement'; 
import OrderManagement from './admin/OrderManagement';
import BannerManagement from './admin/BannerManagement';
import UserManagement from './admin/UserManagement'; 
import MediaManagement from './admin/MediaManagement';
import SubscriptionManagement from './admin/SubscriptionManagement';

// Ice Cream Page
import IceCreamPage from './pages/IceCreamPage';

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
        <Route path="/subscription-success" element={<PublicLayout><SubscriptionSuccessPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/blog/:id" element={<PublicLayout><BlogPostDetail /></PublicLayout>} />
        
        {/* === ESEWA PAYMENT ROUTES === */}
        <Route path="/payment-success" element={<PaymentSuccess/>} />
        
        {/* ADDED: Payment Failure Route */}
        <Route path="/payment-failure" element={
          <PublicLayout>
            <div className="flex flex-col items-center justify-center py-32 text-center px-6">
              <div className="w-24 h-24 bg-red-50 rounded-[2rem] border border-red-100 flex items-center justify-center text-[#9e111a] mb-6 shadow-sm">
                <XCircle size={48} strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-serif font-black text-[#1A1A1A] mb-4">Payment Failed</h2>
              <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">
                Your transaction was cancelled or unsuccessful. No charges were made to your account.
              </p>
              <Link to="/checkout" className="inline-flex items-center gap-3 bg-[#9e111a] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#1A1A1A] transition-all shadow-xl">
                Return to Checkout
              </Link>
            </div>
          </PublicLayout>
        } />
        
        {/* === MEDIA & UPDATES === */}
        <Route path="/media" element={<PublicLayout><MediaPage /></PublicLayout>} /> 
      
        {/* === NEWLY ADDED PAGES === */}
        <Route path="/availability" element={<PublicLayout><AvailabilityPage /></PublicLayout>} />
        <Route path="/outlets" element={<PublicLayout><OutletsPage /></PublicLayout>} />
        
        {/* === AUTHENTICATION === */}
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />

        {/* === SHOPPING FLOW === */}
        <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
        <Route path="/history" element={<PublicLayout><OrderHistoryPage /></PublicLayout>} />

        {/* === ADMIN PANEL (NESTED & PROTECTED) === */}
        {/* The ProtectedRoute wraps the main Dashboard. All children inherit this protection automatically! */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="milk" element={<MilkStockManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="media" element={<MediaManagement />} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
        </Route>

        {/* === ICE CREAM PAGE === */}
        <Route path="/ice-cream" element={<IceCreamPage />} />

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