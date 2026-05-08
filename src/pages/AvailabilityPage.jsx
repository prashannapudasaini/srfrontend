import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CalendarDays, Check, Loader2, Gift, Clock, Truck, Sun, Moon, Info } from 'lucide-react';
import ContactModal from '../components/ContactModal';

const AVAILABLE_LOCATIONS = [
  "Kathmandu Central (Thamel, Lazimpat, Naxal)",
  "Lalitpur Core (Patan, Jawalakhel, Jhamsikhel)",
  "Bhaktapur Area (Thimi, Suryabinayak)",
  "Ring Road East (Koteshwor, Baneshwor)",
  "Kathmandu North (Boudha, Chabahil, Kapan)",
  "Kathmandu West (Kalanki, Swayambhu)",
  "Kathmandu South (Balkhu, Kirtipur)",
  "Lalitpur Outskirts (Sanepa, Kupondole)",
  "Chandragiri & Thankot Route",
  "Gongabu & Sitapaila Route"
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPage() {
  const [selectedLocation, setSelectedLocation] = useState(null); // <--- Changed to single selection
  const [selectedDays, setSelectedDays] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState('weekly'); // 'weekly' or 'monthly'
  const [deliveryTime, setDeliveryTime] = useState('morning'); // 'morning' or 'evening'
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Ghee Eligibility Check: Monthly plan + at least 5 days selected
  const isEligibleForFreeGhee = subscriptionType === 'monthly' && selectedDays.length >= 5;

  const handleToggleLocation = (loc) => {
    // If clicking the already selected location, deselect it. Otherwise, select the new one.
    setSelectedLocation(prev => prev === loc ? null : loc);
    setSubmitStatus(null);
  };

  const handleToggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
    setSubmitStatus(null);
  };

  const handleSubmit = async () => {
    if (!selectedLocation || selectedDays.length === 0) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/user/delivery-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          selectedLocation, // <--- Sending single location
          selectedDays, 
          subscriptionType,
          deliveryTime,
          qualifiesForFreeGhee: isEligibleForFreeGhee
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setSubmitStatus('success');
    } catch (error) {
      console.error("Error saving schedule:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-20 font-sans">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-[#9e111a]/10 text-[#9e111a] text-xs font-bold uppercase tracking-widest mb-4">
              Doorstep Delivery
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] mb-6 tracking-tight">
              Sita Ram <span className="text-[#9e111a]">Subscriptions</span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* LEFT SIDE: Available Locations */}
            <div className="lg:w-3/5 w-full flex flex-col gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-[#002147] mb-2 flex items-center gap-3">
                  <MapPin className="text-[#9e111a]" /> 1. Select Your Location
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Check if we deliver to your area. Please select your primary delivery location.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AVAILABLE_LOCATIONS.map((loc, index) => {
                    const isSelected = selectedLocation === loc; // <--- Check single selection
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleToggleLocation(loc)}
                        className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                          isSelected 
                            ? 'bg-[#9e111a]/5 border-[#9e111a] shadow-sm' 
                            : 'bg-gray-50 border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-[#9e111a]' : 'bg-white border-2 border-gray-300'
                        }`}>
                          {isSelected && <Check size={14} strokeWidth={4} className="text-white" />}
                        </div>
                        <span className={`font-bold text-sm leading-tight ${isSelected ? 'text-[#9e111a]' : 'text-gray-700'}`}>
                          {loc}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Route Box */}
              <div 
                onClick={() => setIsContactModalOpen(true)}
                className="bg-gradient-to-br from-[#002147] to-[#00152e] p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between text-left border border-[#002147] cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Truck className="text-[#E2B254]" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#E2B254] transition-colors">Not on the list?</h3>
                    <p className="text-gray-300 text-sm max-w-sm">
                      Planning a bulk or corporate order? Contact our dispatch team to arrange a special route.
                    </p>
                  </div>
                </div>
                <div className="mt-6 sm:mt-0 px-6 py-3 bg-white/10 text-white rounded-full text-sm font-bold tracking-wider uppercase">
                  Contact Us
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Sticky Subscription Builder */}
            <div className="lg:w-2/5 w-full sticky top-28">
              
              {/* Dynamic Promo Banner */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`p-6 rounded-t-3xl shadow-md border-b-2 border-dashed flex gap-4 items-start transition-colors duration-500 ${
                  isEligibleForFreeGhee 
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 border-white/40' 
                    : 'bg-gradient-to-r from-[#E2B254] to-[#f4d081] border-white/40'
                }`}
              >
                <div className="bg-white/20 p-3 rounded-full shrink-0">
                  <Gift className={isEligibleForFreeGhee ? "text-white" : "text-[#002147]"} size={28} />
                </div>
                <div>
                  <h3 className={`font-black text-lg uppercase tracking-wide ${isEligibleForFreeGhee ? "text-white" : "text-[#002147]"}`}>
                    {isEligibleForFreeGhee ? 'Offer Unlocked! 🎉' : 'Monthly Offer!'}
                  </h3>
                  <p className={`text-sm font-bold leading-tight mt-1 ${isEligibleForFreeGhee ? "text-white/90" : "text-[#002147]/80"}`}>
                    {isEligibleForFreeGhee 
                      ? "Awesome! You've qualified for a complimentary 500ml Pure Ghee on your first delivery."
                      : <>Subscribe <strong className="text-[#9e111a]">Monthly for 5+ days/week</strong> and receive a complimentary <strong className="text-[#9e111a]">500ml Pure Ghee</strong> on your first delivery!</>}
                  </p>
                </div>
              </motion.div>

              <div className="bg-white p-8 rounded-b-3xl shadow-xl border border-t-0 border-gray-100">
                
                {/* Subscription Type Toggle */}
                <h2 className="text-xl font-black text-[#002147] mb-4 flex items-center gap-3">
                  <CalendarDays className="text-[#9e111a]" /> 2. Choose Plan
                </h2>
                <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
                  <button 
                    onClick={() => setSubscriptionType('weekly')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                      subscriptionType === 'weekly' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setSubscriptionType('monthly')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      subscriptionType === 'monthly' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Monthly 
                    {!isEligibleForFreeGhee && <span className="bg-[#E2B254] text-[#002147] text-[9px] px-1.5 py-0.5 rounded">FREE GHEE</span>}
                  </button>
                </div>

                {/* Days Selection */}
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-xl font-black text-[#002147]">
                    3. Delivery Days
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {selectedDays.length}/7 Selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mb-8">
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleToggleDay(day)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                          isSelected 
                            ? 'bg-[#9e111a] border-[#9e111a] text-white shadow-md transform -translate-y-0.5' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#9e111a]/40'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>

                {/* Time Selection */}
                <h2 className="text-xl font-black text-[#002147] mb-4 flex items-center gap-3">
                  <Clock className="text-[#9e111a]" /> 4. Delivery Time
                </h2>
                <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
                  <button 
                    onClick={() => setDeliveryTime('morning')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                      deliveryTime === 'morning' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Sun size={16} className={deliveryTime === 'morning' ? 'text-amber-500' : ''} /> 7:00 AM
                  </button>
                  <button 
                    onClick={() => setDeliveryTime('evening')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                      deliveryTime === 'evening' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Moon size={16} className={deliveryTime === 'evening' ? 'text-indigo-500' : ''} /> 5:00 PM
                  </button>
                </div>

                {/* Processing Note */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex gap-3 items-start">
                  <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>Note:</strong> We require an 18-24 hour processing window. Subscriptions confirmed today will begin receiving deliveries starting tomorrow.
                  </p>
                </div>

                {/* Validation & Submit */}
                <button 
                  onClick={handleSubmit}
                  disabled={!selectedLocation || selectedDays.length === 0 || isSubmitting}
                  className={`w-full py-4 rounded-xl font-black text-[15px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                    !selectedLocation || selectedDays.length === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                      : 'bg-[#002147] hover:bg-[#00152e] text-white shadow-lg shadow-[#002147]/20 hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={20} />Processing...</>
                  ) : (
                    "Subscribe Now"
                  )}
                </button>

                {!selectedLocation || selectedDays.length === 0 ? (
                   <p className="text-gray-400 text-xs text-center mt-4 font-medium">
                     Please select your location and at least one day to subscribe.
                   </p>
                ) : null}

                {submitStatus === 'success' && (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-700 text-sm font-bold text-center mt-4 bg-emerald-50 border border-emerald-100 py-3 rounded-xl">
                    Subscription confirmed successfully! We will contact you shortly.
                  </motion.p>
                )}
                {submitStatus === 'error' && (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[#9e111a] text-sm font-bold text-center mt-4 bg-red-50 border border-red-100 py-3 rounded-xl">
                    Connection failed. Please try again.
                  </motion.p>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}