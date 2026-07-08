import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // <-- Imported Icons for arrows
import MilkDivider from './MilkDivider';

// IMPORT YOUR IMAGES DIRECTLY
import hero1 from '../../assets/hero_1.webp';
import hero2 from '../../assets/hero_2.webp';
import hero3 from '../../assets/hero_3.webp';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Pure Organic Ghee",
      subtitle: "Authentic Homemade Taste",
      // Condensed to 22 words
      description: "Healthy, flavorful ghee with a rich aroma and granulated texture. Hygienically packed for authentic homemade taste, perfect for traditional and modern cooking.",
      image: hero1, 
    },
    {
      id: 2,
      title: "Energy Fresh Drink",
      subtitle: "Smooth & Energizing",
      // Condensed to 21 words, flavor-neutral for all 5 flavors
      description: "A refreshing low-fat dairy beverage packed with protein and calcium. Hygienically processed and ready to drink for a smooth, energizing boost.",
      image: hero2, 
    },
    {
      id: 3,
      title: "Strawberry Lassi",
      subtitle: "Fresh Curd & Berries",
      // Condensed to 21 words
      description: "Smooth, creamy lassi blended with fresh curd and delicious strawberry crush. Rich in protein and calcium, hygienically packed for refreshing enjoyment.",
      image: hero3, 
    }
  ];

  // Manual Navigation Functions
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-sliding interval
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative h-[90vh] md:h-screen overflow-hidden bg-[#a80000] group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
          >
            {/* Deep Navy Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#a80000]/90 via-[#a80000]/50 to-transparent" />
          </div>
          
          <div className="relative h-full flex items-center max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-2xl text-white pt-20"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="w-12 h-0.5 bg-[#E2B254]"></span>
                <h2 className="text-[#E2B254] uppercase tracking-[0.2em] text-sm font-bold">
                  {slides[currentIndex].subtitle}
                </h2>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-6 leading-[1.1] text-white">
                {slides[currentIndex].title}
              </h1>
              <p className="text-lg md:text-xl mb-10 text-gray-200 font-sans max-w-lg leading-relaxed">
                {slides[currentIndex].description}
              </p>
              {/* Button removed as requested previously */}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* --- MANUAL SLIDING ARROWS --- */}
      {/* Hidden on mobile to prevent clutter, visible on hover on larger screens */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-[#E2B254] text-white hover:text-[#a80000] rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-[#E2B254] text-white hover:text-[#a80000] rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <ChevronRight size={28} strokeWidth={2.5} />
      </button>

      {/* Pagination Indicators (Dots) */}
      <div className="absolute bottom-24 left-6 lg:left-auto lg:right-12 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              currentIndex === index ? 'w-12 bg-[#E2B254]' : 'w-4 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Animated Liquid Transition to next section */}
      <div className="absolute bottom-0 w-full z-20">
        <MilkDivider />
      </div>
    </div>
  );
};

export default HeroSlider;