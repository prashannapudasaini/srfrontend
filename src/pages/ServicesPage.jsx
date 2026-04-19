import { motion } from 'framer-motion';
import { useState } from 'react';
import { Truck, PackageOpen, CalendarDays, Map, Sparkles, Headset } from 'lucide-react';
import MilkDivider from '../components/Home/MilkDivider';

const ServicesPage = () => {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: 1,
      title: "White-Glove Delivery",
      icon: Truck,
      description: "Fresh, temperature-controlled dairy delivered to your Kathmandu Valley doorstep by 7 AM.",
      features: ["Free delivery above Rs. 2000", "Cold-chain logistics", "Real-time SMS tracking"]
    },
    {
      id: 2,
      title: "Corporate & Event Bulk",
      icon: PackageOpen,
      description: "Premium pricing for hotels, restaurants, and grand Nepalese weddings.",
      features: ["Volume-tiered discounts", "Custom branding available", "Dedicated account manager"]
    },
    {
      id: 3,
      title: "Farm-to-Table Subscription",
      icon: CalendarDays,
      description: "Set and forget. Receive pure A2 milk and fresh paneer precisely when you need it.",
      features: ["Save up to 15% monthly", "Pause anytime", "Priority stock allocation"]
    },
    {
      id: 4,
      title: "Tokha Farm Excursions",
      icon: Map,
      description: "Visit our pristine organic pastures. Witness the bilona churning process firsthand.",
      features: ["Guided weekend tours", "Fresh tasting sessions", "Family & child friendly"]
    },
    {
      id: 5,
      title: "Bespoke Dairy Orders",
      icon: Sparkles,
      description: "Specialized products crafted to your exacting culinary specifications.",
      features: ["Custom Juju Dhau sizes", "Unsalted cooking butter", "Festival-ready packaging"]
    },
    {
      id: 6,
      title: "24/7 Concierge Support",
      icon: Headset,
      description: "Unwavering customer service to manage your subscriptions and immediate needs.",
      features: ["Instant WhatsApp support", "Live order modifications", "No-questions return policy"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="bg-[#F9F6F0] min-h-screen">
      {/* HERO SECTION - Mirroring the reference image style */}
      <div className="relative h-[80vh] flex items-center overflow-hidden bg-dairyBlack">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85 scale-105" 
          style={{ backgroundImage: "url('/hero_2.png')" }} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-8 h-[1px] bg-[#E2B254]"></span>
              <h2 className="text-[#E2B254] text-xs uppercase tracking-[0.3em] font-bold">
                Tailored To Your Needs
              </h2>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white"
            >
              Premium Services
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-200 font-light tracking-wide mb-10"
            >
              Bespoke dairy solutions for households and enterprises across the valley.
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#E2B254] text-dairyBlack px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:bg-white transition-all duration-300 shadow-xl"
            >
              Book Service
            </motion.button>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full z-20">
          <MilkDivider />
        </div>
      </div>
      
      {/* SERVICES GRID - UNCHANGED */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            const isHovered = hoveredService === service.id;
            
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 cursor-pointer relative group transition-all duration-500 p-8"
                style={{
                  transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                  boxShadow: isHovered ? '0 30px 40px -15px rgba(168, 0, 0, 0.1)' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${isHovered ? 'bg-dairyRed text-[#E2B254]' : 'bg-[#F9F6F0] text-dairyRed'}`}>
                  <IconComponent size={32} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-dairyRed mb-4">{service.title}</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="border-t border-gray-100 pt-6">
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm font-medium flex items-center gap-3 text-gray-600">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${isHovered ? 'bg-[#E2B254] text-dairyRed' : 'bg-dairyRed/10 text-dairyRed'}`}>✓</span>
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