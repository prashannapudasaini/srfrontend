import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  User, Mail, Phone, MapPin, CalendarDays, Clock, 
  Package, Crown, CheckCircle2, XCircle, LogOut, ArrowRight, 
  Truck, Settings, Lock, Save, X, Receipt, Activity, 
  PauseCircle, Play, AlertTriangle, Bell, ChevronRight, 
  Banknote, CreditCard, Eye, Sparkles
} from 'lucide-react';

// SAFE HELPER FUNCTIONS
const formatSafeDate = (dateStr) => {
  if (!dateStr) return 'Recent';
  try {
    const safeStr = typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr;
    const d = new Date(safeStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

const formatCurrency = (amt) => {
  const num = Number(amt || 0);
  return isNaN(num) ? '0' : num.toLocaleString();
};

export default function OrderHistoryPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); 
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // NOTIFICATIONS STATE (Persistent until acknowledged)
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifications = notifications.filter(n => parseInt(n.is_read) === 0);
  const unreadCount = unreadNotifications.length;
  const latestUnread = unreadNotifications[0]; // Persistent popup

  // SETTINGS STATE
  const [profileData, setProfileData] = useState({ name: '', phone: '', address: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // MODAL STATES
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  // TOAST & CONFIRMATION DIALOG
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ visible: false, message: '', onConfirm: null });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3500);
  };

  // VIP LOGIC
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
          api.get(`/user/my-subscription.php?user_id=${user.id}`).catch(() => ({ data: { status: 'error', data: [] } })),
          api.get(`/user/my-orders.php?user_id=${user.id}`).catch(() => ({ data: { status: 'error', data: [] } })),
          api.get(`/user/notifications.php?user_id=${user.id}`).catch(() => ({ data: { status: 'error', data: [] } }))
        ]);

        if (subRes?.data?.data) {
          setSubscriptions(subRes.data.data);
        } else if (Array.isArray(subRes?.data)) {
          setSubscriptions(subRes.data);
        }

        if (orderRes?.data?.data) {
          setOrders(orderRes.data.data);
        } else if (Array.isArray(orderRes?.data)) {
          setOrders(orderRes.data);
        }

        if (notifRes?.data?.data) {
          setNotifications(notifRes.data.data);
        } else if (Array.isArray(notifRes?.data)) {
          setNotifications(notifRes.data);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyData();
  }, [isAuthenticated, navigate, user]);

  // Explicit read acknowledgment
  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    try {
      await api.post('/user/mark-notifications-read.php', { user_id: user.id });
    } catch (e) {
      console.error("Could not sync read status");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // PROFILE & ADDRESS UPDATE
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
        const updatedUser = { 
          ...user, 
          name: profileData.name, 
          phone: profileData.phone, 
          address: profileData.address 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showToast("Profile and address updated successfully!", 'success');
        setTimeout(() => window.location.reload(), 1200); 
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
    if (normalized === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 size={14} /> Paid
        </span>
      );
    }
    if (normalized === 'failed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200/80 rounded-md text-xs font-bold uppercase tracking-wider">
          <XCircle size={14} /> Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-md text-xs font-bold uppercase tracking-wider">
        <Clock size={14} /> Pending
      </span>
    );
  };

  const OrderBadge = ({ status }) => {
    const normalized = status?.toLowerCase()?.replace(/\s+/g, '_') || 'processing';
    
    switch (normalized) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={14} /> Delivered
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-md text-xs font-bold uppercase tracking-wider animate-pulse">
            <Truck size={14} /> Out For Delivery
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-md text-xs font-bold uppercase tracking-wider">
            <Package size={14} /> Dispatched
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200/80 rounded-md text-xs font-bold uppercase tracking-wider">
            <XCircle size={14} /> Cancelled
          </span>
        );
      case 'processing':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-md text-xs font-bold uppercase tracking-wider">
            <Clock size={14} /> Processing
          </span>
        );
    }
  };

  const renderItemsSummary = (items) => {
    if (!items || items.length === 0) return <span className="text-gray-400 italic text-sm">No items listed</span>;
    const summary = items.slice(0, 2).map(i => `${i.name || i.product_name} (x${i.quantity})`).join(', ');
    const extra = items.length > 2 ? ` + ${items.length - 2} more` : '';
    return <span className="text-sm font-semibold text-gray-700">{summary} <span className="text-gray-400 text-xs">{extra}</span></span>;
  };

  if (!user) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-20 font-sans text-[#1A1A1A]">
      
      {/* PERSISTENT FLOATING NOTIFICATION ALERT */}
      <AnimatePresence>
        {latestUnread && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#002147] text-white p-5 rounded-2xl shadow-2xl border-2 border-[#E2B254]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-[#E2B254] text-sm font-black uppercase tracking-wider">
                <Bell size={18} className="animate-bounce" /> New Alert From Farm
              </div>
              <button 
                onClick={handleMarkAllRead}
                className="text-gray-300 hover:text-white text-sm font-bold underline shrink-0"
              >
                Dismiss
              </button>
            </div>
            <p className="font-black text-base mt-2">{latestUnread.title?.replace(/_/g, ' ')}</p>
            <p className="text-sm text-gray-200 mt-1.5 leading-relaxed">{latestUnread.message}</p>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => {
                  handleMarkAllRead();
                  setShowNotifications(true);
                }}
                className="bg-[#E2B254] text-[#002147] px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider hover:bg-white transition-colors"
              >
                Acknowledge & View
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center relative z-40">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-[#002147] tracking-tight">
              My Account
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">Manage your routines, track deliveries, and update address credentials.</p>
          </div>

          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) handleMarkAllRead();
              }}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-200/80 hover:border-[#002147] transition-all relative"
            >
              <Bell size={22} className="text-[#002147]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#9e111a] text-white text-xs font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION TRAY */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[460px] z-50 origin-top-right"
                >
                  <div className="bg-[#002147] p-4 text-white flex justify-between items-center shrink-0">
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider">Dispatch Alerts</h3>
                      <p className="text-xs text-blue-200 mt-0.5">Real-time delivery updates</p>
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto custom-scrollbar bg-gray-50/50 flex-grow">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center justify-center">
                        <Bell size={32} className="text-gray-300 mb-3" />
                        <p className="text-base font-semibold text-gray-600">No recent alerts</p>
                        <p className="text-sm text-gray-400 mt-1">We'll notify you when your orders move.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map(n => (
                          <div key={n.id} className="p-4 bg-white hover:bg-gray-50/80 transition-colors relative">
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${n.title?.toLowerCase().includes('delivered') ? 'bg-emerald-500' : 'bg-[#E2B254]'}`}></div>
                            <div className="pl-3">
                              <div className="flex justify-between items-start mb-1.5">
                                <p className="text-sm font-bold text-[#1A1A1A]">
                                  {n.title?.replace(/_/g, ' ')}
                                </p>
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded">
                                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">{n.message}</p>
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
          
          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 sticky top-24">
            
            {/* VIP Card */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-800 bg-gradient-to-br from-[#001D3D] via-[#002147] to-[#0A192F] text-white p-6 relative">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-[#E2B254] border border-white/20 shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#E2B254]">
                      {isVipUnlocked ? 'VIP Member' : 'Farm Member'}
                    </span>
                    {isVipUnlocked && <Crown size={15} className="text-[#E2B254]" />}
                  </div>
                  <h2 className="text-lg font-bold truncate mt-0.5">{profileData.name || user.name}</h2>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-300 text-xs font-medium">VIP Progress</span>
                  <span className="font-bold text-[#E2B254] text-sm">{loyaltyCount} / {LOYALTY_GOAL}</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-2.5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progressPercentage}%` }} 
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#E2B254] to-[#f4d081]"
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-300 leading-tight">
                  {isVipUnlocked ? 'You have unlocked lifetime VIP perks!' : `Only ${LOYALTY_GOAL - loyaltyCount} more orders to unlock Gold VIP.`}
                </p>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact Details</h3>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="text-sm font-semibold text-[#002147] hover:underline flex items-center gap-1"
                >
                  Edit <ChevronRight size={15} />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Email</p>
                    <p className="font-medium text-base text-gray-800 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Phone</p>
                    <p className="font-medium text-base text-gray-800">{profileData.phone || user.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Delivery Address</p>
                    <p className="font-medium text-base text-gray-800">{profileData.address || user.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout} 
                  className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 min-w-0">
            
            {/* SEGMENTED TAB NAVIGATION */}
            <div className="flex p-1.5 bg-gray-200/60 rounded-xl mb-6 w-max max-w-full overflow-x-auto">
              {[
                { id: 'orders', label: 'Standard Orders', icon: Package },
                { id: 'subscriptions', label: 'My Subscriptions', icon: CalendarDays },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-white text-[#002147] shadow-sm' 
                        : 'text-gray-600 hover:text-[#1A1A1A]'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[#002147]' : 'text-gray-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">Standard Orders</h2>
                    <Link to="/products" className="text-sm font-bold text-[#002147] hover:underline flex items-center gap-1">
                      Shop Products <ChevronRight size={16} />
                    </Link>
                  </div>

                  {isLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200/80">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#002147] mb-3"></div>
                      <p className="text-gray-500 font-semibold text-sm">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200/80 text-center px-6">
                      <Package size={40} className="text-gray-300 mb-3" />
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1.5">No Past Orders</h3>
                      <p className="text-gray-500 text-sm mb-5 max-w-sm">You haven't placed any one-time standard deliveries yet.</p>
                      <Link to="/products" className="bg-[#002147] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#001A3A] transition-colors shadow-sm">
                        Browse Dairy Products
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                          <thead className="bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                            <tr>
                              <th className="py-4 px-5 pl-6">Order #</th>
                              <th className="py-4 px-5">Date Placed</th>
                              <th className="py-4 px-5">Items Summary</th>
                              <th className="py-4 px-5">Payment</th>
                              <th className="py-4 px-5">Order Status</th>
                              <th className="py-4 px-5 pr-6 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {orders.map((order, idx) => (
                              <tr 
                                key={idx} 
                                onClick={() => setSelectedOrder(order)}
                                className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                              >
                                <td className="py-4 px-5 pl-6 font-black text-sm text-[#002147]">
                                  #{order.id}
                                </td>
                                <td className="py-4 px-5 text-sm font-medium text-gray-600">
                                  {formatSafeDate(order.created_at)}
                                </td>
                                <td className="py-4 px-5 max-w-xs truncate whitespace-normal leading-tight">
                                  <div className="flex items-center gap-2">
                                    <Package size={16} className="text-gray-400 shrink-0" />
                                    {renderItemsSummary(order.items)}
                                  </div>
                                </td>
                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                    {order.payment_method?.toLowerCase() === 'cod' ? (
                                      <><Banknote size={15} className="text-gray-400"/> COD</>
                                    ) : (
                                      <><CreditCard size={15} className="text-gray-400"/> ConnectIPS</>
                                    )}
                                  </div>
                                  <p className="text-sm font-black text-[#9e111a] mt-1">NPR {formatCurrency(order.total_amount)}</p>
                                </td>
                                <td className="py-4 px-5">
                                  <OrderBadge status={order.order_status} />
                                </td>
                                <td className="py-4 px-5 pr-6 text-right">
                                  <button className="px-3 py-1.5 bg-gray-50 border border-gray-200/80 text-[#002147] hover:bg-[#002147] hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5">
                                    <Eye size={14} /> View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SUBSCRIPTIONS TAB */}
              {activeTab === 'subscriptions' && (
                <motion.div key="subs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">Active Routines</h2>
                    <Link to="/availability" className="text-sm font-bold text-[#002147] hover:underline flex items-center gap-1">
                      New Plan <ChevronRight size={16} />
                    </Link>
                  </div>

                  {isLoading ? (
                    <div className="py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200/80">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#002147] mb-3"></div>
                      <p className="text-gray-500 font-semibold text-sm">Loading routines...</p>
                    </div>
                  ) : subscriptions.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200/80 text-center px-6">
                      <CalendarDays size={40} className="text-gray-300 mb-3" />
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1.5">No Active Routines</h3>
                      <p className="text-gray-500 text-sm mb-5 max-w-sm">You haven't set up any recurring farm-fresh deliveries yet.</p>
                      <Link to="/availability" className="bg-[#002147] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#001A3A] transition-colors shadow-sm">
                        Create a Schedule
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions.map((sub, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden">
                          {/* Slimmer Header */}
                          <div className="py-3 px-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                                  sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                                }`}>
                                  {sub.status === 'Active' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                                  {sub.status}
                                </span>
                                <span className="text-[11px] font-bold text-gray-500 bg-gray-200/60 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                                  {sub.plan_type} Plan
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-[#1A1A1A] leading-none mt-1.5">{sub.sub_id}</h3>
                            </div>

                            <div className="text-left sm:text-right mt-1 sm:mt-0">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Weekly Cost</p>
                              <p className="text-xl font-black text-[#9e111a] leading-none">NPR {formatCurrency(sub.weekly_total_cost)}</p>
                            </div>
                          </div>

                          {/* Slimmer Body */}
                          <div className="py-3 px-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm">
                              <div className="flex items-center gap-2.5">
                                <MapPin size={16} className="text-[#002147] shrink-0" />
                                <div className="flex items-baseline gap-2">
                                  <p className="text-xs font-bold text-gray-400 uppercase">Zone:</p>
                                  <p className="font-semibold text-gray-800">{sub.location}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <Clock size={16} className="text-[#E2B254] shrink-0" />
                                <div className="flex items-baseline gap-2">
                                  <p className="text-xs font-bold text-gray-400 uppercase">Timing:</p>
                                  <p className="font-semibold text-gray-800 capitalize">{sub.delivery_time} Route</p>
                                </div>
                              </div>
                            </div>

                            {/* Compact Delivery Days Box */}
                            <div className="bg-gray-50/80 rounded-xl px-3 py-2 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                              <p className="text-xs font-bold text-gray-400 uppercase shrink-0">Delivery Days</p>
                              <div className="flex flex-wrap gap-1.5">
                                {sub.days && sub.days.length > 0 ? sub.days.map(day => (
                                  <span key={day} className="bg-white border border-gray-200/80 text-[#002147] font-semibold text-xs px-3 py-1 rounded-md shadow-sm">
                                    {day}
                                  </span>
                                )) : <span className="text-sm text-gray-500 font-medium">No days assigned</span>}
                              </div>
                            </div>
                          </div>

                          {/* Slimmer Footer */}
                          <div className="py-2.5 px-5 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                            <button 
                              onClick={() => setSelectedSub(sub)}
                              className="px-4 py-2 bg-[#002147] text-white rounded-lg text-sm font-bold hover:bg-[#001A3A] transition-colors flex items-center gap-1.5"
                            >
                              Manage Routine <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">Profile Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your account details and delivery credentials.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Info Form */}
                    <form onSubmit={handleProfileUpdate} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
                      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <User className="text-[#002147]" size={20} />
                        <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Personal Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-1.5">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={profileData.name}
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#002147] text-sm font-medium text-[#1A1A1A]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-1.5">Phone Number</label>
                          <input 
                            type="text" 
                            value={profileData.phone}
                            onChange={e => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#002147] text-sm font-medium text-[#1A1A1A]"
                          />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-bold text-gray-600 mb-1.5">Delivery Address</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Enter your complete delivery address"
                            value={profileData.address}
                            onChange={e => setProfileData({...profileData, address: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#002147] text-sm font-medium text-[#1A1A1A]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-bold text-gray-600 mb-1.5">Email Address (Read-only)</label>
                          <input 
                            type="email" 
                            disabled
                            value={user.email}
                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-medium text-gray-400 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button 
                          type="submit" 
                          disabled={isUpdatingProfile} 
                          className="bg-[#002147] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#001A3A] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                          {isUpdatingProfile ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                        </button>
                      </div>
                    </form>

                    {/* Password Form */}
                    <form onSubmit={handlePasswordUpdate} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
                      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <Lock className="text-[#9e111a]" size={20} />
                        <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Security & Password</h3>
                      </div>
                      
                      <div className="space-y-5 max-w-lg">
                        <div>
                          <label className="block text-sm font-bold text-gray-600 mb-1.5">Current Password</label>
                          <input 
                            type="password" 
                            required
                            value={passwordData.current_password}
                            onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#002147] text-sm font-medium text-[#1A1A1A]"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1.5">New Password</label>
                            <input 
                              type="password" 
                              required
                              minLength={8}
                              value={passwordData.new_password}
                              onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#002147] text-sm font-medium text-[#1A1A1A]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1.5">Confirm New</label>
                            <input 
                              type="password" 
                              required
                              minLength={8}
                              value={passwordData.confirm_password}
                              onChange={e => setPasswordData({...passwordData, confirm_password: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#002147] text-sm font-medium text-[#1A1A1A]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button 
                          type="submit" 
                          disabled={isUpdatingPassword} 
                          className="bg-[#9e111a] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#7e0e15] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
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

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[100] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border ${
              toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-900 text-white border-gray-800'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} className="text-emerald-400" />}
            <p className="font-semibold text-sm">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION DIALOG */}
      <AnimatePresence>
        {confirmDialog.visible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setConfirmDialog({ visible: false, message: '', onConfirm: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 text-center"
            >
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4">
                <AlertTriangle size={26} />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-1.5">Confirm Action</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">{confirmDialog.message}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setConfirmDialog({ visible: false, message: '', onConfirm: null })}
                  className="w-full py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDialog.onConfirm}
                  className="w-full py-2.5 bg-[#002147] text-white hover:bg-[#001A3A] rounded-xl font-bold text-sm transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Order #{selectedOrder.id}</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">
                    {formatSafeDate(selectedOrder.created_at)}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex-1 min-w-[120px]">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Order Status</p>
                    <OrderBadge status={selectedOrder.order_status} />
                  </div>
                  <div className="flex-1 min-w-[100px] border-l border-gray-200/80 pl-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Payment</p>
                    <PaymentBadge status={selectedOrder.payment_status} />
                  </div>
                  <div className="flex-1 min-w-[100px] border-l border-gray-200/80 pl-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Method</p>
                    <span className="text-sm font-bold uppercase text-[#002147]">{selectedOrder.payment_method || 'N/A'}</span>
                  </div>
                </div>

                {/* 4-STEP DELIVERY PROGRESS TRACKER */}
                {selectedOrder.order_status?.toLowerCase() !== 'cancelled' && (
                  <div className="mb-6 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Delivery Progress</p>
                    <div className="flex items-center justify-between relative px-4">
                      <div className="absolute left-8 right-8 top-3.5 h-1 bg-gray-200 -z-0"></div>
                      {[
                        { label: 'Processing', key: 'processing' },
                        { label: 'Dispatched', key: 'dispatched' },
                        { label: 'Out for Delivery', key: 'out_for_delivery' },
                        { label: 'Delivered', key: 'delivered' }
                      ].map((step, idx) => {
                        const statuses = ['processing', 'dispatched', 'out_for_delivery', 'delivered'];
                        const currentIdx = statuses.indexOf(selectedOrder.order_status?.toLowerCase()?.replace(/\s+/g, '_') || 'processing');
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={step.key} className="flex flex-col items-center z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                              isCompleted 
                                ? 'bg-[#002147] border-[#002147] text-white shadow-sm' 
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span className={`text-xs font-semibold mt-2 ${
                              isCurrent ? 'text-[#002147] font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Purchased Items</h3>
                  <div className="border border-gray-200/80 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-400">
                        <tr>
                          <th className="p-4">Item</th>
                          <th className="p-4 text-center">Qty</th>
                          <th className="p-4 text-right">Price</th>
                          <th className="p-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {selectedOrder.items && selectedOrder.items.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50/50">
                            <td className="p-4 font-semibold text-[#1A1A1A]">{item.name}</td>
                            <td className="p-4 text-gray-500 text-center">x{item.quantity}</td>
                            <td className="p-4 text-gray-500 text-right">NPR {formatCurrency(item.price)}</td>
                            <td className="p-4 font-bold text-[#002147] text-right">NPR {formatCurrency(Number(item.price) * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Delivery Details</h3>
                    <p className="font-semibold text-sm text-[#1A1A1A] mb-1">{profileData.name || user.name}</p>
                    <p className="font-medium text-sm text-gray-500 mb-1">{profileData.phone || user.phone}</p>
                    <p className="font-medium text-sm text-gray-500">{profileData.address || user.address}</p>
                  </div>
                  <div className="bg-red-50/40 p-5 rounded-2xl border border-red-100/60 flex flex-col justify-end text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Grand Total</p>
                    <p className="text-2xl font-black text-[#9e111a]">NPR {formatCurrency(selectedOrder.total_amount)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* SUBSCRIPTION MANAGE MODAL */}
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedSub(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#002147] text-white">
                <div>
                  <h2 className="text-xl font-bold">Manage Routine</h2>
                  <p className="text-xs font-medium text-blue-200 mt-1">
                    ID: {selectedSub.sub_id}
                  </p>
                </div>
                <button onClick={() => setSelectedSub(null)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex items-center gap-3.5 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Activity className={selectedSub.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'} size={24} />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Status</p>
                    <p className={`text-base font-bold uppercase mt-0.5 ${selectedSub.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedSub.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 mb-8 text-sm">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Plan Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Type</p>
                        <p className="font-bold text-[#1A1A1A] mt-0.5">{selectedSub.plan_type} Plan</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Weekly Cost</p>
                        <p className="font-bold text-[#9e111a] mt-0.5">NPR {formatCurrency(selectedSub.weekly_total_cost)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Delivery Zone</p>
                        <p className="font-semibold text-[#1A1A1A] mt-0.5">{selectedSub.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Time Route</p>
                        <p className="font-semibold text-[#1A1A1A] capitalize mt-0.5">{selectedSub.delivery_time}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Schedule</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSub.days && selectedSub.days.length > 0 ? selectedSub.days.map(day => (
                        <span key={day} className="bg-gray-100 text-[#002147] font-semibold text-sm px-3 py-1.5 rounded-lg">
                          {day}
                        </span>
                      )) : <span className="text-gray-400">No days assigned</span>}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                    <p className="text-gray-500 leading-relaxed text-sm">
                      To modify the products in your routine, please pause this subscription and create a new schedule.
                    </p>
                  </div>
                </div>

                {/* PAUSE/RESUME BUTTON */}
                <div className="pt-5 border-t border-gray-100">
                  {selectedSub.status === 'Active' ? (
                    <button 
                      onClick={() => handleToggleSubscriptionStatus('Paused')}
                      className="w-full py-3 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/80 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <PauseCircle size={18} /> Pause Routine
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleToggleSubscriptionStatus('Active')}
                      className="w-full py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <Play size={18} /> Resume Routine
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}