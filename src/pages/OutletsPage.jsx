import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, Phone, Clock, ArrowRight, RefreshCw } from 'lucide-react';

// Updated: Centralized data for dynamic dropdowns (1 State, 3 Cities)
const REGION_DATA = {
  "Bagmati": {
    cities: {
      "Kathmandu": ["Tokha Headquarters", "Chabahil Outlet", "Koteshwor Bhatbhateni"],
      "Bhaktapur": ["Suryabinayak Fresh Outlet"],
      "Lalitpur": ["Jhamsikhel Heritage Branch"]
    }
  }
};

// Updated: All physical outlets mapped with state, city, and Google Map Embed URLs
const ALL_OUTLETS = [
  {
    name: "Tokha Headquarters",
    state: "Bagmati",
    city: "Kathmandu",
    address: "Bhutkhel, Tokha, Kathmandu 44600",
    phone: "+977 1-438xxxx",
    hours: "5:00 AM - 7:00 PM (Daily)",
    isMain: true,
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14122.393437149098!2d85.3195029!3d27.7599028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1edebc3d790d%3A0x6b77134d16611361!2sTokha%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
  },
  {
    name: "Chabahil Outlet",
    state: "Bagmati",
    city: "Kathmandu",
    address: "Chabahil Chowk, Kathmandu",
    phone: "+977 980-xxxxxxx",
    hours: "6:30 AM - 8:00 PM (Daily)",
    isMain: false,
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.062024105267!2d85.34444531506222!3d27.71536708278854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196e1b696aab%3A0xc3b0e45447c28c!2sChabahil%20Chowk!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
  },
  {
    name: "Koteshwor Bhatbhateni",
    state: "Bagmati",
    city: "Kathmandu",
    address: "Koteshwor, Kathmandu",
    phone: "+977 1-412xxxx",
    hours: "7:00 AM - 8:00 PM (Daily)",
    isMain: false,
    // Using the actual Google Maps embed for Koteshwor Bhatbhateni to ensure it renders correctly
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.1555543169766!2d85.342138!3d27.68156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19920d367463%3A0xe54fb77d018b323a!2sBhat-Bhateni%20Supermarket%20and%20Departmental%20Store%2C%20Koteshwor!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
  },
  {
    name: "Jhamsikhel Heritage Branch",
    state: "Bagmati",
    city: "Lalitpur",
    address: "Jhamsikhel Road, Lalitpur",
    phone: "+977 981-xxxxxxx",
    hours: "6:30 AM - 7:30 PM (Daily)",
    isMain: false,
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.178972824989!2d85.308232!3d27.6808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb183556093557%3A0xeab50d3c40fa96b5!2sJhamsikhel%2C%20Patan%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
  },
  {
    name: "Suryabinayak Fresh Outlet",
    state: "Bagmati",
    city: "Bhaktapur",
    address: "Suryabinayak Chowk, Bhaktapur",
    phone: "+977 1-661xxxx",
    hours: "6:00 AM - 7:00 PM (Daily)",
    isMain: false,
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.8824103138676!2d85.4217105!3d27.6745749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1aa9c2627993%3A0xa6436ef8df9644ba!2sSuryabinayak%2C%20Bhaktapur%2044800!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
  }
];

