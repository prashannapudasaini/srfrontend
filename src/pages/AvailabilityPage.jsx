import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, CalendarDays } from 'lucide-react';

export default function AvailabilityPage() {
  const schedule = [
    { day: "Monday", area: "Kathmandu Central", route: "Thamel, Baluwatar, Lazimpat, Maharajgunj" },
    { day: "Tuesday", area: "Lalitpur Route", route: "Patan Durbar Square, Jhamsikhel, Jawalakhel, Pulchowk" },
    { day: "Wednesday", area: "Bhaktapur Route", route: "Suryabinayak, Kamalvinayak, Thimi, Sallaghari" },
    { day: "Thursday", area: "Ring Road East", route: "Koteshwor, Gwarko, Satdobato, Baneshwor" },
    { day: "Friday", area: "Kathmandu North", route: "Boudha, Jorpati, Chabahil, Gokarna" },
    { day: "Saturday", area: "Weekend Express", route: "Pre-ordered Bulk Deliveries Only" },
    { day: "Sunday", area: "Kathmandu West", route: "Kalanki, Sitapaila, Swayambhu, Bafal" }
  ];

  return (
    <div className="bg-[#F9F6F0] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#9e111a] uppercase tracking-[0.2em] mb-4">Delivery Network</p>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-[#002147] mb-6">
            Weekly Van <span className="text-[#9e111a]">Availability</span>
          </h1>
          <div className="w-16 h-1 bg-[#9e111a] mx-auto rounded-full mb-8"></div>
          
          {/* Important Notice Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex flex-col md:flex-row items-center gap-4 bg-white border border-[#9e111a]/20 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto"
          >
            <div className="w-12 h-12 bg-[#9e111a] text-white rounded-full flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-[#002147] text-lg">Daily Departure Notice</h3>
              <p className="text-gray-600 font-medium mt-1">Our delivery van exits the Tokha Headquarters daily at <strong className="text-[#9e111a]">6:00 AM sharp</strong> to ensure farm-fresh morning delivery.</p>
            </div>
          </motion.div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schedule.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#9e111a]/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                <CalendarDays className="text-[#E2B254]" size={24} />
                <h3 className="text-xl font-black text-[#002147] uppercase">{item.day}</h3>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-[#9e111a] flex items-center gap-2">
                  <MapPin size={16} /> {item.area}
                </p>
                <p className="text-gray-500 text-sm font-medium leading-relaxed pl-6 border-l-2 border-gray-100 ml-1.5">
                  {item.route}
                </p>
              </div>
            </motion.div>
          ))}
          
          {/* Decorative Last Card */}
          <div className="bg-[#1A1A1A] p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
            <Truck className="text-[#E2B254] mb-4" size={40} />
            <h3 className="text-xl font-black text-white mb-2">Track Your Order?</h3>
            <p className="text-gray-400 text-sm">Contact our hotline to know exactly where the van is on your route day.</p>
          </div>
        </div>

      </div>
    </div>
  );
}