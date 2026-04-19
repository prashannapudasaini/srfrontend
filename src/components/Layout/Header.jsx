// frontend/src/components/Layout/Header.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { ShoppingCart, User, PhoneCall, Menu, X, LogOut } from 'lucide-react'; 
import ContactModal from '../ContactModal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartDrawer from './CartDrawer';

const Header = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth(); 
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const activeLink = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Added dropdown sub-items to the Products link
  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { 
      id: 'products', 
      label: 'Products', 
      path: '/products',
      dropdown: [
        { label: 'All Products', path: '/products' },
        { label: 'Ghee & Butter', path: '/products' },
        { label: 'Curd & Paneer', path: '/products' },
        { label: 'Ice Cream', path: '/products' },
        { label: 'Beverages', path: '/products' }
      ]
    },
    { id: 'about', label: 'Our Story', path: '/about' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'notices', label: 'Farm Updates', path: '/notices' },
  ];

  const handleLogout = async () => {
    await logout();
    if (clearCart) clearCart();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-0 z-40 border-b border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 relative">
          <div className="flex justify-between items-center">
            
            {/* === LOGO SECTION FIXED FOR MOBILE === */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <img 
                src="/logo.png" 
                alt="Sita Ram Organic Dairy Logo" 
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-base sm:text-xl font-serif font-bold text-dairyBlack leading-none">Sita Ram</h1>
                <span className="text-[7px] sm:text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-0.5">Gokul Milk</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-8 items-center">
              {navItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative group py-2" // Wrapper to handle hover state for dropdown
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    className={`text-sm tracking-wider uppercase transition-all duration-300 relative cursor-pointer ${
                      activeLink === item.id 
                        ? 'text-dairyBlack font-bold' 
                        : 'text-gray-700 font-medium hover:text-dairyBlack hover:font-bold'
                    }`}
                  >
                    {item.label}
                    
                    {hoveredItem === item.id && activeLink !== item.id && (
                      <motion.div layoutId="navHover" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-dairyRed/50" />
                    )}
                    {activeLink === item.id && (
                      <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-dairyRed shadow-[0_2px_8px_rgba(200,16,46,0.5)]" />
                    )}
                  </Link>

                  {/* Desktop Dropdown Menu */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          // pt-4 creates an invisible bridge so the mouse doesn't fall off the hover area
                          className="absolute top-full left-0 pt-4 w-48 z-50"
                        >
                          <div className="bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden flex flex-col">
                            {item.dropdown.map((dropItem, idx) => (
                              <Link
                                key={idx}
                                to={dropItem.path}
                                className="px-5 py-3 text-xs uppercase tracking-wider font-bold text-gray-600 hover:text-dairyRed hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                              >
                                {dropItem.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button onClick={() => setIsContactOpen(true)} className="hidden sm:flex text-dairyBlack hover:text-dairyRed transition-colors">
                <PhoneCall size={20} />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3 sm:gap-4">
                  <Link 
                    to={user?.role === 'admin' ? '/admin' : '/history'} 
                    className="text-dairyBlack hover:text-dairyRed transition-colors"
                  >
                    <User size={20} className="sm:w-[22px] sm:h-[22px]" />
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="hidden sm:block text-dairyBlack hover:text-dairyRed transition-colors"
                  >
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block text-sm font-bold text-dairyBlack hover:text-dairyRed transition-colors uppercase tracking-wider">
                  Login
                </Link>
              )}

              <button onClick={() => setIsCartOpen(true)} className="relative text-dairyBlack hover:text-dairyRed transition-colors p-1">
                <ShoppingCart size={22} className="sm:w-[24px] sm:h-[24px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-dairyRed text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-redGlow">
                    {cartCount}
                  </span>
                )}
              </button>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-dairyBlack z-50 p-1">
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 gap-4">
                {navItems.map((item) => (
                  <div key={item.id} className="flex flex-col">
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-sm tracking-wider uppercase font-bold ${
                        activeLink === item.id ? 'text-dairyRed' : 'text-gray-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                    
                    {/* Mobile Nested Dropdown Items */}
                    {item.dropdown && (
                      <div className="flex flex-col ml-4 mt-3 gap-3 border-l-2 border-gray-100 pl-4">
                        {item.dropdown.map((dropItem, idx) => (
                          <Link
                            key={idx}
                            to={dropItem.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs tracking-wider uppercase font-bold text-gray-500 hover:text-dairyRed"
                          >
                            {dropItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Login/Logout Link */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm tracking-wider uppercase font-bold text-gray-800"
                    >
                      Login
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-sm tracking-wider uppercase font-bold text-red-600 text-left flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;