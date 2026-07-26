import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Truck, CreditCard, Users, Activity, ArrowUpRight, CheckCircle2, XCircle, Clock, Loader2, MapPin, Sunrise, Sunset, CalendarDays, Receipt, Phone, Package, Smartphone, Globe, ShieldCheck, Printer, Check, Building2 } from 'lucide-react';
import api from '../services/api';

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState('subscribers'); 
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [dispatchRoutes, setDispatchRoutes] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeSubs: 0, todaysDispatches: 0, pendingPayments: 0, pendingInvoices: 0, tomorrowsDemand: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await api.get('/admin/subscriptions.php');
        if (res.data.status === 'success') {
          if (Array.isArray(res.data.data)) {
            setSubscriptions(res.data.data);
          } else {
            setSubscriptions(res.data.data.subscriptions || []);
            setDispatchRoutes(res.data.data.dispatchRoutes || []);
            setDashboardMetrics(res.data.data.metrics || dashboardMetrics);
          }
        } else {
          setError(res.data.message || 'Failed to load subscriptions.');
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Network error. Could not reach the server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  // --- STRICT SEQUENTIAL STATUS UPDATE & NOTIFICATION PUSH ---
  const handleRouteStatusUpdate = async (route, stageIndex) => {
    const stages = ['Preparing', 'Dispatched', 'Out for Delivery', 'Delivered'];
    const newStatus = stages[stageIndex];
    
    // Save previous state in case of API failure (Optimistic UI Update)
    const previousRoutes = [...dispatchRoutes];
    
    // Instantly update UI for a snappy Daraz-like experience
    setDispatchRoutes(prev => prev.map(r => 
      (r.route === route.route && r.time === route.time) 
        ? { ...r, status: newStatus, progress: (stageIndex / 3) * 100 } 
        : r
    ));

    try {
      const res = await api.post('/admin/update-route-status.php', {
        route: route.route,
        time: route.time,
        status: newStatus
      });
      
      if (res.data.status !== 'success') {
        setDispatchRoutes(previousRoutes); // Revert on fail
        alert(res.data.message || "Failed to update route status.");
      }
    } catch (err) {
      setDispatchRoutes(previousRoutes); // Revert on fail
      alert("Network error while updating status.");
    }
  };

  const filteredSubs = useMemo(() => {
    return subscriptions.filter(sub => {
      const query = searchQuery.toLowerCase();
      const subId = sub.sub_id || sub.id || ''; 
      return (
        sub.customer?.toLowerCase().includes(query) ||
        subId.toLowerCase().includes(query) ||
        sub.location?.toLowerCase().includes(query)
      );
    });
  }, [subscriptions, searchQuery]);

  const metrics = [
    { title: "Active Subs", value: dashboardMetrics.activeSubs, trend: "Live Count", icon: Users, color: "text-[#002147]", bg: "bg-[#002147]/5", glow: "shadow-[#002147]/10" },
    { title: "Today's Dispatches", value: dashboardMetrics.todaysDispatches, trend: "Morning & Evening", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50", glow: "shadow-emerald-500/10" },
    { title: "Pending Payments", value: `NPR ${dashboardMetrics.pendingPayments.toLocaleString()}`, trend: `${dashboardMetrics.pendingInvoices} Invoices Due`, icon: CreditCard, color: "text-[#9e111a]", bg: "bg-[#9e111a]/5", glow: "shadow-[#9e111a]/10" },
    { title: "Tomorrow's Demand", value: `${dashboardMetrics.tomorrowsDemand} L`, trend: "Milk Inventory Needed", icon: Activity, color: "text-[#E2B254]", bg: "bg-[#E2B254]/10", glow: "shadow-[#E2B254]/20" },
  ];

  if (isLoading) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center text-[#002147]">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-black tracking-widest uppercase text-sm">Syncing Database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center text-[#9e111a]">
        <XCircle size={48} className="mb-4" />
        <p className="font-bold text-lg mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#9e111a] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#7a0d13] shadow-lg transition-all hover:-translate-y-0.5">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* HEADER METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            key={idx} 
            className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl ${metric.glow} flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300`}
          >
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{metric.title}</p>
              <h3 className="text-3xl font-black text-[#1A1A1A] tracking-tight">{metric.value}</h3>
              <p className="text-[11px] font-bold text-gray-400 mt-2">{metric.trend}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metric.bg} ${metric.color} group-hover:scale-110 transition-transform duration-300`}>
              <metric.icon size={26} strokeWidth={2.5} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN DATA PANEL */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[600px]">
        
        {/* Toolbar */}
        <div className="p-5 lg:p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-gray-50/30 shrink-0">
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-full xl:w-auto relative">
            {['subscribers', 'dispatch', 'payments'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 xl:flex-none relative px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors z-10 ${
                  activeTab === tab ? 'text-[#1A1A1A]' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="adminTab" 
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 -z-10" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full xl:w-80 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#002147] transition-colors" />
              <input 
                type="text" 
                placeholder="Search ID, Customer, or Location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 text-sm font-bold rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#002147] transition-colors shadow-sm" 
              />
            </div>
            <button className="p-3.5 bg-white border-2 border-gray-100 rounded-2xl text-gray-500 hover:text-[#002147] hover:border-[#002147] transition-colors shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Data Area */}
        <div className="flex-grow overflow-auto custom-scrollbar relative bg-white">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: SUBSCRIBERS */}
            {activeTab === 'subscribers' && (
              <motion.div key="subscribers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100 backdrop-blur-md">
                    <tr>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer & ID</th>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Location</th>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Plan Details</th>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status & Payment</th>
                      <th className="py-5 px-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredSubs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-16 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                          No subscriptions match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredSubs.map((sub, i) => {
                        const rawPlan = (sub.plan_type || sub.plan || 'unknown').toLowerCase();
                        let planStyles = "bg-gray-100 text-gray-600 border-gray-200";
                        let planLabel = rawPlan;
                        
                        if (rawPlan === 'daily') {
                          planStyles = "bg-[#9e111a] text-white border-[#9e111a] shadow-sm"; planLabel = "Daily";
                        } else if (rawPlan === 'alternate') {
                          planStyles = "bg-[#002147] text-white border-[#002147] shadow-sm"; planLabel = "Alternate";
                        } else if (rawPlan === 'weekly') {
                          planStyles = "bg-emerald-100 text-emerald-800 border-emerald-200"; planLabel = "Weekly";
                        } else if (rawPlan === 'custom') {
                          planStyles = "bg-gradient-to-r from-[#d4af37] to-[#E2B254] text-[#1A1A1A] border-none shadow-sm"; planLabel = "Custom Flex";
                        }

                        const rawTime = (sub.delivery_time || sub.time || 'morning').toLowerCase();
                        const isApp = sub.source?.toLowerCase().includes('app');
                        const paymentStatus = (sub.payment_status || sub.payment || 'Pending').toLowerCase();

                        return (
                          <motion.tr 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            key={i} 
                            className="hover:bg-blue-50/30 transition-colors group"
                          >
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#002147] to-[#00152e] text-[#E2B254] flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                                  {sub.customer?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="font-black text-[#1A1A1A] text-sm mb-1">{sub.customer}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1" title={sub.source || 'Website'}>
                                      {isApp ? <Smartphone size={10} className="text-blue-500" /> : <Globe size={10} className="text-blue-500" />}
                                      {sub.sub_id || sub.id}
                                    </span>
                                    <span className="text-[11px] font-bold text-gray-400">{sub.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl w-max">
                                <MapPin size={14} className="text-gray-400" /> {sub.location}
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${planStyles}`}>
                                    {planLabel}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-gray-500 flex items-center gap-2">
                                  <CalendarDays size={14} className="text-gray-400"/> 
                                  {sub.days?.length || 0} Days 
                                  <span className="text-gray-300">|</span> 
                                  {rawTime === 'morning' ? (
                                    <span className="flex items-center gap-1 text-[#9e111a]"><Sunrise size={14} /> Morning</span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[#002147]"><Sunset size={14} /> Evening</span>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="p-6 flex flex-col gap-2">
                              <span className={`inline-flex items-center w-max gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                                sub.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                sub.status === 'Paused' ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                                'bg-red-50 border-red-200 text-red-700'
                              }`}>
                                {sub.status === 'Active' && <CheckCircle2 size={12}/>}
                                {sub.status === 'Paused' && <Clock size={12}/>}
                                {sub.status === 'Cancelled' && <XCircle size={12}/>}
                                Sub: {sub.status || 'Unknown'}
                              </span>
                              <span className={`inline-flex items-center w-max gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                paymentStatus === 'paid' || paymentStatus === 'completed' ? 'text-emerald-600 bg-white border-emerald-100' : 'text-amber-600 bg-white border-amber-100'
                              }`}>
                                <CreditCard size={10} /> {paymentStatus === 'completed' ? 'Paid' : paymentStatus}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <button 
                                onClick={() => setSelectedSub(sub)}
                                className="text-[#002147] bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl hover:bg-[#002147] hover:text-[#E2B254] hover:border-[#002147] text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center gap-2 transition-all shadow-sm"
                              >
                                Details <ArrowUpRight size={14} strokeWidth={3}/>
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* TAB 2: ADVANCED DARAZ-STYLE DISPATCH TRACKING */}
            {activeTab === 'dispatch' && (
              <motion.div key="dispatch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 bg-gray-50/50 min-h-full">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-2xl font-black text-[#002147] mb-1">Today's Active Routes</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Interactive Logistics Overview</p>
                  </div>
                  <span className="bg-white text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    {dashboardMetrics.todaysDispatches} Routes Live
                  </span>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {dispatchRoutes.map((route, i) => {
                    const stages = ['Preparing', 'Dispatched', 'Out for Delivery', 'Delivered'];
                    
                    // Determine current step exactly. Start at -1 (nothing ticked) if status is null.
                    let currentStepIndex = -1; 
                    const normalizedStatus = (route.status || '').toLowerCase();
                    
                    if (normalizedStatus === 'completed' || normalizedStatus === 'delivered' || route.progress === 100) currentStepIndex = 3;
                    else if (normalizedStatus === 'out for delivery' || route.progress > 50) currentStepIndex = 2;
                    else if (normalizedStatus === 'dispatched' || route.progress > 0) currentStepIndex = 1;
                    else if (normalizedStatus === 'preparing') currentStepIndex = 0;

                    return (
                      <div key={i} className="border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all bg-white relative overflow-hidden group">
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div>
                            <span className="text-[10px] font-black text-white bg-[#002147] px-3 py-1 rounded-md uppercase tracking-widest shadow-sm">
                              {route.time} ROUTE
                            </span>
                            <h4 className="font-black text-xl text-[#1A1A1A] mt-4 flex items-center gap-2">
                              <MapPin size={20} className="text-[#9e111a]" /> {route.route}
                            </h4>
                            <p className="text-xs text-gray-400 font-bold mt-1 tracking-wide">{route.count} Total Delivery Stops</p>
                          </div>
                          
                          <div className="text-right">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                              currentStepIndex === 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                              currentStepIndex === -1 ? 'bg-gray-50 border-gray-200 text-gray-500' : 
                              'bg-blue-50 border-blue-200 text-blue-700'
                            }`}>
                              {currentStepIndex === -1 ? 'Standby' : stages[currentStepIndex]}
                            </span>
                          </div>
                        </div>

                        {/* STRICT SEQUENTIAL DARAZ-STYLE STEPPER */}
                        <div className="relative z-10 mt-10">
                          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                          <div className="absolute top-1/2 left-0 h-1.5 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-700" style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / 3) * 100 : 0}%` }}></div>
                          
                          <div className="relative flex justify-between w-full">
                            {stages.map((stage, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              // STRICT LOGIC: Can only click if it's EXACTLY the next step in line.
                              const isNextAllowed = idx === currentStepIndex + 1 || (currentStepIndex === -1 && idx === 0);
                              // Admin cannot mark as Delivered
                              const isDeliveredStep = idx === 3; 
                              
                              const canClick = isNextAllowed && !isDeliveredStep;

                              return (
                                <div key={idx} className="flex flex-col items-center gap-3">
                                  <button 
                                    onClick={() => canClick && handleRouteStatusUpdate(route, idx)}
                                    disabled={!canClick}
                                    title={isDeliveredStep ? "Locked: Only delivery staff can mark as Delivered" : canClick ? `Click to mark as ${stage} and Notify Users` : "Complete previous steps first"}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-300 shadow-sm ${
                                      isCompleted ? 'bg-emerald-500 border-emerald-100 text-white' : 
                                      canClick ? 'bg-white border-blue-300 hover:border-blue-500 cursor-pointer animate-pulse' : 
                                      'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                                    }`}
                                  >
                                    {isCompleted ? <Check size={14} strokeWidth={4} /> : <div className={`w-2 h-2 rounded-full ${canClick ? 'bg-blue-400' : 'bg-transparent'}`}></div>}
                                  </button>
                                  <span className={`text-[10px] font-black uppercase tracking-widest text-center max-w-[70px] leading-tight ${
                                    isCompleted ? 'text-[#1A1A1A]' : canClick ? 'text-blue-600' : 'text-gray-400'
                                  }`}>{stage}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: PAYMENTS */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100 backdrop-blur-md">
                    <tr>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subscription ID</th>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer</th>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Billed</th>
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                      <th className="py-5 px-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredSubs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-16 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                          No payment records found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubs.map((sub, i) => {
                        const paymentStatus = (sub.payment_status || sub.payment || 'Pending').toLowerCase();
                        return (
                          <motion.tr 
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                            key={i} 
                            className="hover:bg-amber-50/30 transition-colors"
                          >
                            <td className="p-6 font-black text-gray-500 text-sm tracking-wide">{sub.sub_id || sub.id}</td>
                            <td className="p-6 font-black text-[#1A1A1A] text-sm">{sub.customer}</td>
                            <td className="p-6 font-black text-xl text-[#1A1A1A] tracking-tight">
                              NPR {parseFloat(sub.weekly_total_cost || sub.totalCost || 0).toLocaleString()}
                            </td>
                            <td className="p-6">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                                paymentStatus === 'paid' || paymentStatus === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                'bg-amber-50 border-amber-200 text-amber-700'
                              }`}>
                                {paymentStatus === 'completed' ? 'Paid' : paymentStatus}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <button 
                                onClick={() => setSelectedInvoice(sub)}
                                className="text-[#002147] bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl hover:bg-[#002147] hover:text-[#E2B254] hover:border-[#002147] text-[10px] font-black uppercase tracking-widest inline-flex items-center justify-center gap-2 transition-all shadow-sm"
                              >
                                View Invoice <ArrowUpRight size={14} strokeWidth={3}/>
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- SUBSCRIPTION DETAILS MODAL (UNCHANGED) --- */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[#FAF9F6] rounded-[2.5rem] w-full max-w-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 sm:p-8 bg-white border-b border-gray-100 flex justify-between items-start shrink-0 relative">
                <div>
                  <h3 className="text-2xl font-serif font-black text-[#002147] mb-1">Subscription Details</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedSub.sub_id || selectedSub.id}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                      selectedSub.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {selectedSub.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedSub(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition-colors">
                  <XCircle size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-grow space-y-6">
                <div className="bg-white border border-gray-100 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
                  {/* Customer Info */}
                  <div className="space-y-3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Customer Profile</p>
                    <p className="font-black text-sm text-[#002147] flex items-center gap-2"><Users size={14} className="text-gray-400"/> {selectedSub.customer}</p>
                    <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {selectedSub.phone || 'N/A'}</p>
                    <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><MapPin size={14} className="text-gray-400"/> {selectedSub.location}</p>
                  </div>
                  {/* Plan Info */}
                  <div className="space-y-3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Plan Setup</p>
                    <p className="font-black text-sm text-[#1A1A1A] capitalize flex items-center gap-2"><CalendarDays size={14} className="text-gray-400"/> {selectedSub.plan_type || selectedSub.plan || 'Standard'} Plan</p>
                    <p className="text-xs font-bold text-gray-600 capitalize flex items-center gap-2">
                      {selectedSub.delivery_time?.toLowerCase() === 'morning' ? <Sunrise size={14} className="text-gray-400"/> : <Sunset size={14} className="text-gray-400"/>}
                      {selectedSub.delivery_time || selectedSub.time || 'Morning'} Delivery
                    </p>
                  </div>
                  {/* Payment & Source Info */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Order & Payment</p>
                    <p className="font-bold text-xs text-gray-700 flex items-center gap-2">
                      {selectedSub.source?.toLowerCase().includes('app') ? <Smartphone size={14} className="text-blue-500"/> : <Globe size={14} className="text-blue-500"/>}
                      Purchased via {selectedSub.source || 'Website'}
                    </p>
                    <p className="font-bold text-xs text-gray-700 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-gray-400"/>
                      {selectedSub.payment_method || 'ConnectIPS'}
                    </p>
                    <div className="pt-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                        (selectedSub.payment_status || selectedSub.payment)?.toLowerCase() === 'completed' || (selectedSub.payment_status || selectedSub.payment)?.toLowerCase() === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        Payment: {(selectedSub.payment_status || selectedSub.payment)?.toLowerCase() === 'completed' ? 'Paid' : (selectedSub.payment_status || selectedSub.payment || 'Pending')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-200 pb-2 mb-4">Ordered Products & Schedule</h4>
                  {selectedSub.items && selectedSub.items.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {selectedSub.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0 relative">
                                {item.base_image && (
                                  <img 
                                    src={item.base_image} 
                                    alt={item.name || item.product_name} 
                                    className="w-full h-full object-cover absolute inset-0 z-10"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                )}
                                <Package size={20} className="z-0" />
                              </div>
                              <div>
                                <span className="font-bold text-[#1A1A1A] text-sm">{item.product_name || item.name}</span>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Day: <span className="text-[#9e111a]">{item.day_of_week || item.day}</span></p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 mb-0.5">
                                NPR {parseFloat(item.price).toLocaleString()} × {item.qty || item.quantity}
                              </p>
                              <p className="font-black text-sm text-[#002147]">
                                NPR {(parseFloat(item.price) * parseFloat(item.qty || item.quantity)).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 bg-gray-50/80 p-5 rounded-xl border border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-500">Total Billed Amount</span>
                        <span className="text-2xl font-black text-[#9e111a]">
                          NPR {parseFloat(selectedSub.weekly_total_cost || selectedSub.totalCost || 0).toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-200">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No item breakdown provided by database.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PROFESSIONAL B2B INVOICE MODAL --- */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh] print:shadow-none print:h-auto print:max-h-none print:w-full print:border-none"
            >
              {/* No-print Action Bar */}
              <div className="bg-gray-100 p-4 flex justify-end gap-3 rounded-t-xl print:hidden shrink-0 border-b border-gray-200">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1A1A1A] transition-colors shadow-sm">
                  <Printer size={14} /> Print Invoice
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm">
                  <XCircle size={14} /> Close
                </button>
              </div>

              {/* Printable Area */}
              <div className="p-10 sm:p-12 overflow-y-auto bg-white print:p-0 relative">
                
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Building2 size={400} />
                </div>

                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-[#002147] pb-8 mb-8 relative z-10">
                  <div>
                    <h1 className="text-4xl font-black text-[#002147] tracking-tight uppercase">INVOICE</h1>
                    <p className="text-sm font-bold text-gray-500 tracking-widest mt-1">INV-{selectedInvoice.sub_id}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 bg-[#002147] text-[#E2B254] rounded-xl flex items-center justify-center ml-auto mb-3">
                      <Receipt size={24} />
                    </div>
                    <h2 className="text-lg font-black text-[#1A1A1A]">Sita Ram Gokul Milks</h2>
                    <p className="text-sm text-gray-500 font-medium">Kathmandu Pvt. Ltd.</p>
                  </div>
                </div>

                {/* Meta Data */}
                <div className="grid grid-cols-2 gap-8 mb-10 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">Billed To</p>
                    <p className="font-black text-lg text-[#1A1A1A]">{selectedInvoice.customer}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.phone}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">Payment Details</p>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-bold text-[#1A1A1A]">Method:</span> {selectedInvoice.payment_method || 'ConnectIPS'}</p>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-bold text-[#1A1A1A]">Plan:</span> {selectedInvoice.plan_type || 'Standard'} Routine</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-bold text-[#1A1A1A]">Status:</span> 
                      <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded border ${
                        (selectedInvoice.payment_status || 'Pending').toLowerCase() === 'completed' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}>
                        {selectedInvoice.payment_status || 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="mb-10 relative z-10">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#002147] text-white">
                      <tr>
                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider w-[50%] border border-[#002147]">Description</th>
                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-center border border-[#002147]">Qty/Week</th>
                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right border border-[#002147]">Unit Price</th>
                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right border border-[#002147]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm border border-gray-200">
                      {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                        selectedInvoice.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="py-3 px-4 text-gray-800 font-medium">
                              <span className="font-bold text-[#1A1A1A] block">{item.product_name || item.name}</span>
                              <span className="text-[10px] text-gray-500 uppercase">Delivery Day: {item.day_of_week || item.day}</span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-center">{item.qty || item.quantity}</td>
                            <td className="py-3 px-4 text-gray-600 text-right">NPR {parseFloat(item.price).toLocaleString()}</td>
                            <td className="py-3 px-4 text-[#1A1A1A] font-black text-right">NPR {(parseFloat(item.price) * parseFloat(item.qty || item.quantity)).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="py-6 text-center text-gray-400 font-medium italic">No itemized details available for this invoice.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Total Section */}
                <div className="flex justify-end relative z-10">
                  <div className="w-1/2 bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-500 uppercase">Subtotal</span>
                      <span className="text-sm font-bold text-gray-800">NPR {parseFloat(selectedInvoice.weekly_total_cost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                      <span className="text-sm font-bold text-gray-500 uppercase">Tax (0%)</span>
                      <span className="text-sm font-bold text-gray-800">NPR 0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-[#002147] uppercase tracking-widest">Grand Total</span>
                      <span className="text-2xl font-black text-[#9e111a]">NPR {parseFloat(selectedInvoice.weekly_total_cost).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-16 text-center border-t border-gray-200 pt-8 relative z-10">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thank you for your business.</p>
                  <p className="text-[9px] text-gray-400 mt-1">This is a computer generated document. No signature is required.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}