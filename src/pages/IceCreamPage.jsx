// frontend/src/pages/IceCreamPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, Info, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import all Ice Cream Images
import chocolate100 from '../assets/chocolate_100.png';
import chocolate500 from '../assets/chocolate_500.png';
import butterscotch100 from '../assets/butterscotch_100.png';
import butterscotch500 from '../assets/butterscotch_500.png';
import vanilla100 from '../assets/vanilla_100.png';
import vanilla500 from '../assets/vanilla_500.png';
import strawberry100 from '../assets/strawberry_100.png';
import strawberry500 from '../assets/strawberry_500.png';

const ICE_CREAMS = [
  {
    id: 'chocolate',
    name: 'Chocolate', // Changed from Premium Chocolate
    tagline: 'Rich, indulgent Belgian cocoa blend.',
    themeText: 'text-[#4A2511]',
    themeBg: 'bg-[#4A2511]',
    glowBg: 'from-[#4A2511]/20 to-transparent',
    watermark: 'COCOA',
    variants: {
      '100ml': { price: 75, image: chocolate100, label: 'Single Cup' },
      '500ml': { price: 240, image: chocolate500, label: 'Family Tub' }
    }
  },
  {
    id: 'butterscotch',
    name: 'Butter Scotch',
    tagline: 'Crunchy praline in creamy caramel.',
    themeText: 'text-[#D49A36]',
    themeBg: 'bg-[#D49A36]',
    glowBg: 'from-[#D49A36]/20 to-transparent',
    watermark: 'CARAMEL',
    variants: {
      '100ml': { price: 75, image: butterscotch100, label: 'Single Cup' },
      '500ml': { price: 240, image: butterscotch500, label: 'Family Tub' }
    }
  },
  {
    id: 'vanilla',
    name: 'Classic Vanilla',
    tagline: 'Made with real vanilla bean extract.',
    themeText: 'text-[#B89B42]',
    themeBg: 'bg-[#B89B42]',
    glowBg: 'from-[#F3E5AB]/40 to-transparent',
    watermark: 'CLASSIC',
    variants: {
      '100ml': { price: 65, image: vanilla100, label: 'Single Cup' },
      '500ml': { price: 210, image: vanilla500, label: 'Family Tub' }
    }
  },
  {
    id: 'strawberry',
    name: 'Fresh Strawberry',
    tagline: 'Bursting with real berry goodness.',
    themeText: 'text-[#E8748F]',
    themeBg: 'bg-[#E8748F]',
    glowBg: 'from-[#E8748F]/20 to-transparent',
    watermark: 'BERRY',
    variants: {
      '100ml': { price: 65, image: strawberry100, label: 'Single Cup' },
      '500ml': { price: 210, image: strawberry500, label: 'Family Tub' }
    }
  }
];

export default function IceCreamPage() {
  const [activeFlavor, setActiveFlavor] = useState(0);
  const [activeSize, setActiveSize] = useState('500ml'); // Default to 500ml

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentProduct = ICE_CREAMS[activeFlavor];
  const currentVariant = currentProduct.variants[activeSize];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-12 flex flex-col font-sans selection:bg-[#9e111a] selection:text-white">
      
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center mb-8 z-20 relative">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#9e111a] font-bold text-xs uppercase tracking-widest transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2 text-xs font-bold text-[#9e111a] uppercase tracking-widest">
          <Star size={14} fill="currentColor" /> Artisanal Dairy
        </div>
      </div>

      {/* Main Interactive Showcase */}
      <div className="max-w-7xl mx-auto px-6 w-full flex-grow flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
        
        {/* LEFT SIDE: Immersive Visuals */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] relative flex items-center justify-center rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-gray-100/50">
          
          {/* Dynamic Background Gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br transition-colors duration-1000"
            style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
            animate={{ 
              '--tw-gradient-from': currentProduct.glowBg.split(' ')[0].replace('from-', ''),
              '--tw-gradient-to': 'transparent'
            }}
          />

          {/* Giant Watermark Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id + '-watermark'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.04, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
            >
              <span className="text-[8rem] lg:text-[12rem] font-black tracking-tighter text-black uppercase transform -rotate-12 whitespace-nowrap">
                {currentProduct.watermark}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Floating Ice Cream Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id + activeSize}
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -50, rotate: 5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10 w-3/4 h-3/4 flex items-center justify-center"
            >
              <motion.img
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                src={currentVariant.image}
                alt={`${currentProduct.name} ${activeSize}`}
                className="w-full h-full object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.25)]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT SIDE: Interactive Controls & Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          
          {/* Title & Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id + "-text"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <h1 className="text-5xl lg:text-7xl font-serif font-black text-[#1A1A1A] mb-4 leading-tight tracking-tight">
                {currentProduct.name}
              </h1>
              <p className="text-gray-500 text-lg lg:text-xl font-medium max-w-md leading-relaxed">
                {currentProduct.tagline} Made from 100% pure Sita Ram milk.
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Flavor Selector */}
          <div className="mb-10">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Flavor</h3>
            <div className="flex flex-wrap gap-3">
              {ICE_CREAMS.map((flavor, index) => (
                <button
                  key={flavor.id}
                  onClick={() => setActiveFlavor(index)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                    activeFlavor === index
                      ? `border-transparent ${flavor.themeBg} text-white shadow-lg transform scale-105`
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {flavor.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Segmented Control */}
          <div className="mb-12">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Size</h3>
            <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl relative">
              {['100ml', '500ml'].map((size) => (
                <button
                  key={size}
                  onClick={() => setActiveSize(size)}
                  className={`relative px-8 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 z-10 ${
                    activeSize === size ? currentProduct.themeText : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {activeSize === size && (
                    <motion.div
                      layoutId="activeSizeBg"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {size} {size === '100ml' ? 'Cup' : 'Tub'}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Action Section */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Price</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVariant.price}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-4xl font-black text-[#1A1A1A]"
                >
                  NPR {currentVariant.price}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 mb-3">
                <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">Bulk Orders Only</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Online buying is disabled for ice creams. Please contact us directly for events and large orders.</p>
                </div>
              </div>
              <a 
                href="tel:015213049" 
                className={`w-full flex items-center justify-center gap-2 ${currentProduct.themeBg} text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <Phone size={16} /> Order: 015213049
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}