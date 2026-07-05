import { motion } from 'framer-motion';
import { Calendar, Smartphone, CalendarClock, ShieldCheck } from 'lucide-react';
import MilkDivider from '../components/Home/MilkDivider';

// 1. Import your hero image here
import heroImg from '../assets/hero_4.webp';

export default function NoticesPage() {
  const notices = [
    { 
      id: 1, 
      title: "Official Sitaram Mobile App Coming Soon", 
      date: "Coming Soon", 
      type: "Announcement", 
      icon: <Smartphone size={18} />,
      content: "We are excited to announce that the official Sitaram Mobile App will soon be available on iOS and Android. You will be able to completely manage your wallet, view dynamic order lists, instantly request single-tap cancellations, and set exact doorstep pins via interactive delivery maps." 
    },
    { 
      id: 2, 
      title: "Flexible Farm-to-Table Subscriptions", 
      date: "Active", 
      type: "Services", 
      icon: <CalendarClock size={18} />,
      content: "Take complete control of your routine dairy supply. Our subscription platform allows households to schedule systematic, automated drop-offs for fresh milk, ghee, and paneer. Change quantities, adjust frequency, or pause your ongoing delivery stream easily whenever you are away." 
    },
    { 
      id: 3, 
      title: "Strict Quality & Testing Standards", 
      date: "Operational", 
      type: "Quality", 
      icon: <ShieldCheck size={18} />,
      content: "All raw dairy pooled across our 150 cooperatives undergoes systematic diagnostic checks at our 22 regional chilling centers. This continuous laboratory surveillance preserves natural proteins, lipids, calcium, and potassium balances before safe urban distribution." 
    }
  ];

  return (
    <main className="bg-[#FAF8F5] min-h-screen">
      {/* HERO SECTION */}
      <div className="relative h-[80vh] flex items-center overflow-hidden bg-[#1A1A1A]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105" 
          style={{ backgroundImage: `url(${heroImg})` }} // 2. Use the imported variable here
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-8 h-[1px] bg-[#9e111a]"></span>
              <h2 className="text-[#9e111a] text-xs uppercase tracking-[0.3em] font-black">
                Stay Updated With Us
              </h2>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-black mb-6 text-white leading-tight"
            >
              Farm Updates
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-200 font-medium tracking-wide mb-10 leading-relaxed"
            >
              Latest platform announcements, subscription parameters, and distribution milestones from the heart of Sitaram Gokul Milks.
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#9e111a] text-white px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-[#1A1A1A] transition-all duration-300 shadow-xl"
            >
              View All Notices
            </motion.button>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full z-20">
          <MilkDivider />
        </div>
      </div>
      
      {/* NOTICES CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="space-y-8">
          {notices.map((notice, index) => (
            <motion.div 
              key={notice.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }} 
              viewport={{ once: true }} 
              className="bg-white p-8 rounded-3xl shadow-sm border-l-8 border-[#9e111a] hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#9e111a]/10 text-[#9e111a] p-2 rounded-xl flex items-center justify-center">
                    {notice.icon}
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#9e111a]/80 block mb-0.5">
                      {notice.type}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-gray-900">
                      {notice.title}
                    </h3>
                  </div>
                </div>
                <span className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                  <Calendar size={13} /> {notice.date}
                </span>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-base">
                {notice.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}