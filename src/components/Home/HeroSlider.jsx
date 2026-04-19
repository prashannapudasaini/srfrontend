// frontend/src/components/Home/HeroSlider.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MilkDivider from './MilkDivider';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
    const slides = [
    {
      id: 1,
      title: "Pure Organic GHEE",
      subtitle: "Fresh from our happy cows",
      description: "Slow-churned, aromatic golden ghee. Rich in nutrients and pure taste..",
      image: "/hero_1.png", // Image 1
      buttonText: "Explore Ghee"
    },
    {
      id: 2,
      title: "Energy Fresh Drink",
      subtitle: "Traditional model Method",
      description: "Farm-fresh, A2 organic ghee to elevate your food taste.",
      image: "/hero_2.png", // Image 2
      buttonText: "shop Now"
    },
    {
      id: 3,
      title: "Fresh Dairy Products",
      subtitle: "Straight from nature",
      description: "Experience the true taste of purity with our wide range of organic dairy lassi.",
      image: "/hero_3.png", // Image 3
      buttonText: "View Collection"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000); // Slower, cinematic transition
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-[90vh] md:h-screen overflow-hidden bg-[#a80000]">
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
              <p className="text-lg md:text-xl mb-10 text-gray-200 font-sans max-w-lg">
                {slides[currentIndex].description}
              </p>
              <button className="bg-[#E2B254] text-[#a80000] px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(226,178,84,0.3)]">
                {slides[currentIndex].buttonText}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Indicators */}
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