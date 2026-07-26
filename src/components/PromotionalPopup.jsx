import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import popupImg from '../assets/popup.png';

export default function PromotionalPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* Smooth Dark Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-[#002147] rounded-[2rem] overflow-hidden shadow-2xl w-full max-w-md lg:max-w-lg border border-white/10 z-10 flex flex-col"
          >
            
            {/* Elegant Floating Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-full transition-colors z-20 group"
              aria-label="Close popup"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* FIXED: Image Wrapper */}
            <div className="relative w-full flex items-center justify-center bg-black/20">
              <img 
                src={popupImg} 
                alt="Extra Features Coming Soon" 
                /* CHANGED: h-auto and object-contain guarantee the whole image fits. max-h limits it on desktop */
                className="w-full h-auto max-h-[65vh] sm:max-h-[75vh] object-contain select-none pointer-events-none"
              />
            </div>

            {/* Subtle Action/Info bar at bottom */}
            <div className="bg-[#002147] px-6 py-4 flex items-center justify-between text-white border-t border-white/10">
              <p className="text-xs font-black uppercase tracking-widest text-[#E2B254]">
                Sitaram Gokul Dairy
              </p>
              <button 
                onClick={handleClose}
                className="text-[10px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 transition-colors"
              >
                Explore Site
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}