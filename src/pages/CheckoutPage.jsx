import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import CheckoutComponent from '../components/Checkout/CheckoutPage';

const MINIMUM_ORDER_AMOUNT = 0; 

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart(); 

  const subtotal = cartTotal || cartItems?.reduce((sum, item) => {
    const itemPrice = Number(item.price) || Number(item.price_npr) || 0;
    return sum + (itemPrice * (item.quantity || 1));
  }, 0) || 0;

  useEffect(() => {
    if (subtotal > 0 && subtotal < MINIMUM_ORDER_AMOUNT) {
      const timeout = setTimeout(() => {
        alert(`Minimum order amount is NPR ${MINIMUM_ORDER_AMOUNT}. Please add more items to your cart.`);
        navigate('/products');
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [subtotal, navigate]);

  if (subtotal < MINIMUM_ORDER_AMOUNT) {
    return (
      <main className="flex-grow bg-[#FDF8E7] flex flex-col items-center justify-center py-32 px-6 text-center min-h-screen">
        <ShoppingBag className="text-gray-300 mb-6" size={64} />
        <h2 className="text-3xl font-serif font-black text-[#1A1A1A] mb-4">Minimum Order Requirement</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
          Your cart total is NPR {subtotal}. You need at least <strong>NPR {MINIMUM_ORDER_AMOUNT}</strong> to proceed to checkout for one-time purchases.
        </p>
        <button 
          onClick={() => navigate('/products')} 
          className="inline-flex items-center gap-3 bg-[#002147] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#E2B254] hover:text-[#002147] transition-all shadow-xl"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-[#FAF9F6] pt-32 pb-20 px-4 sm:px-6 min-h-screen">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] tracking-tight">Secure Checkout</h1>
          <p className="text-gray-500 font-medium mt-3">Please confirm your registered delivery details below.</p>
        </div>

        {/* PASSING BOTH SUBTOTAL AND CART ITEMS HERE */}
        <CheckoutComponent cartTotal={subtotal} cartItems={cartItems} />
      </div>
    </main>
  );
}