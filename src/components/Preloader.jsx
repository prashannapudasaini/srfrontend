import { motion } from 'framer-motion';

export default function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-[#FDF8E7] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Pulsating Logo */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-32 h-32 mb-8 relative"
      >
        <img 
          src="/logo.png" 
          alt="Sita Ram Gokul Milk" 
          className="w-full h-full object-contain drop-shadow-xl" 
        />
      </motion.div>

      {/* Loading Bar */}
      <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-[#9e111a]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </div>
      
      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-[#9e111a] font-black text-xs uppercase tracking-[0.4em]"
      >
        Pouring Purity...
      </motion.p>
    </motion.div>
  );
}