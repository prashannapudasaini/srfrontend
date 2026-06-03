import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { Truck, CheckCircle2, XCircle, Search, MapPin, ShoppingCart, Loader2, UserCheck, Smartphone, Globe, Info, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New States for Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders/index.php');
      if (res.data.status === 'success') setOrders(res.data.data);
    } catch (error) { console.error("Failed to fetch orders"); }
    finally { setLoading(false); }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.id?.toString().includes(searchQuery) || 
      order.registered_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  // --- HELPER COMPONENTS ---

  const StatusBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'on way';
    const styles = {
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200"
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${styles[normalized] || "bg-blue-50 text-blue-700 border-blue-200"}`}>
        {normalized === 'delivered' ? <CheckCircle2 size={14} /> : normalized === 'cancelled' ? <XCircle size={14} /> : <Truck size={14} />} 
        {normalized}
      </span>
    );
  };

  // Badge for App vs Web
  const SourceBadge = ({ source }) => (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-[9px] font-bold uppercase text-gray-600">
      {source === 'app' ? <Smartphone size={12} /> : <Globe size={12} />}
      {source || 'web'}
    </span>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-serif font-black text-white">Transaction Ledger</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage orders and customer details</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search Orders..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white text-sm font-bold rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#E2B254]" 
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/80 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <tr>
              <th className="p-6">Order ID</th>
              <th className="p-6">Source</th>
              <th className="p-6">Customer</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className="hover:bg-[#FDF8E7]/30 transition-colors cursor-pointer"
              >
                <td className="p-6 font-black text-sm text-[#002147]">#{order.id}</td>
                <td className="p-6"><SourceBadge source={order.order_source} /></td>
                <td className="p-6 font-bold text-sm">{order.registered_name}</td>
                <td className="p-6 font-black text-sm">NPR {Number(order.total_amount).toLocaleString()}</td>
                <td className="p-6"><StatusBadge status={order.payment_status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-black">Order Details #{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)}><XCircle size={24} className="text-gray-400" /></button>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-2">
                <p className="font-bold text-sm flex items-center gap-2"><UserCheck size={16} /> {selectedOrder.registered_name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2"><Mail size={14} /> {selectedOrder.user_email || 'No email'}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2"><Phone size={14} /> {selectedOrder.user_phone || 'No phone'}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2"><MapPin size={14} /> {selectedOrder.delivery_address}</p>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Ordered Items</h4>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span>{item.name} <span className="text-gray-400 text-xs">(x{item.quantity})</span></span>
                    <span className="font-bold">NPR {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="text-right border-t pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase">Grand Total</p>
                <p className="text-2xl font-black text-[#800000]">NPR {Number(selectedOrder.total_amount).toLocaleString()}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}