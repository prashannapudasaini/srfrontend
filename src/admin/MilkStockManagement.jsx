// frontend/src/admin/MilkStockManagement.jsx
import React from 'react';
import { Droplets, MapPin, TrendingUp, Package } from 'lucide-react';

export default function MilkStockManagement() {
  // Mock Data for Display
  const stats = {
    totalSold: 342,
    available: 158,
    locations: [
      { address: "Tokha Residential Area", total_l: 120 },
      { address: "Budhanilkantha Delivery Route", total_l: 85 },
      { address: "Maharajgunj Hub", total_l: 137 }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<TrendingUp className="text-[#9e111a]" />} 
          label="Total Liters Sold (Today)" 
          value={`${stats.totalSold} L`} 
          sub="Updated daily"
        />
        <StatCard 
          icon={<Package className="text-[#1A1A1A]" />} 
          label="Available Stock" 
          value={`${stats.available} L`} 
          sub="Real-time inventory"
        />
        <StatCard 
          icon={<Droplets className="text-blue-600" />} 
          label="Yield Target" 
          value="92%" 
          sub="Weekly efficiency"
        />
      </div>

      {/* Sales by Location */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#9e111a]/5 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <MapPin className="text-[#9e111a]" size={20} />
          <h2 className="text-xl font-serif font-black text-[#1A1A1A]">Daily Distribution Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FDF8E7]/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                <th className="p-6">Delivery Area / Address</th>
                <th className="p-6 text-right">Liters Delivered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.locations.map((loc, i) => (
                <tr key={i} className="hover:bg-[#FDF8E7]/20 transition-colors">
                  <td className="p-6 text-sm font-bold text-[#1A1A1A]">{loc.address}</td>
                  <td className="p-6 text-sm text-right font-black text-[#9e111a]">{loc.total_l} L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-[#9e111a]/5 shadow-sm flex items-start gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#FDF8E7] flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-serif font-black text-[#1A1A1A]">{value}</h3>
        <p className="text-[10px] text-[#9e111a] mt-1 font-bold uppercase tracking-tighter">{sub}</p>
      </div>
    </div>
  );
}