import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import Layout Components
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

// Import all Ice Cream Images
import chocolate100 from '../assets/chocolate_100.png';
import chocolate500 from '../assets/chocolate_500.png';
import butterscotch100 from '../assets/butterscotch_100.png';
import butterscotch500 from '../assets/butterscotch_500.png';
import vanilla100 from '../assets/vanilla_100.png';
import vanilla500 from '../assets/vanilla_500.png';
import strawberry100 from '../assets/strawberry_100.png';
import strawberry500 from '../assets/strawberry_500.png';

// Base Configuration (Themes, Images, Prices)
const ICE_CREAM_CONFIG = [
  {
    id: 'chocolate',
    fallbackName: 'Chocolate', 
    fallbackTagline: 'Rich, indulgent Belgian cocoa blend.',
    themeText: 'text-[#4A2511]',
    themeBg: 'bg-[#4A2511]',
    glowBg: 'from-[#4A2511]/20 to-transparent',
    variants: {
      '100ml': { price: 75, image: chocolate100 },
      '500ml': { price: 240, image: chocolate500 }
    }
  },
  {
    id: 'butterscotch',
    fallbackName: 'Butter Scotch',
    fallbackTagline: 'Crunchy praline in creamy caramel.',
    themeText: 'text-[#D49A36]',
    themeBg: 'bg-[#D49A36]',
    glowBg: 'from-[#D49A36]/20 to-transparent',
    variants: {
      '100ml': { price: 75, image: butterscotch100 },
      '500ml': { price: 240, image: butterscotch500 }
    }
  },
  {
    id: 'vanilla',
    fallbackName: 'Classic Vanilla',
    fallbackTagline: 'Made with real vanilla bean extract.',
    themeText: 'text-[#B89B42]',
    themeBg: 'bg-[#B89B42]',
    glowBg: 'from-[#F3E5AB]/40 to-transparent',
    variants: {
      '100ml': { price: 65, image: vanilla100 },
      '500ml': { price: 210, image: vanilla500 }
    }
  },
  {
    id: 'strawberry',
    fallbackName: 'Fresh Strawberry',
    fallbackTagline: 'Bursting with real berry goodness.',
    themeText: 'text-[#E8748F]',
    themeBg: 'bg-[#E8748F]',
    glowBg: 'from-[#E8748F]/20 to-transparent',
    variants: {
      '100ml': { price: 65, image: strawberry100 },
      '500ml': { price: 210, image: strawberry500 }
    }
  }
];

// Individual Card Component to handle independent state per flavor
const IceCreamCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const [activeSize, setActiveSize] = useState('500ml');
  const currentVariant = product.variants[activeSize];

  // Typography helper for Nepali script
  const isNepali = i18n.language === 'ne';
  // NEW
