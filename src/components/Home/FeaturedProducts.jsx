// frontend/src/components/Home/FeaturedProducts.jsx
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  
  // Exactly 13 premium products
  const products = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? "Premium A2 Milk" : "Organic Cow Ghee",
    category: i % 2 === 0 ? "Milk" : "Ghee",
    price: i % 2 === 0 ? 130 : 1200,
    oldPrice: i % 2 === 0 ? 150 : 1400,
    image: i % 2 === 0 
      ? "/milk.png" 
      : "/ghee.png",
    badge: i === 0 ? "Top Seller" : i === 2 ? "New" : null
  }));

  return (
    <section className="py-20 bg-[#FDF8E7] relative">
      {/* Background Flowing Milk Effect */}
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
         <motion.div 
           animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }} 
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white rounded-full blur-[100px]" 
         />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-[#9e111a] text-sm font-bold uppercase tracking-widest mb-2">Shop Our Farm</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A]">Just For You</h3>
          </div>
          <button className="text-[#1A1A1A] font-bold hover:text-[#9e111a] transition-colors hidden sm:block border-b-2 border-[#1A1A1A] hover:border-[#9e111a] pb-1">
            View All Catalog
          </button>
        </div>

        {/* Dense Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative"
            >
              {product.badge && (
                <div className="absolute top-3 left-3 z-20 bg-[#9e111a] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-md uppercase">
                  {product.badge}
                </div>
              )}
              
              <div className="relative aspect-square overflow-hidden bg-[#FDF8E7]/50 p-4 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <p className="text-[10px] sm:text-xs text-[#9e111a] font-black uppercase tracking-wider mb-1">{product.category}</p>
                <h4 className="text-sm sm:text-base font-bold text-[#1A1A1A] leading-tight mb-2 line-clamp-2">
                  {product.name}
                </h4>
                
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg sm:text-xl font-black text-[#1A1A1A]">
                      NPR {product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through font-bold">
                        NPR {product.oldPrice}
                      </span>
                    )}
                  </div>
                  
                  {/* Wired up properly to avoid navigation bubbling */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if(addToCart) addToCart(product);
                    }}
                    className="w-full bg-[#FDF8E7] text-[#9e111a] border border-[#9e111a]/20 py-2 sm:py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-[#9e111a] group-hover:text-white transition-colors duration-300"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;