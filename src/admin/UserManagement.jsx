import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, MapPin, X, Phone, Mail, Calendar, Search, Loader2, ShieldAlert, Truck, Key, Trash2, Plus, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function UserManagement() {
  const { user: currentAdmin } = useAuth(); 
  const isSuperAdmin = currentAdmin?.can_create_admins === 1;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('customer');

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users/index.php');
      if (res.data.status === 'success') {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // --- DYNAMIC OVERVIEW METRICS ---
  const overviewMetrics = useMemo(() => {
    const customers = users.filter(u => (u.role || 'customer') === 'customer');
    const subscribers = users.filter(u => u.is_subscriber > 0);
    const delivery = users.filter(u => u.role === 'delivery');
    const admins = users.filter(u => u.role === 'admin');

    return [
      { title: "Total Customers", count: customers.length, icon: Users, color: "text-[#002147]", bg: "bg-[#002147]/5", border: "border-[#002147]/10" },
      { title: "Active Subscribers", count: subscribers.length, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
      { title: "Delivery Fleet", count: delivery.length, icon: Truck, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
      { title: "System Admins", count: admins.length, icon: ShieldAlert, color: "text-[#9e111a]", bg: "bg-[#9e111a]/5", border: "border-[#9e111a]/10" }
    ];
  }, [users]);

  // Tab Filtering
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery);
      
      const roleMatch = (user.role || 'customer') === activeTab;
      return matchesSearch && roleMatch;
    });
  }, [users, searchQuery, activeTab]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this account? This cannot be undone.")) {
      try {
        await api.delete('/admin/users/staff.php', { data: { id } });
        setSelectedUser(null);
        fetchUsers();
      } catch (e) {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. DYNAMIC OVERVIEW METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((metric, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            key={idx} 
            className={`bg-white p-6 rounded-[2rem] border ${metric.border} shadow-sm flex items-center justify-between group hover:shadow-md transition-all`}
          >
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{metric.title}</p>
              <h3 className={`text-3xl font-black ${metric.color} tracking-tight`}>{metric.count}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${metric.bg} ${metric.color} group-hover:scale-110 transition-transform`}>
              <metric.icon size={22} strokeWidth={2.5} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. HEADER & CONTROLS */}
      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FDF8E7] rounded-2xl flex items-center justify-center text-[#9e111a] shadow-lg shrink-0">
            <TrendingUp size={24}/>
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">Access Management</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Search & Filter Accounts
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search accounts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white text-sm placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E2B254] transition-all" 
            />
          </div>
          {isSuperAdmin && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto bg-[#E2B254] text-[#002147] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors shrink-0 shadow-lg"
            >
              <Plus size={16} /> Add Staff
            </button>
          )}
        </div>
      </div>

      {/* 3. TABS */}
      <div className="flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'customer', label: 'Customers', icon: Users },
          { id: 'delivery', label: 'Delivery Team', icon: Truck },
          { id: 'admin', label: 'Administrators', icon: ShieldAlert }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${
              activeTab === tab.id ? 'bg-[#002147] text-white shadow-md' : 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 4. MAIN TABLE */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="p-6">Name & Contact</th>
                <th className="p-6">Account Status</th>
                <th className="p-6">Joined Date</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <Loader2 className="mx-auto animate-spin text-[#9e111a] mb-3" size={32} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Accounts...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <ShieldAlert className="mx-auto text-gray-200 mb-3" size={40} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No accounts found in this category.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    key={user.id} className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center font-black text-lg shadow-sm ${
                          user.role === 'admin' ? 'bg-[#002147] text-[#E2B254]' :
                          user.role === 'delivery' ? 'bg-blue-100 text-blue-700' : 'bg-[#FDF8E7] text-[#9e111a]'
                        }`}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#1A1A1A] text-sm mb-0.5">{user.name}</p>
                          <p className="text-xs font-bold text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {user.role === 'admin' && user.can_create_admins === 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-widest border border-purple-200">
                          <ShieldAlert size={14}/> Super Admin
                        </span>
                      ) : user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                          <ShieldAlert size={14}/> Admin
                        </span>
                      ) : user.role === 'delivery' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-200">
                          <Truck size={14}/> Logistics
                        </span>
                      ) : user.is_subscriber > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                          <UserCheck size={14}/> Subscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-gray-200">
                          Regular User
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-sm text-gray-600 font-bold">
                      {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="text-[#002147] bg-[#002147]/5 hover:bg-[#002147] hover:text-[#E2B254] px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- USER DETAILS & MANAGEMENT MODAL --- */}
      <AnimatePresence>
        {selectedUser && !isPasswordModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF9F6] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative"
            >
              <div className="bg-white p-8 border-b border-gray-100 relative text-center">
                <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-200 transition-colors">
                  <X size={20} />
                </button>
                <div className="w-20 h-20 bg-gradient-to-br from-[#002147] to-[#00152e] rounded-2xl flex items-center justify-center text-[#E2B254] mx-auto mb-4 shadow-lg border border-white">
                  <span className="text-3xl font-serif font-black">{selectedUser.name?.charAt(0).toUpperCase()}</span>
                </div>
                <h2 className="text-2xl font-serif font-black text-[#1A1A1A] mb-1">{selectedUser.name}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedUser.role || 'Customer'} Account</p>
              </div>

              <div className="p-8 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard icon={<Phone/>} label="Phone" value={selectedUser.phone || 'N/A'} color="text-emerald-600" />
                  <InfoCard icon={<Mail/>} label="Email" value={selectedUser.email} color="text-blue-600" />
                </div>
                <InfoCard icon={<MapPin/>} label="Address" value={selectedUser.address || 'N/A'} color="text-[#9e111a]" />
              </div>

              {/* Administrative Actions */}
              {isSuperAdmin && (
                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-[#002147] hover:text-[#002147] transition-all shadow-sm"
                  >
                    <Key size={14}/> Reset Pass
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="flex-1 bg-red-50 border border-red-100 text-red-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={14}/> Delete
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      {isCreateModalOpen && <CreateStaffModal closeModal={() => setIsCreateModalOpen(false)} refresh={fetchUsers} />}
      {isPasswordModalOpen && <PasswordResetModal userId={selectedUser?.id} closeModal={() => setIsPasswordModalOpen(false)} />}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function InfoCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
      <div className={`mt-0.5 ${color}`}>{React.cloneElement(icon, { size: 16 })}</div>
      <div className="overflow-hidden">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-[#1A1A1A] truncate">{value}</p>
      </div>
    </div>
  );
}

// Create Staff Modal
function CreateStaffModal({ closeModal, refresh }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '', role: 'delivery', can_create_admins: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/admin/users/staff.php', formData);
      if (res.data.status === 'success') {
        refresh();
        closeModal();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Registration failed. Email might already exist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-black text-[#1A1A1A] uppercase tracking-widest">Register Staff</h2>
          <button onClick={closeModal} className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
              <input type="text" required onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phone</label>
              <input type="text" required onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Email</label>
            <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Password</label>
            <input type="text" required onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Account Role</label>
              <select onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-sm bg-white">
                <option value="delivery">Delivery Person</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            {formData.role === 'admin' && (
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="super" onChange={e => setFormData({...formData, can_create_admins: e.target.checked})} className="w-5 h-5 accent-[#002147] rounded" />
                <label htmlFor="super" className="text-xs font-bold text-gray-700 leading-tight">Super Admin<br/><span className="text-[9px] text-gray-400 font-normal">Can create others</span></label>
              </div>
            )}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-[#002147] text-[#E2B254] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#1A1A1A] transition-all disabled:opacity-50">
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Password Reset Modal
function PasswordResetModal({ userId, closeModal }) {
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put('/admin/users/staff.php', { id: userId, new_password: newPassword });
      alert("Password updated successfully.");
      closeModal();
    } catch (e) {
      alert("Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest">Force Password Reset</h2>
          <button onClick={closeModal} className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"><X size={16} /></button>
        </div>
        <form onSubmit={handleReset} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">New Password</label>
            <input type="text" required minLength={8} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#9e111a] font-bold text-sm" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#9e111a] transition-all disabled:opacity-50">
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}