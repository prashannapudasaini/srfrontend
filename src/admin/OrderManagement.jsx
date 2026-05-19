import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { Truck, CheckCircle2, XCircle, Search, MapPin, ShoppingCart, Loader2, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders/index.php');
      if (res.data.status === 'success') {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.id?.toString().includes(searchQuery) || 
      order.registered_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  // Dynamic Status Badge Handler
  const StatusBadge = ({ status }) => {
    const normalizedStatus = status?.toLowerCase() || 'on way';
    
    if (normalizedStatus === 'delivered' || normalizedStatus === 'completed' || normalizedStatus === 'paid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
          <CheckCircle2 size={14} /> Delivered
        </span>
      );
    }
    if (normalizedStatus === 'cancelled' || normalizedStatus === 'failed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-200">
          <XCircle size={14} /> Cancelled
        </span>
      );
    }
    // Default to 'On Way' for pending/processing orders
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-200">
        <Truck size={14} /> On Way
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header & Search */}
      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FDF8E7] rounded-2xl flex items-center justify-center text-[#002147] shadow-lg shrink-0">
            <ShoppingCart size={24}/>
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">Transaction Ledger</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Monitor payments and fulfillment
            </p>
          </div>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E2B254] transition-colors" />
          <input 
            type="text" 
            placeholder="Search Order ID, Customer, Address..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white text-sm font-bold placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#E2B254] transition-all" 
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="p-6">Order ID</th>
                <th className="p-6">Customer Name</th>
                <th className="p-6">Delivery Address</th>
                <th className="p-6">Total Amount</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <Loader2 className="mx-auto animate-spin text-[#002147] mb-3" size={32} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading secure ledger...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <ShoppingCart className="mx-auto text-gray-200 mb-3" size={40} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No orders found.</p>
                  </td>
                </tr>
              ) : filteredOrders.map((order, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  key={order.id} 
                  className="hover:bg-[#FDF8E7]/30 transition-colors group"
                >
                  
                  {/* Column 1: Order ID */}
                  <td className="p-6">
                    <span className="text-[#002147] font-black bg-[#002147]/5 border border-[#002147]/10 px-3 py-1.5 rounded-lg text-sm uppercase tracking-widest">
                      #{order.id}
                    </span>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </td>

                  {/* Column 2: Customer Name */}
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#1A1A1A] font-black text-xs">
                        {(order.registered_name || 'G').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-[#1A1A1A] text-sm mb-1">{order.registered_name || 'Guest User'}</p>
                        {order.is_subscriber > 0 && (
                          <span className="bg-[#E2B254]/20 text-[#9e111a] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1 w-max">
                            <UserCheck size={10}/> Subscriber
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Delivery Address */}
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl w-max">
                      <MapPin size={16} className="text-[#9e111a]" /> 
                      {order.delivery_address || 'No address provided'}
                    </div>
                  </td>

                  {/* Column 4: Total Amount */}
                  <td className="p-6">
                    <p className="text-[#1A1A1A] font-black text-lg tracking-tight">
                      NPR {Number(order.total_amount).toLocaleString()}
                    </p>
                  </td>

                  {/* Column 5: Status */}
                  <td className="p-6">
                    <StatusBadge status={order.payment_status} />
                  </td>

                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}