import { motion } from 'framer-motion';
import { useState } from 'react';
import { Truck, Users, CalendarDays, ShieldAlert, Sparkles, Headset } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 1. IMPORT i18n HOOK
import MilkDivider from '../components/Home/MilkDivider';

// Import your hero image here
import heroImg from '../assets/hero_2.webp';

const ServicesPage = () => {
  const [hoveredService, setHoveredService] = useState(null);
  
  // 2. INITIALIZE HOOK & FONT FIX
  const { t, i18n } = useTranslation();
  const isNepali = i18n.language === 'ne';
  // NEW
const nepaliFontClass = isNepali ? "nepali-heading" : "tracking-wider";

  // 3. MAP TRANSLATIONS & MERGE WITH ICONS
  const icons = [Truck, Users, CalendarDays, ShieldAlert, Sparkles, Headset];
  const translatedServices = t('servicesPage.servicesList', { returnObjects: true }) || [];
  
  const services = translatedServices.map((service, index) => ({
    ...service,
    id: index + 1,
    icon: icons[index]
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="bg-[#FAF8F5] min-h-screen">
      {/* HERO SECTION */}
      <div className="relative h-[80vh] flex items-center overflow-hidden bg-[#1A1A1A]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-65 scale-105" 
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
              <h2 className={`text-[#9e111a] text-xs uppercase tracking-[0.3em] font-black ${nepaliFontClass}`}>
                {t('servicesPage.hero.subtitle', 'Sitaram Gokul Corporate Services')}
              </h2>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-5xl md:text-7xl font-serif font-black mb-6 text-white leading-tight ${nepaliFontClass}`}
            >
              {t('servicesPage.hero.title', 'Reputable Operations')}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-xl text-gray-200 font-medium tracking-wide mb-10 leading-relaxed ${nepaliFontClass}`}
            >
              {t('servicesPage.hero.description', 'Modern technology infrastructure channelling urban income directly to rural milk-producing communities.')}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`bg-[#9e111a] text-white px-10 py-4 rounded-full font-black uppercase text-sm hover:bg-[#1A1A1A] transition-all duration-300 shadow-xl ${isNepali ? "tracking-normal font-['Noto_Sans_Devanagari','Mukta',sans-serif]" : "tracking-[0.2em]"}`}
            >
              {t('servicesPage.hero.button', 'Contact Logistics')}
            </motion.button>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full z-20">
          <MilkDivider />
        </div>
      </div>
      
      {/* SERVICES GRID */}
      {/* 🔥 FIX: Changed py-24 to py-10 md:py-20 to reduce top/bottom gaps on mobile */}
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" /* 🔥 FIX: Reduced gap-8 to gap-6 for mobile */
        >
          {services.map((service) => {
            const IconComponent = service.icon || Truck; // Fallback to Truck if icon is missing
            const isHovered = hoveredService === service.id;
            
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 cursor-pointer relative group transition-all duration-500 p-6 md:p-8" /* 🔥 FIX: Reduced p-8 to p-6 for mobile */
                style={{
                  transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                  boxShadow: isHovered ? '0 30px 40px -15px rgba(158, 17, 26, 0.12)' : '0 10px 15px -3px rgba(0, 0, 0, 0.03)'
                }}
              >
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${isHovered ? 'bg-[#9e111a] text-white' : 'bg-[#FAF8F5] text-[#9e111a]'}`}>
                  <IconComponent size={32} strokeWidth={1.5} />
                </div>
                
                <h3 className={`text-2xl font-serif font-black text-gray-900 mb-4 transition-colors duration-300 group-hover:text-[#9e111a] ${nepaliFontClass}`}>
                  {service.title}
                </h3>
                <p className={`text-gray-500 mb-6 font-medium text-sm leading-relaxed ${nepaliFontClass}`}>
                  {service.description}
                </p>
                
                <div className="border-t border-gray-100 pt-6">
                  <ul className="space-y-3">
                    {service.features && service.features.map((feature, idx) => (
                      <li key={idx} className={`text-sm font-bold flex items-center gap-3 text-gray-600 ${nepaliFontClass}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${isHovered ? 'bg-[#9e111a] text-white' : 'bg-[#9e111a]/10 text-[#9e111a]'}`}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
};

export default ServicesPage;