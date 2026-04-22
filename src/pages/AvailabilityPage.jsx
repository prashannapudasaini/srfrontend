import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, CalendarDays, Check, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function AvailabilityPage() {
  // Updated Schedule matching the "Van No:" format from your design
  const schedule = [
    { day: "Monday", van: "Van No: 1", area: "Kathmandu Central", stops: ["Thamel", "Baluwatar", "Lazimpat", "Maharajgunj", "Naxal", "Durbarmarg"] },
    { day: "Tuesday", van: "Van No: 2", area: "Lalitpur Route", stops: ["Patan Durbar", "Jhamsikhel", "Jawalakhel", "Pulchowk", "Sanepa", "Kupondole"] },
    { day: "Wednesday", van: "Van No: 3", area: "Bhaktapur Route", stops: ["Suryabinayak", "Kamalvinayak", "Thimi", "Sallaghari", "Radhe Radhe", "Kausaltar"] },
    { day: "Thursday", van: "Van No: 4", area: "Ring Road East", stops: ["Koteshwor", "Gwarko", "Satdobato", "Baneshwor", "Tinkune", "Sinamangal"] },
    { day: "Friday", van: "Van No: 5", area: "Kathmandu North", stops: ["Boudha", "Jorpati", "Chabahil", "Gokarna", "Kapan", "Sukedhara"] },
    { day: "Saturday", van: "Van No: 6", area: "Weekend Express", stops: ["Thankot", "Chandragiri", "Kirtipur", "Chobhar", "Balkhu", "Kalimati"] },
    { day: "Sunday", van: "Van No: 7", area: "Kathmandu West", stops: ["Kalanki", "Sitapaila", "Swayambhu", "Bafal", "Ravi Bhawan", "Tahachal"] }
  ];

  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 

  // Toggle selection of a specific city/stop
  const handleToggleCity = (day, city) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
    
    // Auto-select the day if a city is chosen
    if (!selectedDays.includes(day)) {
      setSelectedDays(prev => [...prev, day]);
    }
    setSubmitStatus(null);
  };

  // Toggle selection of a day from the right panel
  const handleToggleDay = (day) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        // If unchecking a day, optionally clear its selected cities for clean UX
        const dayCities = schedule.find(s => s.day === day)?.stops || [];
        setSelectedCities(cities => cities.filter(c => !dayCities.includes(c)));
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
    setSubmitStatus(null);
  };

  const handleSubmit = async () => {
    if (selectedDays.length < 3) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/user/delivery-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          selectedDays: selectedDays,
          selectedCities: selectedCities 
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating network
      
      setSubmitStatus('success');
    } catch (error) {
      console.error("Error saving schedule:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        
        {/* Clean Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-[#9e111a]/10 text-[#9e111a] text-xs font-bold uppercase tracking-widest mb-4">
            Delivery Network
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] mb-6 tracking-tight">
            Weekly Van <span className="text-[#9e111a]">Availability</span>
          </h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white border border-gray-100 py-3 px-6 rounded-full shadow-sm mx-auto"
          >
            <Clock size={18} className="text-[#9e111a]" />
            <p className="text-gray-600 text-sm font-medium">
              Vans depart Tokha HQ daily at <strong className="text-[#002147]">6:00 AM sharp</strong>.
            </p>
          </motion.div>
        </div>

        {/* Main Split Layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* LEFT SIDE: Clean Schedule Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedule.map((item, index) => {
              // Check if any city in this day is selected to gently highlight the card border
              const hasSelectedCity = item.stops.some(city => selectedCities.includes(city));
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-3xl p-6 transition-all duration-300 ${
                    hasSelectedCity 
                      ? 'border-2 border-[#9e111a]/30 shadow-md' 
                      : 'border border-gray-200 shadow-sm hover:border-[#9e111a]/20 hover:shadow-md'
                  }`}
                >
                  {/* Card Header (No Day Checkbox) */}
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarDays className="text-[#E2B254]" size={22} />
                    <h3 className="text-xl font-bold text-[#002147] uppercase tracking-wide">
                      {item.day}
                    </h3>
                  </div>
                  
                  <div className="h-px w-full bg-gray-100 mb-4"></div>
                  
                  {/* Route & Van Info */}
                  <div className="mb-5">
                    <p className="font-bold text-[#9e111a] flex items-center gap-2 text-[15px]">
                      <MapPin size={18} /> {item.van} <span className="text-gray-400 font-medium text-sm ml-1">({item.area})</span>
                    </p>
                  </div>
                  
                  {/* Clean City Selection List */}
                  <div className="space-y-1 pl-2">
                    {item.stops.map((city, i) => {
                      const isCitySelected = selectedCities.includes(city);
                      return (
                        <div 
                          key={i} 
                          onClick={() => handleToggleCity(item.day, city)}
                          className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-colors ${
                            isCitySelected ? 'bg-red-50/50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 text-[15px]">
                            <span className="text-gray-300 text-lg leading-none mb-1">•</span>
                            <span className={isCitySelected ? 'text-[#002147] font-semibold' : 'text-gray-600 font-medium'}>
                              {city}
                            </span>
                          </div>
                          
                          {/* Square Checkbox for City */}
                          <div className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-all duration-200 border ${
                            isCitySelected 
                              ? 'bg-[#9e111a] border-[#9e111a]' 
                              : 'bg-white border-gray-300'
                          }`}>
                            {isCitySelected && <Check size={12} strokeWidth={3} className="text-white" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
            
            {/* Decorative Custom Route Card */}
            <div className="bg-gradient-to-br from-[#002147] to-[#00152e] p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center border border-[#002147]">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="text-[#E2B254]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Custom Drop-off?</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-[200px]">
                Planning a bulk order? Contact our dispatch team to arrange a special route.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Sticky Schedule Form */}
          <div className="lg:w-1/3 w-full sticky top-28">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-black text-[#002147] mb-2">Set Schedule</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Confirm the days you want your fresh products. You must select at least 3 days per week.
              </p>
              
              {/* Validation Status */}
              <div className={`flex items-start gap-3 p-4 rounded-2xl mb-8 border ${
                selectedDays.length >= 3 
                  ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' 
                  : 'bg-amber-50/50 border-amber-100 text-amber-700'
              }`}>
                {selectedDays.length >= 3 ? (
                  <CheckCircle2 className="shrink-0 text-emerald-500 mt-0.5" size={20} />
                ) : (
                  <AlertCircle className="shrink-0 text-amber-500 mt-0.5" size={20} />
                )}
                <div className="text-sm font-medium">
                  {selectedDays.length >= 3 
                    ? "Minimum 3 days selected. You're ready to proceed!" 
                    : `Please select ${3 - selectedDays.length} more day${(3 - selectedDays.length) > 1 ? 's' : ''}.`}
                </div>
              </div>

              {/* Day Selection List */}
              <div className="space-y-2.5 mb-8">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const isSelected = selectedDays.includes(day);
                  const daySchedule = schedule.find(s => s.day === day);
                  const selectedCitiesForDay = daySchedule ? daySchedule.stops.filter(city => selectedCities.includes(city)) : [];

                  return (
                    <div 
                      key={day} 
                      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                        isSelected 
                          ? 'border-[#9e111a]/30 bg-[#9e111a]/[0.02] shadow-sm' 
                          : 'border-gray-100 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div 
                        onClick={() => handleToggleDay(day)}
                        className="flex items-center justify-between p-4 cursor-pointer"
                      >
                        <span className={`font-bold text-[15px] ${isSelected ? 'text-[#9e111a]' : 'text-gray-600'}`}>
                          {day}
                        </span>
                        
                        {/* Circular Day Checkbox */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#9e111a] border-[#9e111a]' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={4} className="text-white" />}
                        </div>
                      </div>
                      
                      {/* Show selected cities pill-tags under the day */}
                      {isSelected && selectedCitiesForDay.length > 0 && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="flex flex-wrap gap-2">
                            {selectedCitiesForDay.map((city, idx) => (
                              <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                {city}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                disabled={selectedDays.length < 3 || isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-[15px] tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedDays.length < 3 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                    : 'bg-[#002147] hover:bg-[#00152e] text-white shadow-lg shadow-[#002147]/20 hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  "Confirm Schedule"
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-700 text-sm font-semibold text-center mt-4 bg-emerald-50 border border-emerald-100 py-3 rounded-xl">
                  Schedule confirmed successfully!
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[#9e111a] text-sm font-semibold text-center mt-4 bg-red-50 border border-red-100 py-3 rounded-xl">
                  Connection failed. Please try again.
                </motion.p>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}