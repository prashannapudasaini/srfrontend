import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Truck, CreditCard, Users, CalendarDays, Activity, ArrowUpRight, CheckCircle2, XCircle, Clock } from 'lucide-react';

// MOCK DATA for demonstration
const MOCK_SUBSCRIPTIONS = [
  { id: 'SUB-1001', customer: 'Aarav Sharma', phone: '9841234567', location: 'Baluwatar', plan: 'Monthly', days: ['Mon', 'Wed', 'Fri'], time: 'Morning (7AM)', status: 'Active', payment: 'Paid', freeGhee: true },
  { id: 'SUB-1002', customer: 'Priya Thapa', phone: '9801234567', location: 'Jhamsikhel', plan: 'Weekly', days: ['Tue', 'Thu', 'Sat'], time: 'Evening (5PM)', status: 'Active', payment: 'Pending', freeGhee: false },
  { id: 'SUB-1003', customer: 'Sita Ram Hotel', phone: '9851234567', location: 'Thamel', plan: 'Monthly', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], time: 'Morning (7AM)', status: 'Paused', payment: 'Overdue', freeGhee: true },
  { id: 'SUB-1004', customer: 'Nabin Shrestha', phone: '9811234567', location: 'Baneshwor', plan: 'Weekly', days: ['Sun', 'Wed'], time: 'Morning (7AM)', status: 'Cancelled', payment: 'Refunded', freeGhee: false },
];

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState('subscribers'); // subscribers, dispatch, payments
  const [searchQuery, setSearchQuery] = useState('');

  // Top Metrics Data
  const metrics = [
    { title: "Active Subs", value: "248", trend: "+12% this month", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Today's Dispatches", value: "86", trend: "Morning & Evening", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Pending Payments", value: "NPR 14,500", trend: "12 Invoices Due", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Tomorrow's Demand", value: "124 L", trend: "Milk Inventory Needed", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER & METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{metric.title}</p>
              <h3 className="text-2xl font-black text-[#1A1A1A]">{metric.value}</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-2">{metric.trend}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${metric.bg} ${metric.color}`}>
              <metric.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* MAIN PANEL */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
        
        {/* Toolbar */}
        <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 shrink-0">
          <div className="flex bg-gray-200/50 p-1 rounded-xl">
            {['subscribers', 'dispatch', 'payments'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all capitalize ${
                  activeTab === tab ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search customers or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-xl py-2 pl-9 pr-4 focus:outline-none focus:border-[#9e111a]" 
              />
            </div>
            <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Data Area (Scrollable) */}
        <div className="flex-grow overflow-auto custom-scrollbar">
          
          {/* TAB 1: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Customer & ID</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Location</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Plan Details</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Status</th>
                  <th className="p-4 text-right text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_SUBSCRIPTIONS.map((sub, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {sub.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1A1A] text-sm">{sub.customer}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-gray-400">{sub.id}</span>
                            <span className="text-[10px] text-gray-400">• {sub.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">{sub.location}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${sub.plan === 'Monthly' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {sub.plan}
                          </span>
                          {sub.freeGhee && <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">Free Ghee</span>}
                        </div>
                        <span className="text-xs font-bold text-gray-500">{sub.days.length} Days/Wk ({sub.time})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        sub.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                        sub.status === 'Paused' ? 'bg-amber-50 border-amber-200 text-amber-600' : 
                        'bg-red-50 border-red-200 text-red-600'
                      }`}>
                        {sub.status === 'Active' && <CheckCircle2 size={14}/>}
                        {sub.status === 'Paused' && <Clock size={14}/>}
                        {sub.status === 'Cancelled' && <XCircle size={14}/>}
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-[#9e111a] hover:bg-red-50 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 2: DISPATCH TRACKING */}
          {activeTab === 'dispatch' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-[#1A1A1A]">Today's Routes</h3>
                <span className="bg-[#9e111a] text-white text-xs font-bold px-3 py-1 rounded-full">86 Deliveries Scheduled</span>
              </div>
              {/* Dummy Route Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { route: "Route 1: Central (Thamel, Naxal)", time: "Morning (6:00 AM)", count: 42, status: "Out for Delivery", progress: 60 },
                  { route: "Route 2: Lalitpur Core", time: "Morning (6:00 AM)", count: 28, status: "Completed", progress: 100 },
                  { route: "Route 3: Ring Road East", time: "Evening (4:00 PM)", count: 16, status: "Preparing", progress: 0 },
                ].map((route, i) => (
                  <div key={i} className="border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{route.time}</span>
                        <h4 className="font-bold text-[#1A1A1A] mt-1">{route.route}</h4>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        route.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        route.status === 'Preparing' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
                      }`}>{route.status}</span>
                    </div>
                    <div className="mb-2 flex justify-between text-xs font-bold text-gray-500">
                      <span>Progress</span>
                      <span>{route.count} Drops</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full ${route.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${route.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS */}
          {activeTab === 'payments' && (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Invoice ID</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Customer</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Amount</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Status</th>
                  <th className="p-4 text-right text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_SUBSCRIPTIONS.map((sub, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-500 text-sm">INV-{Math.floor(Math.random() * 90000) + 10000}</td>
                    <td className="p-4 font-bold text-[#1A1A1A] text-sm">{sub.customer}</td>
                    <td className="p-4 font-black text-[#1A1A1A]">NPR {(Math.random() * 5000 + 1000).toFixed(0)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                        sub.payment === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                        sub.payment === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {sub.payment}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider flex items-center justify-end gap-1 w-full">
                        View Details <ArrowUpRight size={14}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}