import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Package, Repeat, Navigation, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending' or 'Completed'
  const [updatingId, setUpdatingId] = useState(null);

  // Custom UI Alert
  const [dialog, setDialog] = useState({ isOpen: false, type: 'alert', message: '', onConfirm: null });
  const showAlert = (message) => setDialog({ isOpen: true, type: 'alert', message, onConfirm: () => setDialog({ isOpen: false }) });
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Point this to your PHP file that outputs the $tasks array
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
      // Calls your update_status.php which expects task_id and status
      const res = await api.post('delivery/update_status.php', {
        task_id: taskId,
        status: newStatus
      });
      
      if (res.data.status === 'success') {
        // Instantly update the UI locally to reflect the change
        setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, status: newStatus } : t));
      } else {
        showAlert("Failed to update status.");
      }
    } catch (error) {
      showAlert("Network error while updating.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter tasks based on the active tab
  const displayedTasks = useMemo(() => {
    return tasks.filter(t => {
      if (activeTab === 'Pending') {
        return t.status !== 'Delivered' && t.status !== 'Completed';
      } else {
        return t.status === 'Delivered' || t.status === 'Completed';
      }
    });
  }, [tasks, activeTab]);

  const completedCount = tasks.filter(t => t.status === 'Delivered' || t.status === 'Completed').length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24 font-sans">
      
      {/* DIALOG MODAL */}
      {dialog.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl text-center transform scale-100 animate-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-50 text-red-500">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-black text-[#1A1A1A] mb-2">Notice</h3>
            <p className="text-gray-500 mb-6 font-medium text-sm">{dialog.message}</p>
            <button onClick={dialog.onConfirm} className="w-full py-3 rounded-xl font-bold text-white bg-[#1A1A1A] hover:bg-[#9e111a]">Got it</button>
          </div>
        </div>
      )}

      {/* MOBILE HEADER */}
      <div className="bg-[#1A1A1A] text-white px-5 pt-8 pb-6 rounded-b-[2rem] shadow-lg sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h1 className="text-2xl font-serif font-black truncate max-w-[200px]">Hello, {user?.name?.split(' ')[0] || 'Driver'}</h1>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
            <Navigation className="text-[#E2B254]" size={24} fill="currentColor" />
          </div>
        </div>

        {/* MOBILE TABS */}
        <div className="flex bg-white/10 p-1.5 rounded-2xl">
          <TabButton name="Pending" active={activeTab} onClick={setActiveTab} count={pendingCount} />
          <TabButton name="Completed" active={activeTab} onClick={setActiveTab} count={completedCount} />
        </div>
      </div>

      {/* TASK LIST */}
      <div className="p-4 space-y-4 mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin text-[#9e111a] mb-4" size={32} />
            <p className="text-xs font-black uppercase tracking-widest">Loading Route...</p>
          </div>
        ) : displayedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <CheckCircle className="text-emerald-500" size={40} />
            </div>
            <h3 className="text-lg font-black text-[#1A1A1A] mb-1">You're all caught up!</h3>
            <p className="text-sm font-medium text-gray-500">No {activeTab.toLowerCase()} tasks right now.</p>
          </div>
        ) : (
          <AnimatePresence>
            {displayedTasks.map((task, idx) => (
              <motion.div
                key={task.task_id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 relative overflow-hidden"
              >
                {/* Visual indicator for Subscriptions vs One-Time */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${task.type === 'Routine Subscription' ? 'bg-emerald-500' : 'bg-blue-500'}`} />

                <div className="flex justify-between items-start mb-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.type === 'Routine Subscription' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {task.type === 'Routine Subscription' ? <Repeat size={20} /> : <Package size={20} />}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#1A1A1A]">{task.customer}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{task.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-black text-[#1A1A1A]">{task.amount}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${task.status === 'On Way' ? 'text-orange-500' : 'text-gray-400'}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-5 pl-2">
                  {/* HUGE Tap Target for Google Maps */}
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(task.address)}`} target="_blank" rel="noreferrer" 
                     className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl active:bg-gray-200 transition-colors border border-gray-100">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <MapPin className="text-[#9e111a]" size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 leading-tight">{task.address}</span>
                  </a>
                  
                  {/* HUGE Tap Target for Calling */}
                  <a href={`tel:${task.phone}`} 
                     className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl active:bg-gray-200 transition-colors border border-gray-100">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <Phone className="text-green-600" size={16} />
                    </div>
                    <span className="text-sm font-black text-gray-700">{task.phone}</span>
                  </a>
                </div>

                {/* DYNAMIC ACTION BUTTONS */}
                <div className="pt-2 pl-2">
                  {activeTab === 'Pending' && (
                    <>
                      {task.status === 'Pending' || task.status === 'Pending Dispatch' ? (
                         <button 
                         onClick={() => handleUpdateStatus(task.task_id, 'On Way')}
                         disabled={updatingId === task.task_id}
                         className="w-full bg-[#E2B254] text-[#002147] py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
                       >
                         {updatingId === task.task_id ? <Loader2 className="animate-spin" size={16} /> : <><Navigation size={16} /> Start Delivery</>}
                       </button>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus(task.task_id, 'Delivered')}
                          disabled={updatingId === task.task_id}
                          className="w-full bg-[#002147] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
                        >
                          {updatingId === task.task_id ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle size={16} /> Mark as Delivered</>}
                        </button>
                      )}
                    </>
                  )}
                  {activeTab === 'Completed' && (
                    <div className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
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

// Mobile Tab Helper
function TabButton({ name, active, onClick, count }) {
  const isActive = active === name;
  return (
    <button
      onClick={() => onClick(name)}
      className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
        isActive ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-400 hover:text-white'
      }`}
    >
      {name}
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${isActive ? 'bg-[#9e111a] text-white' : 'bg-white/20 text-white'}`}>
        {count}
      </span>
    </button>
  );
}