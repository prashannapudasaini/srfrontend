import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { MapPin, CheckCircle2, Loader2, Plus, Minus, ShoppingBag, CalendarDays, Receipt, Calendar, Info, Sunrise, Sunset, Copy, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import api from '../services/api';
import ContactModal from '../components/ContactModal';

const AVAILABLE_LOCATIONS = ["Kathmandu", "Lalitpur", "Bhaktapur"];

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
  const [plan, setPlan] = useState(''); // 'daily', 'alternate', 'weekly', 'custom'
  const [selectedDays, setSelectedDays] = useState([]);
  const [activeDayTab, setActiveDayTab] = useState('');
  
  // Basket structure: { Monday: { prodId: qty }, Tuesday: { prodId: qty } }
  const [basket, setBasket] = useState({});
  
  // Delivery States
  const [location, setLocation] = useState(''); 
  const [timing, setTiming] = useState(''); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Calculate Tomorrow's Date for the Delivery Notice
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  // Fetch Products
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
              img: p.image || p.variants?.[0]?.image || '/logo.png'
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

  // --- PLAN & DAY LOGIC ---
  const handlePlanSelect = (selectedPlan) => {
    setPlan(selectedPlan);
    setBasket({}); // Reset basket when plan changes
    
    if (selectedPlan === 'daily') {
      setSelectedDays(DAYS_OF_WEEK);
      setActiveDayTab(DAYS_OF_WEEK[0]);
      setStep(3); // Skip day selection for daily
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
      
      // Sort days chronologically
      newDays = DAYS_OF_WEEK.filter(d => newDays.includes(d));
      setSelectedDays(newDays);
      if (!newDays.includes(activeDayTab)) setActiveDayTab(newDays[0] || '');
    }
  };

  // --- BASKET LOGIC ---
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

  // --- MATH & VALIDATION ---
  const calculateTotals = () => {
    let baseWeeklyCost = 0;
    
    // Sum up items across all selected days
    selectedDays.forEach(day => {
      const dayItems = basket[day] || {};
      Object.entries(dayItems).forEach(([prodId, qty]) => {
        const prod = products.find(p => String(p.id) === String(prodId));
        if (prod) baseWeeklyCost += (prod.price * qty);
      });
    });

    // Monthly multiplier (4 weeks) vs Custom (1 week)
    const multiplier = plan === 'custom' ? 1 : 4;
    return { weeklyCost: baseWeeklyCost, finalCost: baseWeeklyCost * multiplier };
  };

  const { weeklyCost, finalCost } = calculateTotals();

  const isBasketValid = useMemo(() => {
    if (selectedDays.length === 0) return false;
    // Check if EVERY selected day has at least 1 item
    return selectedDays.every(day => {
      const dayItems = basket[day] || {};
      const totalItems = Object.values(dayItems).reduce((sum, qty) => sum + qty, 0);
      return totalItems > 0;
    });
  }, [selectedDays, basket]);

  // --- CHECKOUT & ESEWA ---
  const handleEsewaCheckout = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!isBasketValid || !location || !timing) return alert("Please complete all fields.");
    
    setIsSubmitting(true);
    
    try {
      // 1. Format the schedule for the database
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

      // 2. CREATE SUBSCRIPTION IN DATABASE FIRST
      const createRes = await api.post('/orders/create_sub.php', {
        user_id: user.id,
        plan_type: plan,
        delivery_time: timing,
        location: location,
        weekly_total_cost: finalCost,
        schedule: cleanWeeklySchedule
      });

      if (createRes.data.status !== 'success') {
        alert("Failed to create subscription record.");
        setIsSubmitting(false);
        return;
      }

      // We capture the real DB ID (e.g., 15)
      const subDbId = createRes.data.id;

      // 3. INITIALIZE ESEWA WITH THE REAL DATABASE ID (e.g., SUB_15)
      const res = await api.post('/orders/init_esewa.php', {
        amount: finalCost,
        purchase_id: `SUB_${subDbId}` 
      });

      if (res.data.status === 'success') {
        // 4. Send to eSewa
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

        for (const key in res.data.esewa_payload) {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", res.data.esewa_payload[key]);
          form.appendChild(hiddenField);
        }
        document.body.appendChild(form);
        form.submit();
      } else {
        alert(res.data.message || "Failed to initialize eSewa.");
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
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] tracking-tight">Curate Your Plan</h1>
            <p className="text-gray-500 font-medium mt-3 max-w-xl mx-auto">Build your recurring farm-fresh delivery schedule in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ========================================== */}
            {/* LEFT SIDE: WIZARD FLOW */}
            {/* ========================================== */}
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

            {/* ========================================== */}
            {/* RIGHT SIDE: CHECKOUT SUMMARY */}
            {/* ========================================== */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-[#002147] text-white">
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                    <Receipt size={20} className="text-[#E2B254]"/> Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Validation Warning */}
                  {!isBasketValid && step === 3 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex gap-2 text-xs font-bold">
                      <ShieldAlert size={16} className="shrink-0"/>
                      <p>You must select at least one product for every active day in your plan to checkout.</p>
                    </div>
                  )}

                  {/* Settings */}
                  <div className="space-y-4">
                    {/* Notice Box */}
                    <div className="bg-red-50 border border-red-100 text-[#9e111a] p-3 rounded-xl flex items-start gap-2 mb-3">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold">Order before 8:00 PM for tomorrow's delivery. Your cycle begins: <strong className="font-black">{tomorrowFormatted}</strong></p>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Delivery Zone</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-sm font-bold text-[#1A1A1A] rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#002147]">
                          <option value="" disabled>Select Zone...</option>
                          {AVAILABLE_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Timing</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setTiming('morning')} className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${timing === 'morning' ? 'border-[#002147] bg-[#002147] text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}><Sunrise size={14}/> AM</button>
                        <button onClick={() => setTiming('evening')} className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${timing === 'evening' ? 'border-[#002147] bg-[#002147] text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}><Sunset size={14}/> PM</button>
                      </div>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="border-t border-gray-100 pt-6 space-y-3">
                    <div className="flex justify-between text-sm font-bold text-gray-600">
                      <span>Weekly Base Cost</span>
                      <span>NPR {weeklyCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-600">
                      <span>Plan Multiplier</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">x{plan === 'custom' ? '1 Week' : '4 Weeks'}</span>
                    </div>
                    <div className="flex justify-between items-end pt-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#002147]">Grand Total</span>
                      <span className="text-3xl font-black text-[#9e111a]">NPR {finalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={handleEsewaCheckout}
                    disabled={!isBasketValid || !location || !timing || isSubmitting}
                    className="w-full bg-[#60A839] hover:bg-[#4d872d] disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : `Pay via eSewa`}
                  </button>
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