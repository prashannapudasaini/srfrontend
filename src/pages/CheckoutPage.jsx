// frontend/src/pages/CheckoutPage.jsx
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutComponent from '../components/Checkout/CheckoutPage';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartTotal } = useCart();
  const transactionUuid = `ORD-${Date.now()}`;

  // SECURITY GUARD: Ensure user is logged in to view checkout
  useEffect(() => {
    const token = localStorage.getItem('sitaRamToken');
    if (!token) {
      navigate('/login?redirect=/checkout', { replace: true });
    }
  }, [navigate]);

  const handleEsewaPayment = (e) => { 
    e.preventDefault(); 
    document.getElementById('esewa-form').submit(); 
  };

  return (
    <main className="bg-[#FDF8E7] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* === BREADCRUMB / BACK LINK === */}
        <div className="mb-10">
          <Link to="/cart" className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#9e111a] transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Selection
          </Link>
        </div>

        {/* === PAGE HEADER === */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#9e111a]/10 rounded-2xl flex items-center justify-center text-[#9e111a] shadow-inner">
              <Lock size={32} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-5xl font-serif font-bold text-[#9e111a] drop-shadow-sm leading-tight">
            Secure Gateway
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Finalizing your premium organic order via eSewa
          </p>
        </div>

        {/* === MAIN CHECKOUT CONTAINER === */}
        <div className="bg-white rounded-[3rem] shadow-xl p-10 md:p-16 border border-gray-100 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#9e111a]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          
          <div className="relative z-10">
            <CheckoutComponent 
              cartTotal={cartTotal} 
              handleEsewaPayment={handleEsewaPayment} 
              transactionUuid={transactionUuid} 
            />
          </div>

          {/* === TRUST & COMPLIANCE FOOTER === */}
          <div className="mt-16 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">Encrypted Payment</span>
                <span className="text-[9px] text-gray-400 font-bold">Processed by eSewa Nepal</span>
              </div>
            </div>

            <div className="flex items-center gap-8 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" className="h-6 object-contain" />
               <div className="h-6 w-[1px] bg-gray-300" />
               <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-[0.2em]">Verified Merchant</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Transaction issues? <a href="/contacts" className="text-[#9e111a] border-b border-[#9e111a]/30 hover:border-[#9e111a] transition-all">Contact Sita Ram Support</a>
        </p>

      </div>
    </main>
  );
}