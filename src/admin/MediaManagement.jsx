import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon, X, UploadCloud } from 'lucide-react';
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
      // These are standard placeholder endpoints. Adjust to your actual PHP paths.
      const [eventsRes, ytRes] = await Promise.all([
        api.get('/admin/media/events.php').catch(() => ({ data: { data: [] } })),
        api.get('/admin/media/youtube.php').catch(() => ({ data: { data: [] } }))
      ]);
      if (eventsRes?.data?.data) setEvents(eventsRes.data.data);
      if (ytRes?.data?.data) setYoutubeVideos(ytRes.data.data);
    } catch (err) {
      console.error(err);
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
    <div className="space-y-6">
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
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-[#9e111a] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          Event Galleries
        </button>
        <button 
          onClick={() => setActiveTab('youtube')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'youtube' ? 'bg-[#9e111a] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          YouTube Links
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
        
        {activeTab === 'events' && (
          <div>
            <button onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }} className="mb-6 bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#9e111a] transition-all">
              <Plus size={16} /> Create New Event
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map(event => (
                <div key={event.id} className="border border-gray-100 rounded-2xl p-4 shadow-sm relative">
                  <img src={event.cover} className="w-full aspect-[4/3] object-cover rounded-xl mb-4" alt="" />
                  <h3 className="font-bold text-[#1A1A1A] line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{event.images?.length || 0} Images</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingEvent(event); setIsEventModalOpen(true); }} className="flex-1 bg-gray-50 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold flex justify-center"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-bold flex justify-center"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'youtube' && (
          <div>
             <button onClick={() => setIsYoutubeModalOpen(true)} className="mb-6 bg-[#1A1A1A] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#9e111a] transition-all">
              <Plus size={16} /> Add YouTube Link
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map(yt => (
                <div key={yt.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-video bg-gray-100 relative">
                    <img src={`https://img.youtube.com/vi/${yt.youtube_id}/hqdefault.jpg`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="p-4 flex justify-between items-center gap-4">
                    <h3 className="font-bold text-sm text-[#1A1A1A] line-clamp-2">{yt.title}</h3>
                    <button onClick={() => handleDeleteYoutube(yt.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
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

    // Upload files one by one to use the existing PHP endpoint
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black">{event ? 'Edit Event' : 'Create Event'}</h2>
          <button onClick={closeModal}><X size={20} /></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Event Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#9e111a]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center relative hover:bg-gray-50 cursor-pointer">
              {cover ? <img src={cover} className="h-32 mx-auto rounded" alt="" /> : <div><UploadCloud className="mx-auto mb-2 text-gray-400"/><span>Upload Cover</span></div>}
              <input type="file" accept="image/*" onChange={e => handleCoverUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-500">Gallery Images (Max 20)</label>
              <span className={`text-xs font-bold ${images.length === 20 ? 'text-red-500' : 'text-gray-400'}`}>
                {images.length} / 20
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} className="w-full aspect-square object-cover rounded-lg shadow-sm border border-gray-100" alt="" />
                  <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                    <X size={12}/>
                  </button>
                </div>
              ))}
              
              {/* Only show upload button if under 20 limit */}
              {images.length < 20 && (
                <div className="relative border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center aspect-square hover:bg-gray-50 transition-colors">
                  <Plus className="text-gray-400" />
                  <input type="file" multiple accept="image/*" onChange={e => handleGalleryUpload(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
            </div>
          </div>
        </form>
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button type="submit" onClick={handleSave} disabled={isUploading} className="bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#9e111a] transition-all disabled:opacity-50">
            {isUploading ? 'Uploading...' : 'Save Event'}
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black">Add YouTube Video</h2>
          <button onClick={closeModal}><X size={20} /></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Video Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Factory Tour" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#9e111a]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">YouTube Video ID</label>
            <input type="text" value={videoId} onChange={e => setVideoId(e.target.value)} required placeholder="e.g. Iinnywe4gPA" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#9e111a]" />
            <p className="text-[10px] text-gray-400 mt-2">Only paste the ID. For `youtube.com/watch?v=12345`, the ID is `12345`.</p>
          </div>
          <button type="submit" className="w-full bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#9e111a] transition-all">Save Link</button>
        </form>
      </div>
    </div>
  );
}