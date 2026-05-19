import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, CalendarDays, Clock, ArrowRight, Home, CreditCard, Sparkles, Crown, Package, ReceiptText } from 'lucide-react';

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

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans relative pb-24">
      
      {/* --- DEEP NAVY PREMIUM HEADER --- */}
      <div className="absolute top-0 left-0 w-full h-[55vh] sm:h-[45vh] bg-[#002147] overflow-hidden rounded-b-[3rem] sm:rounded-b-[4rem] shadow-2xl">
        {/* Subtle Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E2B254] via-transparent to-transparent blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 border border-white/5 rounded-full"></div>
        <div className="absolute top-32 -left-32 w-80 h-80 border border-white/5 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 pt-28 sm:pt-36">
        
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
          
          {/* 1. SUCCESS MESSAGE & ICON */}
          <motion.div variants={fadeInUp} className="text-center px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-6 relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
              <CheckCircle2 size={40} className="text-emerald-400" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 tracking-tight flex items-center justify-center gap-3">
              Payment Successful <Sparkles className="text-[#E2B254]" size={32} />
            </h1>
            <p className="text-blue-100/80 font-medium text-lg max-w-xl mx-auto">
              Your subscription is confirmed. Fresh, organic goodness will be delivered right to your doorstep.
            </p>
          </motion.div>

          {/* 2. VIP LOYALTY OVERLAPPING CARD */}
          <motion.div variants={fadeInUp} className="px-2 sm:px-8 mt-12">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-black rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-800 relative overflow-hidden group">
              <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shine_3s_infinite]"></div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E2B254] to-[#c59828] text-[#1A1A1A] flex items-center justify-center shadow-lg shrink-0">
                    <Crown size={28} />
                  </div>
                  <div>
                    <h3 className="text-[#E2B254] font-black uppercase tracking-widest text-sm mb-1">
                      {isVipUnlocked ? 'Gokul VIP Status Achieved!' : 'Gokul VIP Journey'}
                    </h3>
                    <p className="text-gray-400 text-xs font-bold">
                      {isVipUnlocked ? 'Check your email for your exclusive gift.' : `${LOYALTY_GOAL - loyaltyCount} more deliveries to unlock VIP rewards.`}
                    </p>
                  </div>
                </div>
                
                <div className="w-full sm:w-1/3 flex flex-col gap-2">
                  <div className="flex justify-between text-white font-black text-sm">
                    <span>Level {Math.floor(loyaltyCount/5) + 1}</span>
                    <span>{loyaltyCount}/{LOYALTY_GOAL}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-[#E2B254] to-[#f4d081] rounded-full relative"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-full"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. ORDER DETAILS GRID */}
          <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mx-2 sm:mx-8">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <ReceiptText size={14} className="text-[#9e111a]" /> Order Reference
                </p>
                <p className="text-xl font-black text-[#1A1A1A]">{orderId}</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Paid
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailCard icon={MapPin} title="Delivery Route" value={subscriptionDetails.location} color="text-[#002147]" />
              <DetailCard icon={Clock} title="Drop-off Time" value={`${subscriptionDetails.deliveryTime} Route`} color="text-[#E2B254]" />
              <DetailCard icon={CalendarDays} title="Subscription Plan" value={subscriptionDetails.type} color="text-[#9e111a]" capitalize />
              <DetailCard 
                icon={CreditCard} 
                title="Amount Paid" 
                value={`NPR ${subscriptionDetails.weeklyTotalCost.toLocaleString()}`} 
                color="text-emerald-600" 
              />
            </div>
          </motion.div>

          {/* 4. WEEKLY SCHEDULE TIMELINE */}
          <motion.div variants={fadeInUp} className="mx-2 sm:mx-8">
            <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest mb-6 px-2 flex items-center gap-2">
              <Package size={18} className="text-[#9e111a]" /> Your Delivery Routine
            </h3>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {weeklySchedule.map((dayData, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#FAF9F6] bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-[#002147] font-black text-[10px] uppercase tracking-wider relative z-10">
                    {dayData.day.substring(0, 3)}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:border-[#E2B254]/50 group-hover:shadow-md transition-all">
                    <div className="flex flex-wrap gap-2">
                      {dayData.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 pr-3 pl-1.5 py-1.5 rounded-xl border border-gray-100">
                          <span className="bg-white text-[#9e111a] font-black text-xs px-2 py-1 rounded-lg shadow-sm">{item.qty}x</span>
                          <span className="text-xs font-bold text-gray-700">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 5. CALL TO ACTIONS */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8 px-4">
            <Link to="/user/dashboard" className="px-8 py-4 rounded-xl bg-[#002147] text-[#E2B254] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#00152e] transition-all shadow-[0_10px_20px_rgba(0,33,71,0.2)] hover:-translate-y-1">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
            <Link to="/" className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-[#1A1A1A] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
              <Home size={16} /> Back to Home
            </Link>
          </motion.div>

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

// Small helper component for the grid
function DetailCard({ icon: Icon, title, value, color, capitalize }) {
  return (
    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{title}</p>
        <p className={`text-sm font-black text-[#1A1A1A] ${capitalize ? 'capitalize' : ''}`}>{value}</p>
      </div>
    </div>
  );
}