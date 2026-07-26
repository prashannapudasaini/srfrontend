import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, User, Phone, MapPin, Lock, ShieldCheck, CreditCard, Banknote, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import api from '../../services/api'; 
import cIPSlogo from '../../assets/cIPSlogo.png'; 
import { useAuth } from '../../context/AuthContext'; 

export default function CheckoutPage({ cartTotal, cartItems }) {
  const navigate = useNavigate();
  
  // USE THE GLOBAL AUTH STATE INSTEAD OF LOCALSTORAGE
  const { user } = useAuth(); 
  
  // SAFELY EXTRACT VALUES (Falling back to empty string if loading)
  const safeName = user?.name || '';
  const safePhone = user?.phone || '';
  const safeAddress = user?.address || '';

  const [paymentMethod, setPaymentMethod] = useState('connectips');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Determine if profile is incomplete
  const isProfileIncomplete = !safeName || !safePhone || !safeAddress;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (isProfileIncomplete) return; 

    setIsProcessing(true);

    try {
      const orderRes = await api.post('/orders/verify.php', {
        user_id: user.id, // <-- ADDED: This links the order to the user's profile
        customer_name: safeName,
        phone: safePhone,
        address: safeAddress,
        total_amount: cartTotal,
        payment_method: paymentMethod,
        items: cartItems 
      });

      if (orderRes.data.status === 'success') {
        const realOrderId = orderRes.data.order_id; 

        if (paymentMethod === 'connectips') {
          const connectIpsRes = await api.post('/orders/init_connectips.php', {
            amount: cartTotal,
            purchase_id: realOrderId 
          });

          if (connectIpsRes.data.success) {
            submitConnectIPSForm(connectIpsRes.data.gatewayUrl, connectIpsRes.data.payload);
          } else {
            alert("Failed to initialize connectIPS payment: " + connectIpsRes.data.message);
            setIsProcessing(false);
          }
        } else {
          setIsProcessing(false);
          setIsSuccess(true); 
        }
      } else {
        alert("Failed to create order: " + orderRes.data.message);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  const submitConnectIPSForm = (gatewayUrl, payload) => {
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", gatewayUrl);
    for (const key in payload) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", payload[key]);
      form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
  };

  // SUCCESS UI
  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-10 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-inner">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">Order Confirmed!</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{safeName}</strong>. We have received your order and will deliver it to your registered address shortly.
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="inline-flex items-center justify-center gap-2 bg-[#00519E] hover:bg-[#004182] text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-md"
        >
          Continue Shopping <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // STANDARD CHECKOUT FORM
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Checkout</h2>
          <p className="text-sm text-gray-500 mt-1">Your registered delivery details</p>
        </div>
        <div className="flex items-center gap-2 text-green-700 bg-green-100/50 px-3 py-1.5 rounded-full border border-green-200">
          <ShieldCheck size={16} className="text-green-600" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Verified Profile</span>
        </div>
      </div>

      <div className="p-6">
        {isProfileIncomplete && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
            <AlertTriangle size={20} className="flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Incomplete Profile Details</p>
              <p className="text-amber-700/80 mb-2">You must provide your full name, phone number, and address to place an order.</p>
              <Link to="/history" className="inline-block bg-amber-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors">
                Update Profile Now
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 ml-1">Registered Name</label>
              <div className="relative cursor-not-allowed">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" readOnly value={safeName || 'Missing Name'}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold text-sm text-gray-600 cursor-not-allowed ${!safeName && 'text-red-500'}`} 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 ml-1">Registered Mobile</label>
              <div className="relative cursor-not-allowed">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" readOnly value={safePhone || 'Missing Phone Number'}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold text-sm text-gray-600 cursor-not-allowed ${!safePhone && 'text-red-500'}`} 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 ml-1">Registered Address</label>
              <div className="relative cursor-not-allowed">
                <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                <textarea 
                  readOnly value={safeAddress || 'Missing Delivery Address'}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold text-sm text-gray-600 cursor-not-allowed resize-none ${!safeAddress && 'text-red-500'}`} rows="2"
                ></textarea>
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-2 ml-1">To change these details, please <Link to="/history" className="text-[#00519E] hover:underline">update your profile</Link>.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-500" />
              Payment Method
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'connectips' ? 'border-[#00519E] bg-[#00519E]/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'} ${isProfileIncomplete && 'opacity-50 cursor-not-allowed'}`}>
                <input type="radio" name="paymentMethod" value="connectips" className="sr-only" disabled={isProfileIncomplete} checked={paymentMethod === 'connectips'} onChange={() => setPaymentMethod('connectips')} />
                <div className="h-8 flex items-center justify-center">
                  <img src={cIPSlogo} alt="connectIPS" className="h-6 object-contain" />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide ${paymentMethod === 'connectips' ? 'text-[#00519E]' : 'text-gray-500'}`}>Online Payment</span>
              </label>

              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-[#9e111a] bg-[#9e111a]/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'} ${isProfileIncomplete && 'opacity-50 cursor-not-allowed'}`}>
                <input type="radio" name="paymentMethod" value="cod" className="sr-only" disabled={isProfileIncomplete} checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-[#9e111a] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <Banknote size={18} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide ${paymentMethod === 'cod' ? 'text-[#9e111a]' : 'text-gray-500'}`}>Cash on Delivery</span>
              </label>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Amount Due</span>
              <span className="text-2xl font-black text-[#1A1A1A]">NPR {cartTotal.toLocaleString()}</span>
            </div>

            <button 
              type="submit" disabled={isProcessing || cartTotal <= 0 || isProfileIncomplete}
              className={`w-full text-white p-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-md flex justify-center items-center gap-3 relative disabled:opacity-50 disabled:cursor-not-allowed ${
                paymentMethod === 'connectips' ? 'bg-[#00519E] hover:bg-[#004182]' : 'bg-[#9e111a] hover:bg-[#7a0d14]'
              }`}
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={20} /> Processing Order...</>
              ) : paymentMethod === 'connectips' ? (
                <>
                  <Lock size={16} className="opacity-70" />
                  <span>Pay Now via</span>
                  <div className="bg-white px-3 py-1 rounded shadow-sm">
                    <img src={cIPSlogo} alt="connectIPS" className="h-4 object-contain block" />
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Place COD Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}