import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Loader2, User, Phone, MapPin, Lock, ShieldCheck, 
  CreditCard, Banknote, CheckCircle, ArrowRight, 
  AlertTriangle, AlertCircle, CheckCircle2 
} from 'lucide-react';
import api from '../../services/api'; 
import cIPSlogo from '../../assets/cIPSlogo.png'; 
import { useAuth } from '../../context/AuthContext'; 

// FULL 5 KM SERVICEABLE ZONE (Patan Hub + Kuleshwor Hub)
const DELIVERY_AREAS = [
  // --- Central / Core Kathmandu (~2–4 km from Kuleshwor/Patan) ---
  "Anamnagar",
  "Asan / Kshetrapati",
  "Babarmahal",
  "Basantapur / New Road",
  "Buddhanagar",
  "Jamal / Kamaladi",
  "Maitighar",
  "New Baneshwor",
  "Old Baneshwor",
  "Putalisadak",
  "Shantinagar / Minbhawan",
  "Sinamangal",
  "Sundhara / Bhrikutimandap",
  "Teku",
  "Thapathali",
  "Tripureshwor",

  // --- Lalitpur Core & North (~0–3 km from Patan) ---
  "Balkumari (Lalitpur)",
  "Chakupat",
  "Ekantakuna",
  "Gwarko",
  "Jawalakhel",
  "Kumaripati",
  "Kupondole",
  "Lagankhel",
  "Mahalaxmisthan",
  "Mangal Bazar / Patan Core",
  "Pulchowk",
  "Sanepa",
  "Satdobato",
  "Shankhamul (Lalitpur)",

  // --- Lalitpur South & East (~3–5 km from Patan) ---
  "Bhaisepati",
  "Dhapakhel (Lower)",
  "Harisiddhi",
  "Imadol",
  "Khumaltar",
  "Kusunti",
  "Nakhipot",
  "Sunakoti",
  "Thaiba",

  // --- Kuleshwor & Western Kathmandu (~0–4 km from Kuleshwor) ---
  "Bafal",
  "Balkhu",
  "Chhauni",
  "Dallu",
  "Kalanki",
  "Kalimati",
  "Kuleshwor",
  "Ravi Bhawan",
  "Sitapaila",
  "Solteemode",
  "Swayambhu",
  "Syuchatar / Naikap (Lower)",
  "Tahachal",

  // --- Kirtipur & South-West (~2–5 km from Kuleshwor) ---
  "Chobhar / Taudaha (Lower)",
  "Kirtipur (Naya Bazar / Panga)",
  "Kirtipur (Sundarighat / Lower)",
  "Tyangla Phant",

  // --- Gatekeeper Option ---
  "OTHER"
].sort();

