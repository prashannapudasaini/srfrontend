import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { 
  MapPin, CheckCircle2, Loader2, Plus, Minus, ShoppingBag, 
  CalendarDays, Receipt, Sunrise, Copy, ShieldAlert, 
  Lock, CreditCard, Clock, AlertCircle, Search, Gift
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { useAuth } from '../context/AuthContext'; 
import api from '../services/api';
import ContactModal from '../components/ContactModal';
import cIPSlogo from '../assets/cIPSlogo.png'; 

// --- FIX FOR LEAFLET REACT ICONS BUGS ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- DELIVERY HUBS CONFIG ---
const HUBS = [
  { name: 'Patan', coordinates: [85.3181, 27.6742] },     
  { name: 'Kuleshwor', coordinates: [85.2970, 27.6970] }
];
const MAX_RADIUS_KM = 5;

// --- GENERATE RED ZONE MASK ---
const outerBounds = [ [35, 70], [35, 95], [20, 95], [20, 70] ]; 
const circle1 = turf.circle(HUBS[0].coordinates, MAX_RADIUS_KM, { steps: 64, units: 'kilometers' });
const circle2 = turf.circle(HUBS[1].coordinates, MAX_RADIUS_KM, { steps: 64, units: 'kilometers' });

let mergedZones;
try {
  mergedZones = turf.union(turf.featureCollection([circle1, circle2]));
} catch (e) {
  mergedZones = turf.union(circle1, circle2);
}

const extractLeafletCoords = (polygonFeature) => {
  const type = polygonFeature.geometry.type;
  const coords = polygonFeature.geometry.coordinates;
  const flip = (c) => [c[1], c[0]]; 
  if (type === 'Polygon') return [coords[0].map(flip)];
  if (type === 'MultiPolygon') return coords.map(poly => poly[0].map(flip));
  return [];
};

const safeZoneHoles = extractLeafletCoords(mergedZones);
const redZoneMask = [outerBounds, ...safeZoneHoles]; 
const circle1Border = circle1.geometry.coordinates[0].map(c => [c[1], c[0]]);
const circle2Border = circle2.geometry.coordinates[0].map(c => [c[1], c[0]]);

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
  const [timing, setTiming] = useState('morning'); // Locked to morning
  
  // --- LOCATION & ADDRESS STATES ---
  const [detailedAddress, setDetailedAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  
  const [userLocation, setUserLocation] = useState(null); 
  const [selectedAreaName, setSelectedAreaName] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState({ available: false, fee: 0, distance: 0, hasChecked: false });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const isAddressValid = deliveryInfo.available && Boolean(detailedAddress.trim()) && Boolean(phone.trim());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/index.php');
        if (res.data.status === 'success') {
          const formattedProducts = res.data.data.map(p => {
            const lowestPrice = p.variants?.length > 0 ? Math.min(...p.variants.map(v => parseFloat(v.price_npr) || 0)) : 0;
            return {
              id: p.id, name: p.name, size: p.variants?.[0]?.size || 'Standard',
              price: lowestPrice, img: p.base_image || p.image || p.variants?.[0]?.image || '/logo.png'
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

  // --- GIS LOGIC ---
  const checkDeliveryZone = (lat, lng) => {
    setUserLocation([lat, lng]);
    const userPoint = turf.point([lng, lat]);
    let shortestDistance = Infinity;

    HUBS.forEach(hub => {
      const hubPoint = turf.point(hub.coordinates);
      const distance = turf.distance(userPoint, hubPoint, { units: 'kilometers' });
      if (distance < shortestDistance) shortestDistance = distance;
    });

    if (shortestDistance <= MAX_RADIUS_KM) {
      const calculatedFee = Math.ceil(shortestDistance) * 30; 
      setDeliveryInfo({ available: true, fee: calculatedFee, distance: shortestDistance.toFixed(1), hasChecked: true });
    } else {
      setDeliveryInfo({ available: false, fee: 0, distance: shortestDistance.toFixed(1), hasChecked: true });
    }
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      const res = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const props = data.features[0].properties;
        const nameParts = [props.name, props.district, props.city].filter(Boolean);
        setSelectedAreaName([...new Set(nameParts)].join(', ') || 'Map Pinned Location');
      } else {
        setSelectedAreaName('Map Pinned Location');
      }
    } catch (err) {
      setSelectedAreaName('Map Pinned Location');
    }
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        checkDeliveryZone(lat, lng);
        fetchLocationName(lat, lng);
        setSearchResults([]); 
      },
    });
    return userLocation ? <Marker position={userLocation} /> : null;
  };

  const MapUpdater = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      if (coords) map.flyTo(coords, 14, { duration: 1.5 });
    }, [coords, map]);
    return null;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingMap(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=27.7172&lon=85.3240&limit=8`);
      const data = await res.json();
      const formattedResults = data.features.map(feature => {
        const props = feature.properties;
        const nameParts = [props.name, props.street, props.district, props.city, props.state].filter(Boolean);
        return {
          display_name: [...new Set(nameParts)].join(', '),
          lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0]
        };
      }).filter(res => res.display_name);
      setSearchResults(formattedResults);
    } catch (err) { console.error("Search failed:", err); }
    setIsSearchingMap(false);
  };

  const selectSearchResult = (result) => {
    checkDeliveryZone(result.lat, result.lon);
    setSelectedAreaName(result.display_name);
    setSearchResults([]); 
    setSearchQuery(result.display_name.split(',')[0]); 
  };

  // --- WIZARD LOGIC ---
  const handlePlanSelect = (selectedPlan) => {
    setPlan(selectedPlan);
    setBasket({}); 
    
    if (selectedPlan === 'daily') {
      setSelectedDays(DAYS_OF_WEEK); 
      setActiveDayTab('Monday'); 
      setStep(2); 
    } else if (selectedPlan === 'weekly') {
      setSelectedDays(['Tuesday', 'Friday']); 
      setActiveDayTab('Tuesday'); 
      setStep(2);
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
    selectedDays.forEach(day => { newBasket[day] = { ...currentDayBasket }; });
    setBasket(newBasket);
  };

  // --- MATH & PRICING RULES ---
  const calculateTotals = () => {
    let baseWeeklyCost = 0;
    const dayCosts = {}; 

    selectedDays.forEach(day => {
      let dailyTotal = 0;
      const dayItems = basket[day] || {};
      Object.entries(dayItems).forEach(([prodId, qty]) => {
        const prod = products.find(p => String(p.id) === String(prodId));
        if (prod) dailyTotal += (prod.price * qty);
      });
      dayCosts[day] = dailyTotal;
      baseWeeklyCost += dailyTotal;
    });

    const multiplier = 4; // 1 month = 4 weeks
    const subTotal = baseWeeklyCost * multiplier;
    
    // Delivery is FREE for subscriptions
    const totalDeliveryFee = 0; 
    
    // Apply 5% Discount ONLY for Daily Plan
    let discountAmount = 0;
    if (plan === 'daily') {
      discountAmount = subTotal * 0.05;
    }

    return { 
      dayCosts,
      weeklyCost: baseWeeklyCost,
      subTotal: subTotal,
      discountAmount: discountAmount,
      totalDeliveryFee: totalDeliveryFee,
      finalCost: (subTotal - discountAmount) + totalDeliveryFee 
    };
  };

  const { dayCosts, weeklyCost, subTotal, discountAmount, finalCost } = calculateTotals();

  // 🔥 CORE VALIDATION LOGIC
  const isDailyMinMet = plan === 'daily' ? finalCost >= 10000 : true; // Only applies to Daily
  const isWeeklyMinMet = plan === 'weekly' ? (dayCosts['Tuesday'] >= 500 && dayCosts['Friday'] >= 500) : true; // 500/day for Weekly

  const isBasketValid = useMemo(() => {
    if (selectedDays.length === 0) return false;
    const hasItemsEveryday = selectedDays.every(day => {
      const totalItems = Object.values(basket[day] || {}).reduce((sum, qty) => sum + qty, 0);
      return totalItems > 0;
    });
    return hasItemsEveryday && isDailyMinMet && isWeeklyMinMet;
  }, [selectedDays, basket, isDailyMinMet, isWeeklyMinMet]);

  const handleConnectIPSCheckout = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!isBasketValid || !isAddressValid) return alert("Please complete all requirements.");
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

      const areaPrefix = selectedAreaName ? `${selectedAreaName} - ` : '';
      const fullDeliveryAddress = `[GPS: ${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}] ${areaPrefix}${detailedAddress.trim()}` + 
        (landmark.trim() ? ` (${landmark.trim()})` : '');

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
        setIsSubmitting(false); return;
      }

      const subDbId = createRes.data.id;
      const connectIpsRes = await api.post('/orders/init_connectips.php', { amount: finalCost, purchase_id: `SUB_${subDbId}` });

      if (connectIpsRes.data.success) {
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
      console.error(error); alert("Payment gateway error."); setIsSubmitting(false);
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
            <p className="text-gray-500 font-medium mt-3 max-w-xl mx-auto">Build your recurring farm-fresh delivery schedule in just two steps.</p>
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
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        <div onClick={() => navigate('/products')} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#002147] cursor-pointer transition-colors bg-white flex flex-col h-full group">
                          <ShoppingBag className="text-gray-400 group-hover:text-[#002147] mb-3" size={24} />
                          <h3 className="font-black text-lg text-[#1A1A1A]">One-Time Buy</h3>
                          <p className="text-xs text-gray-500 mt-1 mb-4 flex-grow">Standard single delivery. Browse our shop and checkout instantly.</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#002147] bg-gray-50 py-1.5 px-3 rounded-lg w-max">Go to Shop →</span>
                        </div>

                        <div onClick={() => handlePlanSelect('daily')} className="p-5 rounded-2xl border-2 border-[#E2B254] bg-[#FFFBF0] hover:border-[#002147] cursor-pointer transition-colors flex flex-col h-full group relative shadow-sm">
                          <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm flex items-center gap-1">
                            <Gift size={10} /> 5% OFF
                          </div>
                          <CalendarDays className="text-[#E2B254] group-hover:text-[#002147] mb-3" size={24} />
                          <h3 className="font-black text-lg text-[#1A1A1A]">Daily Package</h3>
                          <p className="text-[11px] font-bold text-[#002147] mt-1">1 Month • 30 Deliveries</p>
                          <p className="text-xs text-gray-500 mt-1 mb-4 flex-grow">Fresh dairy delivered 7 days a week. Free delivery included.</p>
                        </div>

                        <div onClick={() => handlePlanSelect('weekly')} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#002147] cursor-pointer transition-colors bg-white flex flex-col h-full group relative">
                          <div className="absolute top-4 right-4 bg-blue-50 text-blue-700 text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm">Free Delivery</div>
                          <CalendarDays className="text-gray-400 group-hover:text-[#002147] mb-3" size={24} />
                          <h3 className="font-black text-lg text-[#1A1A1A]">Weekly Package</h3>
                          <p className="text-[11px] font-bold text-[#002147] mt-1">Tue & Fri • 8 Deliveries</p>
                          <p className="text-xs text-gray-500 mt-1 mb-4 flex-grow">Bulk delivery perfectly timed for the week and weekend.</p>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* STEP 2: BUILD BASKET */}
              <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${step === 2 ? 'border-[#002147] shadow-xl' : 'border-gray-100 shadow-sm opacity-60'}`}>
                <div className={`p-6 flex justify-between items-center ${step > 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-[#002147] text-[#E2B254]' : 'bg-gray-100 text-gray-400'}`}>2</span> Build Basket
                  </h2>
                </div>

                <AnimatePresence>
                  {step === 2 && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-6 pt-0">
                        
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

                        <div className="flex justify-between items-center mb-4 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#002147]">Adding items for: <span className="text-[#9e111a]">{activeDayTab}</span></p>
                          {selectedDays.length > 1 && (
                            <button onClick={copyToAllDays} className="text-[10px] font-black uppercase tracking-widest text-[#002147] flex items-center gap-1 bg-white border border-[#002147]/20 px-3 py-1.5 rounded hover:bg-[#002147] hover:text-white transition-colors">
                              <Copy size={12}/> Copy to All Days
                            </button>
                          )}
                        </div>

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

            {/* RIGHT SIDE: MAP CHECKOUT SUMMARY */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-[#002147] text-white">
                  <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                    <Receipt size={20} className="text-[#E2B254]"/> Routine Summary
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  
                  {/* 🔥 VALIDATION WARNINGS */}
                  <div className="space-y-2">
                    {!isDailyMinMet && plan === 'daily' && step === 2 && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl flex gap-2 text-[11px] font-bold">
                        <ShieldAlert size={16} className="shrink-0 text-amber-600"/>
                        <p>Daily subscription value must be at least NPR 10,000. Current total: NPR {finalCost.toLocaleString()}</p>
                      </div>
                    )}
                    
                    {!isWeeklyMinMet && plan === 'weekly' && step === 2 && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl flex gap-2 text-[11px] font-bold">
                        <ShieldAlert size={16} className="shrink-0 text-amber-600"/>
                        <p>Weekly plans require a minimum of NPR 500 worth of products on both Tuesday and Friday.</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    
                    {/* 🔥 GIS MAP PICKER */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">
                        Delivery Location *
                      </label>
                      <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner relative z-0">
                        <div className="absolute top-2 right-2 z-[1000] w-48 sm:w-56">
                          <div className="relative flex shadow-md rounded-lg overflow-hidden bg-white">
                            <input 
                              type="text" value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                              placeholder="Search area..."
                              className="w-full p-2 pl-3 pr-10 text-xs font-medium text-gray-700 outline-none"
                            />
                            <button 
                              type="button" onClick={handleSearch}
                              className="absolute right-0 top-0 bottom-0 px-2 bg-gray-50 border-l border-gray-100 hover:bg-gray-100 transition-colors flex items-center justify-center"
                            >
                              {isSearchingMap ? <Loader2 size={14} className="animate-spin text-[#00519E]" /> : <Search size={14} className="text-gray-500" />}
                            </button>
                          </div>
                          {searchResults.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 max-h-40 overflow-y-auto z-[1001]">
                              {searchResults.map((res, index) => (
                                <li key={index} onClick={() => selectSearchResult(res)} className="p-2 text-[10px] cursor-pointer hover:bg-blue-50 border-b border-gray-50 last:border-0 text-gray-700">
                                  {res.display_name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <MapContainer center={[27.685, 85.305]} zoom={13} style={{ height: '100%', width: '100%' }} attributionControl={false}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Polygon positions={redZoneMask} pathOptions={{ color: '#ef4444', stroke: false, fillColor: '#ef4444', fillOpacity: 0.55 }} />
                          <Polygon positions={[circle1Border]} pathOptions={{ color: '#10b981', fill: false, weight: 2, dashArray: '6, 6' }} />
                          <Polygon positions={[circle2Border]} pathOptions={{ color: '#10b981', fill: false, weight: 2, dashArray: '6, 6' }} />
                          <LocationPicker />
                          <MapUpdater coords={userLocation} />
                        </MapContainer>
                        
                        {!userLocation && (
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md pointer-events-none z-[999] flex items-center gap-1.5 border border-gray-100">
                            <MapPin size={12} className="text-[#00519E] animate-bounce" />
                            <span className="text-[10px] font-bold text-gray-800">Pin location</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {deliveryInfo.hasChecked && deliveryInfo.available && (
                      <div className="flex flex-col gap-1 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 animate-fade-in">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <span>Service Available!</span>
                        </div>
                        <div className="ml-6 text-[10px] font-semibold text-emerald-700">
                          {selectedAreaName}
                        </div>
                      </div>
                    )}

                    {deliveryInfo.hasChecked && !deliveryInfo.available && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold leading-relaxed animate-fade-in">
                        <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase text-[10px] tracking-wider text-red-900">Out of Zone</p>
                          <p className="mt-0.5 text-[10px]">Location is outside our {MAX_RADIUS_KM}km radius.</p>
                        </div>
                      </div>
                    )}

                    {deliveryInfo.available && (
                      <div className="space-y-3 animate-fade-in pt-1">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Detailed House Address *</label>
                          <input type="text" value={detailedAddress} onChange={(e) => setDetailedAddress(e.target.value)} placeholder="e.g., House No. 12" required className="w-full bg-gray-50 border border-gray-200 text-xs font-medium text-[#1A1A1A] rounded-xl px-3 py-2.5 outline-none focus:border-[#002147] focus:bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Landmark</label>
                            <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near Zoo Gate" className="w-full bg-gray-50 border border-gray-200 text-xs font-medium text-[#1A1A1A] rounded-xl px-3 py-2.5 outline-none focus:border-[#002147] focus:bg-white" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Contact Phone *</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" required className="w-full bg-gray-50 border border-gray-200 text-xs font-medium text-[#1A1A1A] rounded-xl px-3 py-2.5 outline-none focus:border-[#002147] focus:bg-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 🔥 FIXED TIMING SELECTION */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Timing Route *</label>
                      <div className="bg-blue-50 border border-[#002147] text-[#002147] rounded-xl px-4 py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-90 shadow-inner">
                        <Sunrise size={16} /> Morning Delivery (7:00 AM - 10:00 AM)
                      </div>
                    </div>
                  </div>

                  {/* CALCULATION SUMMARY */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>Weekly Base Cost</span>
                      <span>NPR {weeklyCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>Plan Multiplier</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded">x4 Weeks</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>Subtotal</span>
                      <span>NPR {subTotal.toLocaleString()}</span>
                    </div>
                    
                    {plan === 'daily' && discountAmount > 0 && (
                      <div className="flex justify-between text-xs font-bold text-green-600">
                        <span>Special Offer (5% Off)</span>
                        <span>- NPR {discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {deliveryInfo.available && (
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Total Delivery Fee</span>
                        <span className="text-green-600 uppercase font-black tracking-widest">Free</span>
                      </div>
                    )}

                    <div className="flex justify-between items-end pt-3 border-t border-gray-100 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#002147]">Grand Total</span>
                      <span className="text-2xl font-black text-[#9e111a]">NPR {finalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* CONNECTIPS CHECKOUT */}
                  <button 
                    onClick={handleConnectIPSCheckout}
                    disabled={!isBasketValid || !isAddressValid || isSubmitting}
                    className="w-full bg-[#00519E] hover:bg-[#004182] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#00519E] text-white p-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-md flex justify-center items-center gap-3 relative"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="animate-spin" size={20} /> Processing...</>
                    ) : !userLocation ? (
                      <span>Pin Location First</span>
                    ) : !isAddressValid ? (
                      <span>Location Out of Bounds</span>
                    ) : !isBasketValid ? (
                      <span>Meet Package Minimums</span>
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
                  
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-medium">
                    <Lock size={12} /> <span>Encrypted and secured by connectIPS.</span>
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