// frontend/src/pages/NoticesPage.jsx
import { motion } from 'framer-motion';
import { Bell, Calendar } from 'lucide-react';
import MilkDivider from '../components/Home/MilkDivider';

export default function NoticesPage() {
  const notices = [
    { id: 1, title: "New Tokha Delivery Routes", date: "April 5, 2026", type: "Logistics", content: "We have expanded our daily morning delivery routes to cover more areas including Budhanilkantha and Bansbari. Enjoy fresh A2 milk before 7 AM." },
    { id: 2, title: "Biska Jatra Special Offer", date: "April 1, 2026", type: "Offer", content: "Celebrate the Nepali New Year with pure sweetness. Get 15% off on our famous Bhaktapur Juju Dhau. Use code: NEWYEAR83" },
    { id: 3, title: "Organic Certification Renewed", date: "March 15, 2026", type: "Quality", content: "Sita Ram Dairy has successfully renewed its Premium Organic Certification. Our commitment to chemical-free farming remains absolute." }
  ];

  return (
    <main className="bg-[#F9F6F0] min-h-screen">
      {/* HERO SECTION - Mirroring the reference style with hero_4.png */}
      <div className="relative h-[80vh] flex items-center overflow-hidden bg-dairyBlack">
        {/* Background Image - Clear and Visible */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85 scale-105" 
          style={{ backgroundImage: "url('/hero_4.png')" }} 
        />
        
        {/* Subtle dark-to-transparent gradient to make text pop */}
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
                Stay Updated With Us
              </h2>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white"
            >
              Farm Updates
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-200 font-light tracking-wide mb-10"
            >
              Latest news, exclusive offers, and announcements from the heart of Sita Ram Organic Dairy.
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#E2B254] text-dairyBlack px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:bg-white transition-all duration-300 shadow-xl"
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
              className="bg-white p-8 rounded-3xl shadow-sm border-l-8 border-[#E2B254] hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Decorative background circle on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-dairyRed text-[#E2B254] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                    {notice.type}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-dairyRed">
                    {notice.title}
                  </h3>
                </div>
                <span className="flex items-center gap-2 text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                  <Calendar size={14} /> {notice.date}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {notice.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}