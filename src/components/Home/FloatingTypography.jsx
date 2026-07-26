import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// 1. IMPORT THE IMAGE DIRECTLY
import hero5 from '../../assets/hero_5.webp';

const FloatingTypography = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect (Now only applied to desktop)
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    // ADJUSTED: Using py-2 on mobile for a very tight, balanced gap at the top and bottom
    <div ref={containerRef} className="relative overflow-hidden bg-[#FDF8E7] flex flex-col items-center justify-center md:min-h-screen border-y border-gray-100 py-2 md:py-0">
      
      {/* 1. THE WATERMARK: Responsive "SR" Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
        <span className="text-[15rem] md:text-[45rem] font-serif font-black text-[#1A1A1A] tracking-tighter">
          SR
        </span>
      </div>

      {/* ========================================================= */}
      {/* 2A. DESKTOP HERO IMAGE (Absolute, Full Screen, Parallax)  */}
      {/* ========================================================= */}
      <motion.div 
        style={{ y: imgY }}
        className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-10 w-full"
      >
        <img 
          src={hero5} 
          alt="Sita Ram Heritage"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-700 ease-out shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8E7]/40 via-transparent to-[#FDF8E7]/20 pointer-events-none" />
      </motion.div>

      {/* ========================================================= */}
      {/* 2B. MOBILE HERO IMAGE (Relative, Static, NO Parallax Gap) */}
      {/* ========================================================= */}
      <div className="flex md:hidden relative items-center justify-center pointer-events-none z-10 w-full px-4">
        <img 
          src={hero5} 
          alt="Sita Ram Heritage"
          className="w-full h-auto object-contain object-center shadow-2xl rounded-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8E7]/40 via-transparent to-[#FDF8E7]/20 pointer-events-none rounded-2xl" />
      </div>

      {/* 3. DECORATIVE FLOATING ORBS */}
      <motion.div
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[5%] top-[10%] w-24 md:w-56 h-24 md:h-56 bg-[#7A0000]/15 rounded-full blur-[60px] md:blur-[110px] z-20 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-[5%] bottom-[10%] w-32 md:w-72 h-32 md:h-72 bg-[#1A1A1A]/10 rounded-full blur-[70px] md:blur-[130px] z-20 pointer-events-none"
      />
    </div>
  );
};

export default FloatingTypography;