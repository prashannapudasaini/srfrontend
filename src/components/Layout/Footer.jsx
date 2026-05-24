import React from "react";
import { 
  MapPin, Phone, Mail, Clock, Award, Shield, Leaf, Truck, Globe, 
  Map as MapIcon,
  Plane 
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// --- Constants ---
const MARQUEE_ITEMS = [
  "BHAT BHATENI", "SALESBERRY", "BIG MART", "KC STORE", "METRO MARKET", "SMILE MART", "BIG MART", "HORIZONS MART","GAUTAM GENERAL","BIGMART","DARAZ"
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
  { icon: (s) => <Facebook s={s} />, label: "Facebook", href: "https://www.facebook.com/sitaramdairy" },
  { icon: (s) => <Instagram s={s} />, label: "Instagram", href: "https://www.instagram.com/sitaramdairy" },
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
      <div className="bg-white text-red-700 py-2.5 border-t border-b border-red-100 overflow-hidden mt-6">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex w-max whitespace-nowrap text-xs md:text-sm font-bold tracking-wider uppercase"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-10 px-5">
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
                  <p className="text-red-100/70 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Est. 1985 • Sanepa, Kathmandu</p>
                </div>
              </div>
              <p className="text-sm text-red-50 leading-relaxed pr-4">
                Generations of pure goodness. Premium organic dairy and artisanal bakery products from Nepal's lush pastures.
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

              {/* Why Choose Us */}
              <div className="space-y-4">
                <h4 className="text-base font-bold tracking-tight border-b border-white/20 pb-1.5 inline-block">Why Choose Us</h4>
                <ul className="space-y-2.5 text-red-50 text-sm">
                  <li className="flex gap-3 items-center"><Award className="shrink-0 w-4 h-4 text-red-300" /> <span>Premium Quality</span></li>
                  <li className="flex gap-3 items-center"><Leaf className="shrink-0 w-4 h-4 text-red-300" /> <span>100% Organic</span></li>
                  <li className="flex gap-3 items-center"><Shield className="shrink-0 w-4 h-4 text-red-300" /> <span>Trusted Since 1985</span></li>
                  <li className="flex gap-3 items-center"><Truck className="shrink-0 w-4 h-4 text-red-300" /> <span>Fast Delivery</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. New Availability Info Section */}
      <div className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Online Availability */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Globe className="w-5 h-5 text-[#C8102E]" />
                <h4 className="text-sm font-bold tracking-wide text-gray-800 uppercase">Online Availability</h4>
              </div>
              <p className="text-gray-600 text-sm">Available on <span className="font-semibold text-[#C8102E]">Daraz</span></p>
            </div>

            {/* Nationally - Using MapIcon instead of Map */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <MapIcon className="w-5 h-5 text-[#C8102E]" />
                <h4 className="text-sm font-bold tracking-wide text-gray-800 uppercase">Nationally</h4>
              </div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-[#C8102E]">Biratnagar</span> • 
                <span className="font-semibold text-[#C8102E]"> Birgunj</span> • 
                <span className="font-semibold text-[#C8102E]"> Pokhara</span>
              </p>
            </div>

            {/* International */}
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

     {/* 4. Available On Section - Partner Stores */}
<div className="bg-gray-50 py-10 border-t border-gray-200">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <div className="text-center mb-8">
      <h4 className="text-2xl font-bold tracking-wide text-gray-800 uppercase">
        Our Partner Stores
      </h4>

      <div className="w-24 h-1 bg-[#C8102E] mx-auto mt-3 rounded-full"></div>
    </div>

    {/* Logos Container */}
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex justify-center items-center gap-6 min-w-max py-3">

        {AVAILABLE_ON.map((partner, index) => (
          <div
            key={index}
            className="
              w-[120px]
              h-[120px]
              bg-white
              rounded-2xl
              shadow-md
              border border-gray-200
              flex items-center justify-center
              p-4
              transition-all duration-300
              hover:-translate-y-2
              hover:shadow-2xl
              hover:border-[#C8102E]
            "
          >
            <img
              src={partner.url}
              alt={partner.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = `https://placehold.co/120x120?text=${partner.initials}`;
              }}
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
          <p>© 2026 Sita Ram Dairy. All rights reserved.</p>
          <p>Designed and Developed by MotionAge.</p>
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