import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api'; // Ensure this points to your axios instance

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Orders the categories dynamically so selected ones move to the top
  const orderedCategories = useMemo(() => {
    const selected = BASE_CATEGORIES.filter(c => selectedCategories.includes(c));
    const unselected = BASE_CATEGORIES.filter(c => !selectedCategories.includes(c));
    return [...selected, ...unselected];
  }, [selectedCategories, BASE_CATEGORIES]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] pt-40 flex justify-center items-start">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002147]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F6F0] min-h-screen pt-28 pb-20">
      {/* 1. PAGE HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10 mt-8">
        <p className="text-xs font-bold text-red-700 uppercase tracking-[0.2em] mb-4">Our Complete Catalog</p>
        <h1 className="text-4xl md:text-6xl font-serif font-black text-[#002147] mb-6">
          Premium Dairy <span className="text-red-700">Selection</span>
        </h1>
        <div className="w-16 h-1 bg-red-700 mx-auto rounded-full"></div>
      </div>

      {/* 2. MULTI-SELECT CATEGORY FILTERS */}
      <div className="max-w-7xl mx-auto px-4 mb-16 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategories([])}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
              selectedCategories.length === 0 
                ? 'border-[#002147] bg-[#002147] text-[#E2B254] shadow-md' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#002147] hover:text-[#002147]'
            }`}
          >
            All Products
          </button>

          {BASE_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
                selectedCategories.includes(category) 
                  ? 'border-[#002147] bg-[#002147] text-[#E2B254] shadow-md transform scale-105' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#002147] hover:text-[#002147]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Helper text letting users know they are sorting */}
        {selectedCategories.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-gray-500 italic">
            Showing {selectedCategories.join(" & ")} first.
          </motion.p>
        )}
      </div>

      {/* 3. SECTION-WISE PRODUCT GRID (Animated Sorting) */}
      <div className="max-w-7xl mx-auto px-4">
        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No products available at the moment.</div>
        ) : (
          <motion.div layout className="flex flex-col gap-16">
            <AnimatePresence>
              {orderedCategories.map((category) => {
                const categoryProducts = products.filter(p => p.category === category);
                const isSelected = selectedCategories.length === 0 || selectedCategories.includes(category);

                if (categoryProducts.length === 0) return null;

                return (
                  <motion.div 
                    layout key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isSelected ? 1 : 0.4, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`transition-all duration-500 ${!isSelected ? 'grayscale-[20%] hover:opacity-100 hover:grayscale-0' : ''}`}
                  >
                    <h2 className="text-3xl font-serif font-black text-[#002147] mb-8 flex items-center gap-6">
                      {category}
                      <div className="h-[2px] bg-gray-200 flex-grow rounded-full"></div>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {categoryProducts.map(product => (
                        <ProductCard key={product.id} product={product} navigate={navigate} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: FULL-FIT PRODUCT CARD ---
function ProductCard({ product, navigate }) {
  // Protect against products with no variants yet
  const lowestPrice = product.variants?.length > 0 
    ? Math.min(...product.variants.map(v => parseFloat(v.price_npr) || 0)) 
    : 0;

  // Prioritize main image, fallback to first variant image, or default logo
  const displayImage = product.image || product.variants?.[0]?.image || '/logo.png';

  return (
    <motion.div 
      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img 
          src={displayImage} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
        />
        
        {/* Subtle bottom gradient to ensure details text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {product.badge && (
          <div className="absolute top-4 right-4 bg-red-700/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg z-10 border border-white/20">
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow relative bg-white z-20">
        <h3 className="text-xl font-bold text-[#002147] mb-3 leading-tight">{product.name}</h3>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {product.variants?.slice(0, 2).map((v, index) => (
            <span key={index} className="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-1 rounded-md font-semibold">
              {v.size}
            </span>
          ))}
          {product.variants?.length > 2 && (
            <span className="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-1 rounded-md font-semibold">
              +{product.variants.length - 2} Options
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Starting from</p>
            <p className="text-2xl font-black text-[#E2B254]">Rs. {lowestPrice}</p>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-[#002147]/5 flex items-center justify-center group-hover:bg-[#002147] transition-colors duration-300 shadow-sm border border-[#002147]/10 group-hover:border-[#002147]">
            <span className="text-[#002147] group-hover:text-[#E2B254] font-bold text-lg transition-colors">→</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}