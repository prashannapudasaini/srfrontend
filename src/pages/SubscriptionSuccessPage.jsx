import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, CalendarDays, Clock, Gift, Package, ArrowRight, Home } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');

  // Retrieve the data passed from the AvailabilityPage
  const orderData = location.state?.orderData;
  const itemCount = location.state?.itemCount;

  // Generate a random Order ID on load
  useEffect(() => {
    setOrderId(`SUB-${Math.floor(100000 + Math.random() * 900000)}`);
    window.scrollTo(0, 0);
    
    // If someone visits this page directly without subscribing, send them back
    if (!orderData) {
      navigate('/availability');
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  const { subscriptionDetails, weeklySchedule } = orderData;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Animation & Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100/50"
          >
            <CheckCircle2 size={48} className="text-emerald-600" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif font-black text-[#002147] mb-4 tracking-tight"
          >
            Subscription Confirmed!
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-gray-500 text-lg"
          >
            Thank you for choosing Sita Ram Dairy. Your fresh deliveries are being scheduled.
          </motion.p>
        </div>

        {/* Digital Receipt Card */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden relative"
        >
          {/* Top Decorative Border */}
          <div className="h-3 bg-gradient-to-r from-[#002147] via-[#9e111a] to-[#E2B254]"></div>

          <div className="p-8 sm:p-12">
            
            {/* Order Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-gray-100 border-dashed gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Subscription ID</p>
                <p className="text-2xl font-black text-[#1A1A1A] tracking-tight">{orderId}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className={`inline-block px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${
                  subscriptionDetails.type === 'monthly' ? 'bg-[#002147] text-[#E2B254]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {subscriptionDetails.type} Plan
                </span>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Zone</p>
                  <p className="font-bold text-[#1A1A1A] text-sm">{subscriptionDetails.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preferred Time</p>
                  <p className="font-bold text-[#1A1A1A] text-sm capitalize">{subscriptionDetails.deliveryTime} Delivery</p>
                </div>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="py-8 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CalendarDays size={16} /> Your Weekly Menu
              </h3>
              
              <div className="space-y-4">
                {weeklySchedule.map((dayData, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                    <div className="flex items-center gap-3 w-1/3 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#9e111a]"></span>
                      <span className="font-black text-[#1A1A1A]">{dayData.day}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full">
                      {dayData.items.map((item, i) => (
                        <span key={i} className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                          {item.qty}x {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Totals */}
            <div className="py-8 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                <span>Total Items per Week</span>
                <span>{itemCount} Items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Estimated Weekly Cost</span>
                <span className="text-3xl font-black text-[#9e111a] tracking-tight">NPR {subscriptionDetails.weeklyTotalCost}</span>
              </div>
            </div>

            {/* Ghee Offer Banner */}
            {subscriptionDetails.qualifiesForFreeGhee && (
              <div className="mt-4 p-5 bg-gradient-to-r from-[#E2B254] to-[#f4d081] rounded-2xl flex items-center gap-4 shadow-inner">
                <div className="bg-white/30 p-2 rounded-full text-[#002147]">
                  <Gift size={24} />
                </div>
                <div>
                  <h4 className="font-black text-[#002147] text-sm uppercase tracking-wider mb-0.5">Free Ghee Unlocked!</h4>
                  <p className="text-xs font-bold text-[#002147]/80">500ml Pure Cow Ghee will be included in your first delivery.</p>
                </div>
              </div>
            )}

          </div>
        </motion.div>

        {/* Next Steps / Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-[#1A1A1A] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/products" className="px-8 py-4 rounded-xl bg-[#002147] text-[#E2B254] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#00152e] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 border border-[#E2B254]/30">
            Browse Products <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}