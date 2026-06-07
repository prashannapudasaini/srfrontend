import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  User, Mail, Phone, MapPin, CalendarDays, Clock, 
  Package, Crown, CheckCircle2, XCircle, LogOut, ArrowRight, Truck, Settings, Lock, Save
} from 'lucide-react';

export default function OrderHistoryPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions', 'orders', or 'settings'
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Settings State
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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
      setProfileData({ name: user.name || '', phone: user.phone || '' });
    }

    const fetchMyData = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const [subRes, orderRes] = await Promise.all([
          api.get(`/user/my-subscriptions.php?user_id=${user.id}`),
          api.get(`/user/my-orders.php?user_id=${user.id}`)
        ]);

        if (subRes.data.status === 'success') setSubscriptions(subRes.data.data);
        if (orderRes.data.status === 'success') setOrders(orderRes.data.data);
        
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyData();
  }, [isAuthenticated, navigate, user]);

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
        phone: profileData.phone
      });
      if (res.data.status === 'success') {
        alert("Profile updated! The page will refresh to apply changes.");
        window.location.reload(); // Reload to refresh user context
      } else {
        alert(res.data.message || "Failed to update profile.");
      }
    } catch (err) {
      alert("Network error occurred.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      return alert("New passwords do not match!");
    }
    if (passwordData.new_password.length < 8) {
      return alert("Password must be at least 8 characters.");
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
        alert("Password updated successfully! Please log in again.");
        handleLogout();
      } else {
        alert(res.data.message || "Failed to update password.");
      }
    } catch (err) {
      alert("Network error occurred.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Helper Badges for Orders
  const PaymentBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'pending';
    if (normalized === 'completed') return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><CheckCircle2 size={12}/> Paid</span>;
    if (normalized === 'failed') return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><XCircle size={12}/> Failed</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-[9px] font-black uppercase tracking-widest"><Clock size={12}/> Pending</span>;
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-[#002147] tracking-tight">
            My Account
          </h1>
          <p className="text-gray-500 font-medium mt-2">Manage your subscriptions, track orders, and configure profile settings.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: User Profile & VIP Card */}
          <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col gap-6 sticky top-28">
            
            {/* VIP Profile Card */}
            <div className={`rounded-[2rem] overflow-hidden shadow-xl border ${isVipUnlocked ? 'border-gray-800 bg-gradient-to-b from-[#1A1A1A] to-black' : 'border-gray-100 bg-[#002147]'}`}>
              {/* Header/Avatar */}
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

              {/* VIP Tracker */}
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

            {/* Contact Info Card */}
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
            
            {/* Tabs */}
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

            {/* Content Area */}
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
                          {/* Card Header */}
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

                          {/* Card Body */}
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

                          {/* Card Footer */}
                          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button className="px-5 py-2.5 bg-[#002147] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors flex items-center gap-2">
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
                        <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8">
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-6">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #{order.id}</p>
                              <p className="text-sm font-bold text-[#1A1A1A]">
                                {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <PaymentBadge status={order.payment_status} />
                              <OrderBadge status={order.order_status} />
                            </div>
                          </div>

                          <div className="space-y-3 mb-6">
                            {order.items && order.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="font-bold text-[#1A1A1A]">{item.name} <span className="text-gray-400 font-medium text-xs ml-1">x{item.quantity}</span></span>
                                <span className="font-black text-gray-600">NPR {parseFloat(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-end bg-gray-50 p-4 rounded-xl">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                            <span className="text-xl font-black text-[#9e111a]">NPR {parseFloat(order.total_amount).toLocaleString()}</span>
                          </div>
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
      
      {/* Shine Animation for VIP Card */}
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