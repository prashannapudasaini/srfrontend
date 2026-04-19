// frontend/src/components/Home/HeroProductGrid.jsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroProductGrid = () => {
  const products = [
    {
      id: 1,
      name: "DAIRY ESSENTIAL",
      title: "Pure A2 Milk",
      description: "Sourced directly from our lush Tokha pastures. Unadulterated milk rich in A2 protein, delivered fresh within hours of milking.",
      image: "/milk.png",
      badge: "FRESH DAILY",
    },
    {
      id: 2,
      name: "HERITAGE GOLD",
      title: "Bilona Desi Ghee",
      description: "Crafted using the ancient slow-churned bilona method. Aromatic, nutrient-dense, and perfect for your family's health.",
      image: "/ghee.png",
      badge: "BESTSELLER",
    },
    {
      id: 3,
      name: "CULTURED PRIDE",
      title: "Probiotic Dahi",
      description: "Traditional Juju Dhau set in earthen pots. A naturally sweet, probiotic powerhouse for superior gut health and digestion.",
      image: "/dahi.png",
      badge: "TRADITIONAL",
    },
    {
      id: 4,
      name: "ARTISANAL SOFT",
      title: "Fresh Paneer",
      description: "Non-crumbling, ultra-soft paneer made daily from single-source milk. Pressed naturally without any artificial binders.",
      image: "/paneer.png",
      badge: "PROTEIN RICH",
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 bg-white border-b border-[#7A0000]/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* === SECTION HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-[#7A0000] text-sm uppercase tracking-[0.4em] font-black mb-4">
            The Sita Ram Standard
          </h2>
          <h3 className="text-5xl md:text-6xl font-serif font-black text-[#1A1A1A] mb-8 tracking-tight">
            Sitaram <span className="text-[#7A0000]">Produces</span>
          </h3>
          <div className="w-32 h-1.5 bg-[#7A0000] mx-auto rounded-full" />
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
                  <span className="absolute top-6 left-6 bg-[#7A0000] text-white px-4 py-1.5 rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest z-10">
                    {product.badge}
                  </span>
                </div> 
                
                {/* Content Section */}
                <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col justify-center bg-white relative">
                  {/* Decorative Background Accent */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#7A0000]/5 rounded-tl-full pointer-events-none transition-transform duration-700 group-hover:scale-125" />
                  
                  <p className="text-[#7A0000] text-xs tracking-[0.25em] font-black mb-3 uppercase">
                    {product.name}
                  </p>
                  
                  <h4 className="text-3xl font-serif font-black text-[#1A1A1A] mb-4 tracking-tight">
                    {product.title}
                  </h4>
                  
                  <p className="text-gray-500 text-base leading-relaxed mb-8 relative z-10 font-medium">
                    {product.description}
                  </p>
                  
                  {/* Action Link */}
                  <button className="text-[#7A0000] font-black text-sm uppercase tracking-widest hover:text-[#1A1A1A] transition-colors duration-300 inline-flex items-center gap-3 group/btn w-fit mt-auto relative z-10">
                    Explore Product 
                    <ArrowRight size={20} className="transform group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </button>
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