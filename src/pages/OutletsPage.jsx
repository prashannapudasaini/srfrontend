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
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      
      {/* ========================================== */}
      {/* HERO SECTION (Red Banner styling)            */}
      {/* ========================================== */}
      <div className="bg-[#E41E26] pt-32 pb-36 relative overflow-hidden">
        {/* Subtle background pattern/graphics to mimic the city silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 bg-[url('/city-silhouette.png')] bg-repeat-x bg-bottom" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-7xl font-black text-white tracking-tight"
          >
            Near You
          </motion.h1>
        </div>
      </div>

      {/* ========================================== */}
      {/* STORE LOCATOR (Overlapping White Box)        */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 -mt-20 mb-16">
        <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6 md:p-10">
          <h2 className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Store Locator</h2>
          <p className="text-base text-gray-500 mb-8">Find a Sita Ram Dairy store near you</p>

          <div className="flex flex-col md:flex-row gap-5">
            {/* Dropdown: State / Province */}
            <div className="flex-1">
              <select 
                value={selectedState} 
                onChange={handleStateChange}
                className="w-full h-14 px-5 border border-gray-200 rounded-lg text-gray-700 text-base focus:outline-none focus:border-[#E41E26] appearance-none bg-white cursor-pointer"
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
                className="w-full h-14 px-5 border border-gray-200 rounded-lg text-gray-700 text-base focus:outline-none focus:border-[#E41E26] appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                className="w-full h-14 px-5 border border-gray-200 rounded-lg text-gray-700 text-base focus:outline-none focus:border-[#E41E26] appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
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
              className="flex-1 h-14 bg-[#E41E26] text-white text-lg font-bold rounded-lg flex items-center justify-between px-8 hover:bg-[#c4161f] transition-colors"
            >
              <span>Find Store</span>
              <ArrowRight size={22} />
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
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Store size={40} />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No Stores Found</h3>
            <p className="text-lg text-gray-500">Please adjust your search criteria to find nearby outlets.</p>
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
                  className="bg-white border border-gray-200 p-8 md:p-10 rounded-2xl relative hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Headquarters Red Badge */}
                  {outlet.isMain && (
                    <div className="absolute top-0 right-0 bg-[#E41E26] text-white px-5 py-2 rounded-bl-2xl font-black text-xs uppercase tracking-widest z-10 shadow-sm">
                      Headquarters
                    </div>
                  )}
                  
                  {/* Top Header Row */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center shrink-0 ${outlet.isMain ? 'bg-red-50 text-[#E41E26]' : 'bg-gray-50 text-gray-500'}`}>
                      <Store size={32} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center pt-1">
                      <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        {outlet.city}, {outlet.state}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-serif font-black text-[#1A1A1A] leading-none">
                        {outlet.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-full h-px bg-gray-100 mb-8"></div>
                  
                  {/* Information Rows */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-5 text-gray-600">
                      <MapPin className="shrink-0 text-gray-400 mt-1" size={24} />
                      <p className="text-lg md:text-xl font-medium">{outlet.address}</p>
                    </div>
                    
                    <div className="flex items-center gap-5 text-gray-600">
                      <Phone className="shrink-0 text-gray-400" size={24} />
                      <p className="text-lg md:text-xl font-medium">{outlet.phone}</p>
                    </div>
                    
                    <div className="flex items-center gap-5 text-[#1A1A1A]">
                      <Clock className="shrink-0 text-[#E41E26]" size={24} />
                      <p className="text-lg md:text-xl font-bold">{outlet.hours}</p>
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