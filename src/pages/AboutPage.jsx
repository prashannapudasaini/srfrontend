import { motion } from 'framer-motion';
import { ShieldCheck, Droplets, Heart, Award } from 'lucide-react';
import MilkDivider from '../components/Home/MilkDivider';

export default function AboutPage() {
  const features = [
    { icon: <Droplets size={32} />, title: "100% Pure A2 Milk", desc: "Sourced exclusively from indigenous cattle breeds." },
    { icon: <ShieldCheck size={32} />, title: "Zero Preservatives", desc: "No chemicals, additives, or artificial thickeners ever." },
    { icon: <Award size={32} />, title: "Traditional Bilona", desc: "Our ghee is slow-churned using ancient Ayurvedic methods." },
    { icon: <Heart size={32} />, title: "Ethical Farming", desc: "Happy cows grazing freely in the lush pastures of Tokha." }
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* HERO SECTION - RED & WHITE HIGH CONTRAST */}
      <div className="relative h-[85vh] flex items-center overflow-hidden bg-[#1A1A1A]">
        {/* Background Image with Dark Overlay for maximum White Text contrast */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: "url('/hero_3.png')" }} 
        />
        
        {/* Deep Red Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#9e111a]/80 via-[#9e111a]/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="w-12 h-[2px] bg-white"></span>
              <h2 className="text-white text-sm uppercase tracking-[0.4em] font-black">
                ESTABLISHED 1985
              </h2>
            </motion.div>

            <motion.h1 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif font-black mb-8 text-white leading-[1.1] tracking-tight"
            >
              The Heritage of <br /> 
              <span className="text-white">Sita Ram</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }} 
              className="text-xl md:text-2xl text-red-50 font-medium tracking-wide mb-12 max-w-xl opacity-90"
            >
              Generations of pure organic goodness rooted in the heart of Nepal. 
              Farm-fresh dairy delivered with uncompromising purity.
            </motion.p>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 w-full z-20">
          <MilkDivider />
        </div>
      </div>
      
      {/* LEGACY SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div 
            initial={{ x: -50, opacity: 0 }} 
            whileInView={{ x: 0, opacity: 1 }} 
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-[#9e111a] text-xs font-black uppercase tracking-[0.3em]">Our Legacy</h2>
            <h3 className="text-5xl md:text-6xl font-serif font-black text-gray-900 tracking-tight">A Tradition of <span className="text-[#9e111a]">Purity</span></h3>
            <p className="text-gray-600 leading-relaxed text-xl font-medium">
              Sita Ram Dairy has been a trusted cornerstone in providing premium, organic dairy products to families across the Kathmandu Valley for over three decades.
            </p>
            <p className="text-gray-500 leading-relaxed text-lg">
              Our cattle graze in the pristine environments of Tokha, never treated with synthetic hormones. We believe the finest dairy comes from happy animals and sustainable practices.
            </p>
            <div className="pt-4">
               <div className="h-1.5 w-24 bg-[#9e111a] rounded-full" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }} 
            whileInView={{ x: 0, opacity: 1 }} 
            viewport={{ once: true }} 
            className="relative"
          >
            {/* Red Frame Decoration */}
            <div className="absolute inset-0 bg-[#9e111a] rounded-[2.5rem] transform -rotate-3 scale-105 opacity-10" />
  
            <img 
              src="/ghee.png" 
              alt="Sita Ram Premium Ghee" 
              className="relative rounded-[2.5rem] shadow-2xl object-contain h-[550px] w-full bg-white p-12 border border-gray-100" 
            />
          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-serif font-black text-gray-900 tracking-tight">
            Why Families <span className="text-[#9e111a]">Trust Us</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              initial={{ y: 30, opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              transition={{ delay: idx * 0.1 }} 
              viewport={{ once: true }} 
              className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-[#9e111a]/10 transition-all duration-500 border border-gray-100 group text-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-[#9e111a] mx-auto mb-8 group-hover:bg-[#9e111a] group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                {feature.icon}
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{feature.title}</h4>
              <p className="text-gray-500 leading-relaxed text-base font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}