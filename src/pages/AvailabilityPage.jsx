import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { MapPin, Check, Loader2, Plus, Minus, ShoppingBag, CalendarDays, Receipt, Calendar, Info, Sunrise, Sunset } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import api from '../services/api';
import ContactModal from '../components/ContactModal';

const AVAILABLE_LOCATIONS = [
  "Kathmandu", "Lalitpur", "Bhaktapur"
];

const DAYS_OF_WEEK = [
  { full: 'Monday', short: 'MON' },
  { full: 'Tuesday', short: 'TUE' },
  { full: 'Wednesday', short: 'WED' },
  { full: 'Thursday', short: 'THU' },
  { full: 'Friday', short: 'FRI' },
  { full: 'Saturday', short: 'SAT' },
  { full: 'Sunday', short: 'SUN' }
];

export default function AvailabilityPage() {
  const navigate = useNavigate(); 
  const { isAuthenticated } = useAuth(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState(''); 
  
  // NEW: Updated Plan States based on the UI requested
  const [subscriptionPlan, setSubscriptionPlan] = useState('one_time'); // one_time, daily, alternate, weekly
  const [deliveryTiming, setDeliveryTiming] = useState('evening'); // morning, evening
  
  const [activeDay, setActiveDay] = useState('Monday'); 
  const [productSchedules, setProductSchedules] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Calculate Tomorrow's Date for the Delivery Notice
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  // Fetch Live Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/index.php');
        if (res.data.status === 'success') {
          const formattedProducts = res.data.data.map(p => {
            const lowestPrice = p.variants?.length > 0 
              ? Math.min(...p.variants.map(v => parseFloat(v.price_npr) || 0)) 
              : 0;
            const displayImage = p.image || p.variants?.[0]?.image || '/logo.png';
            const unit = p.variants?.[0]?.size || 'Standard';

            return {
              id: p.id,
              name: p.name,
              size: unit,
              price: lowestPrice,
              img: displayImage
            };
          });
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Failed to load products for subscription", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const activeDays = useMemo(() => {
    const daysSet = new Set();
    Object.values(productSchedules).forEach(dayData => {
      Object.entries(dayData).forEach(([day, qty]) => {
        if (qty > 0) daysSet.add(day);
      });
    });
    return DAYS_OF_WEEK.map(d => d.full).filter(day => daysSet.has(day));
  }, [productSchedules]);

  const summaryItems = useMemo(() => {
    const summary = {};
    Object.entries(productSchedules).forEach(([productId, dayData]) => {
      const totalQty = Object.values(dayData).reduce((sum, qty) => sum + qty, 0);
      if (totalQty > 0) {
        const product = products.find(p => String(p.id) === String(productId)); 
        if (product) {
          summary[productId] = { ...product, totalQty };
        }
      }
    });
    return Object.values(summary);
  }, [productSchedules, products]);

  // Base cost of selected items
  const baseCost = summaryItems.reduce((sum, item) => sum + (item.price * item.totalQty), 0);

  // Dynamic Multiplier based on the selected plan
  const calculateFinalCost = () => {
    switch (subscriptionPlan) {
      case 'daily': return baseCost * 30; // 30 deliveries
      case 'alternate': return baseCost * 15; // 15 deliveries
      case 'weekly': return baseCost * 4; // 4 deliveries
      case 'one_time':
      default: return baseCost; // 1 delivery
    }
  };

  const finalCost = calculateFinalCost();

  // --- Handlers ---
  const handleAddProductToActiveDay = (product) => {
    if (!activeDay) return;
    setProductSchedules(prev => {
      const prodData = prev[product.id] || {};
      const currentQty = prodData[activeDay] || 0;
      return { ...prev, [product.id]: { ...prodData, [activeDay]: currentQty + 1 } };
    });
  };

  const handleUpdateProductDay = (productId, day, delta) => {
    setProductSchedules(prev => {
      const prodData = prev[productId] || {};
      const currentQty = prodData[day] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newProdData = { ...prodData };
      if (newQty === 0) delete newProdData[day];
      else newProdData[day] = newQty;

      const newState = { ...prev };
      if (Object.keys(newProdData).length === 0) delete newState[productId];
      else newState[productId] = newProdData;
      
      return newState;
    });
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedLocation || summaryItems.length === 0) return;
    setIsSubmitting(true);

    const cleanWeeklySchedule = activeDays.map(day => {
      const itemsForDay = [];
      Object.entries(productSchedules).forEach(([productId, dayData]) => {
        if (dayData[day] && dayData[day] > 0) {
          const product = products.find(p => String(p.id) === String(productId));
          if (product) {
            itemsForDay.push({
              productId: product.id, name: product.name, size: product.size, qty: dayData[day], price: product.price
            });
          }
        }
      });
      return { day, items: itemsForDay };
    });

    const orderPayload = {
      subscriptionDetails: { 
        type: subscriptionPlan, 
        timing: deliveryTiming,
        location: selectedLocation, 
        totalCost: finalCost 
      },
      weeklySchedule: cleanWeeklySchedule,
      amount: finalCost,
      purchase_id: `SUB_${Date.now()}`,
      purchase_name: `${subscriptionPlan.replace('_', ' ').toUpperCase()} Delivery`
    };

    try {
      const response = await api.post('/orders/verify.php', orderPayload);
      
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else if (response.data.status === 'success') {
        navigate('/subscription-success', { 
          state: { orderData: orderPayload, itemCount: summaryItems.reduce((acc, curr) => acc + curr.totalQty, 0) } 
        });
      } else {
        alert(response.data.message || "Payment initialization failed.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to the payment server. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8E7] pt-40 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9e111a] mb-4"></div>
        <p className="text-[#002147] font-bold uppercase tracking-widest text-sm">Loading Catalog...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20 font-sans text-[#1A1A1A]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] tracking-tight flex items-center justify-center gap-4">
              <span className="text-[#E2B254]">✦</span> CURATE YOUR SUBSCRIPTION <span className="text-[#E2B254]">✦</span>
            </h1>
            <p className="text-gray-500 font-medium mt-4">Design your perfect routine. Select a day, add products, and choose your plan.</p>
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start h-auto lg:h-[calc(100vh-220px)] min-h-[850px]">
            
            {/* ========================================== */}
            {/* COLUMN 1: PRODUCT SELECTION */}
            {/* ========================================== */}
            <div className="lg:col-span-5 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="p-6 pb-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/30">
                <div className="p-2 bg-[#002147]/5 text-[#002147] rounded-lg">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-widest text-[#002147]">
                  1. Product Selection
                </h2>
              </div>
              
              <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => handleAddProductToActiveDay(product)}
                      className="group relative flex flex-col items-center p-4 rounded-2xl border border-gray-100 hover:border-[#002147]/30 hover:shadow-lg transition-all duration-300 bg-white hover:-translate-y-1 text-center h-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 rounded-2xl pointer-events-none"></div>
                      
                      {/* Hover Add Icon */}
                      <div className="absolute top-3 right-3 w-7 h-7 bg-[#002147] text-[#E2B254] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform scale-75 group-hover:scale-100">
                        <Plus size={16} strokeWidth={3} />
                      </div>
                      
                      <img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-20 h-20 object-contain p-2 rounded-xl mb-4 shadow-sm bg-gray-50 z-10 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
                      />
                      <div className="z-10 flex flex-col flex-grow justify-between w-full">
                        <div>
                          <h4 className="text-[13px] font-black leading-tight text-[#1A1A1A] mb-1">{product.name}</h4>
                          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{product.size}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100/80">
                          <span className="text-[#9e111a] font-black text-sm">NPR {product.price}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* COLUMN 2: WEEKLY SCHEDULE */}
            {/* ========================================== */}
            <div className="lg:col-span-4 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="p-6 pb-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/30">
                <div className="p-2 bg-[#002147]/5 text-[#002147] rounded-lg">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-widest text-[#002147] leading-tight">
                    2. Your Schedule
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Select a day below</p>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-3">
                {DAYS_OF_WEEK.map(dayObj => {
                  const isSelected = activeDay === dayObj.full;
                  
                  const dayProducts = products.map(p => ({
                    ...p, qty: productSchedules[p.id]?.[dayObj.full] || 0
                  })).filter(p => p.qty > 0);

                  const hasItems = dayProducts.length > 0;

                  return (
                    <div 
                      key={dayObj.full}
                      onClick={() => setActiveDay(dayObj.full)}
                      className={`flex items-stretch border-2 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden min-h-[85px] group ${
                        isSelected 
                          ? 'border-[#002147] shadow-[0_4px_15px_rgba(0,33,71,0.12)] -translate-y-0.5' 
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {/* Day Label Strip */}
                      <div className={`w-16 flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isSelected ? 'bg-[#002147] text-white' : hasItems ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                      }`}>
                        <span className="font-black text-sm tracking-widest">{dayObj.short}</span>
                      </div>

                      {/* Day Content Area */}
                      <div className={`flex-grow p-3 flex flex-wrap items-center gap-2.5 transition-colors ${isSelected ? 'bg-blue-50/40' : 'bg-white'}`}>
                        {hasItems ? (
                          dayProducts.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
                              <img src={p.img} alt={p.name} className="w-9 h-9 rounded-lg object-contain bg-gray-50 p-1 mix-blend-multiply" />
                              <div className="flex flex-col items-center bg-gray-50 rounded-lg px-1">
                                <button onClick={(e) => { e.stopPropagation(); handleUpdateProductDay(p.id, dayObj.full, 1); }} className="text-gray-400 hover:text-[#9e111a] py-0.5"><Plus size={12}/></button>
                                <span className="text-[11px] font-black text-[#1A1A1A] leading-none py-0.5">{p.qty}</span>
                                <button onClick={(e) => { e.stopPropagation(); handleUpdateProductDay(p.id, dayObj.full, -1); }} className="text-gray-400 hover:text-[#9e111a] py-0.5"><Minus size={12}/></button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center w-full h-full opacity-60">
                            <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-[#002147]' : 'text-gray-400'}`}>
                              {isSelected ? "Click products to add →" : "Empty"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================== */}
            {/* COLUMN 3: SUMMARY & PLAN (UPDATED TO MATCH SCREENSHOT) */}
            {/* ========================================== */}
            <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="p-6 pb-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/30">
                <div className="p-2 bg-[#002147]/5 text-[#002147] rounded-lg">
                  <Receipt size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-widest text-[#002147]">
                  3. Summary & Plan
                </h2>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar p-6 flex flex-col">
                
                {/* Location Selector */}
                <div className="mb-6 relative">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Delivery Zone</label>
                    <button 
                      onClick={() => setIsContactModalOpen(true)}
                      className="text-[10px] font-black text-[#9e111a] hover:text-[#002147] uppercase tracking-widest transition-colors flex items-center gap-1 bg-[#9e111a]/5 hover:bg-[#002147]/5 px-2 py-1 rounded"
                    >
                      Not in your region?
                    </button>
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-sm font-bold text-[#1A1A1A] rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#9e111a] appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <option value="" disabled>Select Zone...</option>
                      {AVAILABLE_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* --- NEW: PLAN CHOOSER GRID --- */}
                <div className="mb-6">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3 block">Choose Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* One Time */}
                    <button onClick={() => setSubscriptionPlan('one_time')} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${subscriptionPlan === 'one_time' ? 'bg-[#9e111a] border-[#9e111a] text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <ShoppingBag size={18} className={subscriptionPlan === 'one_time' ? 'text-white mb-2' : 'text-gray-400 mb-2'} />
                      <span className="text-xs font-bold">One Time Buy</span>
                      <span className={`text-[9px] mt-1 ${subscriptionPlan === 'one_time' ? 'text-red-200' : 'text-gray-400'}`}>1 Delivery</span>
                    </button>

                    {/* Daily */}
                    <button onClick={() => setSubscriptionPlan('daily')} className={`relative p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${subscriptionPlan === 'daily' ? 'bg-[#9e111a] border-[#9e111a] text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <div className="absolute -top-2.5 -right-2 bg-green-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                        🎁 2L Free
                      </div>
                      <CalendarDays size={18} className={subscriptionPlan === 'daily' ? 'text-white mb-2' : 'text-gray-400 mb-2'} />
                      <span className="text-xs font-bold">Daily</span>
                      <span className={`text-[9px] mt-1 ${subscriptionPlan === 'daily' ? 'text-red-200' : 'text-gray-400'}`}>30 Deliveries/Mo</span>
                    </button>

                    {/* Alternate Days */}
                    <button onClick={() => setSubscriptionPlan('alternate')} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${subscriptionPlan === 'alternate' ? 'bg-[#9e111a] border-[#9e111a] text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <Calendar size={18} className={subscriptionPlan === 'alternate' ? 'text-white mb-2' : 'text-gray-400 mb-2'} />
                      <span className="text-xs font-bold leading-tight">Alternate Days</span>
                      <span className={`text-[9px] mt-1 ${subscriptionPlan === 'alternate' ? 'text-red-200' : 'text-gray-400'}`}>15 Deliveries/Mo</span>
                    </button>

                    {/* Weekly */}
                    <button onClick={() => setSubscriptionPlan('weekly')} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${subscriptionPlan === 'weekly' ? 'bg-[#9e111a] border-[#9e111a] text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <CalendarDays size={18} className={subscriptionPlan === 'weekly' ? 'text-white mb-2' : 'text-gray-400 mb-2'} />
                      <span className="text-xs font-bold">Weekly</span>
                      <span className={`text-[9px] mt-1 ${subscriptionPlan === 'weekly' ? 'text-red-200' : 'text-gray-400'}`}>4 Deliveries/Mo</span>
                    </button>

                  </div>
                </div>

                {/* --- NEW: DELIVERY TIMING SECTION --- */}
                <div className="mb-6">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Delivery Timing</label>
                  
                  {/* Notice Box */}
                  <div className="bg-red-50 border border-red-100 text-[#9e111a] p-3 rounded-xl flex items-start gap-2 mb-3">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    <p className="text-xs">Order before 8:00 PM for tomorrow's delivery. Your cycle begins: <strong className="font-black">{tomorrowFormatted}</strong></p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setDeliveryTiming('morning')} className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${deliveryTiming === 'morning' ? 'border-[#9e111a] text-[#9e111a] bg-red-50/50 font-bold shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300 font-medium'}`}>
                      <Sunrise size={16} className={deliveryTiming === 'morning' ? 'text-[#9e111a]' : 'text-gray-400'} />
                      <span className="text-xs">Morning <span className="text-[10px] opacity-70">(7:00 AM)</span></span>
                    </button>

                    <button onClick={() => setDeliveryTiming('evening')} className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${deliveryTiming === 'evening' ? 'border-[#9e111a] text-[#9e111a] bg-red-50/50 font-bold shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300 font-medium'}`}>
                      <Sunset size={16} className={deliveryTiming === 'evening' ? 'text-[#9e111a]' : 'text-gray-400'} />
                      <span className="text-xs">Evening <span className="text-[10px] opacity-70">(5:00 PM)</span></span>
                    </button>
                  </div>
                </div>

                {/* Final Cost & Submit */}
                <div className="mt-auto border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Total Calculation</span>
                    <span className="text-2xl font-black text-[#1A1A1A]">NPR {finalCost.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={(!selectedLocation || summaryItems.length === 0 || isSubmitting) && isAuthenticated}
                    className={`w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all ${
                      !isAuthenticated 
                        ? 'bg-[#1A1A1A] text-white hover:bg-black shadow-lg hover:-translate-y-0.5'
                        : (!selectedLocation || summaryItems.length === 0)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                          : 'bg-gradient-to-r from-[#d4af37] to-[#E2B254] text-[#002147] shadow-[0_4px_14px_rgba(226,178,84,0.4)] hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} /> Processing...</span>
                    ) : !isAuthenticated ? (
                      "Login to Continue"
                    ) : (
                      "Confirm Schedule"
                    )}
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