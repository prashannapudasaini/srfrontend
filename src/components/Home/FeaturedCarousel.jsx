// frontend/src/components/Home/FeaturedCarousel.jsx
import { motion } from 'framer-motion';

const FeaturedCarousel = () => {
  const featured = [
    "We're Featured In", 
    "We're Featured In", 
    "We're Featured In", 
    "We're Featured In", 
    "We're Featured In", 
    "We're Featured In"
  ];

  return (
    /* Background set to the Deepest Red (#7A0000) for maximum gold contrast */
    <div className="overflow-hidden py-6 bg-[#7A0000] border-y-2 border-[#E2B254]/20 shadow-2xl relative z-20">
      
      {/* Edge Gradients: Fading from Deep Red to Transparent */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#7A0000] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#7A0000] to-transparent z-10" />

      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="flex gap-16 whitespace-nowrap items-center"
      >
        {/* Tripled array for seamless infinite scroll */}
        {[...featured, ...featured, ...featured].map((item, index) => (
          <div key={index} className="flex items-center gap-16">
            
            {/* Main Text: Luxury Gold (#E2B254) with a gold-tinted shadow */}
            <span className="text-[#E2B254] text-sm md:text-base font-black tracking-[0.4em] uppercase flex items-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {item}
            </span>
            
            {/* Separator icon in a muted, elegant Gold */}
            <span className="text-[#E2B254]/40 text-2xl">
              ✧
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedCarousel;