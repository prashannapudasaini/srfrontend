import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // --- PARSE FLAVORS & SIZES ---
  const parsedVariants = useMemo(() => {
    if (!product?.variants) return [];
    return product.variants.map((v) => {
      let flavor = 'Original';
      let packSize = v.size;
      // Split "Mango - 200ml" into Flavor and Size
      if (v.size && v.size.includes(' - ')) {
        const parts = v.size.split(' - ');
        flavor = parts[0];
        packSize = parts.slice(1).join(' - ');
      }
      return { ...v, flavor, packSize };
    });
  }, [product]);

  // Extract unique flavors, ignoring "Original" so we only show special flavors
  const uniqueFlavors = useMemo(() => {
    return [...new Set(parsedVariants.map(v => v.flavor))].filter(f => f !== 'Original' && f.trim() !== '');
  }, [parsedVariants]);

  const hasFlavors = uniqueFlavors.length > 0;
  const startingPrice = parsedVariants.length > 0 ? Math.min(...parsedVariants.map(v => parseFloat(v.price_npr) || 0)) : parseFloat(product.price_npr || 0);
  const totalStock = parsedVariants.reduce((sum, v) => sum + parseInt(v.stock_quantity || 0), 0);

  const handleActionClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    // If it has flavors, force them to the detail page to choose.
    if (hasFlavors) {
      navigate(`/products/${product.id}`);
      return;
    }

    // Otherwise, add the first available variant directly to cart
    if (totalStock > 0 && parsedVariants.length > 0) {
      const defaultVariant = parsedVariants[0];
      const cartItem = {
        ...product, 
        cartItemId: `${product.id}-${defaultVariant.size}`, 
        selectedSize: defaultVariant.packSize, 
        price_npr: defaultVariant.price_npr, 
        image: defaultVariant.image || product.image || '/logo.png'
      };
      addToCart(cartItem, 1);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative flex flex-col h-full hover:shadow-[0_15px_30px_rgba(0,33,71,0.08)]"
    >
      {/* Premium Badge */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        <span className="bg-[#E2B254] text-[#002147] text-[10px] font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
          Pure Quality
        </span>
        {product.badge && (
          <span className="bg-[#9e111a] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider w-max">
            {product.badge}
          </span>
        )}
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
          <h3 className="text-sm md:text-base font-bold text-[#002147] hover:text-[#E2B254] transition-colors mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Dynamic Flavor Tag */}
        {hasFlavors ? (
          <div className="mb-2">
            <p className="text-[9px] font-bold text-[#9e111a] line-clamp-1 bg-[#9e111a]/5 px-2 py-1 rounded inline-block uppercase tracking-wider">
              Flavours: {uniqueFlavors.join(', ')}
            </p>
          </div>
        ) : (
          <div className="mb-2">
            <p className="text-[9px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block uppercase tracking-wider border border-gray-100">
              {parsedVariants.length > 0 ? parsedVariants[0].packSize : 'Standard Size'}
            </p>
          </div>
        )}
        
        <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
          <span className="text-lg font-bold text-[#E2B254]">Rs. {startingPrice}</span>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleActionClick}
            disabled={totalStock === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              totalStock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-50 text-[#002147] hover:bg-[#002147] hover:text-[#E2B254]'
            }`}
            title={hasFlavors ? "Select Flavor" : "Add to Cart"}
          >
            {hasFlavors ? <Eye size={18} strokeWidth={2.5} /> : <ShoppingCart size={18} strokeWidth={2.5} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}