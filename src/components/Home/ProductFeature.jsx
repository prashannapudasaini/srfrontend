// frontend/src/components/Home/ProductFeature.jsx
import { motion } from 'framer-motion';
import { Leaf, Baby, ShieldCheck, Droplets } from 'lucide-react';

export default function ProductFeature() {
  const fatContents = ["0.5%", "1.5%", "2.5%", "3.5%", "6%"];

  return (
    <div className="bg-[#FDF8E7] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        
        {/* Left Column */}
        <div className="space-y-10 relative z-10">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-6 leading-tight">
              Our products <span className="text-[#9e111a]">are based on high quality milk</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8 font-medium">
              We ensure the highest standards in dairy processing. Our milk is sourced directly from happy, healthy cattle in Tokha, preserving all natural vitamins and minerals.
            </p>
            
            {/* Fat Content Circles */}
            <div className="flex flex-wrap gap-4 mb-10">
              {fatContents.map((fat, i) => (
                <div key={i} className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center font-black text-[#1A1A1A] text-sm border-2 border-transparent hover:border-[#9e111a] hover:text-[#9e111a] transition-all cursor-pointer">
                  {fat}
                </div>
              ))}
            </div>

            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white">
              <h3 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-3 mb-3">
                <Leaf className="text-green-600" size={24} /> Environmentally <span className="text-[#9e111a]">Friendly</span>
              </h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Sustainable farming practices that protect our soil, water, and local Nepalese ecosystem.</p>
              <button className="bg-[#1A1A1A] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#9e111a] transition-all duration-300 uppercase tracking-widest text-xs">
                Read our story
              </button>
            </div>
          </motion.div>
        </div>

        {/* Center Column: The 3D Bottle Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
          className="relative flex justify-center items-center h-[500px] lg:h-[600px] z-20"
        >
          {/* Animated Glow Behind Bottle */}
          <div className="absolute inset-0 bg-[#9e111a]/10 rounded-full blur-[100px] animate-pulse"></div>
          
          {/* 3D Realistic Bottle Mockup */}
          <img 
            src="/milk.png" 
            alt="Organic Fresh Milk" 
            className="relative z-10 h-full object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Right Column */}
        <div className="space-y-8 relative z-10">
          <FeatureBlock 
            icon={<ShieldCheck className="text-[#9e111a]" size={28} />} 
            title="100% Organic Products" 
            desc="Sourced from local farms entirely free of synthetic pesticides and artificial fertilizers." 
          />
          <FeatureBlock 
            icon={<Baby className="text-[#9e111a]" size={28} />} 
            title="Recommended for Babies" 
            desc="Rich in natural calcium and essential A2 proteins required for early development." 
          />
          <FeatureBlock 
            icon={<Droplets className="text-[#9e111a]" size={28} />} 
            title="High Quality Raw Milk" 
            desc="Processed minimally and pasteurized perfectly to retain the authentic farm taste." 
          />
        </div>

      </div>
    </div>
  );
}

function FeatureBlock({ icon, title, desc }) {
  return (
    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex gap-6 group bg-white/50 hover:bg-white p-4 rounded-2xl transition-colors shadow-sm hover:shadow-md border border-transparent hover:border-gray-100">
      <div className="w-16 h-16 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#9e111a]/10 group-hover:border-[#9e111a] transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{title}</h3>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}