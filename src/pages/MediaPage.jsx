import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ArrowLeft, ChevronRight } from 'lucide-react';

// Custom YouTube SVG Component
const YoutubeIcon = ({ size = 18 }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 103.38 103.38 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 103.38 103.38 0 0 1-15 0 2 2 0 0 1-2-2Z" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

// --- EVENT BASED DATA ---
const EVENTS_GALLERY = [
  {
    id: 1,
    title: 'Farmer Support Program 2025',
    cover: 'https://images.unsplash.com/photo-1596733430284-f743727521a0?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1596733430284-f743727521a0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595841696677-5430885e7903?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 2,
    title: 'Annual Excellence Awards',
    cover: 'https://images.unsplash.com/photo-1574689049868-e93892dc4793?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1574689049868-e93892dc4793?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 3,
    title: 'Dairy Farm Expo 2025',
    cover: 'https://images.unsplash.com/photo-1628148671408-54c2daecfcfa?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1628148671408-54c2daecfcfa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 4,
    title: 'Community Health Camp',
    cover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584515933487-759f3d029146?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582750433449-64c390748301?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

const YOUTUBE_VIDEOS = [
  { id: 'Iinnywe4gPA', title: 'Sitaram Dairy Co-operative - Story of a New Revolution' },
  { id: 'qX1dYysILww', title: 'Product Diversification Interview || Sumit Kedia' },
  { id: 'tzFG4YWnHFk', title: 'TVET Opportunities: Sumit Kedia (Sitaram Dairy)' },
];

export default function MediaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('images');
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['images', 'youtube'].includes(tab)) {
      setActiveTab(tab);
      setSelectedEvent(null); 
    }
  }, [location]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    navigate(`/media?tab=${tab}`);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans">
      {/* Hero Section */}
      <div className="bg-[#9e111a] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/city-silhouette.png')] bg-repeat-x bg-bottom mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-4">
            Gallery & Updates
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight"
          >
            Sita Ram <span className="text-red-300">Media</span>
          </motion.h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-md mx-auto px-4 sm:px-6 relative z-20 -mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2 border border-gray-100">
          {[
            { id: 'images', label: 'Events', icon: <ImageIcon size={18} /> },
            { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-[#1A1A1A] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          
          {/* --- IMAGES / EVENTS TAB --- */}
          {activeTab === 'images' && (
            <motion.div key="images" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!selectedEvent ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {EVENTS_GALLERY.map((event) => (
                    <motion.div 
                      key={event.id}
                      whileHover={{ y: -10 }}
                      onClick={() => setSelectedEvent(event)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-md border-4 border-white group-hover:shadow-2xl transition-all duration-500">
                        <img src={event.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute bottom-0 p-6">
                            <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded mb-2 inline-block">Program</span>
                            <h3 className="text-white font-serif font-black text-xl leading-tight">{event.title}</h3>
                            <div className="flex items-center gap-2 text-white/70 text-xs font-bold mt-4 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                View Gallery <ChevronRight size={14} />
                            </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <button 
                        onClick={() => setSelectedEvent(null)}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-sm uppercase tracking-widest transition-colors"
                    >
                        <ArrowLeft size={18} /> Back to Programs
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
                        <h2 className="text-3xl font-serif font-black text-[#1A1A1A]">{selectedEvent.title}</h2>
                        <span className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">{selectedEvent.images.length} Photos Captured</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {selectedEvent.images.map((img, idx) => (
                            <motion.div 
                                key={idx} 
                                whileHover={{ scale: 1.03 }}
                                onClick={() => setSelectedImage({ url: img, title: `${selectedEvent.title} - Photo ${idx + 1}` })}
                                className="aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm border-2 border-white"
                            >
                                <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* --- YOUTUBE TAB --- */}
          {activeTab === 'youtube' && (
            <motion.div key="youtube" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {YOUTUBE_VIDEOS.map((yt) => (
                <div key={yt.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                  <div className="relative aspect-video bg-gray-100">
                    <iframe 
                      className="w-full h-full absolute top-0 left-0" src={`https://www.youtube.com/embed/${yt.id}`} 
                      title={yt.title} frameBorder="0" allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-[#E41E26]"><YoutubeIcon size={16} /></div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Official Channel</span>
                    </div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm leading-snug">{yt.title}</h3>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- LIGHTBOX OVERLAY --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4">
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"><X size={28} /></button>
            <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
            <p className="text-white text-lg font-bold mt-6 tracking-wide">{selectedImage.title}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}