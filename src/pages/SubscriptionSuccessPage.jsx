import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, CalendarDays, Clock, Gift, ArrowRight, Home, Receipt, Truck, Award, Crown } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');

  // Retrieve the data passed from the AvailabilityPage
  const orderData = location.state?.orderData;
  const itemCount = location.state?.itemCount;
  
  // Get the loyalty count from the backend (default to 1 for their first time)
  const loyaltyCount = location.state?.loyaltyCount || 1; 
  const LOYALTY_GOAL = 20;
  const isVipUnlocked = loyaltyCount >= LOYALTY_GOAL;
  const progressPercentage = Math.min((loyaltyCount / LOYALTY_GOAL) * 100, 100);

  useEffect(() => {
    setOrderId(`SUB-${Math.floor(100000 + Math.random() * 900000)}`);
    window.scrollTo(0, 0);
    
    if (!orderData) navigate('/availability');
  }, [orderData, navigate]);

  if (!orderData) return null;

  const { subscriptionDetails, weeklySchedule } = orderData;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 font-sans text-[#1A1A1A] relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-[#E2B254]/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Success Animation & Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_40px_rgba(16,185,129,0.4)] relative"
          >
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-20"></div>
            <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif font-black text-[#002147] mb-4 tracking-tight"
          >
            Farm-Fresh, <span className="text-emerald-600">Scheduled.</span>
          </motion.h1>
        </div>

        {/* --- NEW: GOKUL VIP LOYALTY TRACKER --- */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className={`mb-8 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border ${
            isVipUnlocked 
              ? 'bg-gradient-to-br from-[#1A1A1A] to-[#000000] border-gray-800' 
              : 'bg-white border-gray-100'
          }`}
        >
          {isVipUnlocked && <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shine_3s_infinite]"></div>}

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${isVipUnlocked ? 'bg-gradient-to-br from-[#E2B254] to-[#d4af37] text-[#1A1A1A]' : 'bg-gray-50 text-[#002147] border border-gray-100'}`}>
                {isVipUnlocked ? <Crown size={24} /> : <Award size={24} />}
              </div>
              <div>
                <h3 className={`text-sm font-black uppercase tracking-widest ${isVipUnlocked ? 'text-[#E2B254]' : 'text-[#002147]'}`}>
                  {isVipUnlocked ? 'Gokul VIP Unlocked!' : 'Gokul VIP Status'}
                </h3>
                <p className={`text-xs font-bold ${isVipUnlocked ? 'text-gray-300' : 'text-gray-400'}`}>
                  {isVipUnlocked ? 'You have reached the ultimate tier.' : `${LOYALTY_GOAL - loyaltyCount} more to unlock a special gift!`}
                </p>
              </div>
            </div>
            <div className={`text-3xl font-black ${isVipUnlocked ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {loyaltyCount}<span className={`text-sm ${isVipUnlocked ? 'text-gray-500' : 'text-gray-300'}`}>/{LOYALTY_GOAL}</span>
            </div>
          </div>

          <div className="relative z-10">
            <div className={`w-full h-4 rounded-full overflow-hidden shadow-inner ${isVipUnlocked ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className={`h-full rounded-full relative ${
                  isVipUnlocked ? 'bg-gradient-to-r from-[#E2B254] to-[#f4d081]' : 'bg-gradient-to-r from-[#002147] to-[#004080]'
                }`}
              >
                {/* Shiny highlight on the progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-full"></div>
              </motion.div>
            </div>
          </div>

          {isVipUnlocked && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-6 p-4 bg-[#E2B254]/10 border border-[#E2B254]/20 rounded-xl relative z-10 text-center">
              <p className="text-[#E2B254] text-xs font-black uppercase tracking-widest">🎉 Check your email for your exclusive VIP Farm Tour & Gift Basket invitation! 🎉</p>
            </motion.div>
          )}
        </motion.div>

        {/* Premium Digital Receipt Ticket */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden relative border border-gray-100"
        >
          <div className="h-3 bg-gradient-to-r from-[#002147] via-[#9e111a] to-[#E2B254]"></div>
          <div className="p-8 sm:p-12">
            
            {/* Header: Order Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                  <Receipt size={14} className="text-[#9e111a]" /> Subscription Docket
                </p>
                <p className="text-3xl font-black text-[#1A1A1A] tracking-tight">{orderId}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border ${
                  subscriptionDetails.type === 'monthly' ? 'bg-[#002147] text-[#E2B254] border-[#002147]' : 'bg-gray-50 text-[#1A1A1A] border-gray-200'
                }`}>
                  <CalendarDays size={16} /> {subscriptionDetails.type} Plan
                </span>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#FAF9F6] border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#002147]">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Delivery Route</p>
                  <p className="font-black text-[#1A1A1A] text-sm leading-tight">{subscriptionDetails.location}</p>
                </div>
              </div>
              <div className="bg-[#FAF9F6] border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#E2B254]">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Drop-off Timing</p>
                  <p className="font-black text-[#1A1A1A] text-sm capitalize">{subscriptionDetails.deliveryTime} Route</p>
                </div>
              </div>
            </div>

            <div className="relative py-4 my-2">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FAF9F6] rounded-full border-r border-gray-200 shadow-inner"></div>
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FAF9F6] rounded-full border-l border-gray-200 shadow-inner"></div>
              <div className="border-t-2 border-dashed border-gray-200"></div>
            </div>

            {/* Schedule Details */}
            <div className="py-6">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Your Weekly Routine</h3>
              <div className="space-y-3">
                {weeklySchedule.map((dayData, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (idx * 0.1) }}
                    key={idx} 
                    className="flex flex-col sm:flex-row sm:items-center p-4 bg-white border border-gray-100 shadow-sm rounded-2xl gap-4 hover:border-[#002147]/30 transition-colors group"
                  >
                    <div className="w-24 shrink-0 border-r border-gray-100 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E2B254]"></div>
                      <span className="font-black text-[#002147] uppercase tracking-wider">{dayData.day.substring(0, 3)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full">
                      {dayData.items.map((item, i) => (
                        <span key={i} className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <span className="text-[#9e111a] font-black mr-1">{item.qty}x</span> {item.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative py-4 my-2">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FAF9F6] rounded-full border-r border-gray-200 shadow-inner"></div>
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FAF9F6] rounded-full border-l border-gray-200 shadow-inner"></div>
              <div className="border-t-2 border-dashed border-gray-200"></div>
            </div>

            {/* Pricing Totals */}
            <div className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                <span className="uppercase tracking-wider text-[11px]">Items per Week</span>
                <span className="text-[#1A1A1A] bg-gray-100 px-3 py-1 rounded-md">{itemCount}</span>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Estimated Weekly Total</span>
                <span className="text-4xl font-black text-[#9e111a] tracking-tighter">NPR {subscriptionDetails.weeklyTotalCost}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps / Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/history" className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-[#1A1A1A] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
            <Receipt size={16} /> Track Order
          </Link>
          <Link to="/products" className="px-8 py-4 rounded-xl bg-[#002147] text-[#E2B254] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#00152e] transition-all shadow-xl shadow-[#002147]/20 hover:shadow-2xl hover:-translate-y-0.5 border border-[#E2B254]/30">
            Browse Shop <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
      `}} />
    </div>
  );
}