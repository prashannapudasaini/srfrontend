import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Package, Repeat, Navigation, CheckCircle, Loader2, AlertTriangle, Truck, Clock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending'); 
  const [updatingId, setUpdatingId] = useState(null);

  // Custom UI Alert
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
    setUpdatingId(taskId);
    try {
      const res = await api.post('delivery/update_status.php', {
        task_id: taskId,
        status: newStatus
      });
      
      if (res.data.status === 'success') {
        // Instantly update UI locally
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

  // Filter tasks based on active tab
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
      
      {/* --- MOBILE OPTIMIZED DIALOG --- */}
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

      {/* --- PREMIUM MOBILE HEADER --- */}
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

        {/* Live Progress Bar */}
        <div className="mb-8 relative z-10">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-white/80">
            <span>Route Progress</span>
            <span className="text-[#E2B254]">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#d4af37] to-[#E2B254] rounded-full" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/20 backdrop-blur-sm p-1.5 rounded-2xl relative z-10 border border-white/5">
          <TabButton name="Pending" active={activeTab} onClick={setActiveTab} count={pendingCount} />
          <TabButton name="Completed" active={activeTab} onClick={setActiveTab} count={completedCount} />
        </div>
      </div>

      {/* --- TASK LIST --- */}
      <div className="p-5 space-y-5 mt-2">
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
            {displayedTasks.map((task, idx) => (
              <motion.div
                key={task.task_id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group"
              >
                {/* Visual Indicator Line */}
                <div className={`absolute top-0 left-0 w-2 h-full ${task.type === 'Routine Subscription' ? 'bg-emerald-400' : 'bg-[#002147]'}`} />

                {/* Customer Info Header */}
                <div className="flex justify-between items-start mb-6 pl-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shadow-inner ${task.type === 'Routine Subscription' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {task.type === 'Routine Subscription' ? <Repeat size={24} /> : <Package size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">{task.customer}</h3>
                      <span className={`inline-block mt-0.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${task.type === 'Routine Subscription' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {task.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-black text-[#9e111a] tracking-tight">{task.amount}</span>
                  </div>
                </div>

                {/* Logistics Info Buttons (HUGE tap targets) */}
                <div className="space-y-3 mb-6 pl-3">
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(task.address)}`} target="_blank" rel="noreferrer" 
                     className="flex items-center gap-4 p-4 bg-[#FAF9F6] rounded-2xl active:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-gray-50">
                      <MapPin className="text-[#002147]" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Delivery Address</p>
                      <p className="text-sm font-bold text-[#1A1A1A] leading-tight">{task.address}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300" />
                  </a>
                  
                  <a href={`tel:${task.phone}`} 
                     className="flex items-center gap-4 p-4 bg-[#FAF9F6] rounded-2xl active:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-gray-50">
                      <Phone className="text-emerald-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact Customer</p>
                      <p className="text-sm font-black text-[#1A1A1A] tracking-wide">{task.phone}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300" />
                  </a>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-2 pl-3">
                  {activeTab === 'Pending' && (
                    <>
                      {task.status === 'Pending' || task.status === 'Pending Dispatch' ? (
                         <button 
                         onClick={() => handleUpdateStatus(task.task_id, 'On Way')}
                         disabled={updatingId === task.task_id}
                         className="w-full bg-[#E2B254] text-[#002147] py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#E2B254]/20 active:scale-[0.98] transition-all"
                       >
                         {updatingId === task.task_id ? <Loader2 className="animate-spin" size={18} /> : <><Navigation size={18} /> Start Delivery</>}
                       </button>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus(task.task_id, 'Delivered')}
                          disabled={updatingId === task.task_id}
                          className="w-full bg-[#002147] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#002147]/20 active:scale-[0.98] transition-all"
                        >
                          {updatingId === task.task_id ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Mark as Delivered</>}
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
              </motion.div>
            ))}
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