// frontend/src/admin/OrderManagement.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, CheckCircle, XCircle, Search, MapPin, Phone } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders/index.php');
      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      failed: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    const Icons = { completed: CheckCircle, pending: Clock, failed: XCircle };
    const Icon = Icons[status] || Clock;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]} uppercase tracking-wider`}>
        <Icon size={14} /> {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
            <p className="text-sm text-slate-500 mt-1">Monitor payments and fulfillment</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="p-5">Order Info</th>
                <th className="p-5">Customer & Delivery</th>
                <th className="p-5">Total Amount</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center text-slate-500">Loading secure ledger...</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-md text-sm">#{order.id}</span>
                    <p className="text-xs text-slate-500 mt-2">{new Date(order.date).toLocaleDateString()}</p>
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-slate-800">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Phone size={12}/> {order.phone_number}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {order.delivery_address}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-slate-800 font-bold text-lg">NPR {Number(order.total_amount).toLocaleString()}</p>
                    {order.esewa_ref && <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">REF: {order.esewa_ref}</p>}
                  </td>
                  <td className="p-5"><StatusBadge status={order.payment_status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}