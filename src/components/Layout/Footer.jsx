import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

// --- Constants ---
const MARQUEE_ITEMS = [
  "BHAT BHATENI", "SALESBERRY", "BIG MART", "KK MART", "BHAT BHATENI", "SALESBERRY", "BIG MART", "KK MART"
];

const EXPLORE_LINKS = ["Home", "Products", "Our Story", "Services", "Notices"];

const SOCIAL_LINKS = [
  { icon: (s) => <Facebook s={s} />, label: "Facebook", href: "#" },
  { icon: (s) => <Instagram s={s} />, label: "Instagram", href: "#" },
  { icon: (s) => <Youtube s={s} />, label: "YouTube", href: "#" }
];

// --- Custom Icons ---
const Facebook = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const Instagram = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const Youtube = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 103.38 103.38 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 103.38 103.38 0 0 1-15 0 2 2 0 0 1-2-2Z"/><path d="m10 15 5-3-5-3z"/></svg>
);

const Footer = () => {
  return (
    <footer className="w-full flex flex-col bg-white overflow-hidden">
      
      {/* 1. Marquee Section */}
      <div className="bg-white text-red-700 py-2.5 border-t border-b border-red-100 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex w-max whitespace-nowrap text-xs md:text-sm font-bold tracking-wider uppercase"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-10 px-5">
              {MARQUEE_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="text-red-300 text-xs">✦</span> {item}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. Main Body Section */}
      <div className="relative bg-red-700 text-white">
        
        {/* Background Decorative Layer - Image Removed */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Liquid Edge Divider (Kept for subtle texture) */}
          <div className="hidden lg:block absolute top-0 left-[43%] w-[250px] h-full z-10 translate-x-[-50%]">
             <svg viewBox="0 0 200 800" preserveAspectRatio="none" className="h-full w-full fill-white/5 opacity-30">
                <path d="M0,0 L60,0 C140,80 20,160 150,240 C190,280 40,360 170,440 C220,520 30,600 140,680 C180,740 60,800 100,800 L0,800 Z" />
             </svg>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                {/* Logo Image */}
                <div className="bg-white p-1 rounded-xl shadow-lg">
                  <img 
                    src="/logo.png" 
                    alt="Sita Ram Dairy Logo" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold tracking-tight">
                    Sita Ram <span className="text-red-200">Dairy</span>
                  </h3>
                  <p className="text-red-100/60 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Est. 1985 • Sanepa, Kathmandu</p>
                </div>
              </div>
              
              <p className="text-sm text-red-50 leading-relaxed max-w-md">
                Generations of pure goodness. Premium organic dairy and artisanal bakery products from Nepal's lush pastures.
              </p>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Explore */}
              <div className="space-y-4">
                <h4 className="text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block">Explore</h4>
                <ul className="space-y-2.5">
                  {EXPLORE_LINKS.map(link => (
                    <li key={link}>
                      <a href="#" className="text-red-100 hover:text-white transition-all flex items-center gap-2 group text-sm font-medium">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">▸</span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h4 className="text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block">Support</h4>
                <ul className="space-y-2.5 text-red-50 text-sm">
                  <li className="flex gap-3 items-center"><MapPin className="shrink-0 w-4 h-4 text-red-300" /> <span>Sanepa, KTM</span></li>
                  <li className="flex gap-3 items-center"><Phone className="shrink-0 w-4 h-4 text-red-300" /> <span>01-00000000</span></li>
                  <li className="flex gap-3 items-center"><Mail className="shrink-0 w-4 h-4 text-red-300" /> <span>pure@sitaram.com</span></li>
                  <li className="flex gap-3 items-center"><Clock className="shrink-0 w-4 h-4 text-red-300" /> <span>6 AM - 8 PM</span></li>
                </ul>
              </div>

              {/* Follow Us */}
              <div className="space-y-4">
                <h4 className="text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block">Follow Us</h4>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, label }) => (
                    <a key={label} href="#" className="w-9 h-9 rounded-full bg-white text-red-700 flex items-center justify-center hover:bg-red-100 transition-colors shadow-md group" aria-label={label}>
                      <div className="group-hover:scale-110 transition-transform">{Icon(16)}</div>
                    </a>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-red-800/40 rounded-xl border border-white/10">
                   <p className="text-xs text-red-100 leading-snug font-semibold">
                     🚚 Free Delivery<br/>
                     <span className="text-[9px] uppercase font-bold tracking-tighter text-red-300">On orders above ₨500</span>
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="bg-white py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <p>© 2026 Sita Ram Dairy. All rights reserved.</p>
          <p>© 2026 Designed and Developed by MotionAge.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-red-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-red-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-red-600 transition-colors">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;