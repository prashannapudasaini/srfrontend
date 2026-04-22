import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Clock } from 'lucide-react';

export default function OutletsPage() {
  const outlets = [
    {
      name: "Tokha Headquarters & Main Dairy",
      address: "Bhutkhel, Tokha, Kathmandu 44600",
      phone: "+977 1-438xxxx",
      hours: "5:00 AM - 7:00 PM (Daily)",
      isMain: true
    },
    {
      name: "Kathmandu Central Branch",
      address: "Tridevi Marg, Thamel, Kathmandu",
      phone: "+977 980-xxxxxxx",
      hours: "6:30 AM - 8:00 PM (Daily)",
      isMain: false
    },
    {
      name: "Lalitpur Heritage Branch",
      address: "Near Patan Durbar Square, Lalitpur",
      phone: "+977 981-xxxxxxx",
      hours: "6:30 AM - 7:30 PM (Daily)",
      isMain: false
    },
    {
      name: "Bhaktapur Fresh Outlet",
      address: "Suryabinayak Chowk, Bhaktapur",
      phone: "+977 1-661xxxx",
      hours: "6:00 AM - 7:00 PM (Daily)",
      isMain: false
    }
  ];

  return (
    <div className="bg-[#F9F6F0] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#9e111a] uppercase tracking-[0.2em] mb-4">Visit Us</p>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-[#002147] mb-6">
            Our Official <span className="text-[#9e111a]">Outlets</span>
          </h1>
          <div className="w-16 h-1 bg-[#9e111a] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {outlets.map((outlet, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 transition-transform duration-300 hover:-translate-y-2 shadow-lg border ${
                outlet.isMain ? 'bg-[#1A1A1A] text-white border-transparent' : 'bg-white border-gray-100 text-[#002147]'
              }`}
            >
              {outlet.isMain && (
                <div className="absolute top-0 right-0 bg-[#9e111a] text-white px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest">
                  Headquarters
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${outlet.isMain ? 'bg-white/10 text-[#E2B254]' : 'bg-[#F9F6F0] text-[#9e111a]'}`}>
                <Store size={28} />
              </div>

              <h3 className="text-2xl font-serif font-black mb-6">{outlet.name}</h3>
              
              <div className="space-y-4">
                <div className={`flex items-start gap-3 ${outlet.isMain ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="shrink-0 mt-1" size={18} />
                  <p className="font-medium">{outlet.address}</p>
                </div>
                
                <div className={`flex items-center gap-3 ${outlet.isMain ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Phone className="shrink-0" size={18} />
                  <p className="font-medium">{outlet.phone}</p>
                </div>
                
                <div className={`flex items-center gap-3 ${outlet.isMain ? 'text-[#E2B254]' : 'text-[#9e111a]'}`}>
                  <Clock className="shrink-0" size={18} />
                  <p className="font-bold">{outlet.hours}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}