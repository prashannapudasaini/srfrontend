import { useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/admin/banners.php');
      setBanners(res.data || []);
    } catch (error) { console.error("Failed to fetch banners"); } 
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image");
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);

    try {
      await api.post('/admin/banners.php', formData);
      setTitle('');
      setImageFile(null);
      document.getElementById('banner-upload').value = '';
      fetchBanners();
    } catch (error) {
      alert("Upload failed. Ensure backend permissions are correct.");
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id, currentState) => {
    try {
      await api.post('/admin/banners.php', { action: 'toggle', id, is_active: !currentState });
      fetchBanners();
    } catch (error) { alert("Toggle failed."); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Permanently delete this banner?")) {
      try {
        await api.post('/admin/banners.php', { action: 'delete', id });
        fetchBanners();
      } catch (error) { alert("Deletion failed."); }
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <form onSubmit={handleUpload} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 relative hover:bg-indigo-50 transition-colors">
          <UploadCloud className="text-indigo-500 mb-3" size={32} />
          <input 
            id="banner-upload" 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImageFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="text-sm font-bold text-indigo-700">Browse Image</span>
          <span className="text-xs text-slate-400 mt-1">1920x1080px (16:9)</span>
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Display Title (Optional)</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Farm Fresh Organic Milk"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={uploading || !imageFile}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? 'Uploading...' : <><CheckCircle size={18} /> Publish Banner</>}
          </button>
        </div>
      </form>

      {/* Grid of Existing Banners */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ImageIcon size={22} /> Active Slides</h2>
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{banners.length} Banners</span>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p className="text-slate-500 p-4">Loading banners...</p> : banners.map(banner => (
            <div key={banner.id} className="group rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
              <div className="h-40 w-full relative bg-slate-900">
                <img src={banner.image_url} alt={banner.title} className={`w-full h-full object-cover transition-opacity ${!banner.is_active && 'opacity-40 grayscale'}`} />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-bold text-sm truncate">{banner.title || 'Untitled Banner'}</h3>
                </div>
              </div>
              
              <div className="bg-white p-4 flex justify-between items-center">
                <button 
                  onClick={() => handleToggle(banner.id, banner.is_active)}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${banner.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {banner.is_active ? <><Eye size={14}/> Visible</> : <><EyeOff size={14}/> Hidden</>}
                </button>
                <button onClick={() => handleDelete(banner.id)} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}