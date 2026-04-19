import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const OurCollection = ({ products = [] }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Don't render the section if there are no premium products checked in admin
  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-[#FDF8E7] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#9e111a]/5 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 -right-20 w-[30rem] h-[30rem] bg-[#9e111a]/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[#9e111a] text-sm uppercase tracking-[0.3em] font-bold mb-4">
            Our Collection
          </h2>

          <h3 className="text-5xl md:text-6xl font-serif font-extrabold text-[#1A1A1A] mb-6 drop-shadow-sm">
            Premium Dairy <span className="text-[#9e111a]">Selection</span>
          </h3>

          <div className="w-24 h-1 bg-[#9e111a] mx-auto rounded-full" />
        </motion.div>

        {/* Dynamic Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => {
            // Dynamically extract data from DB format
            const lowestPrice = product.variants?.length > 0 ? Math.min(...product.variants.map(v => parseFloat(v.price_npr) || 0)) : 0;
            const displayImage = product.image || product.variants?.[0]?.image || '/logo.png';
            const unit = product.variants?.[0]?.size ? ` / ${product.variants[0].size}` : '';
            const subtitle = product.variants?.[0]?.description || "Farm Fresh Dairy";

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group relative cursor-pointer"
              >
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full z-10 relative">
                  
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#9e111a]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                    {product.badge && (
                      <span className="absolute top-4 right-4 bg-[#9e111a] text-white px-3 py-1 text-[10px] font-black tracking-widest rounded uppercase shadow-md">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow text-center">
                    <p className="text-[#9e111a] text-[10px] font-black uppercase mb-2 tracking-widest">
                      {product.category}
                    </p>

                    <h4 className="text-xl font-serif font-bold text-[#1A1A1A] mb-1 line-clamp-1">
                      {product.name}
                    </h4>

                    <p className="text-gray-500 font-medium text-xs mb-4 line-clamp-1">
                      {subtitle}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-lg font-black text-[#1A1A1A]">
                        NPR {lowestPrice}<span className="text-xs text-gray-400 font-bold ml-1">{unit}</span>
                      </span>

                      {/* WIRED UP ADD TO CART BUTTON */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          const cartItem = {
                            ...product,
                            cartItemId: `${product.id}-${product.variants?.[0]?.size || 'default'}`,
                            selectedSize: product.variants?.[0]?.size || 'Standard',
                            price_npr: lowestPrice,
                            image: displayImage
                          };
                          if(addToCart) addToCart(cartItem, 1);
                        }}
                        className="bg-[#9e111a] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#1A1A1A] transition-colors shadow-md hover:shadow-xl"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Glow */}
                <div
                  className={`absolute -bottom-4 left-4 right-4 h-8 bg-[#9e111a]/20 rounded-full blur-xl transition-all duration-500 z-0 ${
                    hoveredId === product.id ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default OurCollection;