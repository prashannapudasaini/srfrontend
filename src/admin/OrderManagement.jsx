import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { Truck, CheckCircle2, XCircle, Search, MapPin, ShoppingCart, Loader2, UserCheck, Smartphone, Globe, Info, Mail, Phone, CreditCard, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      // FIX: Pointed endpoint to the correct non-admin API route path
      const res = await api.get('/orders/index.php');
      if (res.data.status === 'success') setOrders(res.data.data);
    } catch (error) { 
      console.error("Failed to fetch orders"); 
    } finally { 
      setLoading(false); 
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.id?.toString().includes(searchQuery) || 
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  // --- HELPER COMPONENTS ---

  const PaymentBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'pending';
    if (normalized === 'completed') return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 size={14}/> Paid</span>;
    if (normalized === 'failed') return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-red-50 text-red-700 border-red-200"><XCircle size={14}/> Failed</span>;
    return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-yellow-50 text-yellow-700 border-yellow-200"><Clock size={14}/> Pending</span>;
  };

  const OrderBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'processing';
    if (normalized === 'delivered') return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 size={14}/> Delivered</span>;
    if (normalized === 'cancelled') return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-red-50 text-red-700 border-red-200"><XCircle size={14}/> Cancelled</span>;
    return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-700 border-blue-200"><Truck size={14}/> {normalized.replace('_', ' ')}</span>;
  };

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
              <th className="p-6">Customer</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Payment</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-16 text-center">
                  <Loader2 className="mx-auto animate-spin text-[#9e111a] mb-3" size={32} />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Orders...</p>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-16 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No orders discovered in database registry.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-[#FDF8E7]/30 transition-colors cursor-pointer group"
                >
                  <td className="p-6 font-black text-sm text-[#002147]">#{order.id}</td>
                  <td className="p-6">
                    <p className="font-bold text-sm text-[#1A1A1A]">{order.customer_name}</p>
                    <p className="text-xs text-gray-400 font-bold">{order.phone_number}</p>
                  </td>
                  <td className="p-6 font-black text-sm text-[#9e111a]">NPR {Number(order.total_amount).toLocaleString()}</td>
                  <td className="p-6"><PaymentBadge status={order.payment_status} /></td>
                  <td className="p-6"><OrderBadge status={order.order_status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-black text-[#002147]">Order #{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition-colors"><XCircle size={20} className="text-gray-400" /></button>
              </div>

              {/* User Info */}
              <div className="bg-[#FDF8E7] border border-[#E2B254]/30 p-5 rounded-2xl mb-6 space-y-3">
                <p className="font-black text-sm text-[#002147] flex items-center gap-3"><UserCheck size={16} className="text-[#E2B254]"/> {selectedOrder.customer_name}</p>
                <p className="text-xs font-bold text-gray-600 flex items-center gap-3"><Phone size={14} className="text-[#E2B254]"/> {selectedOrder.phone_number}</p>
                <p className="text-xs font-bold text-gray-600 flex items-center gap-3"><MapPin size={14} className="text-[#E2B254]"/> {selectedOrder.delivery_address}</p>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-8">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2">Purchased Items</h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm items-center">
                      <span className="font-bold text-[#1A1A1A]">{item.name} <span className="text-gray-400 text-xs ml-1">x{item.quantity}</span></span>
                      <span className="font-black text-gray-600">NPR {item.price * item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No item details available.</p>
                )}
              </div>

              {/* Total & Method */}
              <div className="flex items-end justify-between border-t border-gray-100 pt-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-600 border border-gray-200">
                    <CreditCard size={14}/> {selectedOrder.payment_method?.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grand Total</p>
                  <p className="text-3xl font-black text-[#9e111a]">NPR {Number(selectedOrder.total_amount).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}