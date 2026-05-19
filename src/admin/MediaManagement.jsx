import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon, X, UploadCloud, Video } from 'lucide-react';
import api from '../services/api';

export default function MediaManagement() {
  const [events, setEvents] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('events');

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const [eventsRes, ytRes] = await Promise.all([
        api.get('/admin/media/events.php').catch(() => ({ data: { data: [] } })),
        api.get('/admin/media/youtube.php').catch(() => ({ data: { data: [] } }))
      ]);
      if (eventsRes?.data?.data) setEvents(eventsRes.data.data);
      if (ytRes?.data?.data) setYoutubeVideos(ytRes.data.data);
    } catch (err) {
      console.error("Failed to fetch media", err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Delete this event and all its images?")) {
      await api.delete('/admin/media/events.php', { data: { id } });
      fetchMedia();
    }
  };

  const handleDeleteYoutube = async (id) => {
    if (window.confirm("Remove this YouTube link?")) {
      await api.delete('/admin/media/youtube.php', { data: { id } });
      fetchMedia();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-[2rem] flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#9e111a] rounded-2xl flex items-center justify-center text-white shrink-0">
            <ImageIcon size={24}/>
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">Media Manager</h2>
            <p className="text-[10px] font-bold text-[#9e111a] uppercase tracking-widest mt-1">Manage Galleries & Videos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setActiveTab('events')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-[#9e111a] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          Event Galleries
        </button>
        <button 
          onClick={() => setActiveTab('youtube')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'youtube' ? 'bg-[#002147] text-[#E2B254] shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          YouTube Links
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 min-h-[500px]">
        
        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="animate-in fade-in duration-300">
            <button onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }} className="mb-6 bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#9e111a] transition-all shadow-md">
              <Plus size={16} /> Create New Event
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400">
                  <ImageIcon size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-widest">No events found.</p>
                </div>
              ) : events.map(event => (
                <div key={event.id} className="border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all relative group bg-white">
                  <img src={event.cover} className="w-full aspect-[4/3] object-cover rounded-xl mb-4 bg-gray-50" alt={event.title} />
                  <h3 className="font-bold text-[#1A1A1A] line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-gray-400 mb-4 font-medium">{event.images?.length || 0} Images</p>
                  
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingEvent(event); setIsEventModalOpen(true); }} className="flex-1 bg-gray-50 hover:bg-[#002147] hover:text-[#E2B254] text-gray-700 py-2 rounded-lg text-sm font-bold flex justify-center transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="flex-1 bg-red-50 hover:bg-[#9e111a] hover:text-white text-red-600 py-2 rounded-lg text-sm font-bold flex justify-center transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Tab */}
        {activeTab === 'youtube' && (
          <div className="animate-in fade-in duration-300">
             <button onClick={() => setIsYoutubeModalOpen(true)} className="mb-6 bg-[#002147] text-[#E2B254] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#1A1A1A] hover:text-white transition-all shadow-md">
              <Video size={16} /> Add YouTube Link
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400">
                  <Video size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-widest">No videos found.</p>
                </div>
              ) : youtubeVideos.map(yt => (
                <div key={yt.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                  <div className="aspect-video bg-gray-100 relative">
                    <img src={`https://img.youtube.com/vi/${yt.youtube_id}/hqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={yt.title} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                       <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">▶</div>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-start gap-4 bg-white">
                    <h3 className="font-bold text-sm text-[#1A1A1A] line-clamp-2 leading-tight">{yt.title}</h3>
                    <button onClick={() => handleDeleteYoutube(yt.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isEventModalOpen && <EventModal event={editingEvent} closeModal={() => setIsEventModalOpen(false)} refresh={fetchMedia} />}
      {isYoutubeModalOpen && <YoutubeModal closeModal={() => setIsYoutubeModalOpen(false)} refresh={fetchMedia} />}
    </div>
  );
}

// --- EVENT FORM MODAL ---
function EventModal({ event, closeModal, refresh }) {
  const [title, setTitle] = useState(event?.title || '');
  const [cover, setCover] = useState(event?.cover || '');
  const [images, setImages] = useState(event?.images || []);
  const [isUploading, setIsUploading] = useState(false);

  // Handle single Cover upload
  const handleCoverUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await api.post('/products/upload.php', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCover(`http://localhost/sita-ram-dairy/backend${res.data.url}`);
    } catch (e) {
      alert("Cover upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Multiple Gallery Image Uploads (Up to 20 total)
  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    const newFilesArray = Array.from(files);
    
    if (images.length + newFilesArray.length > 20) {
      alert(`You can only upload up to 20 images. You selected ${newFilesArray.length}, but only have ${20 - images.length} slots left.`);
      return;
    }

    setIsUploading(true);
    const uploadedUrls = [];

    // Upload files one by one
    for (let file of newFilesArray) {
      const data = new FormData();
      data.append('image', file);
      try {
        const res = await api.post('/products/upload.php', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploadedUrls.push(`http://localhost/sita-ram-dairy/backend${res.data.url}`);
      } catch (e) {
        console.error("Upload failed for a file");
      }
    }

    setImages(prev => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { id: event?.id, title, cover, images };
    await api.post('/admin/media/events.php', payload);
    refresh();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 lg:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-serif font-black text-[#1A1A1A]">{event ? 'Edit Gallery Event' : 'Create New Event'}</h2>
          <button onClick={closeModal} className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Event Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Annual Dairy Fest 2026" className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#9e111a] font-bold text-[#1A1A1A] transition-colors" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center relative hover:bg-gray-50 cursor-pointer transition-colors">
              {cover ? (
                <img src={cover} className="h-40 mx-auto rounded-xl shadow-sm object-cover" alt="Cover" />
              ) : (
                <div className="py-6">
                  <UploadCloud className="mx-auto mb-3 text-gray-300" size={32} />
                  <span className="text-sm font-bold text-[#9e111a]">Click to Upload Cover Image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={e => handleCoverUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Gallery Images</label>
              <span className={`text-xs font-black px-2 py-1 rounded ${images.length === 20 ? 'bg-red-100 text-red-600' : 'bg-white text-gray-500'}`}>
                {images.length} / 20 MAX
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} className="w-full aspect-square object-cover rounded-xl shadow-sm border border-gray-200" alt="" />
                  <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100">
                    <X size={12} strokeWidth={3}/>
                  </button>
                </div>
              ))}
              
              {/* Only show upload button if under 20 limit */}
              {images.length < 20 && (
                <div className="relative border-2 border-dashed border-gray-300 bg-white rounded-xl flex flex-col items-center justify-center aspect-square hover:border-[#9e111a] hover:bg-[#9e111a]/5 transition-colors cursor-pointer">
                  <Plus className="text-gray-400 mb-1" size={24} />
                  <span className="text-[10px] font-bold text-gray-400">Add More</span>
                  <input type="file" multiple accept="image/*" onChange={e => handleGalleryUpload(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
            </div>
          </div>
        </form>
        
        <div className="p-6 lg:p-8 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
          <button type="submit" onClick={handleSave} disabled={isUploading || !title || !cover} className="bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#9e111a] transition-all disabled:opacity-50 shadow-lg">
            {isUploading ? 'Processing...' : 'Save Gallery'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- YOUTUBE FORM MODAL ---
function YoutubeModal({ closeModal, refresh }) {
  const [title, setTitle] = useState('');
  const [videoId, setVideoId] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    await api.post('/admin/media/youtube.php', { title, youtube_id: videoId });
    refresh();
    closeModal();
  }; 

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-serif font-black text-[#1A1A1A]">Link YouTube Video</h2>
          <button onClick={closeModal} className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Display Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Inside the Dairy Factory" className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-[#1A1A1A] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">YouTube Video ID</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">ID:</span>
              <input type="text" value={videoId} onChange={e => setVideoId(e.target.value)} required placeholder="e.g. dQw4w9WgXcQ" className="w-full p-4 pl-12 border-2 border-gray-100 rounded-xl outline-none focus:border-[#002147] font-bold text-[#1A1A1A] transition-colors" />
            </div>
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl mt-3 text-xs font-medium">
              <p>Only paste the random 11-character ID.</p>
              <p className="mt-1 opacity-80">From: <code className="bg-white px-1 rounded text-blue-900">youtube.com/watch?v=<span className="font-black text-blue-600">ID_HERE</span></code></p>
            </div>
          </div>
          
          <button type="submit" disabled={!title || !videoId} className="w-full bg-[#002147] text-[#E2B254] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all disabled:opacity-50 shadow-lg mt-4">
            Save Video Link
          </button>
        </form>
      </div>
    </div>
  );
}