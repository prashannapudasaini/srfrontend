// frontend/src/components/Layout/CartDrawer.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, cartTotal, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#002147]/40 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F9F6F0] shadow-2xl z-50 flex flex-col border-l border-white"
          >
            <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-serif font-bold text-[#002147]">Your Order</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-[#E2B254] transition-colors bg-gray-50 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <p className="font-bold text-[#002147] text-lg mb-2">Cart is empty</p>
                  <p className="text-sm">Start adding premium dairy to your cart.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center">
                    <img src={item.image || item.image_url} alt={item.name} className="w-16 h-16 object-contain mix-blend-multiply bg-[#F9F6F0] p-2 rounded-xl shrink-0" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-[#002147] leading-tight text-sm mb-1">{item.name}</h4>
                      <p className="text-[#E2B254] font-bold text-sm">Rs. {item.price_npr} <span className="text-gray-400 text-xs font-normal">x {item.quantity}</span></p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 bg-gray-50 hover:bg-red-50 rounded-lg shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-white border-t border-gray-100 shrink-0 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,33,71,0.03)]">
              <div className="flex justify-between font-bold text-lg mb-6 text-[#002147]">
                <span>Total Due:</span>
                <span className="text-[#E2B254] text-2xl">Rs. {cartTotal}</span>
              </div>
              <button 
                onClick={() => { onClose(); navigate('/cart'); }}
                disabled={cartItems.length === 0}
                className="w-full bg-[#002147] text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E2B254] hover:text-[#002147] transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
              >
                Review Full Cart <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}