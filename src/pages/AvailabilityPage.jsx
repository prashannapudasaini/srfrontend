import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { 
  MapPin, CheckCircle2, Loader2, Plus, Minus, ShoppingBag, 
  CalendarDays, Receipt, Calendar, Info, Sunrise, Sunset, 
  Copy, ShieldAlert, Lock, CreditCard, Clock, ChevronDown, 
  AlertCircle, Phone, Home 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import api from '../services/api';
import ContactModal from '../components/ContactModal';

// 1. IMPORT CONNECTIPS LOGO
import cIPSlogo from '../assets/cIPSlogo.png'; 

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

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ALTERNATE_SETS = {
  MWF: ['Monday', 'Wednesday', 'Friday'],
  TTS: ['Tuesday', 'Thursday', 'Saturday']
};

export default function AvailabilityPage() {
  const navigate = useNavigate(); 
  const { isAuthenticated, user } = useAuth(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- WIZARD STATES ---
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState(''); 
  const [selectedDays, setSelectedDays] = useState([]);
  const [activeDayTab, setActiveDayTab] = useState('');
  
  const [basket, setBasket] = useState({});
  
  // --- LOCATION & ADDRESS STATES ---
  const [location, setLocation] = useState(''); 
  const [locationSearch, setLocationSearch] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [timing, setTiming] = useState(''); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // GATEKEEPER CHECKS
  const isAreaSelected = Boolean(location) && location !== 'OTHER';
  const isOutsideService = location === 'OTHER';
  const isAddressValid = isAreaSelected && Boolean(detailedAddress.trim()) && Boolean(phone.trim());

  // Handle clicking outside the location dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        if (location) setLocationSearch(location === 'OTHER' ? 'Other / Area Not Listed' : location);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [location]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/index.php');
        if (res.data.status === 'success') {
          const formattedProducts = res.data.data.map(p => {
            const lowestPrice = p.variants?.length > 0 ? Math.min(...p.variants.map(v => parseFloat(v.price_npr) || 0)) : 0;
            return {
              id: p.id,
              name: p.name,
              size: p.variants?.[0]?.size || 'Standard',
              price: lowestPrice,
              img: p.base_image || p.image || p.variants?.[0]?.image || '/logo.png'
            };
          });
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Failed to load catalog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePlanSelect = (selectedPlan) => {
    setPlan(selectedPlan);
    setBasket({}); 
    
    if (selectedPlan === 'daily') {
      setSelectedDays(DAYS_OF_WEEK);
      setActiveDayTab(DAYS_OF_WEEK[0]);
      setStep(3); 
    } else if (selectedPlan === 'alternate') {
      setSelectedDays(ALTERNATE_SETS.MWF);
      setActiveDayTab(ALTERNATE_SETS.MWF[0]);
      setStep(2);
    } else if (selectedPlan === 'weekly') {
      setSelectedDays(['Monday']);
      setActiveDayTab('Monday');
      setStep(2);
    } else if (selectedPlan === 'custom') {
      setSelectedDays([]);
      setActiveDayTab('');
      setStep(2);
    }
  };

  const handleDayToggle = (day) => {
    if (plan === 'weekly') {
      setSelectedDays([day]);
      setActiveDayTab(day);
    } else if (plan === 'custom') {
      let newDays = selectedDays.includes(day) 
        ? selectedDays.filter(d => d !== day) 
        : [...selectedDays, day];
      
      newDays = DAYS_OF_WEEK.filter(d => newDays.includes(d));
      setSelectedDays(newDays);
      if (!newDays.includes(activeDayTab)) setActiveDayTab(newDays[0] || '');
    }
  };

  const updateQuantity = (productId, delta) => {
    setBasket(prev => {
      const currentDayBasket = prev[activeDayTab] || {};
      const currentQty = currentDayBasket[productId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newDayBasket = { ...currentDayBasket };
      if (newQty === 0) delete newDayBasket[productId];
      else newDayBasket[productId] = newQty;

      return { ...prev, [activeDayTab]: newDayBasket };
    });
  };

  const copyToAllDays = () => {
    const currentDayBasket = basket[activeDayTab];
    if (!currentDayBasket || Object.keys(currentDayBasket).length === 0) return alert("Add items to this day first!");
    
    const newBasket = { ...basket };
    selectedDays.forEach(day => {
      newBasket[day] = { ...currentDayBasket };
    });
    setBasket(newBasket);
    alert("Basket copied to all selected days!");
  };

  const calculateTotals = () => {
    let baseWeeklyCost = 0;
    
    selectedDays.forEach(day => {
      const dayItems = basket[day] || {};
      Object.entries(dayItems).forEach(([prodId, qty]) => {
        const prod = products.find(p => String(p.id) === String(prodId));
        if (prod) baseWeeklyCost += (prod.price * qty);
      });
    });

    const multiplier = plan === 'custom' ? 1 : 4;
    return { weeklyCost: baseWeeklyCost, finalCost: baseWeeklyCost * multiplier };
  };

  const { weeklyCost, finalCost } = calculateTotals();

  const isBasketValid = useMemo(() => {
    if (selectedDays.length === 0) return false;
    return selectedDays.every(day => {
      const dayItems = basket[day] || {};
      const totalItems = Object.values(dayItems).reduce((sum, qty) => sum + qty, 0);
      return totalItems > 0;
    });
  }, [selectedDays, basket]);

  const filteredLocations = useMemo(() => {
    return DELIVERY_AREAS.filter(loc => 
      loc.toLowerCase().includes(locationSearch.toLowerCase())
    );
  }, [locationSearch]);

  const handleConnectIPSCheckout = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!isBasketValid || !isAddressValid || !timing) return alert("Please complete all required address and schedule fields.");
    
    setIsSubmitting(true);
    
    try {
      const cleanWeeklySchedule = selectedDays.map(day => {
        const itemsForDay = [];
        Object.entries(basket[day] || {}).forEach(([productId, qty]) => {
          if (qty > 0) {
            const product = products.find(p => String(p.id) === String(productId));
            if (product) itemsForDay.push({ ...product, qty });
          }
        });
        return { day, items: itemsForDay };
      });

      // Combine full address for delivery riders
      const fullDeliveryAddress = `${location} - ${detailedAddress.trim()}` + 
        (landmark.trim() ? ` (${landmark.trim()})` : '');

      // 1. Create Sub in Database
      const createRes = await api.post('/orders/create_sub.php', {
        user_id: user.id,
        plan_type: plan,
        delivery_time: timing,
        location: fullDeliveryAddress,
        phone: phone,
        weekly_total_cost: finalCost,
        schedule: cleanWeeklySchedule
      });

      if (createRes.data.status !== 'success') {
        alert("Failed to create subscription record.");
        setIsSubmitting(false);
        return;
      }

      const subDbId = createRes.data.id;

      // 2. INITIALIZE CONNECTIPS 
      const connectIpsRes = await api.post('/orders/init_connectips.php', {
        amount: finalCost,
        purchase_id: `SUB_${subDbId}` 
      });

      if (connectIpsRes.data.success) {
        // 3. Build & Submit Form
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", connectIpsRes.data.gatewayUrl);

        for (const key in connectIpsRes.data.payload) {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", connectIpsRes.data.payload[key]);
          form.appendChild(hiddenField);
        }
        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Failed to initialize connectIPS: " + connectIpsRes.data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Payment gateway error.");
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDF8E7] pt-40 flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002147] mb-4"></div>
      <p className="text-[#002147] font-bold uppercase tracking-widest text-sm">Loading Farm Data...</p>
    </div>
  );

  return (
    <>
      <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20 font-sans text-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] tracking-tight">Curate Your Plan</h1>
            <p className="text-gray-500 font-medium mt-3 max-w-xl mx-auto">Build your recurring farm-fresh delivery schedule in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-6">
              {/* STEP 1: CHOOSE PLAN */}
              <div className={`relative bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${step === 1 ? 'border-[#002147] shadow-xl' : 'border-gray-100 shadow-sm opacity-60'}`}>
                <div className="p-6 bg-gray-50/50 flex justify-between items-center cursor-pointer" onClick={() => setStep(1)}>
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#002147] text-[#E2B254] flex items-center justify-center text-sm">1</span> Plan Type
                  </h2>
                  {step > 1 && <span className="text-xs font-bold text-[#9e111a] capitalize">{plan.replace('_', ' ')} Plan Selected</span>}
                </div>
                
                <AnimatePresence>
                  {step === 1 && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        <div onClick={() => navigate('/products')} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#002147] cursor-pointer transition-colors bg-white flex flex-col h-full group">
                          <ShoppingBag className="text-gray-400 group-hover:text-[#002147] mb-3" size={24} />
                          <h3 className="font-black text-lg text-[#1A1A1A]">One-Time Buy</h3>
                          <p className="text-xs text-gray-500 mt-1 mb-4 flex-grow">Standard single delivery. Browse our shop and checkout instantly.</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#002147] bg-gray-50 py-1.5 px-3 rounded-lg w-max">Go to Shop →</span>
                        </div>

                        <div onClick={() => handlePlanSelect('daily')} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#002147] cursor-pointer transition-colors bg-white flex flex-col h-full group relative">
                          <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm">🎁 Free 2L Included</div>
                          <CalendarDays className="text-gray-400 group-hover:text-[#002147] mb-3" size={24} />
                          <h3 className="font-black text-lg text-[#1A1A1A]">Daily (1 Month)</h3>
                          <p className="text-xs text-gray-500 mt-1 mb-4 flex-grow">Requires items selected on all 7 days of the week.</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#002147] bg-blue-50 py-1.5 px-3 rounded-lg w-max">30 Deliveries</span>
                        </div>

                        <div onClick={() => handlePlanSelect('alternate')} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#002147] cursor-pointer transition-colors bg-white flex flex-col h-full group">
                          <Calendar className="text-gray-400 group-hover:text-[#002147] mb-3" size={24} />
                          <h3 className="font-black text-lg text-[#1A1A1A]">Alternate Days</h3>
                          <p className="text-xs text-gray-500 mt-1 mb-4 flex-grow">3 deliveries per week. Choose MWF or TTS.</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#002147] bg-blue-50 py-1.5 px-3 rounded-lg w-max">1 Month Cycle</span>
                        </div>

                        <div onClick={() => handlePlanSelect('weekly')} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#002147] cursor-pointer transition-colors bg-white flex flex-col h-full group">
                          <CalendarDays className="text-gray-400 group-hover:text-[#002147] mb-3" size={24} />
                          <h3 className="font-black text-lg text-[#1A1A1A]">Weekly (1 Month)</h3>
                          <p className="text-xs text-gray-500 mt-1 mb-4 flex-grow">Select exactly one day per week for bulk delivery.</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#002147] bg-blue-50 py-1.5 px-3 rounded-lg w-max">4 Deliveries</span>
                        </div>

                        <div onClick={() => handlePlanSelect('custom')} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#E2B254] cursor-pointer transition-colors bg-gradient-to-br from-[#1A1A1A] to-black flex flex-col h-full sm:col-span-2">
                          <h3 className="font-black text-lg text-[#E2B254]">Custom Flex (1 Week Only)</h3>
                          <p className="text-xs text-gray-300 mt-1 mb-4">Pick any custom days. Valid for a single week only. Perfect for trial runs.</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-black bg-[#E2B254] py-1.5 px-3 rounded-lg w-max">Flexible Days</span>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* STEP 2: CHOOSE DAYS */}
              <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${step === 2 ? 'border-[#002147] shadow-xl' : 'border-gray-100 shadow-sm opacity-60'}`}>
                <div className={`p-6 flex justify-between items-center ${step > 1 ? 'cursor-pointer bg-gray-50/50' : 'bg-white'}`} onClick={() => step > 1 && setStep(2)}>
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-[#002147] text-[#E2B254]' : 'bg-gray-100 text-gray-400'}`}>2</span> Delivery Days
                  </h2>
                  {step > 2 && <span className="text-xs font-bold text-[#9e111a]">{selectedDays.length} Days Selected</span>}
                </div>

                <AnimatePresence>
                  {step === 2 && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-6 pt-0">
                        {plan === 'alternate' && (
                          <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => { setSelectedDays(ALTERNATE_SETS.MWF); setActiveDayTab('Monday'); }} className={`p-4 rounded-xl border-2 font-black tracking-widest ${selectedDays.includes('Monday') ? 'border-[#002147] bg-blue-50 text-[#002147]' : 'border-gray-100 text-gray-500'}`}>
                              Mon - Wed - Fri
                            </button>
                            <button onClick={() => { setSelectedDays(ALTERNATE_SETS.TTS); setActiveDayTab('Tuesday'); }} className={`p-4 rounded-xl border-2 font-black tracking-widest ${selectedDays.includes('Tuesday') ? 'border-[#002147] bg-blue-50 text-[#002147]' : 'border-gray-100 text-gray-500'}`}>
                              Tue - Thu - Sat
                            </button>
                          </div>
                        )}

                        {(plan === 'weekly' || plan === 'custom') && (
                          <div className="flex flex-wrap gap-3">
                            {DAYS_OF_WEEK.map(day => (
                              <button 
                                key={day} onClick={() => handleDayToggle(day)}
                                className={`px-4 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-colors ${selectedDays.includes(day) ? 'border-[#002147] bg-[#002147] text-[#E2B254]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                              >
                                {day.substring(0,3)}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="mt-6 flex justify-end">
                          <button onClick={() => {
                            if (selectedDays.length > 0) setStep(3);
                            else alert("Please select delivery days first.");
                          }} className="bg-[#002147] text-[#E2B254] px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#1A1A1A] transition-colors">
                            Continue to Basket
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* STEP 3: BUILD BASKET */}
              <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${step === 3 ? 'border-[#002147] shadow-xl' : 'border-gray-100 shadow-sm opacity-60'}`}>
                <div className={`p-6 flex justify-between items-center ${step > 2 ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 3 ? 'bg-[#002147] text-[#E2B254]' : 'bg-gray-100 text-gray-400'}`}>3</span> Build Basket
                  </h2>
                </div>

                <AnimatePresence>
                  {step === 3 && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-6 pt-0">
                        
                        {/* Day Tabs */}
                        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-6">
                          {selectedDays.map(day => {
                            const hasItems = Object.keys(basket[day] || {}).length > 0;
                            return (
                              <button 
                                key={day} onClick={() => setActiveDayTab(day)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap border-2 flex items-center gap-2 ${activeDayTab === day ? 'border-[#002147] bg-[#002147] text-white' : hasItems ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
                              >
                                {day} {hasItems && <CheckCircle2 size={14}/>}
                              </button>
                            );
                          })}
                        </div>

                        {/* Fast Actions */}
                        <div className="flex justify-between items-center mb-4 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#002147]">Adding items for: <span className="text-[#9e111a]">{activeDayTab}</span></p>
                          {selectedDays.length > 1 && (
                            <button onClick={copyToAllDays} className="text-[10px] font-black uppercase tracking-widest text-[#002147] flex items-center gap-1 bg-white border border-[#002147]/20 px-3 py-1.5 rounded hover:bg-[#002147] hover:text-white transition-colors">
                              <Copy size={12}/> Copy to All Days
                            </button>
                          )}
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {products.map(product => {
                            const qty = basket[activeDayTab]?.[product.id] || 0;
                            return (
                              <div key={product.id} className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${qty > 0 ? 'border-[#9e111a] bg-red-50/30' : 'border-gray-100 hover:border-gray-300 bg-white'}`}>
                                <img src={product.img} alt={product.name} className="w-16 h-16 object-contain mb-2 mix-blend-multiply" />
                                <h4 className="text-[11px] font-black leading-tight text-[#1A1A1A]">{product.name}</h4>
                                <span className="text-[10px] font-bold text-gray-500 mb-2">NPR {product.price}</span>
                                
                                {qty === 0 ? (
                                  <button onClick={() => updateQuantity(product.id, 1)} className="mt-auto w-full py-2 bg-gray-50 hover:bg-[#002147] hover:text-white text-[#002147] text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors">Add</button>
                                ) : (
                                  <div className="mt-auto w-full flex justify-between items-center bg-[#9e111a] text-white rounded-lg p-1">
                                    <button onClick={() => updateQuantity(product.id, -1)} className="p-1 hover:bg-white/20 rounded"><Minus size={14}/></button>
                                    <span className="font-black text-xs">{qty}</span>
                                    <button onClick={() => updateQuantity(product.id, 1)} className="p-1 hover:bg-white/20 rounded"><Plus size={14}/></button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* RIGHT SIDE: CHECKOUT SUMMARY & 5KM ADDRESS GATEKEEPER */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-[#002147] text-white">
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                    <Receipt size={20} className="text-[#E2B254]"/> Routine Summary
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  {!isBasketValid && step === 3 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex gap-2 text-xs font-bold">
                      <ShieldAlert size={16} className="shrink-0"/>
                      <p>You must select at least one product for every active day in your plan to checkout.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    
                    {/* 12-HOUR WARNING MESSAGE */}
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl flex items-start gap-2">
                      <Clock size={16} className="shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold">Please place your order at least <strong className="font-black">12 hours</strong> before your preferred delivery time.</p>
                    </div>

                    {/* 5 KM PATAN / KULESHWOR AREA GATEKEEPER */}
                    <div ref={dropdownRef}>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">
                        Select Delivery Neighborhood *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#002147]" size={16} />
                        <input 
                          type="text"
                          placeholder="Search Patan / Kuleshwor zone..."
                          value={locationSearch}
                          onFocus={() => setIsDropdownOpen(true)}
                          onChange={(e) => {
                            setLocationSearch(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 text-sm font-bold text-[#1A1A1A] rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-[#002147] focus:bg-white transition-all shadow-sm"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.ul 
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto custom-scrollbar overflow-hidden"
                            >
                              {filteredLocations.length > 0 ? (
                                filteredLocations.map(loc => (
                                  <li 
                                    key={loc} 
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setLocation(loc);
                                      setLocationSearch(loc === 'OTHER' ? 'Other / Area Not Listed' : loc);
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors ${location === loc ? 'bg-blue-50 text-[#002147]' : 'text-gray-700'}`}
                                  >
                                    {loc === 'OTHER' ? 'Other / My Area is Not Listed' : loc}
                                  </li>
                                ))
                              ) : (
                                <li className="px-4 py-3 text-xs text-gray-400 font-medium italic text-center">No matching neighborhoods found</li>
                              )}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* OUTSIDE 5KM SERVICE BANNER */}
                    {isOutsideService && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold leading-relaxed animate-fade-in">
                        <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase text-[10px] tracking-wider text-red-900">Service Restricted</p>
                          <p className="mt-0.5">
                            We currently only deliver within a 5 km radius of our <strong>Patan</strong> and <strong>Kuleshwor</strong> hubs.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* DETAILED HOUSE ADDRESS & PHONE (Only shown when inside serviceable zone) */}
                    {isAreaSelected && (
                      <div className="space-y-3 animate-fade-in pt-1">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">
                            Detailed House / Street Address *
                          </label>
                          <input
                            type="text"
                            value={detailedAddress}
                            onChange={(e) => setDetailedAddress(e.target.value)}
                            placeholder="e.g., House No. 12, Street Name"
                            required
                            className="w-full bg-gray-50 border border-gray-200 text-sm font-medium text-[#1A1A1A] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002147] focus:bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">
                              Landmark
                            </label>
                            <input
                              type="text"
                              value={landmark}
                              onChange={(e) => setLandmark(e.target.value)}
                              placeholder="Near Zoo Gate"
                              className="w-full bg-gray-50 border border-gray-200 text-sm font-medium text-[#1A1A1A] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002147] focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">
                              Contact Phone *
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="98XXXXXXXX"
                              required
                              className="w-full bg-gray-50 border border-gray-200 text-sm font-medium text-[#1A1A1A] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#002147] focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* TIMING SELECTION */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Timing Route *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setTiming('morning')} className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${timing === 'morning' ? 'border-[#002147] bg-[#002147] text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}><Sunrise size={14}/> 7-10 AM</button>
                        <button type="button" onClick={() => setTiming('evening')} className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${timing === 'evening' ? 'border-[#002147] bg-[#002147] text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}><Sunset size={14}/> 2-5 PM</button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <div className="flex justify-between text-sm font-bold text-gray-600">
                      <span>Weekly Base Cost</span>
                      <span>NPR {weeklyCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-600">
                      <span>Plan Multiplier</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">x{plan === 'custom' ? '1 Week' : '4 Weeks'}</span>
                    </div>
                    <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#002147]">Grand Total</span>
                      <span className="text-3xl font-black text-[#9e111a]">NPR {finalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* CONNECTIPS SUBSCRIPTION CHECKOUT BUTTON */}
                  <button 
                    onClick={handleConnectIPSCheckout}
                    disabled={!isBasketValid || !isAddressValid || !timing || isSubmitting}
                    className="w-full bg-[#00519E] hover:bg-[#004182] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#00519E] text-white p-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-md flex justify-center items-center gap-3 relative"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="animate-spin" size={20} /> Processing Payment...</>
                    ) : !isAddressValid ? (
                      <span>Select Valid Neighborhood</span>
                    ) : (
                      <>
                        <Lock size={16} className="opacity-70" />
                        <span>Pay via</span>
                        <div className="bg-white px-3 py-1 rounded shadow-sm">
                          <img src={cIPSlogo} alt="connectIPS" className="h-4 object-contain block" />
                        </div>
                      </>
                    )}
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Lock size={12} /> 
                    <span>Encrypted and secured by connectIPS.</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}