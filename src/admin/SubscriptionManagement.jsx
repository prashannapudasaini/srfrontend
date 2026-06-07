import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, Truck, CreditCard, Users, Activity, ArrowUpRight, CheckCircle2, XCircle, Clock, Loader2, MapPin, Sunrise, Sunset, CalendarDays, Receipt, Phone, Package } from 'lucide-react';
import api from '../services/api';

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState('subscribers'); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals State
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Dynamic State for Database
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
                      <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
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
                          planStyles = "bg-[#9e111a] text-white border-[#9e111a] shadow-sm";
                          planLabel = "Daily";
                        } else if (rawPlan === 'alternate') {
                          planStyles = "bg-[#002147] text-white border-[#002147] shadow-sm";
                          planLabel = "Alternate";
                        } else if (rawPlan === 'weekly') {
                          planStyles = "bg-emerald-100 text-emerald-800 border-emerald-200";
                          planLabel = "Weekly";
                        } else if (rawPlan === 'custom') {
                          planStyles = "bg-gradient-to-r from-[#d4af37] to-[#E2B254] text-[#1A1A1A] border-none shadow-sm";
                          planLabel = "Custom Flex";
                        }

                        const rawTime = (sub.delivery_time || sub.time || 'morning').toLowerCase();

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
                                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-widest">{sub.sub_id || sub.id}</span>
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
                                  {(sub.qualifies_free_ghee == 1 || sub.freeGhee) && (
                                    <span className="text-[9px] bg-green-100 text-green-700 border border-green-200 font-black uppercase tracking-widest px-2 py-1 rounded-md">Free Ghee</span>
                                  )}
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
                            <td className="p-6">
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border ${
                                sub.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                sub.status === 'Paused' ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                                'bg-red-50 border-red-200 text-red-700'
                              }`}>
                                {sub.status === 'Active' && <CheckCircle2 size={14}/>}
                                {sub.status === 'Paused' && <Clock size={14}/>}
                                {sub.status === 'Cancelled' && <XCircle size={14}/>}
                                {sub.status || 'Unknown'}
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

            {/* TAB 2: DISPATCH TRACKING */}
            {activeTab === 'dispatch' && (
              <motion.div key="dispatch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h3 className="text-2xl font-black text-[#002147] mb-1">Today's Active Routes</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time Logistics Overview</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    {dashboardMetrics.todaysDispatches} Deliveries Scheduled
                  </span>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {dispatchRoutes.map((route, i) => (
                    <div key={i} className="border-2 border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all bg-white relative overflow-hidden group">
                      <Truck size={120} className="absolute -right-6 -bottom-6 text-gray-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                          <span className="text-[10px] font-black text-[#9e111a] bg-[#9e111a]/10 px-2 py-1 rounded uppercase tracking-widest">{route.time}</span>
                          <h4 className="font-black text-lg text-[#1A1A1A] mt-3">{route.route}</h4>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                          route.status === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          route.status === 'Preparing' ? 'bg-gray-50 border-gray-200 text-gray-500' : 
                          route.status === 'Standby' ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}>
                          {route.status}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <div className="mb-3 flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                          <span>Route Progress</span>
                          <span className="text-[#1A1A1A]">{route.count} Stops</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${route.progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${route.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
                        const paymentStatus = sub.payment_status || sub.payment || 'Pending';
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
                                paymentStatus === 'Paid' || paymentStatus === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                paymentStatus === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                                'bg-red-50 border-red-200 text-red-700'
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

      {/* --- SUBSCRIPTION DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[#FAF9F6] rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 bg-white border-b border-gray-100 flex justify-between items-start shrink-0 relative">
                <div>
                  <h3 className="text-2xl font-serif font-black text-[#002147] mb-1">Subscription Details</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedSub.sub_id || selectedSub.id}</p>
                </div>
                <button onClick={() => setSelectedSub(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition-colors">
                  <XCircle size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-grow space-y-6">
                
                {/* Customer Info */}
                <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row gap-6 shadow-sm">
                  <div className="flex-1 space-y-3">
                    <p className="font-black text-sm text-[#002147] flex items-center gap-3"><Users size={16} className="text-gray-400"/> {selectedSub.customer}</p>
                    <p className="text-xs font-bold text-gray-600 flex items-center gap-3"><Phone size={14} className="text-gray-400"/> {selectedSub.phone || 'N/A'}</p>
                    <p className="text-xs font-bold text-gray-600 flex items-center gap-3"><MapPin size={14} className="text-gray-400"/> {selectedSub.location}</p>
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Plan Setup</p>
                    <p className="text-sm font-bold text-[#1A1A1A] capitalize mb-1">{selectedSub.plan_type || selectedSub.plan || 'Standard'} Plan</p>
                    <p className="text-xs text-gray-500 capitalize">{selectedSub.delivery_time || selectedSub.time || 'Morning'} Delivery</p>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-200 pb-2 mb-4">Ordered Products & Schedule</h4>
                  {selectedSub.items && selectedSub.items.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSub.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#002147]/5 p-2 rounded-lg text-[#002147]">
                              <Package size={16} />
                            </div>
                            <div>
                              <span className="font-bold text-[#1A1A1A] text-sm">{item.product_name || item.name}</span>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Day: <span className="text-[#9e111a]">{item.day_of_week || item.day}</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-gray-500 mr-3">Qty: {item.qty || item.quantity}</span>
                            <span className="font-black text-sm text-[#002147]">NPR {parseFloat(item.price).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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

      {/* --- INVOICE MODAL --- */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="bg-[#002147] text-white p-6 text-center relative">
                <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 p-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <XCircle size={20} />
                </button>
                <Receipt size={32} className="mx-auto text-[#E2B254] mb-2" />
                <h3 className="text-xl font-black uppercase tracking-widest">Payment Invoice</h3>
                <p className="text-xs text-[#E2B254] font-bold tracking-widest mt-1">{selectedInvoice.sub_id || selectedInvoice.id}</p>
              </div>

              <div className="p-8">
                <div className="text-center mb-8 border-b border-gray-100 pb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Billed Amount</p>
                  <p className="text-4xl font-black text-[#9e111a]">NPR {parseFloat(selectedInvoice.weekly_total_cost || selectedInvoice.totalCost || 0).toLocaleString()}</p>
                  <span className={`inline-block mt-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${
                    (selectedInvoice.payment_status || selectedInvoice.payment || 'Pending') === 'Paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    Status: {selectedInvoice.payment_status || selectedInvoice.payment || 'Pending'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-400">Billed To</span>
                    <span className="font-black text-[#1A1A1A]">{selectedInvoice.customer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-400">Plan Period</span>
                    <span className="font-black text-[#1A1A1A] capitalize">{selectedInvoice.plan_type || selectedInvoice.plan || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-400">Contact</span>
                    <span className="font-black text-[#1A1A1A]">{selectedInvoice.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 text-center">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sita Ram Gokul Milks Kathmandu Pvt. Ltd.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}