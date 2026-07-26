import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, Phone, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

// We keep the non-translatable data (URLs, phones, booleans) here
const BASE_OUTLETS_DATA = {
  factory: {
    phone: "015213049",
    isMain: true,
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14133.07604169992!2d85.2671569!3d27.6781216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18635f5674c1%3A0x88981f3e742813df!2sKirtipur%2C%20Nepal!5e0!3m2!1sen!2sus!4v1717000000000!5m2!1sen!2sus"
  },
  kuleshwor: {
    phone: "015213049",
    isMain: false,
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14131.033785172605!2d85.2936279!3d27.6938363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb185a198533b5%3A0xc621b589a8dc735e!2sKuleshwor%2C%20Kathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2sus!4v1717000000001!5m2!1sen!2sus"
  }
};

export default function OutletsPage() {
  const { t, i18n } = useTranslation();
  const isNepali = i18n.language === 'ne';
  
  // Separated typography for clean Nepali rendering
  const headingStyle = isNepali ? "nepali-heading" : "tracking-wider";
  const bodyStyle = isNepali ? "nepali-body" : "leading-relaxed";

  // Dynamic State for filtering
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [displayedOutlets, setDisplayedOutlets] = useState([]);
  
  // 1. Merge Translated Text with Base Data dynamically
  const translatedOutlets = t('outletsPage.locations', { returnObjects: true });
  
  // Safely merge only the keys that exist in both translations and BASE_OUTLETS_DATA
  const ALL_OUTLETS = Object.keys(translatedOutlets)
    .filter(key => BASE_OUTLETS_DATA[key]) 
    .map(key => ({
      id: key,
      ...translatedOutlets[key],
      ...BASE_OUTLETS_DATA[key]
    }));

  // 2. Dynamically Generate REGION_DATA based on current language translations
  const REGION_DATA = {};
  ALL_OUTLETS.forEach(outlet => {
    if (!REGION_DATA[outlet.state]) {
      REGION_DATA[outlet.state] = { cities: {} };
    }
    if (!REGION_DATA[outlet.state].cities[outlet.city]) {
      REGION_DATA[outlet.state].cities[outlet.city] = [];
    }
    if (!REGION_DATA[outlet.state].cities[outlet.city].includes(outlet.name)) {
      REGION_DATA[outlet.state].cities[outlet.city].push(outlet.name);
    }
  });

  // Reset displayed outlets when language changes
  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

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
    if (selectedState) filtered = filtered.filter(o => o.state === selectedState);
    if (selectedCity) filtered = filtered.filter(o => o.city === selectedCity);
    if (selectedStore) filtered = filtered.filter(o => o.name === selectedStore);
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
    // 🔥 FIX: Changed pb-24 to pb-10 md:pb-20 to fix the massive gap above the footer
    <div className="bg-[#F8F9FA] min-h-screen pb-10 md:pb-20 font-sans">
      
      {/* ========================================== */}
      {/* HERO SECTION                               */}
      {/* ========================================== */}
      {/* 🔥 FIX: Changed pt-12 to pt-28 md:pt-32 so the text clears the navbar */}
      <div className="bg-[#9e111a] pt-28 md:pt-32 pb-28 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 bg-[url('/city-silhouette.png')] bg-repeat-x bg-bottom" />
        
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-4xl md:text-5xl font-serif font-black text-white tracking-tight ${headingStyle}`}
          >
            {t('outletsPage.heroTitle', 'Near You')}
          </motion.h1>
        </div>
      </div>

      {/* ========================================== */}
      {/* STORE LOCATOR                              */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 -mt-20 mb-12 md:mb-16">
        <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6 md:p-10">
          <h2 className={`text-2xl font-black text-[#002147] uppercase mb-2 ${headingStyle}`}>
            {t('outletsPage.locatorTitle', 'Store Locator')}
          </h2>
          <p className={`text-sm text-gray-500 mb-8 ${bodyStyle}`}>
            {t('outletsPage.locatorDesc', 'Find a Sita Ram Dairy store near you')}
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            {/* Dropdown: State / Province */}
            <div className="flex-1">
              <select 
                value={selectedState} 
                onChange={handleStateChange}
                className={`w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:border-[#9e111a] appearance-none bg-white cursor-pointer ${bodyStyle}`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "20px" }}
              >
                <option value="">{t('outletsPage.selectState', 'Select State / Province')}</option>
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
                className={`w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:border-[#9e111a] appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed ${bodyStyle}`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "20px" }}
              >
                <option value="">{t('outletsPage.selectCity', 'City')}</option>
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
                className={`w-full h-12 px-4 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:border-[#9e111a] appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed ${bodyStyle}`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "20px" }}
              >
                <option value="">{t('outletsPage.selectStore', 'Store')}</option>
                {selectedState && selectedCity && REGION_DATA[selectedState].cities[selectedCity].map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons: Find & Reset */}
            <div className="flex-1 flex gap-3">
              <button 
                onClick={handleFindStore}
                className={`flex-1 h-12 bg-[#002147] hover:bg-[#00152e] text-white text-[14px] font-bold uppercase tracking-wide rounded-lg flex items-center justify-between px-4 lg:px-6 transition-colors shadow-md ${headingStyle}`}
              >
                <span>{t('outletsPage.findBtn', 'Find Store')}</span>
                <ArrowRight size={18} className="hidden sm:block" />
              </button>
              
              <button 
                onClick={handleReset}
                title={t('outletsPage.resetBtn', 'Reset Filters')}
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
            <h3 className={`text-xl font-bold text-[#002147] mb-2 ${headingStyle}`}>
              {t('outletsPage.noStoresTitle', 'No Stores Found')}
            </h3>
            <p className={`text-sm text-gray-500 ${bodyStyle}`}>
              {t('outletsPage.noStoresDesc', 'Please adjust your search criteria to find nearby outlets.')}
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <AnimatePresence>
              {displayedOutlets.map((outlet, index) => (
                <motion.div 
                  key={outlet.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 p-6 md:p-8 rounded-[1.5rem] md:rounded-2xl relative hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Badge Text */}
                  {outlet.badgeText && (
                    <div className={`absolute top-0 right-0 bg-[#9e111a] text-white px-4 py-1.5 rounded-bl-xl font-bold text-[10px] uppercase tracking-widest z-10 shadow-sm ${headingStyle}`}>
                      {outlet.badgeText}
                    </div>
                  )}
                  
                  {/* Top Header Row */}
                  <div className="flex items-center gap-4 mb-6 mt-2 md:mt-0">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${outlet.isMain || outlet.badgeText ? 'bg-red-50 text-[#9e111a]' : 'bg-gray-50 text-gray-500'}`}>
                      <Store size={24} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className={`text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 ${headingStyle}`}>
                        {outlet.city}, {outlet.state}
                      </p>
                      <h3 className={`text-xl font-bold text-[#002147] leading-tight ${headingStyle}`}>
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
                      <p className={`text-[15px] font-medium ${bodyStyle}`}>{outlet.address}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <Phone className="shrink-0 text-gray-400" size={18} />
                      <p className="text-[15px] font-medium">{outlet.phone}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[#1A1A1A]">
                      <Clock className="shrink-0 text-[#9e111a]" size={18} />
                      <p className={`text-[15px] font-bold ${bodyStyle}`}>{outlet.hours}</p>
                    </div>
                  </div>

                  {/* Real Interactive Google Maps Embed */}
                  <div className="mt-auto w-full h-48 rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-gray-100">
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