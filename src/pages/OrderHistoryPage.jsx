import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  User, Mail, Phone, MapPin, CalendarDays, Clock, 
  Package, Crown, CheckCircle2, XCircle, LogOut, ArrowRight, Truck, Settings, Lock, Save, X, Receipt, Activity, PauseCircle, Play, AlertTriangle, Bell
} from 'lucide-react';

export default function OrderHistoryPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('subscriptions'); 
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- ADDED: NOTIFICATIONS STATE ---
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Calculate unread count safely
  const unreadCount = notifications.filter(n => parseInt(n.is_read) === 0).length;

  // Settings State
  const [profileData, setProfileData] = useState({ name: '', phone: '', address: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  // --- CUSTOM UI STATES (Replaces alerts) ---
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ visible: false, message: '', onConfirm: null });

  // Helper for Toasts
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3500);
  };

  // VIP Logic
  const loyaltyCount = user?.subscription_count || 0;
  const LOYALTY_GOAL = 20;
  const isVipUnlocked = loyaltyCount >= LOYALTY_GOAL;
  const progressPercentage = Math.min((loyaltyCount / LOYALTY_GOAL) * 100, 100);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileData({ 
        name: user.name || '', 
        phone: user.phone || '', 
        address: user.address || '' 
      });
    }

    const fetchMyData = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const [subRes, orderRes, notifRes] = await Promise.all([
          api.get(`/user/my-subscription.php?user_id=${user.id}`),
          api.get(`/user/my-orders.php?user_id=${user.id}`),
          api.get(`/user/notifications.php?user_id=${user.id}`) // Fetch Notifications
        ]);

        if (subRes.data.status === 'success') setSubscriptions(subRes.data.data);
        if (orderRes.data.status === 'success') setOrders(orderRes.data.data);
        if (notifRes.data.status === 'success') setNotifications(notifRes.data.data);
        
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyData();
  }, [isAuthenticated, navigate, user]);

  // Mark all as read locally when opening the notification tray
  useEffect(() => {
    if (showNotifications && unreadCount > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    }
  }, [showNotifications, unreadCount]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // --- SETTINGS HANDLERS ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await api.post('/user/update-profile.php', {
        action: 'update_info',
        user_id: user.id,
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      });
      if (res.data.status === 'success') {
        const updatedUser = { ...user, name: profileData.name, phone: profileData.phone, address: profileData.address };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showToast("Profile updated! Your checkout details are now synchronized.", 'success');
        setTimeout(() => window.location.reload(), 1500); 
      } else {
        showToast(res.data.message || "Failed to update profile.", 'error');
      }
    } catch (err) {
      showToast("Network error occurred.", 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      return showToast("New passwords do not match!", 'error');
    }
    if (passwordData.new_password.length < 8) {
      return showToast("Password must be at least 8 characters.", 'error');
    }

    setIsUpdatingPassword(true);
    try {
      const res = await api.post('/user/update-profile.php', {
        action: 'update_password',
        user_id: user.id,
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      if (res.data.status === 'success') {
        showToast("Password updated successfully! Please log in again.", 'success');
        setTimeout(() => handleLogout(), 1500);
      } else {
        showToast(res.data.message || "Failed to update password.", 'error');
      }
    } catch (err) {
      showToast("Network error occurred.", 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // --- SUBSCRIPTION STATUS HANDLER (PAUSE/RESUME) ---
  const handleToggleSubscriptionStatus = (newStatus) => {
    setConfirmDialog({
      visible: true,
      message: `Are you sure you want to ${newStatus === 'Paused' ? 'pause' : 'resume'} this routine?`,
      onConfirm: async () => {
        setConfirmDialog({ visible: false, message: '', onConfirm: null });
        try {
          const res = await api.post('/user/update_subscription_status.php', {
            user_id: user.id,
            id: selectedSub.id,
            status: newStatus
          });

          if (res.data.status === 'success') {
            showToast(`Routine ${newStatus === 'Paused' ? 'paused' : 'resumed'} successfully.`, 'success');
            setSelectedSub(null); 
            setTimeout(() => window.location.reload(), 1500); 
          } else {
            showToast(res.data.message || "Failed to update routine.", 'error');
          }
        } catch (err) {
          showToast("Network error occurred while trying to update.", 'error');
        }
      }
    });
  };

  const PaymentBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'pending';
    if (normalized === 'completed') return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><CheckCircle2 size={12}/> Paid</span>;
    if (normalized === 'failed') return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><XCircle size={12}/> Failed</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><Clock size={12}/> Pending</span>;
  };

  const OrderBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'processing';
    if (normalized === 'delivered') return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><CheckCircle2 size={12}/> Delivered</span>;
    if (normalized === 'cancelled') return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><XCircle size={12}/> Cancelled</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><Truck size={12}/> {normalized.replace('_', ' ')}</span>;
  };

  if (!user) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20 font-sans text-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* --- HEADER & NOTIFICATION BELL --- */}
        <div className="mb-10 flex justify-between items-end relative z-40">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] tracking-tight">
              My Account
            </h1>
            <p className="text-gray-500 font-medium mt-2">Manage your subscriptions, track orders, and configure profile settings.</p>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100 hover:border-[#002147] transition-all relative"
            >
              <Bell size={24} className="text-[#002147]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#9e111a] text-white text-[11px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION TRAY */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-16 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[500px] z-50 origin-top-right"
                >
                  <div className="bg-[#002147] p-5 text-white flex justify-between items-center shrink-0">
                    <div>
                      <h3 className="font-black tracking-widest uppercase text-xs">Dispatch Alerts</h3>
                      <p className="text-[10px] text-blue-200 mt-1">Real-time delivery updates</p>
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto custom-scrollbar bg-gray-50/50 flex-grow">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center flex flex-col items-center justify-center">
                        <Bell size={32} className="text-gray-300 mb-3" />
                        <p className="text-sm font-bold text-gray-500">No recent alerts</p>
                        <p className="text-xs text-gray-400 mt-1">We'll notify you when your orders move.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map(n => (
                          <div key={n.id} className="p-5 bg-white hover:bg-gray-50 transition-colors relative">
                            {/* Visual indicator for delivered vs in-transit */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${n.title.toLowerCase().includes('delivered') ? 'bg-emerald-500' : 'bg-[#E2B254]'}`}></div>
                            <div className="pl-2">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">{n.title}</p>
                                <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed font-medium">{n.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
          
          {/* LEFT COLUMN: User Profile & VIP Card */}
          <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col gap-6 sticky top-28">
            <div className={`rounded-[2rem] overflow-hidden shadow-xl border ${isVipUnlocked ? 'border-gray-800 bg-gradient-to-b from-[#1A1A1A] to-black' : 'border-gray-100 bg-[#002147]'}`}>
              <div className="p-8 text-center relative border-b border-white/10">
                {isVipUnlocked && <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shine_3s_infinite]"></div>}
                
                <div className="w-24 h-24 mx-auto rounded-full bg-white p-1 mb-4 relative">
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-black ${isVipUnlocked ? 'bg-gradient-to-br from-[#E2B254] to-[#d4af37] text-[#1A1A1A]' : 'bg-gray-100 text-[#002147]'}`}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {isVipUnlocked && (
                    <div className="absolute -bottom-2 -right-2 bg-[#1A1A1A] text-[#E2B254] p-1.5 rounded-full border-2 border-[#E2B254]">
                      <Crown size={16} />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white">{user.name}</h2>
                <p className="text-[#E2B254] text-xs font-bold uppercase tracking-widest mt-1">
                  {isVipUnlocked ? 'Gokul VIP Member' : 'Farm Member'}
                </p>
              </div>

              <div className="p-8 bg-white/5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">VIP Progress</span>
                  <span className="text-white font-black">{loyaltyCount} <span className="text-gray-500 text-xs">/ {LOYALTY_GOAL}</span></span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1 }}
                    className={`h-full rounded-full ${isVipUnlocked ? 'bg-gradient-to-r from-[#E2B254] to-[#f4d081]' : 'bg-[#E2B254]'}`}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-400 font-medium text-center">
                  {isVipUnlocked ? 'You have unlocked lifetime VIP perks!' : `Only ${LOYALTY_GOAL - loyaltyCount} more subscriptions to unlock Gold VIP.`}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Contact Details</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#002147] shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="font-bold text-sm text-[#1A1A1A] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#002147] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                    <p className="font-bold text-sm text-[#1A1A1A]">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#002147] shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</p>
                    <p className="font-bold text-sm text-[#1A1A1A]">{user.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button onClick={handleLogout} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[#9e111a] font-bold text-sm hover:bg-red-50 transition-colors">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Subscriptions, Orders & Settings */}
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            
            <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-max overflow-x-auto max-w-full custom-scrollbar">
              <button 
                onClick={() => setActiveTab('subscriptions')}
                className={`px-5 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === 'subscriptions' ? 'bg-white text-[#002147] shadow-sm' : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                My Subscriptions
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-5 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === 'orders' ? 'bg-white text-[#002147] shadow-sm' : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                Standard Orders
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-5 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'settings' ? 'bg-white text-[#002147] shadow-sm' : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                <Settings size={14} /> Settings
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* --- SUBSCRIPTIONS TAB --- */}
              {activeTab === 'subscriptions' && (
                <motion.div key="subs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-[#1A1A1A]">Active Routines</h2>
                    <Link to="/availability" className="text-xs font-black text-[#002147] uppercase tracking-widest hover:text-[#9e111a] flex items-center gap-1 transition-colors">
                      <CalendarDays size={14}/> New Plan
                    </Link>
                  </div>
                  {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#002147] mb-4"></div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
                    </div>
                  ) : subscriptions.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100 border-dashed text-center px-6">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <CalendarDays size={32} />
                      </div>
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-2">No Active Routines</h3>
                      <p className="text-gray-500 text-sm mb-6 max-w-sm">You haven't set up any recurring farm-fresh deliveries yet.</p>
                      <Link to="/availability" className="bg-[#002147] text-[#E2B254] px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#1A1A1A] transition-colors shadow-lg">
                        Create a Schedule
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {subscriptions.map((sub, idx) => (
                        <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                          <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                  sub.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {sub.status === 'Active' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                  {sub.status}
                                </span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                  {sub.plan_type} Plan
                                </span>
                              </div>
                              <h3 className="text-xl font-black text-[#1A1A1A] mt-2">{sub.sub_id}</h3>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Weekly Cost</p>
                              <p className="text-2xl font-black text-[#9e111a] tracking-tight">NPR {parseFloat(sub.weekly_total_cost).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                              <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#002147] mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Zone</p>
                                  <p className="text-sm font-bold text-[#1A1A1A]">{sub.location}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Clock size={18} className="text-[#E2B254] mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timing</p>
                                  <p className="text-sm font-bold text-[#1A1A1A] capitalize">{sub.delivery_time} Route</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-gray-100">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Delivery Days</p>
                              <div className="flex flex-wrap gap-2">
                                {sub.days && sub.days.length > 0 ? sub.days.map(day => (
                                  <span key={day} className="bg-white border border-gray-200 text-[#002147] font-black text-xs px-4 py-2 rounded-xl shadow-sm">
                                    {day}
                                  </span>
                                )) : <span className="text-xs text-gray-400 font-bold">No days assigned</span>}
                              </div>
                            </div>
                          </div>
                          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button 
                              onClick={() => setSelectedSub(sub)}
                              className="px-5 py-2.5 bg-[#002147] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
                            >
                              Manage <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- ORDERS TAB --- */}
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-[#1A1A1A]">Order History</h2>
                    <Link to="/products" className="text-xs font-black text-[#002147] uppercase tracking-widest hover:text-[#9e111a] flex items-center gap-1 transition-colors">
                      <Package size={14}/> Shop Now
                    </Link>
                  </div>
                  {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#002147] mb-4"></div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100 border-dashed text-center px-6">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <Package size={32} />
                      </div>
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-2">No Past Orders</h3>
                      <p className="text-gray-500 text-sm mb-6 max-w-sm">You haven't placed any standard one-time orders yet.</p>
                      <Link to="/products" className="bg-[#002147] text-[#E2B254] px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#1A1A1A] transition-colors shadow-lg">
                        Browse Shop
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order, idx) => (
                        <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all hover:shadow-md">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg font-black text-[#1A1A1A]">Order #{order.id}</span>
                              <OrderBadge status={order.order_status} />
                              <PaymentBadge status={order.payment_status} />
                            </div>
                            <p className="text-sm font-bold text-gray-500 mb-4">
                              Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-xl font-black text-[#9e111a]">NPR {parseFloat(order.total_amount).toLocaleString()}</p>
                          </div>

                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="w-full sm:w-auto px-6 py-3 bg-gray-50 border border-gray-200 text-[#002147] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors flex justify-center items-center gap-2 shrink-0"
                          >
                            <Receipt size={16} /> View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- SETTINGS TAB --- */}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-[#1A1A1A]">Profile Settings</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">Update your account information and security credentials.</p>
                  </div>

                  <div className="space-y-8">
                    {/* Basic Info Form */}
                    <form onSubmit={handleProfileUpdate} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <User className="text-[#002147]" size={20} />
                        <h3 className="text-lg font-black text-[#1A1A1A]">Personal Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={profileData.name}
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                            className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-sm text-[#1A1A1A] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                          <input 
                            type="text" 
                            value={profileData.phone}
                            onChange={e => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-sm text-[#1A1A1A] transition-colors"
                          />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Delivery Address</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Enter your complete delivery address"
                            value={profileData.address}
                            onChange={e => setProfileData({...profileData, address: e.target.value})}
                            className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-sm text-[#1A1A1A] transition-colors"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Email Address (Read-only)</label>
                          <input 
                            type="email" 
                            disabled
                            value={user.email}
                            className="w-full p-4 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold text-sm text-gray-400 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button type="submit" disabled={isUpdatingProfile} className="bg-[#002147] text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#1A1A1A] transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
                          {isUpdatingProfile ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                        </button>
                      </div>
                    </form>

                    {/* Password Form */}
                    <form onSubmit={handlePasswordUpdate} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <Lock className="text-[#9e111a]" size={20} />
                        <h3 className="text-lg font-black text-[#1A1A1A]">Security & Password</h3>
                      </div>
                      
                      <div className="space-y-6 max-w-lg">
                        <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Current Password</label>
                          <input 
                            type="password" 
                            required
                            value={passwordData.current_password}
                            onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                            className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#9e111a] font-bold text-sm text-[#1A1A1A] transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">New Password</label>
                            <input 
                              type="password" 
                              required
                              minLength={8}
                              value={passwordData.new_password}
                              onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                              className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#9e111a] font-bold text-sm text-[#1A1A1A] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Confirm New</label>
                            <input 
                              type="password" 
                              required
                              minLength={8}
                              value={passwordData.confirm_password}
                              onChange={e => setPasswordData({...passwordData, confirm_password: e.target.value})}
                              className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#9e111a] font-bold text-sm text-[#1A1A1A] transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button type="submit" disabled={isUpdatingPassword} className="bg-[#9e111a] text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#1A1A1A] transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
                          {isUpdatingPassword ? 'Updating...' : <><Lock size={16} /> Update Password</>}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* GLOBAL TOAST NOTIFICATION                            */}
      {/* ==================================================== */}
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

      {/* ==================================================== */}
      {/* CUSTOM CONFIRMATION MODAL                            */}
      {/* ==================================================== */}
      <AnimatePresence>
        {confirmDialog.visible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#1A1A1A] mb-2">Confirm Action</h3>
              <p className="text-gray-500 font-medium mb-8">{confirmDialog.message}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setConfirmDialog({ visible: false, message: '', onConfirm: null })}
                  className="w-full py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-black text-xs uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDialog.onConfirm}
                  className="w-full py-3 bg-[#002147] text-white hover:bg-[#1A1A1A] rounded-xl font-black text-xs uppercase tracking-widest transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* DETAILS MODALS (RENDERED ON TOP)                     */}
      {/* ==================================================== */}
      <AnimatePresence>
        
        {/* --- ORDER DETAILS MODAL --- */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-[#1A1A1A]">Order #{selectedOrder.id}</h2>
                  <p className="text-sm font-bold text-gray-500 mt-1">
                    {new Date(selectedOrder.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#9e111a] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Status</p>
                    <OrderBadge status={selectedOrder.order_status} />
                  </div>
                  <div className="flex-1 border-l border-gray-200 pl-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                    <PaymentBadge status={selectedOrder.payment_status} />
                  </div>
                  <div className="flex-1 border-l border-gray-200 pl-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Method</p>
                    <span className="text-xs font-black uppercase text-[#002147] tracking-wider">{selectedOrder.payment_method || 'N/A'}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Purchased Items</h3>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500">
                        <tr>
                          <th className="p-4 font-black">Item</th>
                          <th className="p-4 font-black text-center">Qty</th>
                          <th className="p-4 font-black text-right">Price</th>
                          <th className="p-4 font-black text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm">
                        {selectedOrder.items && selectedOrder.items.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 font-bold text-[#1A1A1A]">{item.name}</td>
                            <td className="p-4 font-bold text-gray-500 text-center">x{item.quantity}</td>
                            <td className="p-4 font-bold text-gray-500 text-right">NPR {parseFloat(item.price).toLocaleString()}</td>
                            <td className="p-4 font-black text-[#002147] text-right">NPR {(parseFloat(item.price) * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Delivery Information</h3>
                    <p className="font-bold text-sm text-[#1A1A1A] mb-1">{user.name}</p>
                    <p className="font-bold text-sm text-gray-500 mb-1">{user.phone}</p>
                    <p className="font-bold text-sm text-gray-500">{user.address}</p>
                  </div>
                  <div className="bg-[#9e111a]/5 p-5 rounded-2xl border border-[#9e111a]/10 flex flex-col justify-end text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Grand Total</p>
                    <p className="text-3xl font-black text-[#9e111a]">NPR {parseFloat(selectedOrder.total_amount).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* --- SUBSCRIPTION MANAGE MODAL --- */}
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedSub(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#002147] text-white">
                <div>
                  <h2 className="text-2xl font-black">Manage Routine</h2>
                  <p className="text-xs font-bold text-white/70 tracking-widest uppercase mt-1">
                    ID: {selectedSub.sub_id}
                  </p>
                </div>
                <button onClick={() => setSelectedSub(null)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                
                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Activity className={selectedSub.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'} size={24} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                    <p className={`text-lg font-black uppercase ${selectedSub.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedSub.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Plan Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Type</p>
                        <p className="font-bold text-sm text-[#1A1A1A]">{selectedSub.plan_type} Plan</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Weekly Cost</p>
                        <p className="font-black text-sm text-[#9e111a]">NPR {parseFloat(selectedSub.weekly_total_cost).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Delivery Zone</p>
                        <p className="font-bold text-sm text-[#1A1A1A]">{selectedSub.location}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Time Route</p>
                        <p className="font-bold text-sm text-[#1A1A1A] capitalize">{selectedSub.delivery_time}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Schedule</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSub.days && selectedSub.days.length > 0 ? selectedSub.days.map(day => (
                        <span key={day} className="bg-gray-100 text-[#002147] font-black text-xs px-3 py-1.5 rounded-lg">
                          {day}
                        </span>
                      )) : <span className="text-xs text-gray-400 font-bold">No days assigned</span>}
                    </div>
                  </div>

                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-gray-100 text-center">
                    <p className="text-xs font-bold text-gray-500">
                      To modify the products in your routine, please pause this subscription and create a new one.
                    </p>
                  </div>
                </div>

                {/* DYNAMIC PAUSE/RESUME BUTTON */}
                <div className="pt-6 border-t border-gray-100">
                  {selectedSub.status === 'Active' ? (
                    <button 
                      onClick={() => handleToggleSubscriptionStatus('Paused')}
                      className="w-full py-3.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <PauseCircle size={16} /> Pause Routine
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleToggleSubscriptionStatus('Active')}
                      className="w-full py-3.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <Play size={16} /> Resume Routine
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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