import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const FloatingTypography = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax scrolling value for the background image
  const imgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  // Adjusted height for mobile (50vh) so object-contain doesn't leave massive white gaps
  return (
    <div ref={containerRef} className="relative overflow-hidden bg-white flex flex-col items-center justify-center min-h-[50vh] md:min-h-screen border-y border-gray-100">
      
      {/* 1. THE WATERMARK: Responsive "SR" Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
        <span className="text-[15rem] md:text-[45rem] font-serif font-black text-[#1A1A1A] tracking-tighter">
          SR
        </span>
      </div>

      {/* 2. THE HERO IMAGE: Parallax and Responsive Fitting */}
      <motion.div 
        style={{ y: imgY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4 md:px-0"
      >
        {/* object-contain for mobile, object-cover for larger screens */}
        <img 
          src="/hero_5.png" 
          alt="Sita Ram Heritage"
          className="w-full h-full object-contain md:object-cover md:scale-105 transition-all duration-700 ease-out drop-shadow-2xl"
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />
      </motion.div>

      {/* 3. DECORATIVE FLOATING ORBS: Scaled down for mobile */}
      <motion.div
        animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[25%] w-32 md:w-56 h-32 md:h-56 bg-[#7A0000]/10 rounded-full blur-[80px] md:blur-[110px] z-20"
      />
      <motion.div
        animate={{ y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-[8%] bottom-[15%] w-40 md:w-72 h-40 md:h-72 bg-[#1A1A1A]/5 rounded-full blur-[90px] md:blur-[130px] z-20"
      />
    </div>
  );
};

export default FloatingTypography;