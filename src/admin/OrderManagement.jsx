import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { 
  Truck, CheckCircle2, XCircle, Search, MapPin, 
  Loader2, User, Phone, CreditCard, Clock, 
  Package, Receipt, FileText, ChevronRight, Banknote, Printer, AlertTriangle, Send, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // UI States for Updating
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3500);
  };

  useEffect(() => { 
    fetchOrders(); 
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/index.php');
      if (res.data.status === 'success') {
        setOrders(res.data.data);
      }
    } catch (error) { 
      console.error("Failed to fetch orders"); 
    } finally { 
      setLoading(false); 
    }
  };

  // Handle Order Fulfillment Status Update
  const handleStatusUpdate = async (orderId, newStatus) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
    }

    try {
      const res = await api.post('/admin/update-order-status.php', {
        order_id: orderId,
        status: newStatus
      });

      if (res.data.status === 'success') {
        showToast(`Order updated to ${newStatus.replace(/_/g, ' ')}. User Notified!`, 'success');
      } else {
        showToast(res.data.message || "Failed to update order status.", 'error');
        fetchOrders();
      }
    } catch (err) {
      showToast("Network error while updating status.", 'error');
      fetchOrders();
    } finally {
      setIsUpdating(false);
    }
  };

  // --- NEW: Handle Payment Status Update ---
  const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
    if (isUpdating) return;
    setIsUpdating(true);

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: newPaymentStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, payment_status: newPaymentStatus }));
    }

    try {
      const res = await api.post('/admin/update-payment-status.php', {
        order_id: orderId,
        payment_status: newPaymentStatus
      });

      if (res.data.status === 'success') {
        showToast(`Payment marked as ${newPaymentStatus.toUpperCase()}. User Notified!`, 'success');
      } else {
        showToast(res.data.message || "Failed to update payment status.", 'error');
        fetchOrders();
      }
    } catch (err) {
      showToast("Network error while updating payment status.", 'error');
      fetchOrders();
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.id?.toString().includes(searchQuery) || 
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone_number?.includes(searchQuery)
    );
  }, [orders, searchQuery]);

  // PROFESSIONAL INVOICE GENERATOR
  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    
    const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
    }) : 'Date Not Available';

    const itemsHtml = order.items && order.items.length > 0 
      ? order.items.map(item => `
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: left;">${item.name || item.product_name}</td>
            <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">NPR ${Number(item.price).toLocaleString()}</td>
            <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">NPR ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `).join('')
      : `<tr><td colspan="4" style="padding: 20px; text-align: center; color: #888; font-style: italic;">No item details provided by database.</td></tr>`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - Order #${order.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; background: #fff; }
            .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .05); }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #002147; padding-bottom: 20px; }
            .title { font-size: 36px; font-weight: 900; color: #002147; margin: 0; text-transform: uppercase; }
            .details { text-align: right; color: #666; font-size: 14px; line-height: 1.6; }
            .details strong { color: #333; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .info-col { width: 45%; font-size: 14px; line-height: 1.6; color: #555; }
            .info-col h3 { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
            .info-col strong { color: #222; font-size: 16px; display: block; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f8f9fa; padding: 12px 15px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 2px solid #ddd; }
            .totals { text-align: right; border-top: 2px solid #ddd; padding-top: 20px; width: 50%; float: right; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #666; }
            .grand-total { font-size: 20px; font-weight: 900; color: #9e111a; border-top: 1px solid #eee; padding-top: 12px; margin-top: 12px; }
            .clearfix::after { content: ""; clear: both; display: table; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <h1 class="title">INVOICE</h1>
                <p style="color: #666; margin-top: 5px;">Sitaram Gokul Milks Kathmandu Pvt.Ltd</p>
              </div>
              <div class="details">
                <strong>Order #:</strong> ${order.id}<br>
                <strong>Date:</strong> ${orderDate}<br>
                <strong>Payment:</strong> ${order.payment_method?.toUpperCase() || 'COD'}<br>
                <strong>Status:</strong> <span style="color: ${order.payment_status === 'completed' ? '#059669' : '#d97706'}">${order.payment_status?.toUpperCase() || 'PENDING'}</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-col">
                <h3>Billed To</h3>
                <strong>${order.customer_name}</strong>
                ${order.phone_number}<br>
                ${order.delivery_address}
              </div>
              <div class="info-col" style="text-align: right;">
                <h3>Dispatched From</h3>
                <strong>Sitaram Dairy HQ</strong>
                Tokha, Bagmati Province<br>
                Kathmandu, Nepal
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="totals clearfix">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>NPR ${Number(order.total_amount).toLocaleString()}</span>
              </div>
              <div class="totals-row grand-total">
                <span>GRAND TOTAL:</span>
                <span>NPR ${Number(order.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 250);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const PaymentStatusBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || 'pending';
    if (normalized === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12}/> Paid
        </span>
      );
    }
    if (normalized === 'failed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
          <XCircle size={12}/> Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={12}/> Pending
      </span>
    );
  };

  const OrderStatusBadge = ({ status }) => {
    const normalized = status?.toLowerCase()?.replace(/\s+/g, '_') || 'processing';
    
    switch (normalized) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Truck size={12} /> Out For Delivery
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
            <Package size={12} /> Dispatched
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            <XCircle size={12} /> Cancelled
          </span>
        );
      case 'processing':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} /> Processing
          </span>
        );
    }
  };

  const renderItemsSummary = (items) => {
    if (!items || items.length === 0) return <span className="text-gray-400 italic text-xs">No items listed</span>;
    const summary = items.slice(0, 2).map(i => `${i.name || i.product_name} (x${i.quantity})`).join(', ');
    const extra = items.length > 2 ? ` + ${items.length - 2} more` : '';
    return <span className="text-sm text-gray-700">{summary} <span className="text-gray-400 text-xs font-medium">{extra}</span></span>;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* GLOBAL TOAST NOTIFICATION */}
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

      {/* HEADER */}
      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-serif font-black text-white">Order Management</h2>
          <p className="text-xs font-medium text-gray-400 mt-1">Comprehensive view of all customer transactions and fulfillment statuses.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer Name, or Phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white text-sm font-medium rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-[#E2B254] transition-all placeholder:text-gray-500" 
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-5 pl-8">Order Info</th>
                <th className="p-5">Customer Details</th>
                <th className="p-5">Items Summary</th>
                <th className="p-5">Payment Method</th>
                <th className="p-5">Payment Status</th>
                <th className="p-5">Order Status</th>
                <th className="p-5 pr-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center">
                    <Loader2 className="mx-auto animate-spin text-[#00519E] mb-3" size={32} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Orders Data...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-sm font-medium text-gray-400">
                    No orders found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="p-5 pl-8">
                      <p className="font-black text-sm text-[#002147]">#{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                      </p>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-sm text-[#1A1A1A]">{order.customer_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.phone_number}</p>
                    </td>
                    <td className="p-5 max-w-xs truncate whitespace-normal leading-tight">
                      <div className="flex items-start gap-2">
                        <Package size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        {renderItemsSummary(order.items)}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                        {order.payment_method?.toLowerCase() === 'cod' ? (
                          <><Banknote size={16} className="text-gray-400"/> COD</>
                        ) : (
                          <><CreditCard size={16} className="text-gray-400"/> ConnectIPS</>
                        )}
                      </div>
                      <p className="text-xs font-black text-[#9e111a] mt-1">NPR {Number(order.total_amount).toLocaleString()}</p>
                    </td>
                    <td className="p-5"><PaymentStatusBadge status={order.payment_status} /></td>
                    <td className="p-5"><OrderStatusBadge status={order.order_status} /></td>
                    <td className="p-5 pr-8 text-right">
                      <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 group-hover:bg-[#00519E] group-hover:text-white group-hover:border-[#00519E] transition-all shadow-sm">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED PROFESSIONAL MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 20 }} 
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-gray-50 border-b border-gray-100 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-black text-[#1A1A1A]">Order #{selectedOrder.id}</h3>
                    <OrderStatusBadge status={selectedOrder.order_status} />
                    <PaymentStatusBadge status={selectedOrder.payment_status} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    Placed on {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'Date Not Available'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handlePrintInvoice(selectedOrder)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Printer size={16} /> Print Invoice
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors text-gray-600">
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto flex-grow">
                
                {/* 1. ORDER FULFILLMENT STATUS CONTROL */}
                <div className="mb-6 bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
                  <h4 className="text-xs font-black uppercase text-[#002147] tracking-wider mb-3 flex items-center gap-2">
                    <Send size={14} className="text-blue-500" /> Fulfillment Status (Dispatch & Notify)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Processing', value: 'processing' },
                      { label: 'Dispatched', value: 'dispatched' },
                      { label: 'Out for Delivery', value: 'out_for_delivery' },
                      { label: 'Delivered', value: 'delivered' },
                      { label: 'Cancelled', value: 'cancelled' }
                    ].map(item => {
                      const isActive = selectedOrder.order_status?.toLowerCase()?.replace(/\s+/g, '_') === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => handleStatusUpdate(selectedOrder.id, item.value)}
                          disabled={isUpdating}
                          className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                            isActive 
                              ? 'bg-[#002147] text-white shadow-md cursor-default' 
                              : 'bg-white border border-gray-200 text-gray-500 hover:border-[#002147] hover:text-[#002147] shadow-sm'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. NEW: PAYMENT STATUS CONTROL */}
                <div className="mb-8 bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
                  <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-3 flex items-center gap-2">
                    <DollarSign size={14} className="text-emerald-600" /> Payment Status (Financial Record)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Pending (Unpaid)', value: 'pending', activeClass: 'bg-amber-500 text-white' },
                      { label: 'Completed (Paid)', value: 'completed', activeClass: 'bg-emerald-600 text-white' },
                      { label: 'Failed', value: 'failed', activeClass: 'bg-red-600 text-white' }
                    ].map(item => {
                      const isActive = selectedOrder.payment_status?.toLowerCase() === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => handlePaymentStatusUpdate(selectedOrder.id, item.value)}
                          disabled={isUpdating}
                          className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                            isActive 
                              ? `${item.activeClass} shadow-md cursor-default` 
                              : 'bg-white border border-gray-200 text-gray-500 hover:border-emerald-600 hover:text-emerald-700 shadow-sm'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2.5">
                    Changing payment status marks the invoice as Paid/Unpaid and sends a notification to the customer.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-2"><User size={14}/> Customer Details</h4>
                      <p className="font-bold text-gray-900 text-sm">{selectedOrder.customer_name}</p>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {selectedOrder.phone_number}</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-2"><MapPin size={14}/> Delivery Address</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{selectedOrder.delivery_address}</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-2"><Receipt size={14}/> Payment Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Method</p>
                          <p className="text-sm font-bold text-gray-800">
                            {selectedOrder.payment_method?.toLowerCase() === 'cod' ? 'Cash on Delivery' : 'ConnectIPS Gateway'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <PaymentStatusBadge status={selectedOrder.payment_status} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2"><FileText size={14}/> Order Summary</h4>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0 relative">
                                  {item.base_image && (
                                    <img 
                                      src={item.base_image} 
                                      alt={item.name || item.product_name} 
                                      className="w-full h-full object-cover absolute inset-0 z-10"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  )}
                                  <Package size={20} className="z-0" />
                                </div>

                                <div>
                                  <p className="font-bold text-sm text-gray-900">{item.name || item.product_name}</p>
                                  <p className="text-xs text-gray-500 font-medium">NPR {Number(item.price).toLocaleString()} × {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-sm text-gray-800">NPR {(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-red-500 italic text-center py-4">
                            Backend Data Missing: Please update your index.php to return order items.
                          </p>
                        )}
                      </div>

                      <div className="bg-gray-50 p-5 space-y-3 border-t border-gray-100">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span className="font-medium">NPR {Number(selectedOrder.total_amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Shipping Fee</span>
                          <span className="font-medium">Calculated at Checkout</span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-end">
                          <span className="text-sm font-bold text-gray-800 uppercase">Grand Total</span>
                          <span className="text-2xl font-black text-[#9e111a]">NPR {Number(selectedOrder.total_amount).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}