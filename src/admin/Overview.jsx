// frontend/src/admin/Overview.jsx
import { TrendingUp, ShoppingBag, Users, Droplet } from 'lucide-react';

export default function Overview() {
  const stats = [
    { label: "Today's Revenue", value: "NPR 42,500", trend: "+12.5%", icon: <TrendingUp className="text-green-600" />, bg: "bg-green-50" },
    { label: "Active Orders", value: "18", trend: "4 Pending", icon: <ShoppingBag className="text-[#9e111a]" />, bg: "bg-red-50" },
    { label: "Registered Users", value: "1,240", trend: "+8 this week", icon: <Users className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Milk Daily Yield", value: "450 L", trend: "Target met", icon: <Droplet className="text-cyan-600" />, bg: "bg-cyan-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-[#9e111a]/5 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className={`${s.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
              {s.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
            <h3 className="text-3xl font-serif font-black text-[#1A1A1A] mb-2">{s.value}</h3>
            <span className="text-xs font-bold text-gray-500">{s.trend}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Orders Mockup */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-[#9e111a]/5">
          <h2 className="text-xl font-serif font-black text-[#1A1A1A] mb-6">Recent Deliveries</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#FDF8E7]/30 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[#9e111a]">#{1040 + i}</div>
                  <div>
                    <p className="text-sm font-black text-[#1A1A1A]">Ram Bahadur - Tokha</p>
                    <p className="text-[10px] text-gray-500">2L Milk, 500g Ghee</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-600">Delivered</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alert Mockup */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-[#9e111a]/5">
          <h2 className="text-xl font-serif font-black text-[#1A1A1A] mb-6">Inventory Alerts</h2>
          <div className="space-y-4">
             <div className="p-4 border-l-4 border-orange-400 bg-orange-50 rounded-r-2xl">
                <p className="text-sm font-bold text-orange-800">Low Stock: Sita Ram Paneer</p>
                <p className="text-xs text-orange-600">Only 12 units remaining in Tokha cold store.</p>
             </div>
             <div className="p-4 border-l-4 border-[#9e111a] bg-red-50 rounded-r-2xl">
                <p className="text-sm font-bold text-red-800">Critical: Packaging Labels</p>
                <p className="text-xs text-red-600">Reorder required within 24 hours.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}