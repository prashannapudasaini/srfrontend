import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Truck, CreditCard, Users, Activity, ArrowUpRight, 
  CheckCircle2, XCircle, Clock, Loader2, MapPin, Sunrise, Sunset, 
  CalendarDays, Receipt, Phone, Package, Smartphone, Globe, ShieldCheck, 
  Printer, Check, Building2, ChevronRight, AlertTriangle, DollarSign
} from 'lucide-react';
import api from '../services/api';

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState('subscribers'); // 'subscribers' | 'dispatch' | 'payments'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeSubs: 0, todaysDispatches: 0, pendingPayments: 0, pendingInvoices: 0, tomorrowsDemand: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await api.get('/admin/subscriptions.php');
        if (res.data.status === 'success') {
          if (Array.isArray(res.data.data)) {
            setSubscriptions(res.data.data);
          } else {
            setSubscriptions(res.data.data.subscriptions || []);
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

  // --- STRICT SEQUENTIAL STATUS UPDATE FOR EXACT CUSTOMER SUBSCRIPTIONS ---
  const handleCustomerDispatchUpdate = async (sub, stageIndex) => {
    const stages = ['Preparing', 'Dispatched', 'Out for Delivery', 'Delivered'];
    const newStatus = stages[stageIndex];
    
    const previousSubscriptions = [...subscriptions];
    
    // 🔥 NULL-SAFE FIX: Strictly match by unique ID so undefined === undefined never updates all rows!
    setSubscriptions(prev => prev.map(s => {
      const matchById = Boolean(sub.id) && Boolean(s.id) && s.id === sub.id;
      const matchBySubId = Boolean(sub.sub_id) && Boolean(s.sub_id) && s.sub_id === sub.sub_id;
      
      return (matchById || matchBySubId)
        ? { ...s, route_status: newStatus, dispatch_status: newStatus } 
        : s;
    }));

    try {
      const res = await api.post('/admin/update-sub-dispatch-status.php', {
        sub_id: sub.sub_id || '',
        id: sub.id || '',
        status: newStatus
      });
      
      if (res.data.status === 'success') {
        showToast(`${sub.customer}'s delivery updated to ${newStatus}`, 'success');
      } else {
        setSubscriptions(previousSubscriptions);
        showToast(res.data.message || "Failed to update dispatch status.", 'error');
      }
    } catch (err) {
      setSubscriptions(previousSubscriptions);
      showToast("Network error while updating status.", 'error');
    }
  };

  const filteredSubs = useMemo(() => {
    return subscriptions.filter(sub => {
      const query = searchQuery.toLowerCase();
      const subId = sub.sub_id || sub.id || ''; 
      return (
        sub.customer?.toLowerCase().includes(query) ||
        subId.toString().toLowerCase().includes(query) ||
        sub.location?.toLowerCase().includes(query) ||
        sub.phone?.includes(query)
      );
    });
  }, [subscriptions, searchQuery]);

  const metrics = [
    { title: "Active Subs", value: dashboardMetrics.activeSubs || filteredSubs.length, trend: "Live Count", icon: Users, color: "text-[#002147]", bg: "bg-[#002147]/5" },
    { title: "Today's Dispatches", value: dashboardMetrics.todaysDispatches || filteredSubs.length, trend: "Morning & Evening", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Pending Payments", value: `NPR ${(dashboardMetrics.pendingPayments || 0).toLocaleString()}`, trend: `${dashboardMetrics.pendingInvoices || 0} Invoices Due`, icon: CreditCard, color: "text-[#9e111a]", bg: "bg-[#9e111a]/5" },
    { title: "Tomorrow's Demand", value: `${dashboardMetrics.tomorrowsDemand || 0} L`, trend: "Milk Inventory Needed", icon: Activity, color: "text-[#E2B254]", bg: "bg-[#E2B254]/10" },
  ];

  const PaymentStatusBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'pending';
    if (normalized === 'completed' || normalized === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12}/> Paid
        </span>
      );
    }
    if (normalized === 'failed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
          <XCircle size={12}/> Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={12}/> Pending
      </span>
    );
  };

  const SubStatusBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'active';
    switch (normalized) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Active
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} /> Paused
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            <XCircle size={12} /> Cancelled
          </span>
        );
    }
  };

  const PlanBadge = ({ plan }) => {
    const raw = (plan || 'weekly').toLowerCase();
    let styles = "bg-gray-100 text-gray-700 border-gray-200";
    if (raw === 'daily') styles = "bg-[#9e111a]/10 text-[#9e111a] border-[#9e111a]/20";
    else if (raw === 'alternate') styles = "bg-[#002147]/10 text-[#002147] border-[#002147]/20";
    else if (raw === 'weekly') styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
    else if (raw === 'custom') styles = "bg-amber-50 text-amber-800 border-amber-200";

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${styles}`}>
        {plan || 'Weekly'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center text-[#002147]">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-black tracking-widest uppercase text-sm">Loading Subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center text-[#9e111a]">
        <XCircle size={48} className="mb-4" />
        <p className="font-bold text-lg mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-[#9e111a] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#7a0d13] shadow-lg transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* GLOBAL TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-900 text-white border-gray-800'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} className="text-emerald-400" />}
            <p className="font-bold text-sm">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER WITH SEARCH BAR */}
      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-serif font-black text-white">Subscription Management</h2>
          <p className="text-xs font-medium text-gray-400 mt-1">Manage recurring milk deliveries, custom schedules, and billing cycles.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search ID, Customer Name, Phone, or Location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white text-sm font-medium rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-[#E2B254] transition-all placeholder:text-gray-500" 
          />
        </div>
      </div>

      {/* HEADER METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:-translate-y-0.5 transition-transform"
          >
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{metric.title}</p>
              <h3 className="text-3xl font-black text-[#1A1A1A] tracking-tight">{metric.value}</h3>
              <p className="text-[11px] font-bold text-gray-400 mt-2">{metric.trend}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metric.bg} ${metric.color}`}>
              <metric.icon size={26} strokeWidth={2.5} />
            </div>
          </div>
        ))}
      </div>

      {/* TOP CATEGORY TAB BAR */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-4">
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'subscribers'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Subscribers ({filteredSubs.length})
        </button>
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'dispatch'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Customer Dispatch & Tracking ({filteredSubs.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Payments & Invoices
        </button>
      </div>

      {/* TABLE / CONTENT AREA */}
      <div className="bg-white rounded-b-3xl shadow-sm border border-t-0 border-gray-100 overflow-hidden">
        
        {/* TAB 1: SUBSCRIBERS TABLE */}
        {activeTab === 'subscribers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="p-5 pl-8">Subscription Info</th>
                  <th className="p-5">Customer & Contact</th>
                  <th className="p-5">Location</th>
                  <th className="p-5">Plan Details</th>
                  <th className="p-5">Payment Status</th>
                  <th className="p-5">Sub Status</th>
                  <th className="p-5 pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-16 text-center text-gray-400 font-medium">
                      No subscribers found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredSubs.map((sub, i) => (
                    <tr 
                      key={i} 
                      onClick={() => setSelectedSub(sub)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="p-5 pl-8">
                        <p className="font-black text-sm text-[#002147]">{sub.sub_id || sub.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'Active Plan'}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-sm text-[#1A1A1A]">{sub.customer}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{sub.phone || 'N/A'}</p>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{sub.location}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <PlanBadge plan={sub.plan_type || sub.plan} />
                          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                            {(sub.delivery_time || sub.time)?.toLowerCase() === 'morning' 
                              ? <Sunrise size={14} className="text-amber-500" /> 
                              : <Sunset size={14} className="text-[#002147]" />}
                            {sub.delivery_time || sub.time || 'Morning'}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <PaymentStatusBadge status={sub.payment_status || sub.payment} />
                      </td>
                      <td className="p-5">
                        <SubStatusBadge status={sub.status} />
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 group-hover:bg-[#00519E] group-hover:text-white group-hover:border-[#00519E] transition-all shadow-sm">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 🔥 TAB 2: THIN, LINE-BY-LINE INLINE DISPATCH TABLE */}
        {activeTab === 'dispatch' && (
          <div className="overflow-x-auto">
            <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-lg font-black text-[#002147]">Customer Dispatch & Fulfillment</h3>
                <p className="text-xs text-gray-500 font-medium">
                  Update Delivery Progress Line-by-Line For Each Subscription
                </p>
              </div>
              <span className="bg-white text-[#002147] border border-gray-200 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {filteredSubs.length} Active Deliveries
              </span>
            </div>

            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Customer & Shift</th>
                  <th className="py-3.5 px-6">Delivery Address</th>
                  <th className="py-3.5 px-6">Products</th>
                  <th className="py-3.5 px-6 text-center">Dispatch Progress (Click Next Step)</th>
                  <th className="py-3.5 px-6 text-right">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-16 text-center text-gray-400 font-medium">
                      No active deliveries found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredSubs.map((sub, i) => {
                    const stages = ['Preparing', 'Dispatched', 'Out for Delivery', 'Delivered'];
                    const shortStages = ['Prep', 'Dispatched', 'Out', 'Delivered'];
                    let currentStepIndex = 0; 
                    const normalizedStatus = (sub.route_status || sub.dispatch_status || 'Preparing').toLowerCase();
                    
                    if (normalizedStatus === 'completed' || normalizedStatus === 'delivered') currentStepIndex = 3;
                    else if (normalizedStatus === 'out for delivery' || normalizedStatus === 'out_for_delivery') currentStepIndex = 2;
                    else if (normalizedStatus === 'dispatched') currentStepIndex = 1;
                    else currentStepIndex = 0;

                    const shiftTime = sub.delivery_time || sub.time || 'Morning';

                    return (
                      <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                        {/* Customer & Shift */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-black text-white bg-[#002147] px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                              {shiftTime.substring(0, 3)}
                            </span>
                            <div>
                              <p className="font-bold text-sm text-[#1A1A1A] leading-tight">{sub.customer}</p>
                              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                                {sub.sub_id || sub.id} • {sub.phone || 'No phone'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Delivery Address */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 max-w-xs truncate">
                            <MapPin size={13} className="text-[#9e111a] shrink-0" />
                            <span className="truncate">{sub.location}</span>
                          </div>
                        </td>

                        {/* Products */}
                        <td className="py-3.5 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {sub.items && sub.items.length > 0 ? (
                              sub.items.map((item, idx) => (
                                <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded">
                                  {item.qty || item.quantity || 1}x {item.product_name || item.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 italic">Daily Milk</span>
                            )}
                          </div>
                        </td>

                        {/* Thin Horizontal Inline Progress Tracker */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                            {stages.map((stage, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              const isNextAllowed = idx === currentStepIndex + 1 || (currentStepIndex === 0 && idx === 0);
                              const isDeliveredStep = idx === 3; 
                              const canClick = isNextAllowed && !isDeliveredStep;

                              return (
                                <React.Fragment key={idx}>
                                  <button
                                    onClick={() => canClick && handleCustomerDispatchUpdate(sub, idx)}
                                    disabled={!canClick}
                                    title={
                                      isDeliveredStep 
                                        ? "Locked: Only delivery staff can mark as Delivered" 
                                        : canClick 
                                          ? `Click to mark as ${stage}` 
                                          : "Complete previous steps first"
                                    }
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                      isCompleted 
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                                        : canClick 
                                          ? 'bg-blue-50 border-blue-400 text-blue-700 cursor-pointer hover:bg-blue-100 animate-pulse' 
                                          : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                                    }`}
                                  >
                                    {isCompleted ? <Check size={11} strokeWidth={3} /> : null}
                                    {shortStages[idx]}
                                  </button>

                                  {idx < stages.length - 1 && (
                                    <div className={`w-3 h-0.5 rounded-full ${idx < currentStepIndex ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </td>

                        {/* Current Status Badge */}
                        <td className="py-3.5 px-6 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            currentStepIndex === 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            currentStepIndex === 2 ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            currentStepIndex === 1 ? 'bg-purple-50 border-purple-200 text-purple-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                          }`}>
                            {stages[currentStepIndex]}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PAYMENTS & INVOICES */}
        {activeTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="p-5 pl-8">Subscription ID</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Billing Cycle</th>
                  <th className="p-5">Total Billed</th>
                  <th className="p-5">Payment Status</th>
                  <th className="p-5 pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center text-gray-400 font-medium">
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  filteredSubs.map((sub, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-5 pl-8 font-bold text-[#002147]">
                        {sub.sub_id || sub.id}
                      </td>
                      <td className="p-5 font-bold text-[#1A1A1A]">
                        {sub.customer}
                      </td>
                      <td className="p-5 text-xs text-gray-500 font-medium">
                        Weekly Recurring
                      </td>
                      <td className="p-5 font-black text-gray-900">
                        NPR {parseFloat(sub.weekly_total_cost || sub.totalCost || 0).toLocaleString()}
                      </td>
                      <td className="p-5">
                        <PaymentStatusBadge status={sub.payment_status || sub.payment} />
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <button 
                          onClick={() => setSelectedInvoice(sub)}
                          className="px-3.5 py-1.5 bg-gray-100 hover:bg-[#002147] hover:text-white text-gray-700 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- SUBSCRIPTION DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} 
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-gray-50 border-b border-gray-100 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-black text-[#1A1A1A]">Sub #{selectedSub.sub_id || selectedSub.id}</h3>
                    <SubStatusBadge status={selectedSub.status} />
                    <PaymentStatusBadge status={selectedSub.payment_status || selectedSub.payment} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    Customer: {selectedSub.customer}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedInvoice(selectedSub)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Printer size={16} /> View Invoice
                  </button>
                  <button 
                    onClick={() => setSelectedSub(null)} 
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto flex-grow space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Profile</p>
                    <p className="font-bold text-sm text-[#002147] flex items-center gap-2">
                      <Users size={14} className="text-gray-400"/> {selectedSub.customer}
                    </p>
                    <p className="text-xs font-medium text-gray-600 flex items-center gap-2">
                      <Phone size={14} className="text-gray-400"/> {selectedSub.phone || 'N/A'}
                    </p>
                    <p className="text-xs font-medium text-gray-600 flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400"/> {selectedSub.location}
                    </p>
                  </div>

                  {/* Plan Info */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Plan Setup</p>
                    <p className="font-bold text-sm text-[#1A1A1A] capitalize flex items-center gap-2">
                      <CalendarDays size={14} className="text-gray-400"/> {selectedSub.plan_type || selectedSub.plan || 'Standard'} Plan
                    </p>
                    <p className="text-xs font-medium text-gray-600 capitalize flex items-center gap-2">
                      {(selectedSub.delivery_time || selectedSub.time)?.toLowerCase() === 'morning' 
                        ? <Sunrise size={14} className="text-amber-500"/> 
                        : <Sunset size={14} className="text-gray-400"/>}
                      {selectedSub.delivery_time || selectedSub.time || 'Morning'} Delivery
                    </p>
                  </div>

                  {/* Source Info */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Source & Payment</p>
                    <p className="font-bold text-xs text-gray-700 flex items-center gap-2">
                      {selectedSub.source?.toLowerCase().includes('app') 
                        ? <Smartphone size={14} className="text-blue-500"/> 
                        : <Globe size={14} className="text-blue-500"/>}
                      {selectedSub.source || 'Website'}
                    </p>
                    <p className="font-bold text-xs text-gray-700 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-gray-400"/>
                      {selectedSub.payment_method || 'ConnectIPS'}
                    </p>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Ordered Products & Schedule</h4>
                  </div>
                  
                  <div className="p-5 space-y-3">
                    {selectedSub.items && selectedSub.items.length > 0 ? (
                      selectedSub.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
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
                              <span className="font-bold text-[#1A1A1A] text-sm block">{item.product_name || item.name}</span>
                              <span className="text-[11px] font-semibold text-gray-500 uppercase">
                                Day: <span className="text-[#9e111a]">{item.day_of_week || item.day}</span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-500">
                              NPR {parseFloat(item.price).toLocaleString()} × {item.qty || item.quantity}
                            </p>
                            <p className="font-black text-sm text-[#002147]">
                              NPR {(parseFloat(item.price) * parseFloat(item.qty || item.quantity)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center py-4">
                        No item breakdown provided by database.
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-5 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Weekly Total</span>
                    <span className="text-2xl font-black text-[#9e111a]">
                      NPR {parseFloat(selectedSub.weekly_total_cost || selectedSub.totalCost || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PROFESSIONAL INVOICE MODAL --- */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh] print:shadow-none print:h-auto print:max-h-none print:w-full print:border-none"
            >
              {/* No-print Action Bar */}
              <div className="bg-gray-50 p-4 flex justify-end gap-3 rounded-t-3xl print:hidden shrink-0 border-b border-gray-200">
                <button 
                  onClick={() => window.print()} 
                  className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1A1A1A] transition-colors shadow-sm"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)} 
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-sm"
                >
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
                    <p className="text-sm font-bold text-gray-500 tracking-widest mt-1">INV-{selectedInvoice.sub_id || selectedInvoice.id}</p>
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
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <span className="font-bold text-[#1A1A1A]">Status:</span> 
                      <PaymentStatusBadge status={selectedInvoice.payment_status || selectedInvoice.payment} />
                    </div>
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
                            <td className="py-3 px-4 text-[#1A1A1A] font-black text-right">
                              NPR {(parseFloat(item.price) * parseFloat(item.qty || item.quantity)).toLocaleString()}
                            </td>
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
                  <div className="w-1/2 bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-500 uppercase">Subtotal</span>
                      <span className="text-sm font-bold text-gray-800">NPR {parseFloat(selectedInvoice.weekly_total_cost || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                      <span className="text-sm font-bold text-gray-500 uppercase">Tax (0%)</span>
                      <span className="text-sm font-bold text-gray-800">NPR 0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-[#002147] uppercase tracking-widest">Grand Total</span>
                      <span className="text-2xl font-black text-[#9e111a]">NPR {parseFloat(selectedInvoice.weekly_total_cost || 0).toLocaleString()}</span>
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