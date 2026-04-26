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

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { 
      id: 'products', 
      label: 'Products', 
      path: '/products',
      dropdown: [
        { label: 'All Products', path: '/products?category=All' },
        { label: 'Ghee', path: '/products?category=Ghee' },
        { label: 'Curd', path: '/products?category=Curd' },
        { label: 'Paneer', path: '/products?category=Paneer' },
        { label: 'Cheese', path: '/products?category=Cheese' },
        { label: 'Icecream', path: '/products?category=Ice Cream' },
        { label: 'Beverage', path: '/products?category=Beverages' },
        { label: 'Milk', path: '/products?category=Milk' },
        { label: 'Butter', path: '/products?category=Butter' },
        { label: 'Lassi', path: '/products?category=Lassi' }
      ]
    },
    { id: 'about', label: 'Our Story', path: '/about' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'notices', label: 'Farm Updates', path: '/notices' },
    { id: 'availability', label: 'Availability', path: '/availability' },
    { id: 'outlets', label: 'Outlets', path: '/outlets' },
  ];

  const handleLogout = async () => {
    await logout();
    if (clearCart) clearCart();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 relative">
          <div className="flex justify-between items-center">
            
            <Link to="/" className="flex items-center gap-3 sm:gap-4 group shrink-0">
              {/* === AESTHETIC POPPING BADGE === */}
              <motion.img 
                src="/leading.png" 
                alt="Leading Brand Badge"
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-sm"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
              />

              {/* Main Logo & Text */}
              <div className="flex items-center gap-3 border-l border-gray-200 pl-3 sm:pl-4">
                <img 
                  src="/logo.png" 
                  alt="Sita Ram Dairy Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-lg sm:text-2xl font-serif font-black text-[#1A1A1A] leading-none">Sita Ram</h1>
                  <span className="text-[8px] sm:text-[10px] font-bold text-[#E41E26] uppercase tracking-[0.2em] mt-0.5">Gokul Milk</span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-4 xl:gap-8 items-center">
              {navItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative group py-2"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    className={`text-xs xl:text-sm tracking-wider uppercase transition-all duration-300 relative cursor-pointer ${
                      activeLink === item.id 
                        ? 'text-[#1A1A1A] font-black' 
                        : 'text-gray-600 font-bold hover:text-[#1A1A1A]'
                    }`}
                  >
                    {item.label}
                    
                    {hoveredItem === item.id && activeLink !== item.id && (
                      <motion.div layoutId="navHover" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#E41E26]/50" />
                    )}
                    {activeLink === item.id && (
                      <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#E41E26]" />
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
                                className="px-5 py-3 text-xs uppercase tracking-wider font-bold text-gray-600 hover:text-[#E41E26] hover:bg-red-50 transition-colors border-b border-gray-50 last:border-none"
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

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button onClick={() => setIsContactOpen(true)} className="hidden sm:flex text-gray-700 hover:text-[#E41E26] transition-colors">
                <PhoneCall size={20} />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3 sm:gap-4">
                  <Link to={user?.role === 'admin' ? '/admin' : '/history'} className="text-gray-700 hover:text-[#E41E26] transition-colors">
                    <User size={20} className="sm:w-[22px] sm:h-[22px]" />
                  </Link>
                  <button onClick={handleLogout} className="hidden sm:block text-gray-700 hover:text-[#E41E26] transition-colors">
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-700 hover:text-[#E41E26] transition-colors uppercase tracking-wider">
                  Login
                </Link>
              )}

              <button onClick={() => setIsCartOpen(true)} className="relative text-gray-700 hover:text-[#E41E26] transition-colors p-1">
                <ShoppingCart size={22} className="sm:w-[24px] sm:h-[24px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E41E26] text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-gray-700 z-50 p-1">
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
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
                        activeLink === item.id ? 'text-[#E41E26]' : 'text-[#1A1A1A]'
                      }`}
                    >
                      {item.label}
                    </Link>
                    
                    {item.dropdown && (
                      <div className="flex flex-col ml-4 mt-3 gap-3 border-l-2 border-gray-100 pl-4">
                        {item.dropdown.map((dropItem, idx) => (
                          <Link key={idx} to={dropItem.path} onClick={() => setIsMobileMenuOpen(false)} className="text-xs tracking-wider uppercase font-bold text-gray-500 hover:text-[#E41E26]">
                            {dropItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                  {!isAuthenticated ? (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm tracking-wider uppercase font-bold text-[#1A1A1A]">
                      Login
                    </Link>
                  ) : (
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-sm tracking-wider uppercase font-bold text-[#E41E26] text-left flex items-center gap-2">
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