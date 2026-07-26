import React, { useState } from "react";
import { 
  MapPin, Phone, Mail, Clock, Award, Shield, Leaf, Truck, Globe, 
  Map as MapIcon, Plane, X, ShieldCheck
} from "lucide-react";
import FeaturedCarousel from "../Home/FeaturedCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- IMPORT i18n HOOK

// IMPORT LOCAL ASSETS HERE
import logo2 from '../../assets/2.png';
import logo3 from '../../assets/3.png';
import logo4 from '../../assets/4.png';
import logo5 from '../../assets/5.png';

// --- Constants ---
const MARQUEE_ITEMS = [
  "BHAT BHATENI", "SALESBERRY", "KC STORE", "METRO MARKET", "SMILE MART", "BIG MART", "HORIZONS MART","GAUTAM GENERAL","DARAZ"
];

const SOCIAL_LINKS = [
  { icon: (s) => <Facebook s={s} />, label: "Facebook", href: "https://www.facebook.com/sitaramdudh/" },
  { icon: (s) => <Instagram s={s} />, label: "Instagram", href: "https://www.instagram.com/sitaram.dudh/?hl=en" },
  { icon: (s) => <Youtube s={s} />, label: "YouTube", href: "https://www.youtube.com/@sitaramdairy" }
];

