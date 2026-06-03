import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutComponent from '../components/Checkout/CheckoutPage';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartTotal } = useCart();
  
  // Generate a unique ID for this specific checkout attempt
  const transactionUuid = useMemo(() => `ORD-${Date.now()}`, []);

  useEffect(() => {
    const token = localStorage.getItem('sitaRamToken');
    if (!token) {
      navigate('/login?redirect=/checkout', { replace: true });
    }
  }, [navigate]);

  return (
    <main className="bg-[#FDF8E7] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-[#9e111a] mb-8 text-center">Checkout</h1>
        
        {/* Pass the props to the inner component */}
        <CheckoutComponent 
          cartTotal={cartTotal} 
          transactionUuid={transactionUuid} 
        />

      </div>
    </main>
  );
}