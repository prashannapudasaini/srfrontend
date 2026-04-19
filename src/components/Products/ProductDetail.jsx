import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck } from 'lucide-react';

export default function ProductDetail({ 
  product, selectedVariant, setSelectedVariant, quantity, setQuantity, handleAddToCart, onBack 
}) {
  const [activeImage, setActiveImage] = useState(selectedVariant?.image || product.image || '/logo.png');

  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  if (!product) return null;

  const currentPrice = selectedVariant?.price_npr || 0;
  const currentStock = selectedVariant?.stock_quantity || 0;
  const currentDescription = selectedVariant?.description || "Experience the pure, farm-fresh taste of Sita Ram Dairy.";
  
  // DYNAMIC PRICE MATH
  const totalPrice = currentPrice * quantity;

  const galleryImages = [product.image, ...(product.variants?.map(v => v.image) || [])].filter(Boolean);
  const uniqueGalleryImages = [...new Set(galleryImages)];

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start lg:items-center">
      
      {/* LEFT: Image Stage & Gallery */}
      <div className="w-full lg:w-1/2 relative">
        <div className="absolute inset-0 bg-[#E2B254] rounded-[3rem] rotate-3 transform scale-105 opacity-20 -z-10"></div>
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-xl relative overflow-hidden flex flex-col justify-center items-center min-h-[400px]">
          <motion.img 
            key={activeImage} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            src={activeImage} 
            alt={product.name} 
            className="w-full h-64 md:h-80 object-contain drop-shadow-xl mb-8"
          />

          {uniqueGalleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto w-full justify-center pb-2">
              {uniqueGalleryImages.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl flex-shrink-0 transition-all duration-300 p-1 bg-white shadow-sm ${
                    activeImage === img ? 'border-2 border-[#002147] scale-110 shadow-md' : 'border border-gray-200'
                  }`}
                >
                  <img src={img} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Product Info */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <button onClick={onBack} className="text-gray-400 hover:text-[#002147] mb-6 flex items-center gap-2 w-fit font-bold uppercase tracking-wider text-xs">
          <ArrowLeft size={16} /> Back to Catalog
        </button>
        
        <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] mb-4 leading-tight">{product.name}</h1>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="flex text-[#E2B254]">
            <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
          </div>
          <span className="text-sm text-gray-500 font-medium">Verified Quality</span>
        </div>

        {/* DYNAMIC TOTAL PRICE */}
        <div className="mb-6 flex items-baseline gap-3">
          <p className="text-3xl md:text-4xl font-black text-[#E2B254]">Rs. {totalPrice.toLocaleString()}</p>
          {quantity > 1 && (
            <p className="text-sm font-bold text-gray-400">(Rs. {currentPrice} each)</p>
          )}
        </div>
        
        <motion.p key={currentDescription} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-lg mb-8 leading-relaxed min-h-[60px]">
          {currentDescription}
        </motion.p>

        <div className="flex flex-wrap items-end gap-6 mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#002147] uppercase tracking-[0.1em] ml-1">Quantity</span>
            <div className="flex items-center border border-gray-200 rounded-xl bg-white h-14 w-max">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 h-full text-gray-400 hover:text-[#002147] font-bold text-xl">-</button>
              <span className="w-12 text-center font-bold text-lg text-[#002147]">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))} className="px-5 h-full text-gray-400 hover:text-[#002147] font-bold text-xl">+</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#002147] uppercase tracking-[0.1em] ml-1">Size / Flavor Options</span>
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => { setSelectedVariant(variant); setQuantity(1); }}
                  className={`h-14 px-5 rounded-xl font-bold text-sm transition-all border-2 duration-300 ${
                    selectedVariant?.size === variant.size ? 'border-[#002147] bg-[#002147] text-[#E2B254] shadow-md' : 'border-gray-200 bg-white text-gray-500 hover:border-[#E2B254] hover:text-[#002147]'
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleAddToCart} disabled={currentStock === 0}
          className={`w-full h-14 px-8 text-lg font-black flex items-center justify-center gap-3 rounded-xl shadow-lg transition-colors ${currentStock > 0 ? 'bg-[#002147] text-white hover:bg-[#E2B254] hover:text-[#002147]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <ShoppingCart size={20} /> {currentStock > 0 ? 'Add to Order' : 'Out of Stock'}
        </button>

        <div className="pt-6 mt-8 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShieldCheck size={18} className={currentStock > 0 ? "text-green-500" : "text-red-500"} />
            <span>Availability: <strong className={currentStock > 0 ? "text-[#002147]" : "text-red-500"}>{currentStock > 0 ? `${currentStock} In Stock` : 'Sold Out'}</strong></span>
          </div>
          <p className="text-sm text-gray-600 pl-7">Category: <strong className="text-[#002147]">{product.category}</strong></p>
        </div>
      </div>
    </div>
  );
}