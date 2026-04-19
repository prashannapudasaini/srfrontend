// frontend/src/pages/CartPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  // Using actual context instead of static state
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Defensive fallback in case cartTotal isn't provided by context natively
  const subtotal = cartTotal || cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const deliveryCharge = subtotal > 2000 ? 0 : 100;
  const total = subtotal > 0 ? subtotal + deliveryCharge : 0;

  // Professional Auth Guard for Checkout
  const handleCheckoutInitiation = () => {
    const token = localStorage.getItem('sitaRamToken');
    if (!token) {
      // Not logged in? Redirect to login, but preserve intention to checkout
      navigate('/login?redirect=/checkout');
    } else {
      // Logged in? Proceed securely to checkout
      navigate('/checkout');
    }
  };

  return (
    <main className="bg-[#FDF8E7] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* === PAGE HEADER === */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-[#9e111a] drop-shadow-sm">Your Selection</h1>
          <p className="text-gray-500 mt-3 font-medium uppercase tracking-widest text-xs">Premium Dairy Procurement</p>
        </div>

        {(!cartItems || cartItems.length === 0) ? (
          /* === EMPTY STATE === */
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-24 bg-white rounded-[3rem] shadow-xl border border-gray-100"
          >
            <div className="w-24 h-24 bg-[#FDF8E7] rounded-full flex items-center justify-center mx-auto mb-8 text-[#9e111a] shadow-inner">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-6">Your basket is currently empty</h2>
            <Link to="/products">
              <button className="bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-bold hover:bg-[#9e111a] transition-all duration-300 shadow-xl">
                Continue Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          /* === CART CONTENT === */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* List of Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -50 }} 
                    className="bg-white rounded-[2rem] shadow-sm p-6 flex flex-col sm:flex-row gap-8 items-center border border-gray-50 hover:shadow-xl transition-all duration-500 group"
                  >
                    {/* High-res Product Image */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#FDF8E7] w-32 h-32 shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-[10px] font-black text-[#9e111a] uppercase tracking-[0.2em] mb-1">{item.category || "Premium"}</p>
                      <h3 className="font-serif font-bold text-2xl text-[#1A1A1A]">{item.name}</h3>
                      <p className="text-gray-400 font-bold mt-1">NPR {item.price}</p>
                    </div>
                    
                    {/* Quantity Controller */}
                    <div className="flex items-center gap-5 bg-[#FDF8E7] p-2 rounded-2xl border border-[#9e111a]/10">
                      <button 
                        onClick={() => updateQuantity ? updateQuantity(item.id, item.quantity - 1) : null} 
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-[#9e111a] hover:text-white transition-all text-[#1A1A1A] shadow-sm"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="w-6 text-center font-black text-[#1A1A1A] text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity ? updateQuantity(item.id, item.quantity + 1) : null} 
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-[#9e111a] hover:text-white transition-all text-[#1A1A1A] shadow-sm"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                    
                    {/* Item Total & Remove */}
                    <div className="text-right min-w-[120px] flex flex-col items-end gap-4">
                      <button 
                        onClick={() => removeFromCart ? removeFromCart(item.id) : null} 
                        className="text-gray-300 hover:text-[#9e111a] transition-colors bg-[#FDF8E7] p-2.5 rounded-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                      <p className="font-black text-2xl text-[#1A1A1A]">NPR {item.price * item.quantity}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sticky Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-gray-100 sticky top-32">
                <h2 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-8">Order Summary</h2>
                
                <div className="space-y-5 text-gray-500 mb-8 border-b border-gray-50 pb-8">
                  <div className="flex justify-between font-bold text-sm uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-[#1A1A1A]">NPR {subtotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm uppercase tracking-widest">
                    <span>Delivery</span>
                    <span>
                      {deliveryCharge === 0 
                        ? <span className="text-green-600 font-black">Complimentary</span> 
                        : `NPR ${deliveryCharge}`
                      }
                    </span>
                  </div>
                </div>

                <div className="mb-10">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest">Total</span>
                    <span className="text-4xl font-black text-[#9e111a] drop-shadow-sm">NPR {total}</span>
                  </div>
                  
                  {deliveryCharge > 0 && (
                    <div className="mt-4 bg-[#9e111a]/5 p-4 rounded-2xl border border-[#9e111a]/10">
                      <p className="text-[10px] font-black text-[#9e111a] uppercase tracking-widest text-center">
                        Add NPR {2000 - subtotal} more for <span className="underline">Free Delivery</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Using an onClick handler instead of Link to enforce Authentication */}
                <button 
                  onClick={handleCheckoutInitiation}
                  className="w-full bg-[#9e111a] text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1A1A1A] transition-all duration-500 shadow-xl flex justify-center items-center gap-3 group"
                >
                  Secure Checkout 
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
                
                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <ShieldCheck size={16} className="text-green-600" /> 
                  Enterprise Grade Security
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}