const nepaliFontClass = isNepali ? "nepali-heading" : "tracking-wider";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col relative group"
    >
      {/* Top Image Section */}
      <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-gray-100">
        
        {/* Full Fitting Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id + activeSize}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 z-10 w-full h-full"
          >
            <img
              src={currentVariant.image}
              alt={`${product.name} ${activeSize}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </AnimatePresence>

        {/* Giant Watermark Text placed OVER the image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-20 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
          <span className={`text-[6rem] sm:text-[9rem] font-black text-white mix-blend-overlay drop-shadow-md uppercase transform -rotate-12 whitespace-nowrap ${isNepali ? nepaliFontClass : 'tracking-tighter'}`}>
            {product.watermark}
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-8 sm:p-10 flex flex-col flex-grow bg-white z-20">
        <h2 className={`text-4xl font-serif font-black text-[#1A1A1A] mb-3 ${isNepali ? nepaliFontClass : 'leading-tight tracking-tight'}`}>
          {product.name}
        </h2>
        <p className={`text-gray-500 text-base font-medium mb-8 ${isNepali ? nepaliFontClass : 'leading-relaxed'}`}>
          {product.tagline} {t('iceCream.card.madeFrom', 'Made from 100% pure Sita Ram milk.')}
        </p>

        {/* Size Segmented Control */}
        <div className="mb-10">
          <h3 className={`text-[10px] font-black text-gray-400 uppercase mb-3 ${isNepali ? nepaliFontClass : 'tracking-widest'}`}>
            {t('iceCream.card.selectSize', 'Select Size')}
          </h3>
          <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl relative w-full sm:w-auto">
            {['100ml', '500ml'].map((size) => (
              <button
                key={size}
                onClick={() => setActiveSize(size)}
                className={`relative flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-black uppercase transition-all duration-300 z-10 ${isNepali ? nepaliFontClass : 'tracking-wider'} ${
                  activeSize === size ? product.themeText : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {activeSize === size && (
                  <motion.div
                    layoutId={`activeSizeBg-${product.id}`}
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {size} <span className="hidden sm:inline">
                  {size === '100ml' ? t('iceCream.card.cup', 'Cup') : t('iceCream.card.tub', 'Tub')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <span className={`text-[10px] font-black text-gray-400 uppercase block mb-1 ${isNepali ? nepaliFontClass : 'tracking-widest'}`}>
                {t('iceCream.card.totalPrice', 'Total Price')}
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVariant.price}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`text-3xl sm:text-4xl font-black text-[#1A1A1A] ${isNepali ? nepaliFontClass : ''}`}
                >
                  {t('common.currency', 'NPR')} {currentVariant.price}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 mb-4">
              <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className={`text-sm font-bold text-[#1A1A1A] ${isNepali ? nepaliFontClass : ''}`}>
                  {t('iceCream.card.bulkTitle', 'Bulk Orders Only')}
                </p>
                <p className={`text-xs text-gray-500 mt-1 ${isNepali ? nepaliFontClass : 'leading-relaxed'}`}>
                  {t('iceCream.card.bulkDesc', 'Online buying is disabled for ice creams. Please contact us directly for events and large orders.')}
                </p>
              </div>
            </div>
            <a 
              href="tel:015213049" 
              className={`w-full flex items-center justify-center gap-2 ${product.themeBg} text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isNepali ? nepaliFontClass : ''}`}
            >
              <Phone size={16} /> {t('iceCream.card.order', 'Order:')} 015213049
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function IceCreamPage() {
  const { t, i18n } = useTranslation();

  // Typography helper for Nepali script
  const isNepali = i18n.language === 'ne';
  const nepaliFontClass = isNepali 
    ? "font-['Noto_Sans_Devanagari','Mukta',sans-serif] leading-[1.8] tracking-normal" 
    : "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Merge static config with translations
  const translatedFlavors = t('iceCream.flavors', { returnObjects: true });
  const iceCreams = ICE_CREAM_CONFIG.map(config => ({
    ...config,
    name: translatedFlavors[config.id]?.name || config.fallbackName,
    tagline: translatedFlavors[config.id]?.tagline || config.fallbackTagline,
    
  }));

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      
      {/* Main Page Content */}
      <main className="flex-grow bg-[#FAF9F6] pt-32 pb-24 flex flex-col font-sans selection:bg-[#9e111a] selection:text-white">
        
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 w-full text-center mb-16 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl md:text-6xl lg:text-7xl font-serif font-black text-[#1A1A1A] mb-6 ${isNepali ? nepaliFontClass : 'tracking-tight'}`}
          >
            {t('iceCream.pageTitleLine1', 'Sita Ram ')} <span className="text-[#9e111a]">{t('iceCream.pageTitleLine2', 'Ice Creams')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto ${isNepali ? nepaliFontClass : ''}`}
          >
            {t('iceCream.pageSubtitle', 'Discover our luxurious collection of Sita Ram ice creams, crafted with pure milk and the finest ingredients.')}
          </motion.p>
        </div>

        {/* Main Grid Showcase */}
        <div className="max-w-7xl mx-auto px-6 w-full flex-grow relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16">
            {iceCreams.map((product) => (
              <IceCreamCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
}