import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="py-16 md:py-24 relative overflow-hidden font-sans w-full">
        
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 w-full text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-6 mb-4"
        >
          {/* Left Decorative Arrow */}
          <div className="w-0 h-0 border-t-8 border-t-transparent border-r-[12px] border-r-[#9e111a] border-b-8 border-b-transparent opacity-50" />
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#9e111a] tracking-tight uppercase drop-shadow-sm">
            Contact Us
          </h1>
          
          {/* Right Decorative Arrow */}
          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-[#9e111a] border-b-8 border-b-transparent opacity-50" />
        </motion.div>
        
        <div className="flex items-center justify-center gap-3 opacity-60">
          <span className="w-12 h-[2px] bg-[#9e111a] border-dashed border-b-2"></span>
          <span className="text-sm font-bold tracking-widest uppercase text-gray-700">Sita Ram Gokul Milk</span>
          <span className="w-12 h-[2px] bg-[#9e111a] border-dashed border-b-2"></span>
        </div>
      </div>

      {/* Clean Grid Layout */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
        
        {/* LEFT SIDE: Contact Information */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-black text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 font-medium text-base leading-relaxed mb-4">
              Whether you have a question about our organic dairy products, bulk orders for events, or delivery logistics, our team is ready to assist you.
            </p>
            <p className="text-gray-600 font-medium text-base leading-relaxed">
              Pioneering Nepal’s private dairy industry with reputable standard tracking since 2052 B.S.
            </p>
          </div>

          <div className="space-y-8 border-t border-gray-200/60 pt-8">
            <div className="flex items-start gap-5 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-[#9e111a] group-hover:bg-[#9e111a]/5 transition-colors">
                <Phone className="text-[#9e111a]" size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">015213049</p>
                <p className="text-gray-500 text-sm mt-1">Available Sun - Fri</p>
              </div>
            </div>

            <div className="flex items-start gap-5 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-[#9e111a] group-hover:bg-[#9e111a]/5 transition-colors">
                <MapPin className="text-[#9e111a]" size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Tokha, Bagmati Province</p>
                <p className="text-gray-500 text-sm mt-1">Kathmandu, Nepal</p>
              </div>
            </div>

            <div className="flex items-start gap-5 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-[#9e111a] group-hover:bg-[#9e111a]/5 transition-colors">
                <Mail className="text-[#9e111a]" size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">info@sitaramdudh.com</p>
                <p className="text-gray-500 text-sm mt-1">Usually responds in 4 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-5 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-[#9e111a] group-hover:bg-[#9e111a]/5 transition-colors">
                <Clock className="text-[#9e111a]" size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Business Hours</p>
                <p className="text-gray-500 text-sm mt-1">Sun - Fri: 6:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Clean White Form Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Send us a Message</h3>
            <p className="text-gray-500 text-sm">We'll get back to you as soon as possible.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">Name</label>
              <input 
                type="text" required placeholder="Enter Your Name"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 bg-[#FDF8E7]/50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#9e111a] focus:ring-2 focus:ring-[#9e111a]/20 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">Email</label>
              <input 
                type="email" required placeholder="Enter Your Email"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-4 bg-[#FDF8E7]/50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#9e111a] focus:ring-2 focus:ring-[#9e111a]/20 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">Subject</label>
              <input 
                type="text" placeholder="How can we help?"
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full px-5 py-4 bg-[#FDF8E7]/50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#9e111a] focus:ring-2 focus:ring-[#9e111a]/20 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">Message</label>
              <textarea 
                required placeholder="Write your message here..." rows="5"
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full px-5 py-4 bg-[#FDF8E7]/50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#9e111a] focus:ring-2 focus:ring-[#9e111a]/20 transition-all resize-none text-gray-900 placeholder:text-gray-400"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.button 
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full md:w-auto px-10 py-4 rounded-xl text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-md ${
                      isSubmitting ? 'bg-gray-400 cursor-wait' : 'bg-[#9e111a] hover:bg-red-900 hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && <Send size={16} />}
                  </motion.button>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full md:w-auto px-10 py-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-sm"
                  >
                    <CheckCircle2 size={20} className="text-green-600" /> Sent Successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}