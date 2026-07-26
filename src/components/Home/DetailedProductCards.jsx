import { ShoppingCart, Leaf, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DetailedProductCards = ({ products = [] }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Typography helper for Nepali script
  const isNepali = i18n.language === 'ne';
  // NEW
const nepaliFontClass = isNepali ? "nepali-heading" : "tracking-wider";

  // Don't render the section if there are no essential products checked in admin
  if (products.length === 0) return null;

  // Fetch default array translations for fallback ingredients
  const defaultIngredients = t('products.defaultIngredients', {
    returnObjects: true,
    defaultValue: ["100% Pure & Natural", "Farm Fresh", "No Preservatives"]
  });

  return (
   <section className="py-10 md:py-24 bg-[#FDF8E7] overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    {/* Reduced margin-bottom and inner spacing for mobile */}
    <div className="text-center mb-8 md:mb-16 space-y-2 md:space-y-4">
      <h2 className={`text-[#9e111a] text-sm font-bold uppercase ${isNepali ? `${nepaliFontClass} inline-block py-1` : 'tracking-[0.4em]'}`}>
        {t('products.collectionSubtitle', 'Our Collection')}
      </h2>
      
      {/* Scaled down text size and padding for mobile */}
      <h3 className={`text-4xl md:text-5xl font-serif font-bold text-[#1A1A1A] ${isNepali ? `${nepaliFontClass} block pb-1 md:pb-2` : ''}`}>
        {t('products.collectionTitleLine1', 'Carefully Crafted')} <br/> 
        {t('products.collectionTitleLine2', 'Dairy Essentials')}
      </h3>
    </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => {
            // Dynamically extract data from DB format
            const lowestPrice = product.variants?.length > 0 ? Math.min(...product.variants.map(v => parseFloat(v.price_npr) || 0)) : 0;
            const displayImage = product.image || product.variants?.[0]?.image || '/logo.png';
            const desc = product.variants?.[0]?.description || t('products.fallbackDesc', 'Premium quality dairy product crafted with excellence.');
            
            // Generic fallback for nutrition
            const nutrition = t('products.defaultNutrition', 'Rich in essential nutrients, calcium, and energy for a healthy lifestyle.');

            return (
              // 3D Perspective Container (Click navigates to product details)
              <div 
                key={product.id} 
                onClick={() => navigate(`/products/${product.id}`)}
                className="group h-[520px] w-full [perspective:1500px] cursor-pointer"
              >
                
                {/* Inner 3D Transform Container (Flips on Group Hover) */}
                <div className="relative h-full w-full transition-transform duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* ================= FRONT OF CARD ================= */}
                  <div className="absolute inset-0 h-full w-full bg-white rounded-[2.5rem] p-6 shadow-md flex flex-col [backface-visibility:hidden] border border-gray-100">
                    <div className="relative aspect-square mb-6 overflow-hidden rounded-[2rem] bg-white border border-gray-50 flex items-center justify-center">
                      <img 
                        src={displayImage} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" 
                      />
                    </div>

                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-xl font-serif font-bold text-[#1A1A1A] line-clamp-1 ${isNepali ? nepaliFontClass : ''}`}>
                          {product.name}
                        </h3>
                        <span className={`text-sm font-bold text-[#9e111a] whitespace-nowrap ml-2 ${isNepali ? nepaliFontClass : ''}`}>
                          {t('common.currency', 'NPR')} {lowestPrice}
                        </span>
                      </div>
                      <p className={`text-gray-500 text-sm line-clamp-2 ${isNepali ? nepaliFontClass : ''}`}>{desc}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className={`text-xs font-bold uppercase ${isNepali ? nepaliFontClass : 'tracking-widest'} text-gray-400`}>
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* ================= BACK OF CARD ================= */}
                  <div className="absolute inset-0 h-full w-full bg-[#1A1A1A] rounded-[2.5rem] p-8 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col border border-white/10">
                    
                    <div className="text-center mb-6">
                      <h3 className={`text-2xl font-serif font-bold text-white mb-2 line-clamp-1 ${isNepali ? nepaliFontClass : ''}`}>
                        {product.name}
                      </h3>
                      <div className="w-12 h-1 bg-[#9e111a] mx-auto rounded-full" />
                    </div>

                    <div className="space-y-6 flex-grow">
                      {/* Ingredients Section */}
                      <div>
                        <h4 className={`flex items-center gap-2 text-[#9e111a] text-xs font-bold uppercase mb-3 ${isNepali ? nepaliFontClass : 'tracking-widest'}`}>
                          <Leaf size={14} /> {t('products.ingredientsLabel', 'Ingredients')}
                        </h4>
                        <ul className="space-y-2">
                          {defaultIngredients.map((ing, i) => (
                            <li key={i} className={`text-gray-300 text-sm flex items-center gap-2 ${isNepali ? nepaliFontClass : ''}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#9e111a] shrink-0" /> {ing}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Nutrition Section */}
                      <div>
                        <h4 className={`flex items-center gap-2 text-[#9e111a] text-xs font-bold uppercase mb-3 ${isNepali ? nepaliFontClass : 'tracking-widest'}`}>
                          <ShieldCheck size={14} /> {t('products.nutritionLabel', 'Nutrition Fact')}
                        </h4>
                        <p className={`text-gray-300 text-sm leading-relaxed line-clamp-4 ${isNepali ? nepaliFontClass : ''}`}>
                          {nutrition}
                        </p>
                      </div>
                    </div>

                    {/* REAL Add to Cart Button */}
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
                      className="w-full py-4 bg-[#9e111a] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 mt-auto shadow-lg z-10 relative"
                    >
                      <ShoppingCart size={18} /> Add to Cart — NPR {lowestPrice}
                    </button> 
                    
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DetailedProductCards;