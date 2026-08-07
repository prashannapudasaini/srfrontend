import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Package, Repeat, Navigation, CheckCircle, 
  Loader2, AlertTriangle, Truck, Clock, ArrowRight, 
  ChevronDown, ChevronUp, Banknote, CreditCard, ListOrdered 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending'); 
  const [updatingId, setUpdatingId] = useState(null);
  
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const [dialog, setDialog] = useState({ isOpen: false, message: '', onConfirm: null });
  const showAlert = (message) => setDialog({ isOpen: true, message, onConfirm: () => setDialog({ isOpen: false, message: '', onConfirm: null }) });
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`delivery/tasks.php?_t=${Date.now()}`);
      if (res.data.status === 'success') {
        setTasks(res.data.data);
      }
    } catch (error) {
      console.error("Fetch error", error);
      showAlert("Failed to load delivery tasks. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    setUpdatingId(taskId + 'status');
    try {
      const res = await api.post('delivery/update_status.php', {
        task_id: taskId,
        status: newStatus
      });
      
      if (res.data.status === 'success') {
        setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, status: newStatus } : t));
      } else {
        showAlert(res.data.message || "Failed to update status.");
      }
    } catch (error) {
      showAlert("Network error while updating.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdatePayment = async (taskId) => {
    setUpdatingId(taskId + 'payment');
    try {
      const res = await api.post('delivery/update_payment.php', {
        task_id: taskId,
        payment_status: 'paid'
      });
      
      if (res.data.status === 'success') {
        setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, payment_status: 'paid' } : t));
      } else {
        showAlert(res.data.message || "Failed to update payment status.");
      }
    } catch (error) {
      showAlert("Network error while updating payment.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (taskId) => {
    setExpandedTaskId(prev => prev === taskId ? null : taskId);
  };

  const displayedTasks = useMemo(() => {
    return tasks.filter(t => {
      const isCompleted = t.status === 'Delivered' || t.status === 'Completed';
      return activeTab === 'Pending' ? !isCompleted : isCompleted;
    });
  }, [tasks, activeTab]);

  const completedCount = tasks.filter(t => t.status === 'Delivered' || t.status === 'Completed').length;
  const pendingCount = tasks.length - completedCount;
  const progressPercentage = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-24 font-sans selection:bg-[#002147] selection:text-white">
      
      {/* MOBILE OPTIMIZED DIALOG */}
      <AnimatePresence>
        {dialog.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dialog.onConfirm} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center relative z-10"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-amber-50 text-amber-500 border-4 border-amber-100/50">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-black text-[#1A1A1A] mb-2">Notice</h3>
              <p className="text-gray-500 mb-8 font-medium text-sm leading-relaxed">{dialog.message}</p>
              <button onClick={dialog.onConfirm} className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-[#002147] hover:bg-[#1A1A1A] active:scale-95 transition-all shadow-md">
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="bg-gradient-to-b from-[#00152e] to-[#002147] text-white px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl relative overflow-hidden z-40">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white opacity-[0.03] rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 bg-blue-400 opacity-[0.05] rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Clock size={12} /> {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            <h1 className="text-3xl font-serif font-black tracking-tight">Hi, {user?.name?.split(' ')[0] || 'Driver'}</h1>
          </div>
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
            <Truck className="text-[#E2B254]" size={28} />
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-white/80">
            <span>Route Progress</span>
            <span className="text-[#E2B254]">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#d4af37] to-[#E2B254] rounded-full" />
          </div>
        </div>

        <div className="flex bg-black/20 backdrop-blur-sm p-1.5 rounded-2xl relative z-10 border border-white/5">
          <TabButton name="Pending" active={activeTab} onClick={setActiveTab} count={pendingCount} />
          <TabButton name="Completed" active={activeTab} onClick={setActiveTab} count={completedCount} />
        </div>
      </div>

      {/* TASK LIST */}
      <div className="p-4 space-y-4 mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin text-[#002147] mb-4" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">Syncing Route Data...</p>
          </div>
        ) : displayedTasks.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-6 border border-emerald-50">
              <CheckCircle className="text-emerald-500" size={48} />
            </div>
            <h3 className="text-2xl font-black text-[#1A1A1A] mb-2 tracking-tight">All Caught Up!</h3>
            <p className="text-sm font-medium text-gray-500 max-w-[250px]">You have no {activeTab.toLowerCase()} deliveries remaining on your route.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {displayedTasks.map((task, idx) => {
              const isExpanded = expandedTaskId === task.task_id;
              const isPaid = task.payment_status?.toLowerCase() === 'paid';
              const isCOD = task.payment_method?.toLowerCase() === 'cod';
              const isSub = task.type === 'Routine Subscription';

              return (
                <motion.div
                  key={task.task_id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group"
                >
                  {/* Left Color Bar */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${isSub ? 'bg-emerald-400' : 'bg-[#002147]'}`} />

                  {/* PERFECTLY ALIGNED CONTENT CONTAINER */}
                  <div className="p-5 pl-6">
                    
                    {/* 1. Header Row (Icon, Name, Amount, Tags) */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Icon */}
                      <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm border ${isSub ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {isSub ? <Repeat size={24} /> : <Package size={24} />}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 pt-0.5 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[17px] leading-tight font-black text-[#1A1A1A] tracking-tight truncate">{task.customer}</h3>
                          <span className="block text-[16px] font-black text-[#9e111a] tracking-tight shrink-0">
                            NPR {task.amount}
                          </span>
                        </div>
                        
                        {/* Unified Badges Container */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isSub ? 'bg-emerald-100/50 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                            {task.task_id} • {isSub ? 'Sub' : 'Order'}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 ${isCOD ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-[#00519E]'}`}>
                            {isCOD ? <Banknote size={10} /> : <CreditCard size={10} />}
                            {isCOD ? 'COD' : 'ConnectIPS'}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 ${isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Sleek Logistics Cards */}
                    <div className="space-y-2.5 mb-5">
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(task.address)}`} target="_blank" rel="noreferrer" 
                         className="flex items-center gap-3 p-3 bg-gray-50/70 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-100 group">
                        <div className="w-9 h-9 bg-white rounded-[10px] flex items-center justify-center shadow-sm shrink-0 text-[#002147] border border-gray-100 group-hover:scale-105 transition-transform">
                          <MapPin size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Delivery Address</p>
                          <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight truncate">{task.address}</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300" />
                      </a>
                      
                      <a href={`tel:${task.phone}`} 
                         className="flex items-center gap-3 p-3 bg-gray-50/70 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-100 group">
                        <div className="w-9 h-9 bg-white rounded-[10px] flex items-center justify-center shadow-sm shrink-0 text-emerald-600 border border-gray-100 group-hover:scale-105 transition-transform">
                          <Phone size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact Customer</p>
                          <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight truncate">{task.phone}</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300" />
                      </a>
                    </div>

                    {/* 3. Dropdown Accordion */}
                    <div className="mb-5">
                      <button 
                        onClick={() => toggleExpand(task.task_id)}
                        className={`w-full flex items-center justify-between p-3.5 border rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors shadow-sm ${isExpanded ? 'bg-gray-50 border-gray-200 text-[#002147]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        <span className="flex items-center gap-2"><ListOrdered size={16} className={isExpanded ? 'text-[#002147]' : 'text-gray-400'}/> View Items & Payment</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 space-y-3">
                              {/* Order Items */}
                              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2 border-b border-gray-50 pb-2">Package Contents</h4>
                                <ul className="space-y-2">
                                  {task.items && task.items.length > 0 ? (
                                    task.items.map((item, i) => (
                                      <li key={i} className="flex justify-between items-center text-[13px] font-bold text-[#1A1A1A]">
                                        <span><span className="text-gray-400 mr-1">{item.qty}x</span> {item.name}</span>
                                        <span className="text-gray-400 text-xs font-medium">{item.size || ''}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-xs text-gray-400 italic">No specific item data found.</li>
                                  )}
                                </ul>
                              </div>

                              {/* Cash Collection Prompt */}
                              {!isPaid && isCOD && activeTab === 'Pending' && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div>
                                    <p className="text-[9px] font-black uppercase text-red-800 tracking-widest mb-0.5">Collect Cash Amount</p>
                                    <p className="text-[17px] font-black text-[#9e111a] leading-none">NPR {task.amount}</p>
                                  </div>
                                  <button 
                                    onClick={() => handleUpdatePayment(task.task_id)}
                                    disabled={updatingId === task.task_id + 'payment'}
                                    className="bg-[#9e111a] text-white px-5 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest shadow-md shadow-red-900/20 hover:bg-red-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                                  >
                                    {updatingId === task.task_id + 'payment' ? <Loader2 className="animate-spin" size={14} /> : <><Banknote size={14}/> Mark Paid</>}
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 4. Action Buttons */}
                    <div>
                      {activeTab === 'Pending' && (
                        <>
                          {task.status === 'Pending' || task.status === 'Pending Dispatch' ? (
                             <button 
                             onClick={() => handleUpdateStatus(task.task_id, 'On Way')}
                             disabled={updatingId === task.task_id + 'status'}
                             className="w-full bg-gradient-to-r from-[#E2B254] to-[#d4af37] text-[#002147] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#E2B254]/30 hover:opacity-90 active:scale-[0.98] transition-all border border-[#d4af37]"
                           >
                             {updatingId === task.task_id + 'status' ? <Loader2 className="animate-spin" size={18} /> : <><Navigation size={18} /> Start Delivery</>}
                           </button>
                          ) : (
                            <button 
                              onClick={() => {
                                if (isCOD && !isPaid) {
                                  showAlert("Please collect cash and 'Mark Paid' before finishing delivery.");
                                  setExpandedTaskId(task.task_id); // Auto-open the payment section
                                  return;
                                }
                                handleUpdateStatus(task.task_id, 'Delivered');
                              }}
                              disabled={updatingId === task.task_id + 'status'}
                              className="w-full bg-gradient-to-r from-[#002147] to-[#00152e] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#002147]/30 hover:opacity-90 active:scale-[0.98] transition-all border border-[#00152e]"
                            >
                              {updatingId === task.task_id + 'status' ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Mark as Delivered</>}
                            </button>
                          )}
                        </>
                      )}
                      {activeTab === 'Completed' && (
                        <div className="w-full bg-emerald-50 border border-emerald-100 text-emerald-700 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                          <CheckCircle size={16} /> Delivery Successful
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// Sub-component for strictly styled mobile tabs
function TabButton({ name, active, onClick, count }) {
  const isActive = active === name;
  return (
    <button
      onClick={() => onClick(name)}
      className={`flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
        isActive ? 'bg-white text-[#002147] shadow-sm' : 'text-white/60 hover:text-white'
      }`}
    >
      {name}
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${isActive ? 'bg-[#9e111a] text-white' : 'bg-white/10 text-white'}`}>
        {count}
      </span>
    </button>
  );
}