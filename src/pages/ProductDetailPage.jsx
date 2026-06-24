import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CalendarDays } from 'lucide-react'; 
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
            setSelectedIndex(0); 
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

  // --- NEW: PARSE FLAVORS AND SIZES ---
  const parsedVariants = useMemo(() => {
    if (!product?.variants) return [];
    return product.variants.map((v, index) => {
      let flavor = 'Original';
      let packSize = v.size;
      // If the admin saved "Mango - 200gm", split it up!
      if (v.size && v.size.includes(' - ')) {
        const parts = v.size.split(' - ');
        flavor = parts[0];
        packSize = parts.slice(1).join(' - '); // Rejoin rest in case of multiple hyphens
      }
      return { ...v, originalIndex: index, flavor, packSize };
    });
  }, [product]);

  const uniqueFlavors = useMemo(() => {
    return [...new Set(parsedVariants.map(v => v.flavor))];
  }, [parsedVariants]);

  const [selectedFlavor, setSelectedFlavor] = useState('');

  // Set default flavor on load
  useEffect(() => {
    if (uniqueFlavors.length > 0 && !selectedFlavor) {
      setSelectedFlavor(uniqueFlavors[0]);
    }
  }, [uniqueFlavors, selectedFlavor]);

  // When flavor changes, automatically select the first valid pack size for that flavor
  useEffect(() => {
    const variantsInFlavor = parsedVariants.filter(v => v.flavor === selectedFlavor);
    const currentIsInvalid = !variantsInFlavor.find(v => v.originalIndex === selectedIndex);
    
    if (currentIsInvalid && variantsInFlavor.length > 0) {
        setSelectedIndex(variantsInFlavor[0].originalIndex);
        setQuantity(1);
    }
  }, [selectedFlavor, parsedVariants, selectedIndex]);

  const availableSizesForFlavor = parsedVariants.filter(v => v.flavor === selectedFlavor);
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

  const currentPrice = parseFloat(selectedVariant.price_npr || product.price_npr || 0);
  const currentStock = parseInt(selectedVariant.stock_quantity || product.stock_quantity || 0);
  
  const galleryImages = [product.image, ...(product.variants?.map(v => v.image) || [])].filter(Boolean);
  const uniqueGalleryImages = [...new Set(galleryImages)];

  // THIS ENSURES THE DESCRIPTION SWAPS PER FLAVOR/VARIANT
  const displayDescription = selectedVariant?.description?.trim() || product?.description?.trim() || "No description provided for this product.";

  let displayNutrition = [];
  const rawNutrition = selectedVariant?.nutrition || product?.nutrition;
  if (rawNutrition) {
    try { displayNutrition = typeof rawNutrition === 'string' ? JSON.parse(rawNutrition) : rawNutrition; } catch (e) {}
  }

  let displayFeatures = [];
  const rawFeatures = selectedVariant?.features || product?.features;
  if (rawFeatures) {
    try {
      if (typeof rawFeatures === 'string') {
        if (rawFeatures.trim().startsWith('[')) displayFeatures = JSON.parse(rawFeatures);
        else displayFeatures = rawFeatures.split('\n').filter(f => f.trim() !== '');
      } else if (Array.isArray(rawFeatures)) displayFeatures = rawFeatures;
    } catch (e) {}
  }

  // Determine if we should show the Flavor selector
  const showFlavors = uniqueFlavors.length > 1 || (uniqueFlavors.length === 1 && uniqueFlavors[0] !== 'Original');

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
          <button onClick={() => navigate('/')} className="hover:text-[#E41E26] transition-colors">HOME</button>
          <span className="mx-1">•</span>
          <button onClick={() => navigate('/products')} className="hover:text-[#E41E26] transition-colors">{product.category}</button>
          <span className="mx-1">•</span>
          <span className="text-[#E41E26]">{product.name}</span>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row border border-gray-200 bg-white">
            
            <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 p-6 flex flex-col">
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

            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#E41E26] uppercase mb-8">
                {product.name}
              </h1>

              <div className="flex flex-col gap-6 mb-10">
                {/* --- DYNAMIC FLAVOR SELECTOR --- */}
                {showFlavors && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Flavour Options</h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueFlavors.map(flavor => (
                        <button
                          key={flavor}
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all border ${
                            selectedFlavor === flavor 
                              ? 'border-[#002147] bg-[#002147] text-[#E2B254] shadow-md' 
                              : 'border-gray-200 text-gray-600 hover:border-[#002147] hover:text-[#002147]'
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- DYNAMIC PACK SIZES (Filtered by Flavor) --- */}
                {availableSizesForFlavor.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Pack Size / Grams</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableSizesForFlavor.map((variant) => (
                        <button
                          key={variant.originalIndex}
                          onClick={() => { setSelectedIndex(variant.originalIndex); setQuantity(1); }}
                          className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all border ${
                            selectedIndex === variant.originalIndex 
                              ? 'border-[#E41E26] bg-[#E41E26] text-white shadow-md' 
                              : 'border-gray-200 text-gray-600 hover:border-[#E41E26] hover:text-[#E41E26]'
                          }`}
                        >
                          {variant.packSize}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-2 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Shelf Life & Subscriptions</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                     If the product price range extends 3000rs, you can place an order without a subscription.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100">
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Price</p>
                    <p className="text-4xl font-black text-[#1A1A1A]">NPR {currentPrice * quantity}</p>
                  </div>
                  {showFlavors && <p className="text-sm font-bold text-[#E41E26]">{selectedFlavor} Flavour Selected</p>}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white h-14 w-full sm:w-auto shrink-0 overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 h-full text-gray-500 hover:text-[#E41E26] hover:bg-gray-50 font-bold text-xl transition-colors">-</button>
                    <span className="w-12 text-center font-black text-[#1A1A1A]">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))} className="px-5 h-full text-gray-500 hover:text-[#E41E26] hover:bg-gray-50 font-bold text-xl transition-colors">+</button>
                  </div>

                  <button 
                    onClick={handleAddToCart} disabled={currentStock === 0}
                    className={`flex-1 h-14 w-full flex items-center justify-center gap-2 font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      currentStock > 0 
                        ? 'bg-[#E41E26] text-white hover:bg-[#1A1A1A] shadow-[0_8px_20px_rgba(228,30,38,0.2)] hover:shadow-xl' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={18} /> {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white">
            <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
              <h2 className="text-gray-700 font-bold uppercase tracking-widest text-sm font-serif">Product Description</h2>
            </div>
            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedIndex}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="text-gray-600 text-sm md:text-base leading-loose whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: displayDescription }}
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 border border-gray-200 bg-white flex flex-col">
              <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
                <h2 className="text-gray-700 font-bold uppercase tracking-widest text-sm font-serif">Nutritional Information</h2>
              </div>
              <div className="p-4 text-center border-b border-gray-200">
                <p className="text-xs font-bold text-gray-500">Approximate Composition Per 100g/mL</p>
              </div>
              <div className="flex-grow overflow-x-auto">
                {displayNutrition && displayNutrition.length > 0 ? (
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
                ) : (
                  <div className="p-8 text-center text-gray-400 italic text-sm">No nutritional information provided.</div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 border border-gray-200 bg-white flex flex-col">
              <div className="bg-[#F8F9FA] border-b border-gray-200 p-4 text-center">
                <h2 className="text-gray-700 font-bold uppercase tracking-widest text-sm font-serif">Product Features</h2>
              </div>
              <div className="p-8 text-gray-600 text-sm md:text-base leading-relaxed">
                {displayFeatures && displayFeatures.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 text-[#E41E26]">
                    {displayFeatures.map((feature, idx) => (
                      <li key={idx}><span className="text-gray-600 font-medium">{feature}</span></li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-400 italic text-sm">No special features listed.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}