const AVAILABLE_ON = [
  { name: "Bhat Bhateni", url: "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/eae0449ffdcaaaecca846c6da03443e8", initials: "BB" },
  { name: "KC Store", url: logo2, initials: "KC" },
  { name: "Metro Market", url: logo3, initials: "MM" },
  { name: "Smile Mart", url: logo4, initials: "SM" },
  { name: "Horizons Mart", url: logo5, initials: "HM" },
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
  const [activeDoc, setActiveDoc] = useState(null);
  const { t, i18n } = useTranslation();
  const isNepali = i18n.language === 'ne';
  const nepaliFontClass = isNepali ? "font-['Noto_Sans_Devanagari','Mukta',sans-serif]" : "";

  // Dynamic Explore Links using existing nav translations
  const EXPLORE_LINKS = [
    { name: t('nav.home', 'Home'), path: "/" },
    { name: t('nav.products', 'Products'), path: "/products" },
    { name: t('nav.our_story', 'Our Story'), path: "/about" },
    { name: t('nav.services', 'Services'), path: "/services" },
    { name: t('nav.farm_updates', 'Notices'), path: "/notices" },
    { name: t('footer.blog', 'Blog'), path: "/blog" }
  ];

  const docContents = {
    privacy: {
      title: t('footer.docs.privacy.title', 'Privacy Policy'),
      content: (
        <div className={`space-y-4 text-gray-600 text-sm leading-relaxed ${nepaliFontClass}`}>
          <p className="font-bold text-gray-900">{t('footer.docs.privacy.p1')}</p>
          <p>{t('footer.docs.privacy.p2')}</p>
          <h5 className="font-bold text-gray-800 pt-2">{t('footer.docs.privacy.h1')}</h5>
          <p>{t('footer.docs.privacy.p3')}</p>
          <h5 className="font-bold text-gray-800 pt-2">{t('footer.docs.privacy.h2')}</h5>
          <p>{t('footer.docs.privacy.p4')}</p>
        </div>
      )
    },
    terms: {
      title: t('footer.docs.terms.title', 'Terms & Conditions'),
      content: (
        <div className={`space-y-4 text-gray-600 text-sm leading-relaxed ${nepaliFontClass}`}>
          <p className="font-bold text-gray-900">{t('footer.docs.terms.p1')}</p>
          <p>{t('footer.docs.terms.p2')}</p>
          <h5 className="font-bold text-gray-800 pt-2">{t('footer.docs.terms.h1')}</h5>
          <p>{t('footer.docs.terms.p3')}</p>
          <h5 className="font-bold text-gray-800 pt-2">{t('footer.docs.terms.h2')}</h5>
          <p>{t('footer.docs.terms.p4')}</p>
        </div>
      )
    },
    returns: {
      title: t('footer.docs.returns.title', 'Returns & Refund Policy'),
      content: (
        <div className={`space-y-4 text-gray-600 text-sm leading-relaxed ${nepaliFontClass}`}>
          <p className="font-bold text-gray-900">{t('footer.docs.returns.p1')}</p>
          <p>{t('footer.docs.returns.p2')}</p>
          <h5 className="font-bold text-gray-800 pt-2">{t('footer.docs.returns.h1')}</h5>
          <p>{t('footer.docs.returns.p3')}</p>
          <h5 className="font-bold text-gray-800 pt-2">{t('footer.docs.returns.h2')}</h5>
          <p>{t('footer.docs.returns.p4')}</p>
        </div>
      )
    }
  };

  return (
    <footer className="w-full flex flex-col bg-white overflow-hidden">
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
                  <h3 className={`text-xl md:text-2xl font-serif font-bold tracking-tight ${nepaliFontClass}`}>
                    {t('brand.name')} <span className="text-red-200">{t('footer.brandSubtitle2', 'Gokul Milk')}</span>
                  </h3>
                  <p className={`text-red-100/70 text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${nepaliFontClass}`}>
                    {t('footer.est', 'Est. 1995 • Sanepa, Kathmandu')}
                  </p>
                </div>
              </div>
              <p className={`text-sm text-red-50 leading-relaxed pr-4 ${nepaliFontClass}`}>
                {t('footer.brandDesc', 'Generations of pure goodness. Premium quality dairy and nutritional products from Nepal\'s trusted regional farming networks.')}
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h4 className={`text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block ${nepaliFontClass}`}>{t('footer.explore', 'Explore')}</h4>
                <ul className="space-y-2.5">
                  {EXPLORE_LINKS.map(link => (
                    <li key={link.name}>
                      <Link to={link.path} className={`text-red-100 hover:text-white transition-all flex items-center gap-2 group text-sm font-medium ${nepaliFontClass}`}>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">▸</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className={`text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block ${nepaliFontClass}`}>{t('footer.support', 'Support')}</h4>
                <ul className="space-y-2.5 text-red-50 text-sm">
                  <li className="flex gap-3 items-center"><MapPin className="shrink-0 w-4 h-4 text-red-300" /> <span className={nepaliFontClass}>{t('footer.address', 'Dudhpokhari 4, Kirtipur, Kathmandu')}</span></li>
                  <li className="flex gap-3 items-center"><Phone className="shrink-0 w-4 h-4 text-red-300" /> <span>015213049</span></li>
                  <li className="flex gap-3 items-center"><Mail className="shrink-0 w-4 h-4 text-red-300" /> <span>sgokulmilks1@gmail.com</span></li>
                  <li className="flex gap-3 items-center"><Clock className="shrink-0 w-4 h-4 text-red-300" /> <span className={nepaliFontClass}>{t('footer.hours', '9 AM - 5 PM')}</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className={`text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block ${nepaliFontClass}`}>{t('footer.followUs', 'Follow Us')}</h4>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white text-[#C8102E] flex items-center justify-center hover:bg-red-100 transition-colors shadow-md group">
                      <div className="group-hover:scale-110 transition-transform">{Icon(16)}</div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className={`text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block ${nepaliFontClass}`}>{t('footer.whyChooseUs', 'Why Choose Us')}</h4>
                <ul className={`space-y-2.5 text-red-50 text-sm ${nepaliFontClass}`}>
                  <li className="flex gap-3 items-center"><Award className="shrink-0 w-4 h-4 text-red-300" /> <span>{t('footer.reasons.0', 'Premium Quality')}</span></li>
                  <li className="flex gap-3 items-center"><Leaf className="shrink-0 w-4 h-4 text-red-300" /> <span>{t('footer.reasons.1', 'Optimal Nutrition')}</span></li>
                  <li className="flex gap-3 items-center"><Shield className="shrink-0 w-4 h-4 text-red-300" /> <span>{t('footer.reasons.2', 'Reputable Industry')}</span></li>
                  <li className="flex gap-3 items-center"><Truck className="shrink-0 w-4 h-4 text-red-300" /> <span>{t('footer.reasons.3', 'Accessible Sourcing')}</span></li>
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
                <h4 className={`text-sm font-bold tracking-wide text-gray-800 uppercase ${nepaliFontClass}`}>{t('footer.availability.online', 'Online Availability')}</h4>
              </div>
              <p className={`text-gray-600 text-sm ${nepaliFontClass}`}>{t('footer.availability.availableOn', 'Available on')} <span className="font-semibold text-[#C8102E]">Daraz</span></p>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <MapIcon className="w-5 h-5 text-[#C8102E]" />
                <h4 className={`text-sm font-bold tracking-wide text-gray-800 uppercase ${nepaliFontClass}`}>{t('footer.availability.nationally', 'Nationally')}</h4>
              </div>
              <p className={`text-gray-600 text-sm ${nepaliFontClass}`}>
                {t('footer.availability.cities', 'Biratnagar • Birgunj • Pokhara • Janakpur (Upcoming)')}
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Plane className="w-5 h-5 text-[#C8102E]" />
                <h4 className={`text-sm font-bold tracking-wide text-gray-800 uppercase ${nepaliFontClass}`}>{t('footer.availability.international', 'International')}</h4>
              </div>
              <div className={`space-y-1 text-sm text-gray-600 ${nepaliFontClass}`}>
                <p>{t('footer.availability.countries', 'Dubai • Japan')}</p>
                <p className="text-xs text-gray-500">{t('footer.availability.japanSub', 'In Japan: Tokyo, Okinawa')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Available On Section */}
      <div className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <h4 className={`text-sm font-bold tracking-wide text-[#002147] uppercase border-b border-[#002147]/20 pb-2 mb-6 inline-block ${nepaliFontClass}`}>
              {t('footer.productsAvailability', 'Products Availability')}
            </h4>
            
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
        <div className={`max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 ${nepaliFontClass}`}>
          <p>{t('footer.copyright', '© 2026 Sitaram Gokul Milks. All rights reserved.')}</p>
          <p>{t('footer.designedBy', 'Designed and Developed by')} <a href="https://motionage.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">MotionAge</a>.</p>
          <div className="flex gap-6">
            <button onClick={() => setActiveDoc('privacy')} className={`hover:text-red-600 transition-colors uppercase font-bold text-[10px] ${nepaliFontClass}`}>{t('footer.links.privacy', 'Privacy')}</button>
            <button onClick={() => setActiveDoc('terms')} className={`hover:text-red-600 transition-colors uppercase font-bold text-[10px] ${nepaliFontClass}`}>{t('footer.links.terms', 'Terms')}</button>
            <button onClick={() => setActiveDoc('returns')} className={`hover:text-red-600 transition-colors uppercase font-bold text-[10px] ${nepaliFontClass}`}>{t('footer.links.returns', 'Returns')}</button>
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
                  <h4 className={`font-serif font-black text-xl text-gray-900 ${nepaliFontClass}`}>{docContents[activeDoc].title}</h4>
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