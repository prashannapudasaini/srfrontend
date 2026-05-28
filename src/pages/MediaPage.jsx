import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon, X, Loader2, Calendar } from 'lucide-react';
import api from '../services/api';

export default function MediaPage() {
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' or 'videos'
  const [loading, setLoading] = useState(true);

  // Gallery Lightbox State
  const [selectedGallery, setSelectedGallery] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPublicMedia();
  }, []);

  const fetchPublicMedia = async () => {
    try {
      // Fetching from the dynamic endpoints you created for the admin
      const [eventsRes, ytRes] = await Promise.all([
        api.get('/admin/media/events.php').catch(() => ({ data: { data: [] } })),
        api.get('/admin/media/youtube.php').catch(() => ({ data: { data: [] } }))
      ]);
      
      if (eventsRes?.data?.data) setEvents(eventsRes.data.data);
      if (ytRes?.data?.data) setVideos(ytRes.data.data);
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24 font-sans selection:bg-[#9e111a] selection:text-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#E2B254]/20 text-[#002147] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <ImageIcon size={14} /> Media Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-black text-[#1A1A1A] mb-6 tracking-tight"
          >
            Our Journey in <span className="text-[#9e111a]">Pictures & Video</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed"
          >
            Take a look behind the scenes at Sita Ram Dairy. From our lush green pastures to community events and factory tours.
          </motion.p>
        </div>

        {/* Custom Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
            <button 
              onClick={() => setActiveTab('photos')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeTab === 'photos' ? 'bg-[#002147] text-[#E2B254] shadow-md' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <ImageIcon size={16} /> Photo Galleries
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeTab === 'videos' ? 'bg-[#9e111a] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Play size={16} /> Video Tours
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-[#002147]">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-black tracking-widest uppercase text-sm">Loading Media...</p>
          </div>
        )}

        {/* Content Area */}
        {!loading && (
          <AnimatePresence mode="wait">
            
            {/* --- PHOTOS TAB --- */}
            {activeTab === 'photos' && (
              <motion.div 
                key="photos"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {events.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold uppercase tracking-widest">No galleries published yet.</p>
                  </div>
                ) : events.map((event, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    key={event.id} 
                    onClick={() => setSelectedGallery(event)}
                    className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all group cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img 
                        src={event.cover} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      
                      {/* Floating Info Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#002147] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                        <ImageIcon size={12} /> {(event.images?.length || 0) + 1} Photos
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-xl font-serif font-black text-white leading-tight mb-2 group-hover:text-[#E2B254] transition-colors">{event.title}</h3>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar size={12} /> {new Date(event.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* --- VIDEOS TAB --- */}
            {activeTab === 'videos' && (
              <motion.div 
                key="videos"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
              >
                {videos.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    <Play size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold uppercase tracking-widest">No videos published yet.</p>
                  </div>
                ) : videos.map((video, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                    key={video.id} 
                    className="bg-white rounded-[2rem] p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
                  >
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${video.youtube_id}`} 
                        title={video.title}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    <div className="pt-6 px-2 pb-2 text-center">
                      <h3 className="text-lg font-black text-[#1A1A1A] leading-tight">{video.title}</h3>
                      <p className="text-[#9e111a] text-[10px] font-black uppercase tracking-widest mt-2">Official Video</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* --- GALLERY LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedGallery && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col"
          >
            {/* Lightbox Header */}
            <div className="flex justify-between items-center p-6 text-white shrink-0">
              <div>
                <h2 className="text-2xl font-serif font-black">{selectedGallery.title}</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Gallery View</p>
              </div>
              <button 
                onClick={() => setSelectedGallery(null)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Lightbox Scrollable Images */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 sm:p-8">
              <div className="max-w-5xl mx-auto space-y-8 pb-20">
                {/* Always show the cover image first */}
                <img src={selectedGallery.cover} alt="Cover" className="w-full rounded-2xl shadow-2xl border border-white/10" />
                
                {/* Show the rest of the uploaded images */}
                {selectedGallery.images && selectedGallery.images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {selectedGallery.images.map((imgUrl, i) => (
                      <img key={i} src={imgUrl} alt={`Gallery ${i}`} className="w-full rounded-2xl shadow-2xl border border-white/10" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}