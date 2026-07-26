import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 1. Import your images here
import milkImg from '../../assets/milk.webp';
import gheeImg from '../../assets/ghee.webp';
import dahiImg from '../../assets/dahi.webp';
import paneerImg from '../../assets/paneer.webp';

const HeroProductGrid = () => {
  const { t, i18n } = useTranslation();

  // Typography helper for Nepali script
  const isNepali = i18n.language === 'ne';
 // NEW
const nepaliFontClass = isNepali ? "nepali-heading" : "tracking-wider";

  // Extract products array from translations
  const translatedProducts = t('heroProductGrid.products', {
    returnObjects: true,
    defaultValue: [
      {
        name: "DAIRY ESSENTIAL",
        title: "Standard Milk",
        description: "Made from fresh pasteurized milk. Rich in protein and calcium, hygienically packed for freshness and everyday family nutrition.",
        badge: "FRESH DAILY",
      },
      {
        name: "HERITAGE GOLD",
        title: "Ghee",
        description: "Made from pure dairy butter. Rich, aromatic ghee with authentic taste, hygienically prepared for everyday cooking and celebrations.",
        badge: "BESTSELLER",
      },
      {
        name: "CULTURED PRIDE",
        title: "Dahi Sugar Free",
        description: "Made from pure milk and active cultures. Thick, creamy sugar-free curd rich in protein and calcium, hygienically packed for freshness.",
        badge: "TRADITIONAL",
      },
      {
        name: "ARTISANAL SOFT",
        title: "Paneer",
        description: "Made from fresh milk without preservatives. Soft, protein-rich paneer, vacuum packed for freshness and versatile everyday cooking.",
        badge: "PROTEIN RICH",
      }
    ]
  });

  // Merge static imported images with translated data
  const productImages = [milkImg, gheeImg, dahiImg, paneerImg];
  const products = translatedProducts.map((prod, index) => ({
    id: index + 1,
    ...prod,
    image: productImages[index] || milkImg 
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-10 md:py-20 bg-white border-b border-[#7A0000]/10">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* === SECTION HEADER === */}
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-8 md:mb-12"
    >
      <h2 className={`text-[#7A0000] text-sm uppercase font-black mb-2 md:mb-4 ${isNepali ? `${nepaliFontClass} inline-block py-1` : 'tracking-[0.4em]'}`}>
        {t('heroProductGrid.subtitle', 'The Sita Ram Standard')}
      </h2>
      <h3 className={`text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#1A1A1A] mb-3 md:mb-4 ${isNepali ? `${nepaliFontClass} block pb-1 md:pb-2` : 'tracking-tight'}`}>
        {t('heroProductGrid.titleLine1', 'Sitaram')} <span className="text-[#7A0000]">{t('heroProductGrid.titleLine2', 'Produces')}</span>
      </h3>
      <div className="w-24 md:w-32 h-1 md:h-1.5 bg-[#7A0000] mx-auto rounded-full" />
    </motion.div>

        {/* === PRODUCT GRID === */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[#7A0000]/10 transition-all duration-500 border border-gray-100"
            >
              <div className="flex flex-col lg:flex-row h-full">
                
                {/* Image Section */}
                <div className="lg:w-2/5 relative overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-72 lg:h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Red Tint Overlay on Hover */}
                  <div className="absolute inset-0 bg-[#7A0000]/5 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Status Badge */}
                  {product.badge && (
                    <span className={`absolute top-6 left-6 bg-[#7A0000] text-white px-4 py-1.5 rounded-full shadow-lg text-[10px] font-black uppercase z-10 ${isNepali ? nepaliFontClass : 'tracking-widest'}`}>
                      {product.badge}
                    </span>
                  )}
                </div> 
                
                {/* Content Section */}
                <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col justify-center bg-white relative">
                  {/* Decorative Background Accent */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#7A0000]/5 rounded-tl-full pointer-events-none transition-transform duration-700 group-hover:scale-125" />
                  
                  <p className={`text-[#7A0000] text-xs font-black mb-3 uppercase ${isNepali ? nepaliFontClass : 'tracking-[0.25em]'}`}>
                    {product.name}
                  </p>
                  
                  <h4 className={`text-3xl font-serif font-black text-[#1A1A1A] mb-4 ${isNepali ? nepaliFontClass : 'tracking-tight'}`}>
                    {product.title}
                  </h4>
                  
                  <p className={`text-gray-500 text-base leading-relaxed mb-8 relative z-10 font-medium ${isNepali ? nepaliFontClass : ''}`}>
                    {product.description}
                  </p>
                  
                  {/* Action Link */}
                  <Link 
                    to="/products"
                    className={`text-[#7A0000] font-black text-sm uppercase hover:text-[#1A1A1A] transition-colors duration-300 inline-flex items-center gap-3 group/btn w-fit mt-auto relative z-10 ${isNepali ? nepaliFontClass : 'tracking-widest'}`}
                  >
                    {t('heroProductGrid.exploreProduct', 'Explore Product')} 
                    <ArrowRight size={20} className="transform group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroProductGrid;