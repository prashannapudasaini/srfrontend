import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeImage, setActiveImage] = useState('/logo.png');

  // Fetch the product from the backend
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchSingleProduct = async () => {
      try {
        const res = await api.get('/products/index.php');
        if (res.data.status === 'success') {
          const foundProduct = res.data.data.find(p => p.id === parseInt(id));
          if (foundProduct) {
            setProduct(foundProduct);
            setSelectedIndex(0); // Reset to first variant
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [id]);

  const selectedVariant = product?.variants?.[selectedIndex];

  // Keep the active image in sync with the selected variant
  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    } else if (product?.image) {
      setActiveImage(product.image);
    }
  }, [selectedIndex, product, selectedVariant]);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      const cartItem = {
        ...product, 
        cartItemId: `${product.id}-${selectedVariant.size}`, 
        selectedSize: selectedVariant.size, 
        price_npr: selectedVariant.price_npr, 
        image: selectedVariant.image || product.image || '/logo.png'
      };
      addToCart(cartItem, quantity);
      navigate('/cart');
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-40 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#E41E26]"></div>
      </div>
    );
  }

  // 2. Not Found State
  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen bg-white pt-40 flex flex-col items-center">
        <h2 className="text-3xl font-serif font-bold text-[#E41E26] mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">This item may be out of stock or removed.</p>
        <button onClick={() => navigate('/products')} className="px-8 py-3 bg-[#E41E26] text-white rounded font-bold tracking-wider uppercase">
          Browse Catalog
        </button>
      </div>
    );
  }

  // 3. Main Variables
  const currentPrice = parseFloat(selectedVariant.price_npr || 0);
  const currentStock = parseInt(selectedVariant.stock_quantity || 0);
  const currentDescription = (selectedVariant.description && selectedVariant.description.trim() !== '') 
    ? selectedVariant.description 
    : "Experience the pure delight of Sita Ram's premium dairy. Sourced directly from local farmers, our commitment to purity ensures every product is rich in essential proteins, vitamins, calcium, and minerals for your well-being.";

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">
          <button onClick={() => navigate('/')} className="hover:text-[#E41E26] transition-colors">HOME</button>
          <span>•</span>
          <button onClick={() => navigate('/products')} className="hover:text-[#E41E26] transition-colors">{product.category}</button>
          <span>•</span>
          <span className="text-[#E41E26]">{product.name}</span>
        </div>

        {/* ========================================================= */}
        {/* FULL NAMASTE INDIA STYLE UI COMBINED DIRECTLY INTO PAGE   */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-10">
          
          {/* ------------------------------------- */}
          {/* TOP SECTION: Image & Core Info Split  */}
          {/* ------------------------------------- */}
          <div className="flex flex-col lg:flex-row border border-gray-200">
            
            {/* Left: Image Canvas */}
            <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 p-8 flex items-center justify-center bg-white min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full max-w-sm h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </AnimatePresence>
            </div>

            {/* Right: Info & Controls */}
            <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col bg-white">
              <h1 className="text-2xl md:text-3xl font-bold text-[#E41E26] uppercase mb-8">
                {product.name} ({selectedVariant.size})
              </h1>

              <div className="grid grid-cols-2 gap-8 mb-10">
                {/* Pack Sizes (Variant Selection) */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Pack Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants?.map((variant, idx) => (
                      <button
                        key={variant.size + idx}
                        onClick={() => { setSelectedIndex(idx); setQuantity(1); }}
                        className={`px-3 py-1.5 text-sm transition-all border ${
                          selectedIndex === idx 
                            ? 'border-[#E41E26] bg-[#E41E26] text-white font-bold' 
                            : 'border-gray-300 text-gray-600 hover:border-[#E41E26] hover:text-[#E41E26]'
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shelf Life Notice */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Shelf Life</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    For best results, store continuously under refrigeration below 4°C until 'Use by Date'.
                  </p>
                </div>
              </div>

              {/* Pricing & Add to Cart */}
              <div className="mt-auto pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-baseline gap-4 mb-6">
                  <p className="text-4xl font-black text-[#1A1A1A]">NPR {currentPrice * quantity}</p>
                  {quantity > 1 && <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">(NPR {currentPrice} / each)</span>}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border border-gray-300 bg-white h-12 w-full sm:w-auto">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-gray-600 hover:text-[#E41E26] font-bold text-xl transition-colors">-</button>
                    <span className="w-12 text-center font-bold text-[#1A1A1A]">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))} className="px-5 text-gray-600 hover:text-[#E41E26] font-bold text-xl transition-colors">+</button>
                  </div>

                  <button 
                    onClick={handleAddToCart} disabled={currentStock === 0}
                    className={`flex-1 h-12 w-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-colors ${
                      currentStock > 0 ? 'bg-[#E41E26] text-white hover:bg-[#1A1A1A]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={18} /> {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------- */}
          {/* MIDDLE SECTION: Product Description   */}
          {/* ------------------------------------- */}
          <div className="border border-gray-200 bg-white">
            <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
              <h2 className="text-gray-600 font-bold uppercase tracking-widest text-sm">Product Description</h2>
            </div>
            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedIndex}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="text-gray-500 text-sm md:text-base leading-loose whitespace-pre-line"
                >
                  {currentDescription}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ------------------------------------- */}
          {/* BOTTOM SECTION: Nutrition & Features  */}
          {/* ------------------------------------- */}
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* NUTRITIONAL INFORMATION TABLE */}
            <div className="w-full md:w-1/2 border border-gray-200 bg-white flex flex-col">
              <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
                <h2 className="text-gray-600 font-bold uppercase tracking-widest text-sm">Nutritional Information</h2>
              </div>
              
              <div className="p-4 text-center border-b border-gray-200">
                <p className="text-sm font-bold text-gray-500">Approximate Composition Per 100g/mL</p>
              </div>

              <div className="flex-grow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#E41E26] text-white">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold border-r border-white/20">Nutrient</th>
                      <th className="py-3 px-4 text-center font-bold">Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-500 font-medium">
                    <tr className="border-b border-gray-100"><td className="py-3 px-4 border-r border-gray-100">Energy (kcal)</td><td className="py-3 px-4 text-center">89.39</td></tr>
                    <tr className="border-b border-gray-100 bg-gray-50"><td className="py-3 px-4 border-r border-gray-100">Protein (g)</td><td className="py-3 px-4 text-center">3.62</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-3 px-4 border-r border-gray-100">Total Fat (g)</td><td className="py-3 px-4 text-center">6.15</td></tr>
                    <tr className="border-b border-gray-100 bg-gray-50"><td className="py-3 px-4 border-r border-gray-100">Carbohydrates (g)</td><td className="py-3 px-4 text-center">4.89</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-3 px-4 border-r border-gray-100">Added Sugar (g)</td><td className="py-3 px-4 text-center">0.00</td></tr>
                    <tr className="bg-gray-50"><td className="py-3 px-4 border-r border-gray-100">Calcium (mg)</td><td className="py-3 px-4 text-center">120.5</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* PRODUCT FEATURES */}
            <div className="w-full md:w-1/2 border border-gray-200 bg-white flex flex-col">
              <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
                <h2 className="text-gray-600 font-bold uppercase tracking-widest text-sm">Product Features</h2>
              </div>
              
              <div className="p-8 space-y-6 text-gray-500 text-sm md:text-base leading-relaxed">
                <p>
                  Premium Dairy is considered to be the most essential component for a healthy diet. Be it for kids, youth, or adults, dairy is always suggested to be part of the daily intake.
                </p>
                <p>
                  We understand the value of your health and therefore, try to provide you fresh and pure dairy which is rich in Protein, Vitamins, Calcium and Minerals.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-[#E41E26] font-medium">
                  <li><span className="text-gray-500">Zero Added Preservatives & Chemicals</span></li>
                  <li><span className="text-gray-500">100% Pure & Natural Source</span></li>
                  <li><span className="text-gray-500">Boosts Immunity & Bone Strength</span></li>
                  <li><span className="text-gray-500">Perfect for daily consumption</span></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
        {/* ========================================================= */}
        
      </div>
    </div>
  );
}