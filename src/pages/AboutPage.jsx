import { motion } from 'framer-motion';
import { ShieldCheck, Droplets, Heart, Award, Leaf, Sun, Truck, Sparkles, MapPin, Milestone } from 'lucide-react';
import MilkDivider from '../components/Home/MilkDivider';

import heroImg from '../assets/hero_3.webp';
import factoryImg from '../assets/factory.webp';
import leadingImg from '/leading.webp';

export default function AboutPage() {
  const features = [
    { icon: <Droplets size={32} />, title: "100% Pure A2 Milk", desc: "Sourced exclusively from indigenous cattle breeds for better digestion and health." },
    { icon: <ShieldCheck size={32} />, title: "Zero Preservatives", desc: "No chemicals, additives, or artificial thickeners ever. Just pure dairy." },
    { icon: <Award size={32} />, title: "Traditional Bilona", desc: "Our premium ghee is slow-churned using ancient, nutrient-preserving Ayurvedic methods." },
    { icon: <Heart size={32} />, title: "Ethical Farming", desc: "Happy, healthy cows grazing freely in the lush, unpolluted pastures of Tokha." }
  ];

  const processes = [
    { icon: <Sun size={28} />, title: "1. Dawn Collection", desc: "Fresh milk is collected at sunrise from our free-grazing indigenous cows." },
    { icon: <ShieldCheck size={28} />, title: "2. Purity Testing", desc: "Rigorous laboratory testing ensures zero adulteration and optimal nutritional value." },
    { icon: <Truck size={28} />, title: "3. Cold-Chain Delivery", desc: "Dispatched immediately in temperature-controlled vehicles to preserve farm freshness." }
  ];

  const premiumProducts = [
    "Fresh Milk", "Pure Ghee", "Yogurt", "Paneer", "Butter", 
    "Ice Cream", "Cheese", "Flavored Milk", "Lassi", "Strawberry Lassi"
  ];

  return (
    // 🔥 FIX: Reduced bottom padding from pb-20 to pb-10
    <main className="bg-white min-h-screen pb-10 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="relative h-[85vh] flex items-center overflow-hidden bg-[#1A1A1A]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: `url(${heroImg})` }} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#9e111a]/80 via-[#9e111a]/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-8 h-[1px] bg-white"></span>
              <h2 className="text-white text-xs uppercase tracking-[0.3em] font-black">
                ESTABLISHED 2052 B.S. (1995/1996 A.D.)
              </h2>
            </motion.div>

            <motion.h1 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-black mb-6 text-white leading-tight tracking-tight"
            >
              The Heritage of <br /> 
              <span className="text-white">Sitaram Gokul</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }} 
              className="text-xl text-red-50 font-medium tracking-wide mb-10 max-w-2xl opacity-90 leading-relaxed"
            >
              Continuous enterprise in processing, sales, and country-wide distribution. Pioneering Nepal’s private dairy industry with reputable standard tracking.
            </motion.p>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full z-20">
          <MilkDivider />
        </div>
      </div>
      
      {/* MAIN CONTENT CONTAINER */}
      {/* 🔥 FIX: Reduced bottom padding here from pb-12 to pb-4 */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-4">

        {/* OUR LEGACY SECTION */}
        {/* 🔥 FIX: Reduced mb-32 to mb-20 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
          <motion.div 
            initial={{ x: -50, opacity: 0 }} 
            whileInView={{ x: 0, opacity: 1 }} 
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[1px] bg-[#9e111a]"></span>
              <h2 className="text-[#9e111a] text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <Leaf size={14} /> Our Legacy
              </h2>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-serif font-black text-gray-900 tracking-tight">
              A Tradition of <span className="text-[#9e111a]">Purity</span>
            </h3>
            <p className="text-gray-500 leading-relaxed text-base font-medium">
              Sitaram Gokul Milks Kathmandu Pvt. Ltd. has been a trusted cornerstone in providing premium, organic dairy products to families across the Kathmandu Valley for over three decades.
            </p>
            <p className="text-gray-500 leading-relaxed text-base font-medium">
              Since its inception in 2052 B.S., the industry has expanded its core mission to directly improve the livelihood parameters of milk-producing farmers. By systematically routing urban income back to rural communities, we promote a sustainable cycle of domestic capital investment inside Nepal.
            </p>
            <div className="pt-4">
               <div className="h-1.5 w-16 bg-[#9e111a] rounded-full" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }} 
            whileInView={{ x: 0, opacity: 1 }} 
            viewport={{ once: true }} 
            className="relative"
          >
            <div className="absolute inset-0 bg-[#9e111a] rounded-[2.5rem] transform -rotate-3 scale-105 opacity-10" />
            <img 
              src={factoryImg} 
              alt="Sita Ram Premium Ghee Facility" 
              className="relative rounded-[2.5rem] shadow-2xl object-cover h-[500px] w-full bg-white border border-gray-100 hover:scale-[1.02] transition-transform duration-700" 
            />
          </motion.div>
        </div>

        {/* MISSION & VISION SECTION */}
        {/* 🔥 FIX: Reduced mb-32 to mb-20 */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-[#FDF8E7] rounded-[3rem] p-10 md:p-16 mb-20 border border-[#9e111a]/10 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9e111a]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          
          <h3 className="text-3xl md:text-4xl font-serif font-black text-[#1A1A1A] mb-6 relative z-10">
            Our Mission & Vision
          </h3>
          <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto relative z-10">
            "To nourish our community with the purest, unadulterated dairy products while fostering sustainable farming practices that honor the earth and empower local farmers. We envision a future where every family has access to the authentic taste of nature."
          </p>
        </motion.div>

        {/* OUR CATALOG SECTION */}
        {/* 🔥 FIX: Reduced mb-32 to mb-16, and pb-24 to pb-12 */}
        <div className="mb-16 border-b border-gray-100 pb-12">
          <div className="text-center mb-12">
            <h2 className="text-[#9e111a] text-xs font-black uppercase tracking-[0.3em] mb-4">OUR CATALOG</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-black text-gray-900 tracking-tight mb-4">
              Uncompromising Nutrition
            </h3>
            <p className="text-gray-500 font-medium text-base max-w-2xl mx-auto">
              Beyond fresh milk and ghee, discover our variety of high-quality dairy.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 max-w-5xl mx-auto px-4">
            {premiumProducts.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.04, borderColor: "#9e111a", backgroundColor: "#FAF8F5" }}
                className="bg-white border border-gray-200/80 px-8 py-3.5 rounded-full flex items-center gap-3 shadow-sm shadow-gray-100 transition-all cursor-default"
              >
                <Sparkles size={15} className="text-gray-300 group-hover:text-[#9e111a] shrink-0" />
                <span className="font-serif font-black text-gray-800 text-base tracking-wide">{product}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* REGIONAL HARVEST PIPELINE & MACRO BIO-NUTRITION SECTION */}
        {/* 🔥 FIX: Reduced mb-32 to mb-20 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-[#9e111a]/5 transition-all duration-500 space-y-5"
          >
            <div className="w-14 h-14 bg-[#9e111a]/10 rounded-2xl flex items-center justify-center text-[#9e111a] mb-2">
              <MapPin size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif font-black text-gray-900">National Sourcing Framework</h3>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              To supply consistent purity, Sitaram Gokul Milks has successfully initialized <b>22 milk chilling centers</b> across the key districts of <b>Nawalparasi, Rupandehi, Chitwan, and Kavre</b>. 
            </p>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Through an interactive network grouping over <b>150 dairy producer cooperatives</b> and roughly <b>22 private dairy entrepreneurs</b>, raw milk undergoes thorough modernization pipelines under strict standard testing.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-[#9e111a]/5 transition-all duration-500 space-y-5"
          >
            <div className="w-14 h-14 bg-[#1A1A1A]/5 rounded-2xl flex items-center justify-center text-[#1A1A1A] mb-2">
              <Milestone size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif font-black text-gray-900">Nutritional Composition</h3>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Milk and ghee are dense providers of essential elements required cleanly by the human system, containing complex groups of <b>proteins, lipids, calcium, and potassium</b>. 
            </p>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Valued fundamentally since ancient biological times for assisting physical development, these attributes are safely validated by modern clinical laboratory trials to promote optimal immune scaling.
            </p>
          </motion.div>
        </div>

        {/* FARM TO TABLE PROCESS */}
        {/* 🔥 FIX: Reduced mb-32 to mb-20 */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-[#9e111a] text-xs font-black uppercase tracking-[0.3em] mb-4">The Process</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-black text-gray-900 tracking-tight">
              From Our Farm to <span className="text-[#9e111a]">Your Table</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gray-200 z-0" />
            
            {processes.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#9e111a]/10 text-center relative z-10 transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-[#FAF8F5] text-[#9e111a] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#9e111a] group-hover:text-white transition-colors duration-500">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#9e111a] transition-colors duration-300">{step.title}</h4>
                <p className="text-sm font-medium leading-relaxed text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-serif font-black text-gray-900 tracking-tight">
            Why Families <span className="text-[#9e111a]">Trust Us</span>
          </h3>
        </div>

        {/* 🔥 FIX: Reduced mb-24 to mb-16 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              initial={{ y: 30, opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              transition={{ delay: idx * 0.1 }} 
              viewport={{ once: true }} 
              className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-[#9e111a]/10 transition-all duration-500 border border-gray-100 group text-center"
            >
              <div className="w-16 h-16 bg-[#FAF8F5] rounded-2xl flex items-center justify-center text-[#9e111a] mx-auto mb-6 group-hover:bg-[#9e111a] group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-[#9e111a] transition-colors duration-300">{feature.title}</h4>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* LEADING TRUST BANNER */}
        {/* 🔥 FIX: Removed the massive mb-20 margin from this final element so the footer tucks up right against it */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center flex flex-col items-center justify-center"
        >
          <div className="relative flex justify-center mb-12">
            <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-[#9e111a]/5 rounded-full blur-3xl" />

            <motion.img 
              src={leadingImg} 
              alt="Leading Trust Symbol" 
              className="relative w-44 md:w-56 lg:w-64 h-auto object-contain drop-shadow-xl"
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            />
          </div>

          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#9e111a] to-[#c41e2a] px-10 py-4 rounded-full shadow-lg shadow-[#9e111a]/20">
            <span className="text-white font-black text-lg md:text-xl tracking-wide uppercase">
              30+ Years of Leading Trust
            </span>
          </div>

          <p className="text-[#9e111a] font-bold text-xs md:text-sm uppercase tracking-[0.25em] mt-6">
            Nepal's Most Trusted Dairy Brand
          </p>
        </motion.div>

      </div>
    </main>
  );
}