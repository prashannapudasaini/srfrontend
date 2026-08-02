import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { ShoppingCart, User, PhoneCall, Menu, X, LogOut, ChevronDown, Globe } from 'lucide-react'; 
// ContactModal import removed
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartDrawer from './CartDrawer';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const Header = () => {
  // isContactOpen state removed
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null); 
  const [unreadCount, setUnreadCount] = useState(0);
  const [hideHeaderBadge, setHideHeaderBadge] = useState(false);
  const prevUnreadRef = useRef(0);
  
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show near the top
      if (currentScrollY < 80) {
        setIsVisible(true);
      }
      // Scrolling down -> hide navbar
      else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }
      // Scrolling up -> show navbar
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth(); 
  
  // --- i18n ---
  const { t, i18n } = useTranslation();
  const isNepali = i18n.language === 'ne';
  const navFontClass = isNepali ? "font-['Noto_Sans_Devanagari','Mukta',sans-serif] tracking-normal" : "tracking-wider";

  const toggleLanguage = () => {
    const newLang = isNepali ? 'en' : 'ne';
    i18n.changeLanguage(newLang);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const activeLink = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const [hoveredItem, setHoveredItem] = useState(null);

  // --- Fetch Unread Notifications Count ---
  useEffect(() => {
    let intervalId;
    const fetchUnreadNotifications = async () => {
      if (!isAuthenticated || !user?.id) {
        setUnreadCount(0);
        return;
      }
      try {
        const res = await api.get(`/user/notifications.php?user_id=${user.id}`);
        if (res?.data?.status === 'success' && Array.isArray(res.data.data)) {
          const unread = res.data.data.filter(n => parseInt(n.is_read) === 0).length;
          setUnreadCount(unread);
          // If a new alert arrived, re-enable the navbar badge
          if (unread > prevUnreadRef.current) {
            setHideHeaderBadge(false);
          }
          prevUnreadRef.current = unread;
        }
      } catch (error) {
        // Silently catch errors
      }
    };

    fetchUnreadNotifications();
    if (isAuthenticated && user?.id) {
      intervalId = setInterval(fetchUnreadNotifications, 30000); // Check for new alerts every 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated, user?.id]);

  // Only show badge in navbar if not on account pages AND user hasn't clicked "My Account" yet
  const showHeaderBadge = unreadCount > 0 && !hideHeaderBadge && !location.pathname.includes('/history') && !location.pathname.includes('/admin');

  const navItems = [
    { id: 'home', label: t('nav.home', 'Home'), path: '/' },
    { 
      id: 'products', 
      label: t('nav.products', 'Products'), 
      path: '/products',
      dropdown: [
        { label: t('nav.dropdown.all', 'All Products'), path: '/products?category=All' },
        { label: t('nav.dropdown.ghee', 'Ghee'), path: '/products?category=Ghee' },
        { label: t('nav.dropdown.curd', 'Curd'), path: '/products?category=Curd' },
        { label: t('nav.dropdown.paneer', 'Paneer'), path: '/products?category=Paneer' },
        { label: t('nav.dropdown.cheese', 'Cheese'), path: '/products?category=Cheese' },
        { label: t('nav.dropdown.icecream', 'Icecream'), path: '/products?category=Ice Cream' },
        { label: t('nav.dropdown.beverage', 'Beverage'), path: '/products?category=Beverages' },
        { label: t('nav.dropdown.milk', 'Milk'), path: '/products?category=Milk' },
        { label: t('nav.dropdown.butter', 'Butter'), path: '/products?category=Butter' },
        { label: t('nav.dropdown.lassi', 'Lassi'), path: '/products?category=Lassi' }
      ]
    },
    { id: 'about', label: t('nav.our_story', 'Our Story'), path: '/about' },
    { id: 'services', label: t('nav.services', 'Services'), path: '/services' },
    { id: 'notices', label: t('nav.farm_updates', 'Farm Updates'), path: '/notices' },
    { id: 'media', label: t('nav.media', 'Media'), path: '/media' },
    { id: 'outlets', label: t('nav.outlets', 'Outlets'), path: '/outlets' },
  ];

  const handleLogout = async () => {
    await logout();
    if (clearCart) clearCart();
    navigate('/login');
  };

  const toggleMobileMenu = (id) => {
    setExpandedMobileMenu(expandedMobileMenu === id ? null : id);
  };

  // Helper to cleanly close mobile menu and reset dropdowns
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMobileMenu(null);
  };

  const handleMyAccountClick = () => {
    setHideHeaderBadge(true);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header className={`bg-white/80 backdrop-blur-xl shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-gray-100 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-[1400px] mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-4 relative">
          <div className="flex justify-between items-center gap-1.5 sm:gap-4 lg:gap-8 w-full">
            
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-1.5 sm:gap-4 group shrink sm:shrink-0 min-w-0">
              <motion.img 
                src="/leading.webp" 
                alt="Leading Brand Badge"
                className="w-8 h-8 sm:w-14 sm:h-14 object-contain drop-shadow-sm shrink-0"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
              />

              <div className="flex items-center gap-1.5 sm:gap-3 border-l border-gray-200 pl-1.5 sm:pl-4 min-w-0">
                <img 
                  src="/logo.png" 
                  alt="Sita Ram Dairy Logo" 
                  className="w-7 h-7 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
                />
                <div className="flex flex-col justify-center min-w-0 overflow-visible py-1">
                   <h1 className={`text-base sm:text-xl font-serif font-black text-[#1A1A1A] leading-snug pt-1 overflow-visible truncate ${isNepali ? "font-['Noto_Sans_Devanagari','Mukta',sans-serif]" : ""}`}>
                    {t('brand.name', 'Sita Ram')}
                   </h1>
                  <span className={`text-[10px] sm:text-xs font-bold text-[#9e111a] uppercase leading-tight truncate ${isNepali ? "font-['Noto_Sans_Devanagari','Mukta',sans-serif]" : "tracking-normal sm:tracking-[0.1em]"}`}>
                    {t('brand.subtitle', 'Gokul Milks Kathmandu')}
                  </span>
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex flex-1 justify-center gap-3 xl:gap-6 items-center">
              {navItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative group py-2"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    onClick={() => window.scrollTo(0, 0)}
                    className={`whitespace-nowrap text-[11px] xl:text-sm uppercase transition-all duration-300 relative cursor-pointer ${navFontClass} ${
                      activeLink === item.id 
                        ? 'text-[#9e111a] font-black' 
                        : 'text-gray-600 font-bold hover:text-[#1A1A1A]'
                    }`}
                  >
                    {item.label}
                    {hoveredItem === item.id && activeLink !== item.id && (
                      <motion.div layoutId="navHover" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#9e111a]/50" />
                    )}
                    {activeLink === item.id && (
                      <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#9e111a]" />
                    )}
                  </Link>

                  {item.dropdown && (
                    <AnimatePresence>
                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 pt-4 w-48 z-50"
                        >
                          <div className="bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden flex flex-col">
                            {item.dropdown.map((dropItem, idx) => (
                              <Link
                                key={idx}
                                to={dropItem.path}
                                onClick={() => window.scrollTo(0, 0)}
                                className={`px-5 py-3 text-xs uppercase font-bold text-gray-600 hover:text-[#9e111a] hover:bg-red-50 transition-colors border-b border-gray-50 last:border-none ${navFontClass}`}
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

            <div className="flex items-center gap-1.5 sm:gap-6 shrink-0">
              
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-gray-700 hover:text-[#9e111a] transition-colors bg-gray-50 hover:bg-gray-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-gray-200"
                title="Switch Language"
              >
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  {i18n.language === 'en' ? 'NE' : 'EN'}
                </span>
              </button>

              <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hidden sm:flex text-gray-700 hover:text-[#9e111a] transition-colors">
                <PhoneCall size={20} />
              </Link>

              {/* Profile Dropdown / Login Block */}
              {isAuthenticated ? (
                <div className="relative group hidden sm:block">
                  <button className="relative flex items-center justify-center w-9 h-9 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
                      <User size={15} />
                    </div>
                    {showHeaderBadge && (
                      <span className="absolute -top-1 -right-1 bg-[#9e111a] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link 
                      to={user?.role === 'admin' ? '/admin' : '/history'} 
                      onClick={handleMyAccountClick}
                      className="flex items-center justify-between px-5 py-3 text-xs uppercase tracking-wider font-bold text-gray-600 hover:text-[#9e111a] hover:bg-red-50 transition-colors border-b border-gray-50"
                    >
                      <span>My Account</span>
                      {showHeaderBadge && (
                        <span className="bg-[#9e111a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-5 py-3 text-xs uppercase tracking-wider font-bold text-gray-600 hover:text-[#9e111a] hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" onClick={() => window.scrollTo(0, 0)} className="hidden sm:flex text-xs font-black text-[#1A1A1A] hover:text-[#9e111a] transition-colors uppercase tracking-widest px-4 py-2 border border-gray-200 rounded-lg hover:border-[#9e111a]">
                  Login
                </Link>
              )}
              

              {/* Cart Button */}
               <button onClick={() => setIsCartOpen(true)} className="relative text-gray-700 hover:text-[#9e111a] transition-colors p-1">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 sm:-right-2 bg-[#9e111a] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
                

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => {
                  if (isMobileMenuOpen) closeMobileMenu();
                  else setIsMobileMenuOpen(true);
                }} 
                className="lg:hidden text-gray-700 z-50 p-1"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 sm:w-[26px] sm:h-[26px]" /> : <Menu className="w-6 h-6 sm:w-[26px] sm:h-[26px]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden absolute top-full left-0 w-full h-screen bg-black/40 backdrop-blur-sm z-40"
                onClick={closeMobileMenu}
              />

              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="lg:hidden absolute top-full right-0 w-[80%] sm:w-[60%] h-screen bg-white shadow-2xl border-l border-t border-gray-100 overflow-y-auto pb-32 z-50"
              >
                <div className="flex flex-col px-6 py-4 gap-4">
                  {navItems.map((item) => (
                    <div key={item.id} className="flex flex-col">
                      {item.dropdown ? (
                        <button
                          onClick={() => toggleMobileMenu(item.id)}
                          className={`text-sm uppercase font-bold flex justify-between items-center text-left ${navFontClass} ${
                            activeLink === item.id || expandedMobileMenu === item.id ? 'text-[#9e111a]' : 'text-[#1A1A1A]'
                          }`}
                        >
                          {item.label}
                          <ChevronDown 
                            size={18} 
                            className={`transition-transform duration-300 ${expandedMobileMenu === item.id ? 'rotate-180' : ''}`}
                          />
                        </button>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => {
                            closeMobileMenu();
                            window.scrollTo(0, 0);
                          }}
                          className={`text-sm uppercase font-bold ${navFontClass} ${
                            activeLink === item.id ? 'text-[#9e111a]' : 'text-[#1A1A1A]'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                      
                      <AnimatePresence>
                        {item.dropdown && expandedMobileMenu === item.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col ml-4 mt-3 gap-3 border-l-2 border-gray-100 pl-4 overflow-hidden"
                          >
                            {item.dropdown.map((dropItem, idx) => (
                              <Link 
                                key={idx} 
                                to={dropItem.path} 
                                onClick={() => {
                                  closeMobileMenu();
                                  window.scrollTo(0, 0);
                                }} 
                                className={`text-xs uppercase font-bold text-gray-500 hover:text-[#9e111a] ${navFontClass}`}
                              >
                                {dropItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <div className="flex flex-col">
                    <Link
                      to="/contact"
                      onClick={() => {
                        closeMobileMenu();
                        window.scrollTo(0, 0);
                      }}
                      className={`text-sm uppercase font-bold ${navFontClass} ${
                        activeLink === 'contact' ? 'text-[#9e111a]' : 'text-[#1A1A1A]'
                      }`}
                    >
                      {t('nav.contact', 'Contact')}
                    </Link>
                  </div>

                  {/* Mobile Auth Links */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                    {!isAuthenticated ? (
                      <Link to="/login" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }} className="text-sm tracking-wider uppercase font-bold text-[#1A1A1A] flex items-center gap-2">
                        <User size={18} /> Login / Register
                      </Link>
                    ) : (
                      <>
                        <Link 
                          to={user?.role === 'admin' ? '/admin' : '/history'} 
                          onClick={() => { 
                            setIsMobileMenuOpen(false); 
                            handleMyAccountClick();
                          }} 
                          className="text-sm tracking-wider uppercase font-bold text-[#002147] flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2"><User size={18} /> My Account</span>
                          {showHeaderBadge && (
                            <span className="bg-[#9e111a] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-sm tracking-wider uppercase font-bold text-[#9e111a] text-left flex items-center gap-2">
                          <LogOut size={18} /> Logout
                        </button>
                      </>
                    )}
                  </div>
                  
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Removed ContactModal component instance */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;