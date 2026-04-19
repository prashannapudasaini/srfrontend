// frontend/src/components/Products/ProductCard.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative flex flex-col h-full hover:shadow-[0_15px_30px_rgba(0,33,71,0.08)]"
    >
      {/* Premium Badge */}
      <div className="absolute top-3 left-3 z-20 bg-[#E2B254] text-[#002147] text-[10px] font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
        Pure Quality
      </div>

      <Link to={`/products/${product.id}`} className="block relative bg-[#F9F6F0] pt-8 pb-4 px-4 overflow-hidden aspect-square flex items-center justify-center">
        {/* Navy Glow behind product */}
        <div className="absolute inset-0 bg-[#002147]/5 rounded-full blur-2xl transform group-hover:scale-125 transition-transform duration-500" />
        
        <img 
          src={product.image || product.image_url} 
          alt={product.name} 
          className="h-full w-full object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
        />
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest font-semibold">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm md:text-base font-bold text-[#002147] hover:text-[#E2B254] transition-colors mb-3 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
          <span className="text-lg font-bold text-[#E2B254]">Rs. {product.price_npr}</span>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product, 1)}
            className="w-9 h-9 bg-gray-50 text-[#002147] rounded-full flex items-center justify-center hover:bg-[#002147] hover:text-[#E2B254] transition-colors shadow-sm"
            title="Add to Cart"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}