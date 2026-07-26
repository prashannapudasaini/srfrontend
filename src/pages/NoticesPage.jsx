import { motion } from 'framer-motion';
import { Calendar, Smartphone, CalendarClock, ShieldCheck } from 'lucide-react';
import MilkDivider from '../components/Home/MilkDivider';
import { useTranslation } from 'react-i18next';

// 1. Import your hero image here
import heroImg from '../assets/hero_4.webp';

export default function NoticesPage() {
  const { t, i18n } = useTranslation();

  // Typography helpers for Nepali script to prevent congestion
  const isNepali = i18n.language === 'ne';
  const headingStyle = isNepali ? "nepali-heading" : "tracking-wider";
  const bodyStyle = isNepali ? "nepali-body" : "leading-relaxed";

  // Combine static icons with translated array
  const noticeIcons = [
    <Smartphone size={18} />, 
    <CalendarClock size={18} />, 
    <ShieldCheck size={18} />
  ];
  
  const notices = t('noticesPage.noticesList', { returnObjects: true }).map((notice, index) => ({
    ...notice,
    id: index + 1,
    icon: noticeIcons[index] || <Calendar size={18} />
  }));

  return (
    <main className="bg-[#FAF8F5] min-h-screen">
      {/* HERO SECTION */}
      <div className="relative h-[80vh] flex items-center overflow-hidden bg-[#1A1A1A]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105" 
          style={{ backgroundImage: `url(${heroImg})` }} 
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
              <h2 className={`text-[#9e111a] text-xs uppercase font-black ${isNepali ? `${headingStyle} inline-block pt-1` : 'tracking-[0.3em]'}`}>
                {t('noticesPage.hero.subtitle', 'Stay Updated With Us')}
              </h2>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-5xl md:text-7xl font-serif font-black mb-6 text-white ${isNepali ? headingStyle : 'leading-tight'}`}
            >
              {t('noticesPage.hero.title', 'Farm Updates')}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-xl text-gray-200 font-medium mb-10 ${isNepali ? bodyStyle : 'tracking-wide leading-relaxed'}`}
            >
              {t('noticesPage.hero.description', 'Latest platform announcements, subscription parameters, and distribution milestones from the heart of Sitaram Gokul Milks.')}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`bg-[#9e111a] text-white px-10 py-4 rounded-full font-black uppercase text-sm hover:bg-[#1A1A1A] transition-all duration-300 shadow-xl ${isNepali ? headingStyle : 'tracking-[0.2em]'}`}
            >
              {t('noticesPage.hero.button', 'View All Notices')}
            </motion.button>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full z-20">
          <MilkDivider />
        </div>
      </div>
      
      {/* NOTICES CONTENT */}
      {/* 🔥 FIX: Changed py-24 to py-10 md:py-20 to fix the gap above footer and below hero */}
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-20">
        
        {/* 🔥 FIX: Reduced space-y-8 to space-y-6 for tighter mobile scrolling */}
        <div className="space-y-6 md:space-y-8">
          {notices.map((notice, index) => (
            <motion.div 
              key={notice.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }} 
              viewport={{ once: true }} 
              className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl shadow-sm border-l-8 border-[#9e111a] hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#9e111a]/10 text-[#9e111a] p-2 rounded-xl flex items-center justify-center">
                    {notice.icon}
                  </span>
                  <div>
                    <span className={`text-[10px] font-black uppercase text-[#9e111a]/80 block mb-0.5 ${isNepali ? headingStyle : 'tracking-widest'}`}>
                      {notice.type}
                    </span>
                    <h3 className={`text-xl md:text-2xl font-serif font-black text-gray-900 ${isNepali ? headingStyle : ''}`}>
                      {notice.title}
                    </h3>
                  </div>
                </div>
                <span className={`flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full ${isNepali ? headingStyle : ''}`}>
                  <Calendar size={13} /> {notice.date}
                </span>
              </div>
              <p className={`text-gray-500 font-medium ${isNepali ? bodyStyle : 'leading-relaxed text-sm md:text-base'}`}>
                {notice.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}