import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, MessageSquare, Send, Clock } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle your form submission logic here
    console.log("Form submitted:", formData);
    onClose(); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Blurred Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative flex flex-col"
            >
              
              {/* Floating Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#9e111a] hover:bg-gray-100 shadow-sm transition-all z-10"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              {/* Red Header */}
              <div className="bg-[#b91c1c] pt-10 pb-8 px-8 text-center relative">
                <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">
                  Contact Us
                </h2>
                <p className="text-red-100 text-sm font-medium">
                  We'd love to hear from you
                </p>
              </div>

              {/* Form Body */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Row: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User size={16} />
                        </div>
                        <input 
                          type="text" required placeholder="Enter your name"
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Phone size={16} />
                        </div>
                        <input 
                          type="tel" placeholder="+977..."
                          value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail size={16} />
                      </div>
                      <input 
                        type="email" required placeholder="Enter your email address"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Message *</label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
                        <MessageSquare size={16} />
                      </div>
                      <textarea 
                        required placeholder="How can we help you?" rows="4"
                        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] transition-all resize-none placeholder:text-gray-400"
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    className="w-full bg-[#b91c1c] hover:bg-[#9e111a] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md mt-2"
                  >
                    Send Message <Send size={16} className="ml-1" />
                  </button>

                  {/* Footer Note */}
                  <div className="flex items-center justify-center gap-1.5 pt-3 text-gray-400">
                    <Clock size={12} />
                    <span className="text-[11px] font-medium">Usually responds within 4 hours</span>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}