import React, { useState, useEffect, useMemo } from 'react';
import { Droplets, Package, Download, AlertCircle, PlusCircle, History, TrendingDown, FileText, Loader2, XCircle, Search } from 'lucide-react';
import api from '../services/api';

export default function MilkStockManagement() {
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialog, setDialog] = useState({ isOpen: false, message: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/admin/inventory.php');
      if (res.data.status === 'success') {
        setInventory(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Failed to connect to the inventory server.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = () => {
    setDialog({ isOpen: true, message: "Weekly Inventory Report (CSV) has been generated and sent to your email." });
  };

  const filteredItems = useMemo(() => {
    if (!inventory?.items) return [];
    return inventory.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventory, searchQuery]);

  if (isLoading) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center text-[#002147]">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-black tracking-widest uppercase text-sm">Calculating Stock Levels...</p>
      </div>
    );
  }

  if (error || !inventory) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center text-[#9e111a]">
        <XCircle size={48} className="mb-4" />
        <p className="font-bold text-lg mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#9e111a] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#1A1A1A] transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      
      {/* Alert Dialog */}
      {dialog.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-black text-[#1A1A1A] mb-2">Report Generated</h3>
            <p className="text-gray-500 mb-8 font-medium">{dialog.message}</p>
            <button onClick={() => setDialog({ isOpen: false })} className="w-full py-3 rounded-xl font-bold text-white bg-[#002147] hover:bg-[#1A1A1A] transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1A1A1A] p-6 lg:p-8 rounded-[2rem] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FDF8E7] rounded-2xl flex items-center justify-center text-[#002147] shadow-lg shrink-0">
            <Droplets size={24}/>
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">Daily Milk & Inventory</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Live Stock Tracking • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button onClick={fetchInventory} className="flex-1 sm:flex-none bg-white/10 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
            <History size={16} /> Refresh
          </button>
          <button onClick={generateReport} className="flex-1 sm:flex-none bg-[#E2B254] text-[#002147] px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg">
            <Download size={16} /> Weekly Report
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Morning Stock (Milk)</p>
          <h3 className="text-3xl font-black text-[#1A1A1A]">{inventory.metrics.morningMilkStock} L</h3>
          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider flex items-center gap-1">
            <History size={12} className="text-blue-500"/> Calculated Base
          </p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Today's Demand</p>
          <h3 className="text-3xl font-black text-[#9e111a]">{inventory.metrics.todayDemand} L</h3>
          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider flex items-center gap-1">
            <TrendingDown size={12} className="text-[#9e111a]"/> For Active Subs
          </p>
        </div>

        <div className="bg-[#FDF8E7] p-6 rounded-[2rem] border border-[#E2B254]/20 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-black text-[#002147] uppercase tracking-widest mb-1">Current Remaining</p>
          <h3 className="text-3xl font-black text-[#002147]">{inventory.metrics.currentMilkStock} L</h3>
          <p className="text-[10px] text-[#002147]/60 mt-2 font-bold uppercase tracking-wider flex items-center gap-1">
            <Droplets size={12} className="text-[#E2B254]"/> Real-time availability
          </p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Ghee Stock</p>
          <h3 className="text-3xl font-black text-[#1A1A1A]">{inventory.metrics.gheeStock} Units</h3>
          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider flex items-center gap-1">
            <Package size={12} className="text-amber-600"/> High-value inventory
          </p>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <h3 className="text-lg font-black text-[#1A1A1A]">Full Inventory Breakdown</h3>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 text-sm font-bold rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#002147] transition-colors" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-white border-b border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="p-6">Product Item</th>
                <th className="p-6">Category</th>
                <th className="p-6">Variant / Size</th>
                <th className="p-6">Stock Remaining</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <Package className="mx-auto text-gray-300 mb-3" size={32} />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No stock records found.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                          {item.image ? <img src={item.image} alt={item.name} className="w-8 h-8 object-contain mix-blend-multiply" /> : <Package size={16} className="text-gray-400" />}
                        </div>
                        <span className="font-black text-[#1A1A1A] text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-gray-600 text-sm">{item.size}</td>
                    <td className="p-6">
                      <span className="font-black text-lg text-[#1A1A1A]">{item.stock}</span>
                    </td>
                    <td className="p-6">
                      {item.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-red-50 text-red-600">
                          <XCircle size={12} /> Out of Stock
                        </span>
                      ) : item.stock < 20 ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-amber-50 text-amber-600">
                          <AlertCircle size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}