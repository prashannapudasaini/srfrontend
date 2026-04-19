// frontend/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Add your API logic here
  };

  return (
    <main className="bg-cheeseCream min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* === HEADER SECTION === */}
        <div className="mb-20 text-center lg:text-left">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#7A0000] red-text-shadow leading-tight">
            Connect <span className="text-[#1A1A1A]">With Us</span>
          </h1>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.6em] mt-6">
            Direct from Tokha Farm to your Doorstep • Since 1985
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-[4rem] shadow-premium overflow-hidden bg-white border border-gray-100">
          
          {/* LEFT SIDE: INFO PANEL (Heritage Red) - lg:span-5 */}
          <div className="lg:col-span-5 bg-[#7A0000] p-12 md:p-20 text-white relative flex flex-col justify-between">
            {/* Decorative SR Watermark */}
            <div className="absolute -bottom-20 -left-20 text-[35rem] font-serif font-black text-white opacity-[0.04] select-none pointer-events-none">
              SR
            </div>

            <div className="relative z-10 space-y-16">
              <div className="space-y-4">
                <h3 className="text-4xl font-serif font-bold">Our Heritage Site</h3>
                <div className="w-16 h-1 bg-white/20 rounded-full" />
                <p className="text-[#FDF8E7]/70 font-medium leading-relaxed text-lg">
                  Visit our organic pastures in Tokha. We are open for fresh dairy pickup and farm inquiries.
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#7A0000] transition-all duration-500">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Our Location</p>
                    <p className="font-bold text-xl">Tokha-03, Kathmandu, Nepal</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#7A0000] transition-all duration-500">
                    <Phone size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Direct Line</p>
                    <p className="font-bold text-xl">+977 1 4350000</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#7A0000] transition-all duration-500">
                    <Mail size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Email Ledger</p>
                    <p className="font-bold text-xl">pure@sitaramdairy.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Integration */}
            <div className="relative z-10 pt-16 flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Follow Us</span>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#7A0000] transition-all"><Facebook size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#7A0000] transition-all"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#7A0000] transition-all"><Youtube size={18} /></a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE FORM - lg:span-7 */}
          <div className="lg:col-span-7 p-12 md:p-20 bg-white flex flex-col">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1"
                >
                  <div className="mb-12">
                    <h3 className="text-3xl font-serif font-bold text-[#1A1A1A]">Send a Message</h3>
                    <p className="text-gray-400 font-medium mt-2">Expect a response from our farm manager within 4 hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Full Name</label>
                        <input 
                          type="text" 
                          required
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-8 py-5 rounded-3xl bg-cheeseCream/50 border-2 border-transparent focus:border-[#7A0000]/10 focus:bg-white outline-none font-bold text-[#1A1A1A] transition-all shadow-sm" 
                          placeholder="Ram Bahadur" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Email Identifier</label>
                        <input 
                          type="email" 
                          required
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-8 py-5 rounded-3xl bg-cheeseCream/50 border-2 border-transparent focus:border-[#7A0000]/10 focus:bg-white outline-none font-bold text-[#1A1A1A] transition-all shadow-sm" 
                          placeholder="ram@heritage.com" 
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Subject of Inquiry</label>
                      <select className="w-full px-8 py-5 rounded-3xl bg-cheeseCream/50 border-2 border-transparent focus:border-[#7A0000]/10 focus:bg-white outline-none font-bold text-[#1A1A1A] appearance-none cursor-pointer">
                        <option>General Support</option>
                        <option>Wholesale & Bulk Supplies</option>
                        <option>Subscription Adjustments</option>
                        <option>Feedback & Quality Control</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Detail Your Requirements</label>
                      <textarea 
                        rows="5" 
                        required
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-8 py-5 rounded-3xl bg-cheeseCream/50 border-2 border-transparent focus:border-[#7A0000]/10 focus:bg-white outline-none font-bold text-[#1A1A1A] transition-all shadow-sm resize-none" 
                        placeholder="Tell us how we can help..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#7A0000] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-[#1A1A1A] transition-all duration-500 shadow-redGlow flex items-center justify-center gap-4 group"
                    >
                      Dispatch To Farm
                      <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-4">Transmission Successful</h3>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">
                    Your inquiry has been logged in our system. A Sita Ram specialist will contact you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-12 text-[#7A0000] font-black text-[11px] uppercase tracking-widest hover:bg-[#7A0000] hover:text-white border border-[#7A0000] px-8 py-3 rounded-full transition-all"
                  >
                    Draft New Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* === MAP SECTION === */}
        <div className="mt-24 bg-white rounded-[4rem] shadow-premium overflow-hidden h-[450px] relative border border-gray-100">
           {/* Replace this with an actual Google Maps iframe embed if needed */}
           <div className="absolute inset-0 bg-[#FDF8E7]/30 flex items-center justify-center">
             <div className="text-center space-y-4">
                <MapPin size={48} className="text-[#7A0000] mx-auto opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Google Maps Integration Area</p>
                <p className="text-gray-400 italic">Farm Location: Tokha, Kathmandu</p>
             </div>
           </div>
           {/* Example Iframe: 
           <iframe 
             src="https://www.google.com/maps/embed?..." 
             className="w-full h-full grayscale opacity-80" 
             style={{ border: 0 }} 
             allowFullScreen="" 
             loading="lazy"
           ></iframe> 
           */}
        </div>
      </div>
    </main>
  );
}