import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext'; // Added to make the Add + button work

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart(); // Initialize Cart
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // Read URL parameters on mount and whenever the URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("All");
    }
  }, [location.search]);

  // Fetch products from the backend on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/index.php');
        if (res.data.status === 'success') {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const BASE_CATEGORIES = [...new Set(products.map(p => p.category))];

  // Filter products based on the active category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleCategoryClick = (category) => {
    if (category === "All") {
      navigate('/products');
    } else {
      navigate(`/products?category=${category}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8E7] pt-40 flex justify-center items-start">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9e111a]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF8E7] min-h-screen pt-28 pb-20">
      {/* 1. PAGE HEADER (Styled to match screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10 mt-8">
        <p className="text-xs font-bold text-[#9e111a] uppercase tracking-[0.3em] mb-4">
          Our Collection
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-black text-[#1A1A1A] mb-6 drop-shadow-sm">
          Premium Dairy <span className="text-[#9e111a]">Selection</span>
        </h1>
        <div className="w-24 h-1 bg-[#9e111a] mx-auto rounded-full"></div>
      </div>

      {/* 2. CATEGORY FILTERS */}
      <div className="max-w-7xl mx-auto px-4 mb-16 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleCategoryClick("All")}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
              activeCategory === "All" 
                ? 'border-[#9e111a] bg-[#9e111a] text-white shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#9e111a] hover:text-[#9e111a]'
            }`}
          >
            All Products
          </button>

          {BASE_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
                activeCategory === category 
                  ? 'border-[#9e111a] bg-[#9e111a] text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#9e111a] hover:text-[#9e111a]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 3. UNIFIED PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No products available in this category.</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  navigate={navigate} 
                  addToCart={addToCart} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: FULL-FIT PRODUCT CARD (Styled to match screenshot) ---
function ProductCard({ product, navigate, addToCart }) {
  // Protect against products with no variants yet
  const lowestPrice = product.variants?.length > 0 
    ? Math.min(...product.variants.map(v => parseFloat(v.price_npr) || 0)) 
    : 0;

  // Extract display details
  const displayImage = product.image || product.variants?.[0]?.image || '/logo.png';
  const subtitle = product.variants?.[0]?.description || "Farm Fresh Dairy";
  const unit = product.variants?.[0]?.size ? ` / ${product.variants[0].size}` : '';

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="group relative cursor-pointer"
    >
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full z-10 relative">
        
        {/* Top Image Section */}
        <div className="relative h-64 overflow-hidden bg-white flex items-center justify-center">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#9e111a]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

          {/* Red Badge */}
          {product.badge && (
            <span className="absolute top-4 right-4 bg-[#9e111a] text-white px-3 py-1 text-[10px] font-black tracking-widest rounded uppercase shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content Section */}
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

            {/* Add to Cart Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevents navigating to the detail page when clicking add
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
    </motion.div>
  );
}