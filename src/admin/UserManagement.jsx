import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, MapPin, X, Phone, Mail, Calendar, Search, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users/index.php');
      if (res.data.status === 'success') {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header & Search */}
      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FDF8E7] rounded-2xl flex items-center justify-center text-[#9e111a] shadow-lg shrink-0">
            <Users size={24}/>
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">User Management</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              {users.length} Total Registered Users
            </p>
          </div>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search name, email, or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white text-sm placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E2B254] transition-all" 
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <tr>
                <th className="p-6">Customer Name</th>
                <th className="p-6">Subscription Status</th>
                <th className="p-6">Joined Date</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <Loader2 className="mx-auto animate-spin text-[#9e111a] mb-3" size={32} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Customers...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <Users className="mx-auto text-gray-200 mb-3" size={40} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No users found.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[14px] bg-[#FDF8E7] text-[#9e111a] border border-[#9e111a]/10 flex items-center justify-center font-black text-lg shadow-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#1A1A1A] text-sm mb-0.5">{user.name}</p>
                          <p className="text-xs font-bold text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {user.is_subscriber > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                          <UserCheck size={14}/> Active Subscriber
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
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- USER DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF9F6] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative"
            >
              {/* Header Profile Area */}
              <div className="bg-white p-8 border-b border-gray-100 relative text-center">
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-200 hover:text-[#1A1A1A] transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="w-24 h-24 bg-gradient-to-br from-[#002147] to-[#00152e] rounded-[2rem] flex items-center justify-center text-[#E2B254] mx-auto mb-5 shadow-lg border border-white">
                  <span className="text-4xl font-serif font-black">{selectedUser.name?.charAt(0).toUpperCase()}</span>
                </div>
                
                <h2 className="text-2xl font-serif font-black text-[#1A1A1A] mb-1">{selectedUser.name}</h2>
                
                {selectedUser.is_subscriber > 0 ? (
                  <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 mt-2">
                    <UserCheck size={12}/> Premium Subscriber
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">
                    Standard Account
                  </span>
                )}
              </div>

              {/* Data Area */}
              <div className="p-8 space-y-4">
                <InfoRow 
                  icon={<Phone size={18} className="text-[#9e111a]" />} 
                  label="Registered Mobile" 
                  value={selectedUser.phone || 'No phone provided'} 
                />
                <InfoRow 
                  icon={<Mail size={18} className="text-[#002147]" />} 
                  label="Email Address" 
                  value={selectedUser.email} 
                />
                <InfoRow 
                  icon={<MapPin size={18} className="text-emerald-600" />} 
                  label="Delivery Address" 
                  value={selectedUser.address || 'No address provided'} 
                />
                <InfoRow 
                  icon={<Calendar size={18} className="text-[#E2B254]" />} 
                  label="Member Since" 
                  value={new Date(selectedUser.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
                />
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable component for the modal data rows
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-[#1A1A1A]">{value}</p>
      </div>
    </div>
  );
}