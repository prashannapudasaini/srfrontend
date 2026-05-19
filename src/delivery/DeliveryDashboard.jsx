import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, CheckCircle2, XCircle, Package, Loader2, Navigation, Clock } from 'lucide-react';
import api from '../services/api';

export default function DeliveryDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/delivery/tasks.php');
      if (res.data.status === 'success') {
        // Add a local UI state to track completed items before page refresh
        const formattedTasks = res.data.data.map(t => ({ ...t, ui_status: 'pending' }));
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error("Failed to load delivery tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    // Optimistic UI Update (remove from screen instantly for a snappy feel)
    setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, ui_status: newStatus } : t));

    try {
      await api.post('/delivery/update.php', { task_id: taskId, status: newStatus === 'completed' ? 'Delivered' : 'Failed' });
    } catch (error) {
      alert("Failed to sync with server. Please try again.");
      // Revert if failed
      setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, ui_status: 'pending' } : t));
    }
  };

  const displayedTasks = tasks.filter(t => t.ui_status === activeTab);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans selection:bg-[#9e111a] selection:text-white">
      
      {/* Mobile-Friendly App Header */}
      <div className="bg-[#002147] text-white pt-12 pb-6 px-6 rounded-b-[2.5rem] shadow-xl sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Today's Route</h1>
            <p className="text-[#E2B254] text-xs font-bold uppercase tracking-widest mt-1">
              {new Date().toDateString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <Truck size={24} className="text-white" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#00152e] p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-[#E2B254] text-[#002147] shadow-md' : 'text-gray-400'}`}
          >
            Pending ({tasks.filter(t => t.ui_status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400'}`}
          >
            Done ({tasks.filter(t => t.ui_status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="px-4 mt-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#9e111a] mb-4" size={32} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing Route...</p>
          </div>
        ) : displayedTasks.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-xl font-black text-[#1A1A1A]">All Caught Up!</h2>
            <p className="text-sm text-gray-500 font-medium mt-2">There are no {activeTab} deliveries right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {displayedTasks.map((task) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: task.ui_status === 'completed' ? 100 : -100 }}
                  transition={{ duration: 0.2 }}
                  key={task.task_id} 
                  className="bg-white rounded-3xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${task.type.includes('Routine') ? 'bg-[#E2B254]/20 text-[#9e111a]' : 'bg-[#002147]/10 text-[#002147]'}`}>
                        {task.type}
                      </span>
                      <span className="text-gray-400 text-[10px] font-bold">{task.task_id}</span>
                    </div>
                    {task.amount !== 'Pre-Paid' && (
                      <span className="text-[#9e111a] font-black text-sm">{task.amount}</span>
                    )}
                  </div>

                  {/* Customer Info */}
                  <h3 className="text-xl font-black text-[#1A1A1A] leading-tight mb-3">{task.customer}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <MapPin size={18} className="text-[#002147] shrink-0 mt-0.5" />
                      <p className="text-sm font-bold text-gray-700 leading-snug">{task.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={`tel:${task.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-transform">
                        <Phone size={16} /> Call Customer
                      </a>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-transform">
                        <Navigation size={16} /> Navigate
                      </a>
                    </div>
                  </div>

                  {/* Actions (Only show if pending) */}
                  {activeTab === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button onClick={() => updateStatus(task.task_id, 'failed')} className="w-14 h-14 shrink-0 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 active:scale-95 transition-transform">
                        <XCircle size={24} />
                      </button>
                      <button onClick={() => updateStatus(task.task_id, 'completed')} className="flex-grow h-14 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-transform">
                        <CheckCircle2 size={20} /> Mark Delivered
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Truck Icon fallback since it wasn't imported in standard lucide-react list above
function Truck({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/>
      <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"/>
      <circle cx="7" cy="18" r="2"/>
      <circle cx="17" cy="18" r="2"/>
    </svg>
  );
}