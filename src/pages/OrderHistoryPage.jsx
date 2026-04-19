// frontend/src/pages/OrderHistoryPage.jsx
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrderHistoryPage() {
  const mockOrders = [
    { 
      id: "ORD-1234", 
      date: "April 5, 2026", 
      total: 1450, 
      status: "Delivered", 
      items: 3,
      category: "Weekly Subscription"
    }
  ];

  return (
    <main className="bg-cheeseCream min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* === BREADCRUMB === */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-dairyRed transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
        </div>

        {/* === PAGE HEADER === */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-dairyRed red-text-shadow">
            Purchase <span className="text-dairyBlack">Ledger</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3">
            Your Premium Organic Dairy History
          </p>
        </div>

        {/* === ORDERS LIST === */}
        <div className="space-y-8">
          {mockOrders.length > 0 ? (
            mockOrders.map(order => (
              <div 
                key={order.id} 
                className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-premium hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-8 group"
              >
                {/* Left: Info Section */}
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="w-20 h-20 bg-cheeseCream rounded-3xl flex items-center justify-center text-dairyRed shadow-inner group-hover:rotate-6 transition-transform">
                    <Package size={32} strokeWidth={2.5} />
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-black text-dairyRed uppercase tracking-widest mb-1 block">
                      {order.category}
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-dairyBlack mb-1">
                      {order.id}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {order.date} • {order.items} Premium Items
                    </p>
                  </div>
                </div>

                {/* Right: Status & Price */}
                <div className="flex items-center justify-between w-full md:w-auto gap-12">
                  <div className="text-right">
                    <p className="text-3xl font-black text-dairyRed red-text-shadow mb-2">
                      NPR {order.total}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[10px] font-black bg-green-50 text-green-700 px-4 py-1.5 rounded-full uppercase tracking-widest border border-green-100">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <button className="w-14 h-14 bg-cheeseCream text-dairyBlack hover:bg-dairyRed hover:text-white rounded-2xl transition-all duration-300 flex items-center justify-center shadow-inner group/btn">
                    <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No transaction history found</p>
            </div>
          )}
        </div>

        {/* Support Note */}
        <div className="mt-16 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
             Issues with an order? <a href="/contacts" className="text-dairyRed hover:underline">Connect with Tokha Support</a>
           </p>
        </div>
      </div>
    </main>
  );
}