export default function OutletsPage() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  
  const [displayedOutlets, setDisplayedOutlets] = useState(ALL_OUTLETS);

  // Handle cascading dropdown resets
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity("");
    setSelectedStore("");
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedStore("");
  };

  // Search Logic
  const handleFindStore = () => {
    let filtered = ALL_OUTLETS;

    if (selectedState) {
      filtered = filtered.filter(o => o.state === selectedState);
    }
    if (selectedCity) {
      filtered = filtered.filter(o => o.city === selectedCity);
    }
    if (selectedStore) {
      filtered = filtered.filter(o => o.name === selectedStore);
    }

    setDisplayedOutlets(filtered);
  };

  // Reset Logic
  const handleReset = () => {
    setSelectedState("");
    setSelectedCity("");
    setSelectedStore("");
    setDisplayedOutlets(ALL_OUTLETS);
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24 font-sans">
      
      {/* ========================================== */}
      {/* HERO SECTION                               */}
      {/* ========================================== */}
      <div className="bg-[#9e111a] pt-32 pb-36 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 bg-[url('/city-silhouette.png')] bg-repeat-x bg-bottom" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-serif font-black text-white tracking-tight"
          >
            Near You
          </motion.h1>
        </div>
      </div>

      {/* ========================================== */}
      {/* STORE LOCATOR                              */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 -mt-20 mb-16">
        <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6 md:p-10">
          <h2 className="text-2xl font-black text-[#002147] uppercase tracking-wider mb-2">Store Locator</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">Find a Sita Ram Dairy store near you</p>

          <div className="flex flex-col md:flex-row gap-5">
            {/* Dropdown: State / Province */}
            <div className="flex-1">
              <select 
                value={selectedState} 
                onChange={handleStateChange}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:border-[#9e111a] appearance-none bg-white cursor-pointer"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "20px" }}
              >
                <option value="">Select State / Province</option>
                {Object.keys(REGION_DATA).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Dropdown: City */}
            <div className="flex-1">
              <select 
                value={selectedCity} 
                onChange={handleCityChange}
                disabled={!selectedState}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:border-[#9e111a] appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "20px" }}
              >
                <option value="">City</option>
                {selectedState && Object.keys(REGION_DATA[selectedState].cities).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Dropdown: Specific Store */}
            <div className="flex-1">
              <select 
                value={selectedStore} 
                onChange={(e) => setSelectedStore(e.target.value)}
                disabled={!selectedCity}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:border-[#9e111a] appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "20px" }}
              >
                <option value="">Store</option>
                {selectedState && selectedCity && REGION_DATA[selectedState].cities[selectedCity].map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons: Find & Reset */}
            <div className="flex-1 flex gap-3">
              <button 
                onClick={handleFindStore}
                className="flex-1 h-12 bg-[#002147] hover:bg-[#00152e] text-white text-[14px] font-bold uppercase tracking-wide rounded-lg flex items-center justify-between px-4 lg:px-6 transition-colors shadow-md"
              >
                <span>Find Store</span>
                <ArrowRight size={18} className="hidden sm:block" />
              </button>
              
              <button 
                onClick={handleReset}
                title="Reset Filters"
                className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center transition-colors border border-gray-200 shadow-sm shrink-0"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* OUTLETS RESULTS GRID                         */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {displayedOutlets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Store size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#002147] mb-2">No Stores Found</h3>
            <p className="text-sm text-gray-500">Please adjust your search criteria to find nearby outlets.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatePresence>
              {displayedOutlets.map((outlet, index) => (
                <motion.div 
                  key={outlet.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 p-8 rounded-2xl relative hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Headquarters Red Badge */}
                  {outlet.isMain && (
                    <div className="absolute top-0 right-0 bg-[#9e111a] text-white px-4 py-1.5 rounded-bl-xl font-bold text-[10px] uppercase tracking-widest z-10 shadow-sm">
                      Headquarters
                    </div>
                  )}
                  
                  {/* Top Header Row */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${outlet.isMain ? 'bg-red-50 text-[#9e111a]' : 'bg-gray-50 text-gray-500'}`}>
                      <Store size={24} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        {outlet.city}, {outlet.state}
                      </p>
                      <h3 className="text-xl font-bold text-[#002147] leading-tight">
                        {outlet.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-full h-px bg-gray-100 mb-6"></div>
                  
                  {/* Information Rows */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 text-gray-600">
                      <MapPin className="shrink-0 text-gray-400 mt-0.5" size={18} />
                      <p className="text-[15px] font-medium">{outlet.address}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <Phone className="shrink-0 text-gray-400" size={18} />
                      <p className="text-[15px] font-medium">{outlet.phone}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[#1A1A1A]">
                      <Clock className="shrink-0 text-[#9e111a]" size={18} />
                      <p className="text-[15px] font-bold">{outlet.hours}</p>
                    </div>
                  </div>

                  {/* Google Maps Embed */}
                  <div className="mt-auto w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                    <iframe 
                      src={outlet.mapUrl} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${outlet.name} Location Map`}
                    ></iframe>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

    </div>
  );
}