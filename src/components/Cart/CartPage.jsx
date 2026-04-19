// frontend/src/components/Cart/CartPage.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartComponent({ cartItems, cartTotal, updateQuantity, removeFromCart, onCheckout }) {
  
  // High-End Empty State
  if (!cartItems || cartItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto"
      >
        <div className="w-24 h-24 bg-[#F9F6F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#E2B254]">
          <ShoppingBag size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#002147] mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 font-medium">Looks like you haven't added any premium dairy yet.</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
      
      {/* Cart Items List */}
      <div className="flex-grow space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#002147] mb-6 px-2 border-b border-gray-200 pb-4">
          Review Your Order
        </h2>
        <AnimatePresence>
          {cartItems.map(item => (
            <motion.div 
              key={item.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-center border border-gray-100 hover:shadow-[0_10px_20px_rgba(0,33,71,0.05)] transition-shadow"
            >
              {/* Product Image Stage */}
              <div className="w-24 h-24 rounded-xl bg-[#F9F6F0] p-2 shrink-0 flex items-center justify-center overflow-hidden">
                <img 
                  src={item.image || item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-contain mix-blend-multiply" 
                />
              </div>
              
              {/* Product Details */}
              <div className="flex-grow text-center sm:text-left">
                <p className="text-[10px] font-bold text-[#E2B254] uppercase tracking-widest mb-1">
                  {item.category || 'Premium Selection'}
                </p>
                <h3 className="font-serif font-bold text-xl text-[#002147]">{item.name}</h3>
                <p className="text-gray-500 font-medium mt-1">Rs. {item.price_npr}</p>
              </div>
              
              {/* Luxury Quantity Controls */}
              <div className="flex items-center gap-4 bg-[#F9F6F0] p-1.5 rounded-full border border-gray-200">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#002147] hover:text-[#E2B254] transition-colors text-gray-600 shadow-sm"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="w-6 text-center font-bold text-[#002147]">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#002147] hover:text-[#E2B254] transition-colors text-gray-600 shadow-sm"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
              
              {/* Price & Remove Action */}
              <div className="text-right min-w-[100px] flex flex-col items-center sm:items-end gap-3">
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-gray-400 hover:text-red-500 transition-colors bg-red-50 p-2 rounded-lg" 
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
                <p className="font-bold text-xl text-[#002147]">
                  Rs. {item.price_npr * item.quantity}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary Sticky Sidebar */}
      <div className="w-full lg:w-96 shrink-0">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-28">
          <h2 className="text-2xl font-serif font-bold text-[#002147] mb-6">Order Summary</h2>
          
          <div className="space-y-4 text-gray-600 mb-6">
            <div className="flex justify-between font-medium items-center">
              <span>Subtotal</span>
              <span className="text-[#002147] font-bold text-lg">Rs. {cartTotal}</span>
            </div>
            <div className="flex justify-between font-medium items-center">
              <span>Delivery</span>
              <span className="text-green-500 font-bold text-sm bg-green-50 px-2 py-1 rounded-md">Calculated at checkout</span>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mb-8">
            <div className="flex justify-between items-end">
              <span className="text-lg font-bold text-[#002147]">Total Due</span>
              <span className="text-3xl font-bold text-[#E2B254]">Rs. {cartTotal}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCheckout}
            className="w-full bg-[#002147] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#E2B254] hover:text-[#002147] transition-all duration-300 shadow-lg flex justify-center items-center gap-2 group"
          >
            Secure Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <ShieldCheck size={16} className="text-green-500" /> 256-bit Encrypted Checkout
          </div>
        </div>
      </div>

    </div>
  );
}