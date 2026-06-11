import React, { useState } from "react";
import { 
  MapPin, Phone, Mail, Clock, Award, Shield, Leaf, Truck, Globe, 
  Map as MapIcon, Plane, X, ShieldCheck
} from "lucide-react";
import FeaturedCarousel from "../Home/FeaturedCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// --- Constants ---
const MARQUEE_ITEMS = [
  "BHAT BHATENI", "SALESBERRY", "KC STORE", "METRO MARKET", "SMILE MART", "BIG MART", "HORIZONS MART","GAUTAM GENERAL","DARAZ"
];

const EXPLORE_LINKS = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Our Story", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Notices", path: "/notices" },
  { name: "Blog", path: "/blog" }
];

const SOCIAL_LINKS = [
  { icon: (s) => <Facebook s={s} />, label: "Facebook", href: "https://www.facebook.com/sitaramdudh/" },
  { icon: (s) => <Instagram s={s} />, label: "Instagram", href: "https://www.instagram.com/sitaram.dudh/?hl=en" },
  { icon: (s) => <Youtube s={s} />, label: "YouTube", href: "https://www.youtube.com/@sitaramdairy" }
];

const AVAILABLE_ON = [
  { name: "Bhat Bhateni", url: "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/eae0449ffdcaaaecca846c6da03443e8", initials: "BB" },
  { name: "SalesBerry", url: "https://media.insurancekhabar.com/uploads/2023/11/salesberry-logo.png", initials: "SB" },
  { name: "KC Store", url: "https://th.bing.com/th/id/OIP.9yGdHBXGFANKK_2jUuPQjwHaEK?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3", initials: "KC" },
  { name: "Metro Market", url: "https://tse3.mm.bing.net/th/id/OIP.vsu0auvIW65maaK8jLkQKwHaE-?rs=1&pid=ImgDetMain&o=7&rm=3", initials: "MM" },
  { name: "Smile Mart", url: "https://tse4.mm.bing.net/th/id/OIP.zATwtSs0W5D_O7nfwhkVbwHaD4?rs=1&pid=ImgDetMain&o=7&rm=3", initials: "SM" },
  { name: "Horizons Mart", url: "https://tse1.mm.bing.net/th/id/OIP.yipbJBLhT5Z1ivfh_y127AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", initials: "HM" },
  { name: "Gautam General", url: "https://www.vacancies.ae/files/company/68/m_5a6432d05141b.jpg", initials: "GG" },
  { name: "Big Mart", url: "https://storage.googleapis.com/kaggle-datasets-images/1593544/2621633/648c031d1be543da31ca46572025c7be/dataset-card.jpg?t=2021-09-16-17-28-12", initials: "BM" },
  { name: "Daraz", url: "https://www.shutterstock.com/image-vector/daraz-logo-typically-features-distinctive-600nw-2383185843.jpg", initials: "DZ" }
];

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
  // 🔥 2FA states for dynamic document views
  const [activeDoc, setActiveDoc] = useState(null);

  const docContents = {
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          <p className="font-bold text-gray-900">Sitaram Gokul Milks Kathmandu Pvt. Ltd. Privacy Policy</p>
          <p>We respect the absolute privacy parameters of our customers across the Kathmandu Valley. This policy explicitly describes how data records collected via our web portals or incoming mobile software applications are securely maintained.</p>
          <h5 className="font-bold text-gray-800 pt-2">1. Data Collection Fields</h5>
          <p>We log your name, phone identification strings, precise delivery geolocation pins, and transaction histories solely to fulfill automated drops and coordinate with local logistical centers.</p>
          <h5 className="font-bold text-gray-800 pt-2">2. Processing Security Standards</h5>
          <p>Your records are locked behind standard token layers. We do not distribute private identifying markers to outside marketing channels. Information is processed strictly for delivery processing and structural safety logs.</p>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      content: (
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          <p className="font-bold text-gray-900">Sitaram Gokul Milks Terms of Operational Service</p>
          <p>By engaging with our platform or establishing ongoing farm-to-table delivery parameters, you implicitly agree to the following corporate regulations:</p>
          <h5 className="font-bold text-gray-800 pt-2">1. Infrastructure Network</h5>
          <p>All items distributed under our brand are verified cleanly via our 22 milk chilling centers across Nawalparasi, Rupandehi, Chitwan, and Kavre, utilizing a baseline grouping of over 150 local dairy producer cooperatives.</p>
          <h5 className="font-bold text-gray-800 pt-2">2. Supply Modification & Holds</h5>
          <p>Subscribers have the explicit right to pause or update their distribution parameters. To protect the raw schedules of our cooperative collection frames, modification requests must be processed via the platform prior to dispatch routines.</p>
        </div>
      )
    },
    returns: {
      title: "Returns & Refund Policy",
      content: (
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          <p className="font-bold text-gray-900">Premium Dairy Quality Guarantee</p>
          <p>Because dairy items (Milk, Paneer, Yogurt, Lassi) contain sensitive, natural proteins and lipids without artificial preservative thickeners, specialized return guidelines are strictly operationalized:</p>
          <h5 className="font-bold text-gray-800 pt-2">1. Delivery Inspection</h5>
          <p>Due to the perishable nature of fresh products, clients are requested to verify package integrity immediately upon accessible drop-off. If a batch fails your laboratory or structural verification, it must be reported instantly for replacement.</p>
          <h5 className="font-bold text-gray-800 pt-2">2. Refund Allocations</h5>
          <p>Verified batch compromises will result in immediate credits to your digital platform wallet. Wallet assets remain non-transferable and can be safely applied to any upcoming product orders or subscription renewals.</p>
        </div>
      )
    }
  };

  return (
    <footer className="w-full flex flex-col bg-white overflow-hidden">
      {/* Featured Carousel */}
      <FeaturedCarousel />
      
      {/* 1. Marquee Section */}
      <div className="bg-white text-red-700 py-2.5 border-t border-b border-red-50 overflow-hidden mt-2">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex w-max whitespace-nowrap text-xs md:text-sm font-bold tracking-wider uppercase"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-5 px-5">
              {MARQUEE_ITEMS.map((item, index) => (
                <span key={`${item}-${index}`} className="flex items-center gap-1.5">
                  <span className="text-red-300 text-xs">✦</span> {item}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. Main Body Section */}
      <div className="relative bg-[#C8102E] text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="hidden lg:block absolute top-0 left-[40%] w-[250px] h-full z-10 translate-x-[-50%]">
             <svg viewBox="0 0 200 800" preserveAspectRatio="none" className="h-full w-full fill-white/5 opacity-30">
                <path d="M0,0 L60,0 C140,80 20,160 150,240 C190,280 40,360 170,440 C220,520 30,600 140,680 C180,740 60,800 100,800 L0,800 Z" />
             </svg>
          </div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Logo Section */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-1.5 rounded-xl shadow-lg">
                  <img src="/logo.png" alt="Sita Ram Dairy Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold tracking-tight">
                    Sita Ram <span className="text-red-200">Gokul Milk</span>
                  </h3>
                  <p className="text-red-100/70 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Est. 1995 • Sanepa, Kathmandu</p>
                </div>
              </div>
              <p className="text-sm text-red-50 leading-relaxed pr-4">
                Generations of pure goodness. Premium quality dairy and nutritional products from Nepal's trusted regional farming networks.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h4 className="text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block">Explore</h4>
                <ul className="space-y-2.5">
                  {EXPLORE_LINKS.map(link => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-red-100 hover:text-white transition-all flex items-center gap-2 group text-sm font-medium">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">▸</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block">Support</h4>
                <ul className="space-y-2.5 text-red-50 text-sm">
                  <li className="flex gap-3 items-center"><MapPin className="shrink-0 w-4 h-4 text-red-300" /> <span> Kuleshwor and Jyatha (Factory outlets)</span></li>
                  <li className="flex gap-3 items-center"><Phone className="shrink-0 w-4 h-4 text-red-300" /> <span>015213049</span></li>
                  <li className="flex gap-3 items-center"><Mail className="shrink-0 w-4 h-4 text-red-300" /> <span>sgokulmilks1@gmail.com </span></li>
                  <li className="flex gap-3 items-center"><Clock className="shrink-0 w-4 h-4 text-red-300" /> <span>6 AM - 8 PM</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block">Follow Us</h4>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white text-[#C8102E] flex items-center justify-center hover:bg-red-100 transition-colors shadow-md group">
                      <div className="group-hover:scale-110 transition-transform">{Icon(16)}</div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block">Why Choose Us</h4>
                <ul className="space-y-2.5 text-red-50 text-sm">
                  <li className="flex gap-3 items-center"><Award className="shrink-0 w-4 h-4 text-red-300" /> <span>Premium Quality</span></li>
                  <li className="flex gap-3 items-center"><Leaf className="shrink-0 w-4 h-4 text-red-300" /> <span>Optimal Nutrition</span></li>
                  <li className="flex gap-3 items-center"><Shield className="shrink-0 w-4 h-4 text-red-300" /> <span>Reputable Industry</span></li>
                  <li className="flex gap-3 items-center"><Truck className="shrink-0 w-4 h-4 text-red-300" /> <span>Accessible Sourcing</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Availability Info Section */}
      <div className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Globe className="w-5 h-5 text-[#C8102E]" />
                <h4 className="text-sm font-bold tracking-wide text-gray-800 uppercase">Online Availability</h4>
              </div>
              <p className="text-gray-600 text-sm">Available on <span className="font-semibold text-[#C8102E]">Daraz</span></p>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <MapIcon className="w-5 h-5 text-[#C8102E]" />
                <h4 className="text-sm font-bold tracking-wide text-gray-800 uppercase">Nationally</h4>
              </div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-[#C8102E]">Biratnagar</span> • 
                <span className="font-semibold text-[#C8102E]"> Birgunj</span> • 
                <span className="font-semibold text-[#C8102E]"> Pokhara</span> • 
                <span className="font-semibold text-[#C8102E]"> Janakpur (Upcoming)</span>
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Plane className="w-5 h-5 text-[#C8102E]" />
                <h4 className="text-sm font-bold tracking-wide text-gray-800 uppercase">International</h4>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-semibold text-[#C8102E]">Dubai</span> • <span className="font-semibold text-[#C8102E]">Japan</span></p>
                <p className="text-xs text-gray-500">In Japan: Tokyo, Okinawa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Available On Section */}
      <div className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <h4 className="text-sm font-bold tracking-wide text-[#002147] uppercase border-b border-[#002147]/20 pb-2 mb-6 inline-block">Products Availability</h4>
            
            <div className="flex flex-wrap justify-center items-center gap-5">
              {AVAILABLE_ON.map((partner, index) => (
                <div key={index} className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-sm overflow-hidden flex items-center justify-center border border-gray-200 p-3 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <img 
                    src={partner.url} 
                    alt={partner.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = `https://placehold.co/80x80?text=${partner.initials}`; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Bar */}
      <div className="bg-white py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <p>© 2026 Sitaram Gokul Milks. All rights reserved.</p>
          <p>Designed and Developed by MotionAge.</p>
          <div className="flex gap-6">
            {/* 🔥 MODIFIED: Added specific parameter targets to trigger modal frames */}
            <button onClick={() => setActiveDoc('privacy')} className="hover:text-red-600 transition-colors uppercase font-bold text-[10px]">Privacy</button>
            <button onClick={() => setActiveDoc('terms')} className="hover:text-red-600 transition-colors uppercase font-bold text-[10px]">Terms</button>
            <button onClick={() => setActiveDoc('returns')} className="hover:text-red-600 transition-colors uppercase font-bold text-[10px]">Returns</button>
          </div>
        </div>
      </div>

      {/* 🔥 OVERLAY PANEL COMPONENT FOR BALANCED INLINE TEXT VIEWS */}
      <AnimatePresence>
        {activeDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] border border-gray-100 w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2 text-[#C8102E]">
                  <ShieldCheck size={20} />
                  <h4 className="font-serif font-black text-xl text-gray-900">{docContents[activeDoc].title}</h4>
                </div>
                <button 
                  onClick={() => setActiveDoc(null)}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto">
                {docContents[activeDoc].content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;