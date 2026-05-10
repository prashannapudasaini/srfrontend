import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Droplets, IceCream, ShoppingBag, Loader2, XCircle } from 'lucide-react';
import api from '../services/api'; // Make sure your API utility is imported

// Helper to assign icons dynamically based on product name keywords
const getProductIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('milk')) return Droplets;
  if (lowerName.includes('paneer')) return Package;
  if (lowerName.includes('ice cream') || lowerName.includes('fest')) return IceCream;
  return ShoppingBag; // Default
};

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Dashboard Data from PHP Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard.php');
        if (response.data.status === 'success') {
          setData(response.data.data);
        } else {
          setError(response.data.message || "Failed to load dashboard data.");
        }
      } catch (err) {
        console.error("Dashboard API Error:", err);
        setError("Network error. Could not connect to server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center text-[#002147]">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-black tracking-widest uppercase text-sm">Loading Overview...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center text-[#9e111a]">
        <XCircle size={48} className="mb-4" />
        <p className="font-bold text-lg mb-6">{error || "Something went wrong"}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#9e111a] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#7a0d13] shadow-lg transition-all hover:-translate-y-0.5">
          Try Again
        </button>
      </div>
    );
  }

  // --- DYNAMIC CHART SCALING ---
  // Find the highest value in the data to scale the charts dynamically (adding 20% padding to the top)
  const maxRevenue = Math.max(...data.revenueData.flatMap(d => [d.current, d.previous]), 1000) * 1.2;
  const maxProductSales = Math.max(...data.popularProducts.map(p => p.sales), 50) * 1.2;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Sales" value={data.metrics.totalSales} />
        <MetricCard title="Active Subscriptions" value={data.metrics.activeSubscriptions} />
        <MetricCard title="New Customers" value={data.metrics.newCustomers} />
        <MetricCard title="Pending Orders" value={data.metrics.pendingOrders} />
      </div>

      {/* 2. CHARTS & LISTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart: Monthly Revenue */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Monthly Revenue</h3>
          
          <div className="relative flex-grow flex items-end min-h-[250px]">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-gray-400 h-full pb-2">
              <span>{Math.round(maxRevenue).toLocaleString()}</span>
              <span>{Math.round(maxRevenue * 0.75).toLocaleString()}</span>
              <span>{Math.round(maxRevenue * 0.5).toLocaleString()}</span>
              <span>{Math.round(maxRevenue * 0.25).toLocaleString()}</span>
              <span>0</span>
            </div>
            
            {/* SVG Line Chart */}
            <div className="ml-12 w-full h-full relative">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible preserve-3d">
                {/* Grid Lines */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="200" x2="500" y2="200" stroke="#f3f4f6" strokeWidth="1" />

                <defs>
                  <linearGradient id="goldGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#E2B254" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#E2B254" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Gold Line (Previous Year) & Area */}
                {data.revenueData.length > 0 && (
                  <>
                    <path 
                      d={`M 0,${200 - (data.revenueData[0].previous/maxRevenue)*200} ${data.revenueData.map((d, i) => `L ${i * 100},${200 - (d.previous/maxRevenue)*200}`).join(' ')}`}
                      fill="none" stroke="#E2B254" strokeWidth="3" 
                    />
                    <path 
                      d={`M 0,${200 - (data.revenueData[0].previous/maxRevenue)*200} ${data.revenueData.map((d, i) => `L ${i * 100},${200 - (d.previous/maxRevenue)*200}`).join(' ')} L 500,200 L 0,200 Z`}
                      fill="url(#goldGradient)" stroke="none" 
                    />
                    {/* Dark Blue Line (Current Year) */}
                    <path 
                      d={`M 0,${200 - (data.revenueData[0].current/maxRevenue)*200} ${data.revenueData.map((d, i) => `L ${i * 100},${200 - (d.current/maxRevenue)*200}`).join(' ')}`}
                      fill="none" stroke="#002147" strokeWidth="3" 
                    />
                  </>
                )}
              </svg>
              
              {/* X-Axis Labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-bold text-gray-400">
                {data.revenueData.map((d, i) => (
                  <span key={i} className="text-center w-8 -ml-4">{d.month}</span>
                ))}
              </div>
            </div>
            {/* Axis Label */}
            <div className="absolute -left-6 top-1/2 -rotate-90 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Revenue (NPR)
            </div>
          </div>
          <div className="text-center mt-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Last 6 Months
          </div>
        </div>

        {/* Bar Chart: Popular Products */}
        <div className="lg:col-span-6 xl:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Popular Products</h3>
          
          <div className="relative flex-grow flex items-end min-h-[250px] ml-6">
             {/* Y-Axis Labels */}
             <div className="absolute -left-8 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-gray-400 h-full pb-2">
              <span>{Math.round(maxProductSales)}</span>
              <span>{Math.round(maxProductSales * 0.8)}</span>
              <span>{Math.round(maxProductSales * 0.6)}</span>
              <span>{Math.round(maxProductSales * 0.4)}</span>
              <span>{Math.round(maxProductSales * 0.2)}</span>
              <span>0</span>
            </div>

            {/* Bars Container */}
            <div className="flex justify-around items-end w-full h-full pb-8 border-b border-gray-100 relative">
               {/* Background Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-t border-gray-50 h-0"></div>
                  ))}
               </div>

              {data.popularProducts.map((product, idx) => {
                const IconComponent = getProductIcon(product.name);
                return (
                  <div key={idx} className="flex flex-col items-center group relative z-10 w-1/4">
                    {/* Bar */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(product.sales / maxProductSales) * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="w-10 sm:w-12 bg-[#002147] rounded-t-lg shadow-sm group-hover:bg-[#9e111a] transition-colors relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {product.sales} units
                      </div>
                    </motion.div>
                    
                    {/* Icon & Label */}
                    <div className="absolute -bottom-8 flex flex-col items-center">
                      <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-[#E2B254] border border-gray-100 mb-1 shadow-sm">
                        <IconComponent size={12} strokeWidth={3} />
                      </div>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider text-center line-clamp-1 w-16">{product.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* List: New Subscribers */}
        <div className="lg:col-span-6 xl:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <h3 className="text-lg font-black text-[#1A1A1A] mb-6">New Subscribers</h3>
          
          <div className="flex-grow space-y-4">
            {data.newSubscribers.length === 0 ? (
               <p className="text-sm text-gray-400 font-bold text-center mt-10">No recent subscribers.</p>
            ) : (
              data.newSubscribers.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#002147] font-black text-lg shadow-inner shrink-0">
                    {sub.initial}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-[#1A1A1A] text-sm leading-tight mb-0.5 truncate">{sub.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{sub.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="w-full mt-4 py-3 text-xs font-black uppercase tracking-widest text-[#002147] bg-[#002147]/5 hover:bg-[#002147]/10 rounded-xl transition-colors">
            View All Subscribers
          </button>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-black text-[#1A1A1A] tracking-tight">{value}</p>
    </div>
  );
}