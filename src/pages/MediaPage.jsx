import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Video, X, PlayCircle } from 'lucide-react';

// Custom YouTube SVG Component to fix Lucide-React Import Errors
const YoutubeIcon = ({ size = 18 }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 103.38 103.38 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 103.38 103.38 0 0 1-15 0 2 2 0 0 1-2-2Z" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const IMAGE_GALLERY = [
  { id: 1, title: 'Annual Farmer Training Program', url: 'data:image/jpeg;base64,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' },
  { id: 2, title: 'New Organic Pastures', url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Dairy Processing Unit Upgrade', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKDNzsukk1lkJ1ZYRwAWZeddZ6uPwa3k9G6g&s' },
  { id: 4, title: 'Community Outreach Program', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'Milk Collection Centers', url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'Sita Ram Dairy Award Ceremony', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw00XXNT3ny_cd4qxeCDSjR3Tn_vVD24CYAA&s' },
];

const VIDEO_GALLERY = [
  { id: 1, title: 'Inside Our Processing Plant', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1554973653-c9071bd14011?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'A Day at the Dairy Farm', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1527847263472-aa5338d17f6f?auto=format&fit=crop&q=80&w=800' },
];

const YOUTUBE_VIDEOS = [
  { id: 'Iinnywe4gPA', title: 'Product Diversification Interview || Sumit Kedia' },
  { id: 'Iinnywe4gPA', title: 'TVET Opportunities: Sumit Kedia (Sita Ram Dairy)' },
  { id: 'Iinnywe4gPA', title: 'Sitaram Dairy Co-operative - Story of a new revolution' },
];

export default function MediaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('images');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['images', 'videos', 'youtube'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    navigate(`/media?tab=${tab}`);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans">
      <div className="bg-[#9e111a] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/city-silhouette.png')] bg-repeat-x bg-bottom mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-4">
            Gallery & Updates
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight"
          >
            Sita Ram <span className="text-red-300">Media</span>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-20 -mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
          {[
            { id: 'images', label: 'Images', icon: <ImageIcon size={18} /> },
            { id: 'videos', label: 'Videos', icon: <Video size={18} /> },
            { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-[#1A1A1A] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#9e111a]'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'images' && (
            <motion.div 
              key="images"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {IMAGE_GALLERY.map((img) => (
                <div key={img.id} onClick={() => setSelectedImage(img)} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center">
                      <ImageIcon className="text-white opacity-0 group-hover:opacity-100" size={32} />
                    </div>
                  </div>
                  <div className="p-5 text-center"><h3 className="font-bold text-[#1A1A1A] text-[15px]">{img.title}</h3></div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div 
              key="videos"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {VIDEO_GALLERY.map((vid) => (
                <div key={vid.id} onClick={() => setSelectedVideo(vid)} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img src={vid.poster} alt={vid.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#9e111a] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110">
                        <PlayCircle size={32} />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <span className="text-[#9e111a] text-[10px] font-bold uppercase tracking-widest mb-1 block">Internal Clip</span>
                    <h3 className="font-black text-xl text-[#1A1A1A]">{vid.title}</h3>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'youtube' && (
            <motion.div 
              key="youtube"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {YOUTUBE_VIDEOS.map((yt) => (
                <div key={yt.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="relative aspect-video bg-gray-100">
                    <iframe className="w-full h-full absolute top-0 left-0" src={`https://www.youtube.com/embed/${yt.id}`} title={yt.title} frameBorder="0" allowFullScreen></iframe>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-[#E41E26]"><YoutubeIcon size={16} /></div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Sita Ram YouTube</span>
                    </div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm leading-snug">{yt.title}</h3>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4">
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full"><X size={24} /></button>
            <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[80vh] rounded-xl" />
            <p className="text-white text-lg font-bold mt-6">{selectedImage.title}</p>
          </motion.div>
        )}

        {selectedVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full"><X size={24} /></button>
            <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden">
              <video controls autoPlay className="w-full h-full"><source src={selectedVideo.videoUrl} type="video/mp4" /></video>
            </div>
            <p className="text-white text-xl font-bold mt-6">{selectedVideo.title}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}