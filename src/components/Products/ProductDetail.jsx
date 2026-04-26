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

  // Keep the active image in sync with the selected variant, but allow manual override via thumbnails
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

  // --- LOADING & NOT FOUND STATES ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-40 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#E41E26]"></div>
      </div>
    );
  }

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

  // --- DYNAMIC DATA PROCESSING (Backend Ready) ---
  const currentPrice = parseFloat(selectedVariant.price_npr || 0);
  const currentStock = parseInt(selectedVariant.stock_quantity || 0);
  
  // 1. Unique Gallery Images for Thumbnails
  const galleryImages = [product.image, ...(product.variants?.map(v => v.image) || [])].filter(Boolean);
  const uniqueGalleryImages = [...new Set(galleryImages)];

  // 2. Dynamic Description (Reads from variant, then product, then fallback)
  const displayDescription = selectedVariant.description?.trim() || product.description?.trim() || "Experience the pure delight of our premium dairy, meticulously preserved to enrich your healthy lifestyle.";

  // 3. Dynamic Nutrition (Reads from PHP backend if available, otherwise defaults)
  const defaultNutrition = [
    { nutrient: "Energy (kcal)", value: "89.39" },
    { nutrient: "Protein (g)", value: "3.62" },
    { nutrient: "Total Fat (g)", value: "6.15" },
    { nutrient: "Carbohydrates (g)", value: "4.89" },
    { nutrient: "Added Sugar (g)", value: "0.00" },
    { nutrient: "Calcium (mg)", value: "120.5" }
  ];
  const displayNutrition = product.nutrition || selectedVariant.nutrition || defaultNutrition;

  // 4. Dynamic Features (Reads from PHP backend if available, otherwise defaults)
  const defaultFeatures = [
    "Zero Added Preservatives & Chemicals",
    "100% Pure & Natural Source",
    "Boosts Immunity & Bone Strength",
    "Perfect for daily consumption"
  ];
  // Handles if backend sends an array, or a newline-separated string
  let displayFeatures = product.features || selectedVariant.features || defaultFeatures;
  if (typeof displayFeatures === 'string') {
    displayFeatures = displayFeatures.split('\n').filter(f => f.trim() !== '');
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
          <button onClick={() => navigate('/')} className="hover:text-[#E41E26] transition-colors">HOME</button>
          <span className="mx-1">•</span>
          <button onClick={() => navigate('/products')} className="hover:text-[#E41E26] transition-colors">{product.category}</button>
          <span className="mx-1">•</span>
          <span className="text-[#E41E26]">{product.name}</span>
        </div>

        <div className="flex flex-col gap-10">
          
          {/* ========================================== */}
          {/* TOP SECTION: Image Gallery & Core Info     */}
          {/* ========================================== */}
          <div className="flex flex-col lg:flex-row border border-gray-200 bg-white">
            
            {/* Left: Image Canvas & Thumbnails */}
            <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 p-6 flex flex-col">
              
              {/* Main Image (Covers the whole box perfectly) */}
              <div className="w-full aspect-square overflow-hidden bg-gray-50 flex items-center justify-center relative mb-4">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={activeImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                </AnimatePresence>
              </div>

              {/* Thumbnails (Pops image on click) */}
              {uniqueGalleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                  {uniqueGalleryImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                        activeImage === img ? 'border-[#E41E26] opacity-100' : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Controls */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#E41E26] uppercase mb-8">
                {product.name} <span className="text-xl md:text-2xl">({selectedVariant.size})</span>
              </h1>

              <div className="grid grid-cols-2 gap-8 mb-10">
                {/* Pack Sizes (Variant Selection) */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Pack Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants?.map((variant, idx) => (
                      <button
                        key={variant.size + idx}
                        onClick={() => { setSelectedIndex(idx); setQuantity(1); }}
                        className={`px-4 py-2 text-sm transition-all border ${
                          selectedIndex === idx 
                            ? 'border-[#E41E26] bg-[#E41E26] text-white font-bold shadow-sm' 
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
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Shelf Life</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    For best results, store continuously under refrigeration below 4°C until 'Use by Date'.
                  </p>
                </div>
              </div>

              {/* Pricing & Add to Cart */}
              <div className="mt-auto pt-8 border-t border-gray-100">
                <div className="mb-6">
                  <p className="text-4xl font-black text-[#1A1A1A]">NPR {currentPrice * quantity}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-200 bg-white h-12 w-full sm:w-auto shrink-0">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-gray-500 hover:text-[#E41E26] font-bold text-xl transition-colors">-</button>
                    <span className="w-10 text-center font-bold text-[#1A1A1A]">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))} className="px-5 text-gray-500 hover:text-[#E41E26] font-bold text-xl transition-colors">+</button>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={handleAddToCart} disabled={currentStock === 0}
                    className={`flex-1 h-12 w-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-colors ${
                      currentStock > 0 
                        ? 'bg-[#E41E26] text-white hover:bg-[#c4161f] shadow-md' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={18} /> {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* MIDDLE SECTION: Product Description        */}
          {/* ========================================== */}
          <div className="border border-gray-200 bg-white">
            <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
              <h2 className="text-gray-700 font-bold uppercase tracking-widest text-sm font-serif">Product Description</h2>
            </div>
            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedIndex}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="text-gray-500 text-sm md:text-base leading-loose whitespace-pre-line"
                >
                  {displayDescription}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ========================================== */}
          {/* BOTTOM SECTION: Nutrition & Features Split */}
          {/* ========================================== */}
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* NUTRITIONAL INFORMATION TABLE */}
            <div className="w-full md:w-1/2 border border-gray-200 bg-white flex flex-col">
              <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
                <h2 className="text-gray-700 font-bold uppercase tracking-widest text-sm font-serif">Nutritional Information</h2>
              </div>
              
              <div className="p-4 text-center border-b border-gray-200">
                <p className="text-xs font-bold text-gray-500">Approximate Composition Per 100g/mL</p>
              </div>

              <div className="flex-grow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#E41E26] text-white">
                    <tr>
                      <th className="py-3 px-6 text-left font-bold border-r border-white/20">Nutrient</th>
                      <th className="py-3 px-6 text-center font-bold">Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 font-medium">
                    {displayNutrition.map((item, idx) => (
                      <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="py-3 px-6 border-r border-gray-100">{item.nutrient}</td>
                        <td className="py-3 px-6 text-center">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PRODUCT FEATURES */}
            <div className="w-full md:w-1/2 border border-gray-200 bg-white flex flex-col">
              <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
                <h2 className="text-gray-700 font-bold uppercase tracking-widest text-sm font-serif">Product Features</h2>
              </div>
              
              <div className="p-8 space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
                <p>
                  Premium Dairy is considered to be the most essential component for a healthy diet. Be it for kids, youth, or adults, dairy is always suggested to be part of the daily intake.
                </p>
                <p>
                  We understand the value of your health and therefore, try to provide you fresh and pure dairy which is rich in Protein, Vitamins, Calcium and Minerals.
                </p>
                <ul className="list-disc pl-5 pt-4 space-y-2 text-[#E41E26]">
                  {displayFeatures.map((feature, idx) => (
                    <li key={idx}><span className="text-gray-600 font-medium">{feature}</span></li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}