export default function CheckoutPage({ cartTotal, cartItems }) {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const safeName = user?.name || '';
  const safePhone = user?.phone || '';

  // ADDRESS GATING STATE
  const [addressData, setAddressData] = useState({
    area: '',
    detailedAddress: '',
    landmark: '',
    phone: safePhone
  });

  const [paymentMethod, setPaymentMethod] = useState('connectips');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // GATEKEEPER CONDITIONS
  const isAreaSelected = Boolean(addressData.area) && addressData.area !== 'OTHER';
  const isOutsideService = addressData.area === 'OTHER';
  const isAddressValid = isAreaSelected && Boolean(addressData.detailedAddress.trim()) && Boolean(addressData.phone.trim());

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!isAddressValid || !safeName) return; 

    setIsProcessing(true);

    // Format clean address string for delivery riders
    const fullDeliveryAddress = `${addressData.area} - ${addressData.detailedAddress.trim()}` + 
      (addressData.landmark.trim() ? ` (${addressData.landmark.trim()})` : '');

    try {
      const orderRes = await api.post('/orders/verify.php', {
        user_id: user.id,
        customer_name: safeName,
        phone: addressData.phone,
        address: fullDeliveryAddress,
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
          Thank you, <strong>{safeName}</strong>. We have received your order and will deliver it to your address shortly.
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

  // STANDARD CHECKOUT FORM WITH GATEKEEPER
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Checkout Details</h2>
          <p className="text-sm text-gray-500 mt-1">Select your delivery neighborhood and confirm order</p>
        </div>
        <div className="flex items-center gap-2 text-green-700 bg-green-100/50 px-3 py-1.5 rounded-full border border-green-200">
          <ShieldCheck size={16} className="text-green-600" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Verified User</span>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          
          {/* 1. CUSTOMER IDENTITY */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">Customer Name</label>
              <div className="relative cursor-not-allowed">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" readOnly value={safeName || 'Customer'}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 cursor-not-allowed" 
                />
              </div>
            </div>

            {/* 2. DELIVERY AREA GATEKEEPER DROPDOWN */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">
                Select Delivery Neighborhood *
              </label>
              <select
                name="area"
                value={addressData.area}
                onChange={handleAddressChange}
                required
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-sm text-[#1A1A1A] outline-none focus:border-[#002147] focus:bg-white transition-colors"
              >
                <option value="" disabled>-- Select Your Neighborhood --</option>
                {DELIVERY_AREAS.map((area, idx) => (
                  <option key={idx} value={area}>{area}</option>
                ))}
                <option value="OTHER">Other / My Area is Not Listed</option>
              </select>
            </div>

            {/* AVAILABILITY FEEDBACK */}
            {isAreaSelected && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold animate-fade-in">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Service available! We deliver fresh dairy to {addressData.area}.</span>
              </div>
            )}

            {isOutsideService && (
              <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold leading-relaxed animate-fade-in">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase text-[11px] tracking-wider text-red-900">Service Currently Unavailable</p>
                  <p className="mt-0.5">
                    We currently only deliver within a 5 km radius of our <strong>Patan</strong> and <strong>Kuleshwor</strong> hubs. We are expanding soon!
                  </p>
                </div>
              </div>
            )}

            {/* 3. DETAILED ADDRESS & LANDMARK (Only visible if inside serviceable zone) */}
            {isAreaSelected && (
              <div className="space-y-4 animate-fade-in pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">
                    Detailed House / Street Address *
                  </label>
                  <input
                    type="text"
                    name="detailedAddress"
                    value={addressData.detailedAddress}
                    onChange={handleAddressChange}
                    placeholder="e.g., House No. 12, Street Name, Chowk"
                    required
                    className="w-full p-3.5 border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-[#002147]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">
                      Nearest Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={addressData.landmark}
                      onChange={handleAddressChange}
                      placeholder="e.g., Near Bhatbhateni / Opp. School"
                      className="w-full p-3.5 border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-[#002147]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      placeholder="98XXXXXXXX"
                      required
                      className="w-full p-3.5 border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-[#002147]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. PAYMENT SECTION */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-500" />
              Payment Method
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'connectips' ? 'border-[#00519E] bg-[#00519E]/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'} ${!isAddressValid && 'opacity-50 cursor-not-allowed'}`}>
                <input type="radio" name="paymentMethod" value="connectips" className="sr-only" disabled={!isAddressValid} checked={paymentMethod === 'connectips'} onChange={() => setPaymentMethod('connectips')} />
                <div className="h-8 flex items-center justify-center">
                  <img src={cIPSlogo} alt="connectIPS" className="h-6 object-contain" />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide ${paymentMethod === 'connectips' ? 'text-[#00519E]' : 'text-gray-500'}`}>Online Payment</span>
              </label>

              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-[#9e111a] bg-[#9e111a]/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'} ${!isAddressValid && 'opacity-50 cursor-not-allowed'}`}>
                <input type="radio" name="paymentMethod" value="cod" className="sr-only" disabled={!isAddressValid} checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
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
              type="submit" disabled={isProcessing || cartTotal <= 0 || !isAddressValid}
              className={`w-full text-white p-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-md flex justify-center items-center gap-3 relative disabled:opacity-50 disabled:cursor-not-allowed ${
                paymentMethod === 'connectips' ? 'bg-[#00519E] hover:bg-[#004182]' : 'bg-[#9e111a] hover:bg-[#7a0d14]'
              }`}
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={20} /> Processing Order...</>
              ) : !isAddressValid ? (
                <span>Select Valid Delivery Neighborhood</span>
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