import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

// Centralized data for dynamic dropdowns
const REGION_DATA = {
  "Kathmandu": {
    cities: ["Kathmandu Metro", "Tokha", "Chabahil"],
    stores: ["Chabahil Outlet", "Tokha Headquarters"]
  },
  "Bhaktapur": {
    cities: ["Bhaktapur Municipality", "Suryabinayak"],
    stores: ["Suryabinayak Fresh Outlet"]
  },
  "Lalitpur": {
    cities: ["Lalitpur Metro", "Jhamsikhel"],
    stores: ["Jhamsikhel Heritage Branch"]
  }
};

// All physical outlets mapped with metadata for filtering
const ALL_OUTLETS = [
  {
    name: "Tokha Headquarters",
    state: "Kathmandu",
    city: "Tokha",
    address: "Bhutkhel, Tokha, Kathmandu 44600",
    phone: "+977 1-438xxxx",
    hours: "5:00 AM - 7:00 PM (Daily)",
    isMain: true
  },
  {
    name: "Chabahil Outlet",
    state: "Kathmandu",
    city: "Chabahil",
    address: "Chabahil Chowk, Kathmandu",
    phone: "+977 980-xxxxxxx",
    hours: "6:30 AM - 8:00 PM (Daily)",
    isMain: false
  },
  {
    name: "Jhamsikhel Heritage Branch",
    state: "Lalitpur",
    city: "Jhamsikhel",
    address: "Jhamsikhel Road, Lalitpur",
    phone: "+977 981-xxxxxxx",
    hours: "6:30 AM - 7:30 PM (Daily)",
    isMain: false
  },
  {
    name: "Suryabinayak Fresh Outlet",
    state: "Bhaktapur",
    city: "Suryabinayak",
    address: "Suryabinayak Chowk, Bhaktapur",
    phone: "+977 1-661xxxx",
    hours: "6:00 AM - 7:00 PM (Daily)",
    isMain: false
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
                {selectedState && REGION_DATA[selectedState].cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Dropdown: Specific Store */}
            <div className="flex-1">
              <select 
                value={selectedStore} 
                onChange={(e) => setSelectedStore(e.target.value)}
                disabled={!selectedState}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:border-[#9e111a] appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "20px" }}
              >
                <option value="">Store</option>
                {selectedState && REGION_DATA[selectedState].stores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleFindStore}
              className="flex-1 h-12 bg-[#002147] hover:bg-[#00152e] text-white text-[15px] font-bold uppercase tracking-wide rounded-lg flex items-center justify-between px-6 transition-colors shadow-md"
            >
              <span>Find Store</span>
              <ArrowRight size={18} />
            </button>
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
                  className="bg-white border border-gray-200 p-8 rounded-2xl relative hover:shadow-xl transition-all duration-300 overflow-hidden"
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
                  <div className="space-y-4">
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
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

    </div>
  );
}