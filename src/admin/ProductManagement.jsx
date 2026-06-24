import React, { useState, useEffect, useMemo } from 'react';
import { Edit, Trash2, Plus, Package, Search, X, PlusCircle, AlertCircle, UploadCloud, Settings, AlertTriangle, AlignLeft, Activity } from 'lucide-react';
import api from '../services/api';

const ADMIN_TOKEN = 'sitaram_secret_2026';

const fixImageUrl = (url) => {
  if (!url) return '/logo.png';
  return url.replace('localhost', window.location.hostname).replace('127.0.0.1', window.location.hostname);
};

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [dialog, setDialog] = useState({ isOpen: false, type: 'alert', message: '', onConfirm: null });

  const showAlert = (message) => setDialog({ isOpen: true, type: 'alert', message, onConfirm: () => setDialog({ isOpen: false }) });
  const showConfirm = (message, onConfirmCallback) => setDialog({ isOpen: true, type: 'confirm', message, onConfirm: () => { setDialog({ isOpen: false }); if (onConfirmCallback) onConfirmCallback(); } });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('products/index.php');
      if (res.data.status === 'success') setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('categories/index.php', { headers: { 'X-Admin-Token': ADMIN_TOKEN } });
      if (res.data.status === 'success') setCategories(res.data.data);
    } catch (error) { console.error("Error fetching categories", error); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if(!newCategoryName.trim()) return;
    try {
      const res = await api.post('admin/categories.php', { name: newCategoryName }, { headers: { 'X-Admin-Token': ADMIN_TOKEN } });
      if (res.data.status === 'success') {
        setNewCategoryName("");
        fetchCategories();
        showAlert("Category added successfully!");
      }
    } catch (error) { showAlert("Failed to add category."); }
  };

  const handleDeleteCategory = (id) => {
    showConfirm("Are you sure you want to permanently delete this category?", async () => {
      try {
        const res = await api.delete('admin/categories.php', { data: { id }, headers: { 'X-Admin-Token': ADMIN_TOKEN } });
        if (res.data.status === 'success') {
          fetchCategories();
          setActiveCategory("All");
          showAlert("Category deleted successfully.");
        } else showAlert("Failed to delete category.");
      } catch (error) { showAlert("Failed to delete category due to a server error."); }
    });
  };

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to permanently delete this product? This action cannot be undone.", async () => {
      try {
        const res = await api.post('admin/products/delete.php', { id }, { headers: { 'X-Admin-Token': ADMIN_TOKEN } });
        if (res.data.status === 'success') {
          setProducts(products.filter(p => p.id !== id));
          showAlert("Product deleted successfully.");
        } else showAlert(res.data.message || "Failed to delete product.");
      } catch (error) { showAlert("Error connecting to server to delete product."); }
    });
  };

  const handleSaveProduct = async (savedProduct) => {
    try {
      const res = await api.post('admin/products/update.php', savedProduct, { headers: { 'X-Admin-Token': ADMIN_TOKEN } });
      if (res.data.status === 'success') {
        fetchProducts(); 
        setIsModalOpen(false);
        showAlert("Product saved successfully!");
      } else showAlert(res.data.error || res.data.message || "Failed to save product.");
    } catch (error) { showAlert("Error connecting to server while saving."); }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, activeCategory]);

  const calculateTotalStock = (variants) => variants?.reduce((sum, v) => sum + parseInt(v.stock_quantity || 0), 0) || 0;
  const getLowestPrice = (variants) => variants?.length > 0 ? Math.min(...variants.map(v => parseFloat(v.price_npr) || 0)) : 0;
  const categoryNames = categories.map(c => c.name);

  return (
    <div className="space-y-6 relative">
      {dialog.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${dialog.type === 'confirm' ? 'bg-orange-50 text-orange-500' : 'bg-[#FDF8E7] text-[#9e111a]'}`}>
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-serif font-black text-[#1A1A1A] mb-2">{dialog.type === 'confirm' ? 'Confirm Action' : 'Notice'}</h3>
            <p className="text-gray-500 mb-8 font-medium leading-relaxed">{dialog.message}</p>
            <div className="flex justify-center gap-3">
              {dialog.type === 'confirm' && <button onClick={() => setDialog({ isOpen: false })} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Cancel</button>}
              <button onClick={dialog.onConfirm} className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${dialog.type === 'confirm' ? 'bg-[#9e111a] hover:bg-[#1A1A1A]' : 'bg-[#1A1A1A] hover:bg-[#9e111a]'}`}>
                {dialog.type === 'confirm' ? 'Yes, Proceed' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#9e111a] rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Package size={24}/>
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">Product Catalog</h2>
            <p className="text-[10px] font-bold text-[#9e111a] uppercase tracking-widest mt-1">Managing {products.length} Live Products</p>
          </div>
        </div>
        <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-[#9e111a] w-full md:w-auto text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#1A1A1A] transition-all flex items-center justify-center gap-2">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-[#9e111a]/5 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 gap-2 custom-scrollbar items-center">
          <button onClick={() => setActiveCategory("All")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === "All" ? 'bg-[#1A1A1A] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>All</button>
          {categoryNames.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#1A1A1A] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{cat}</button>
          ))}
          <button onClick={() => setIsCategoryModalOpen(true)} className="ml-2 px-3 py-2 bg-[#9e111a]/10 text-[#9e111a] hover:bg-[#9e111a] hover:text-white rounded-xl transition-colors flex items-center gap-1 text-xs font-bold whitespace-nowrap">
            <Settings size={14} /> Manage Categories
          </button>
        </div>
        <div className="relative w-full lg:w-72 shrink-0">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#9e111a]" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-sm border border-[#9e111a]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-[#FDF8E7]/50 border-b border-[#9e111a]/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="p-6 lg:p-8">Product</th>
                <th className="p-6 lg:p-8">Variants / Flavors</th>
                <th className="p-6 lg:p-8">Starting Price</th>
                <th className="p-6 lg:p-8">Total Stock</th>
                <th className="p-6 lg:p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500 font-bold">Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-bold">No products found.</td></tr>
              ) : filteredProducts.map(p => {
                const totalStock = calculateTotalStock(p.variants);
                const hasLowStock = p.variants?.some(v => v.stock_quantity < 10);
                return (
                  <tr key={p.id} className="hover:bg-[#FDF8E7]/30 transition-colors group">
                    <td className="p-4 lg:p-6 flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#FDF8E7] rounded-2xl p-2 flex items-center justify-center border border-[#9e111a]/5 shrink-0">
                        <img src={fixImageUrl(p.image || p.variants?.[0]?.image)} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-serif font-black text-sm lg:text-lg text-[#1A1A1A] line-clamp-1">
                          {p.name} {(p.is_premium || p.is_essential) && <span className="ml-2 text-[8px] bg-[#9e111a] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Home Page</span>}
                        </p>
                        <span className="text-[9px] font-black uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md mt-1 inline-block">{p.category}</span>
                      </div>
                    </td>
                    <td className="p-4 lg:p-6">
                      <div className="flex flex-wrap gap-1">
                        {p.variants?.slice(0, 2).map((v, i) => <span key={i} className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-lg">{v.size}</span>)}
                        {p.variants?.length > 2 && <span className="text-[10px] font-bold bg-gray-50 border border-gray-200 text-gray-400 px-2 py-1 rounded-lg">+{p.variants.length - 2}</span>}
                      </div>
                    </td>
                    <td className="p-4 lg:p-6 font-black text-[#1A1A1A]">NPR {getLowestPrice(p.variants)}</td>
                    <td className="p-4 lg:p-6">
                      <div className="flex items-center gap-2">
                        <p className={`font-black ${totalStock === 0 ? 'text-red-500' : totalStock < 20 ? 'text-orange-500' : 'text-green-600'}`}>{totalStock} Units</p>
                        {hasLowStock && <AlertCircle size={14} className="text-orange-500" title="A variant is low on stock!" />}
                      </div>
                    </td>
                    <td className="p-4 lg:p-6 text-right space-x-2">
                      <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-2 lg:p-3 text-gray-400 hover:text-[#002147] bg-white border border-gray-100 hover:border-[#002147]/20 shadow-sm rounded-xl transition-all"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 lg:p-3 text-gray-400 hover:text-red-600 bg-white border border-gray-100 hover:border-red-200 shadow-sm rounded-xl transition-all"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <ProductFormModal closeModal={() => setIsModalOpen(false)} product={editingProduct} categories={categoryNames} onSave={handleSaveProduct} showAlert={showAlert} />}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-black text-[#1A1A1A]">Manage Categories</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
              <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New Category Name" className="flex-grow p-3 rounded-xl border border-gray-200 outline-none focus:border-[#9e111a]" required />
              <button type="submit" className="bg-[#1A1A1A] text-white px-6 rounded-xl font-bold text-sm hover:bg-[#9e111a] transition-colors">Add</button>
            </form>
            <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar pr-2">
              {categories.map(c => (
                <div key={c.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-700">{c.name}</span>
                  <button onClick={() => handleDeleteCategory(c.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// --- ADVANCED PRODUCT FORM MODAL SUB-COMPONENT ---
// =====================================================================

function ProductFormModal({ closeModal, product, categories, onSave, showAlert }) {
  
  // Parse Features
  let parsedFeatures = product?.features;
  if (typeof parsedFeatures === 'string') {
    if (parsedFeatures.trim().startsWith('[')) { try { parsedFeatures = JSON.parse(parsedFeatures); } catch(e) {} } 
    else { parsedFeatures = parsedFeatures.split('\n').filter(f => f.trim() !== ''); }
  }
  const initialFeatures = Array.isArray(parsedFeatures) && parsedFeatures.length > 0 ? parsedFeatures : [''];

  // Parse Nutrition
  let parsedNutrition = product?.nutrition;
  if (typeof parsedNutrition === 'string') { try { parsedNutrition = JSON.parse(parsedNutrition); } catch(e) {} }
  const initialNutrition = Array.isArray(parsedNutrition) && parsedNutrition.length > 0 ? parsedNutrition : [{ nutrient: '', value: '' }];

  // --- NEW: SPLIT EXISTING SIZES INTO FLAVOR & SIZES ---
  const initialVariants = (product?.variants?.length > 0 ? product.variants : [{ size: '', price_npr: '', stock_quantity: '', description: '', image: '' }]).map(v => {
    let flavor = '';
    let size_value = v.size || '';
    if (v.size && v.size.includes(' - ')) {
      const parts = v.size.split(' - ');
      flavor = parts[0];
      size_value = parts.slice(1).join(' - '); 
    }
    return { ...v, flavor, size_value };
  });

  const [formData, setFormData] = useState({
    ...(product || {
      name: '', category: categories.length > 0 ? categories[0] : '', image: '', badge: '',
      is_premium: false, is_essential: false
    }),
    variants: initialVariants,
    description: product?.description || '',
    features: initialFeatures,
    nutrition: initialNutrition
  });
  
  const [isUploading, setIsUploading] = useState(false);

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };
  
  const handleNutritionChange = (index, field, value) => {
    const newNutrition = [...formData.nutrition];
    newNutrition[index][field] = value;
    setFormData({ ...formData, nutrition: newNutrition });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => setFormData({ ...formData, variants: [...formData.variants, { flavor: '', size_value: '', price_npr: '', stock_quantity: '', description: '', image: '' }] });
  const removeVariant = (index) => { if (formData.variants.length > 1) setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) }); };

  const handleImageUpload = async (file, isMain = false, variantIndex = null) => {
    if (!file) return;
    setIsUploading(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await api.post('products/upload.php', data, { headers: { 'Content-Type': 'multipart/form-data', 'X-Admin-Token': ADMIN_TOKEN } });
      if (res.data.status === 'success') {
        const url = `https://${window.location.hostname}/backend${res.data.url}`;
        if (isMain) setFormData({ ...formData, image: url });
        else if (variantIndex !== null) handleVariantChange(variantIndex, 'image', url);
      } else showAlert("Image upload failed on the server.");
    } catch (error) { showAlert("Error uploading image."); } finally { setIsUploading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categories.length === 0) { showAlert("Please create at least one category before adding a product."); return; }

    // --- NEW: MERGE FLAVOR & SIZE BACK TOGETHER FOR DATABASE ---
    const cleanedVariants = formData.variants.map(v => {
      const finalSize = (v.flavor && v.flavor.trim() !== '') ? `${v.flavor.trim()} - ${v.size_value.trim()}` : v.size_value.trim();
      return {
        size: finalSize, // Backend expects "size"[cite: 1]
        price_npr: v.price_npr,
        stock_quantity: v.stock_quantity,
        description: v.description,
        image: v.image
      };
    });

    const cleanedData = {
      ...formData,
      variants: cleanedVariants,
      features: formData.features.filter(f => f.trim() !== ''),
      nutrition: formData.nutrition.filter(n => n.nutrient.trim() !== '' || n.value.trim() !== '')
    };

    onSave(cleanedData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      <div className="bg-[#F9F6F0] w-full max-w-5xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden transform scale-100 animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center p-6 lg:p-8 bg-white border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-black text-[#1A1A1A]">{product ? 'Edit Product' : 'Create New Product'}</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Include descriptions and variant details</p>
          </div>
          <button onClick={closeModal} className="p-2 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar flex-grow space-y-8">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* BASE DETAILS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#9e111a] uppercase tracking-widest flex items-center gap-2"><Package size={16}/> Base Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 relative overflow-hidden h-32 md:h-full">
                  {formData.image ? <img src={fixImageUrl(formData.image)} alt="Main" className="w-full h-full object-contain p-2" /> : <div className="text-center p-2 text-gray-400"><UploadCloud size={24} className="mx-auto mb-1" /><span className="text-[10px] font-bold">Main Image</span></div>}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], true, null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="md:col-span-3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 mb-2">Product Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#9e111a] outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-2">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 outline-none">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 mb-2">Badge / Tag (Optional)</label><input type="text" value={formData.badge || ''} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="e.g., Best Seller" className="w-full p-3 rounded-xl border border-gray-200 outline-none" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-2">Display Options</label>
                      <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_premium} onChange={e => setFormData({...formData, is_premium: e.target.checked})} /> <span className="text-xs font-bold text-gray-700">Premium</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_essential} onChange={e => setFormData({...formData, is_essential: e.target.checked})} /> <span className="text-xs font-bold text-gray-700">Essential</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OVERVIEW & FEATURES */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-[#9e111a] uppercase tracking-widest flex items-center gap-2"><AlignLeft size={16}/> Overview & Features</h3>
              <div><textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Main product description..." className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#9e111a] outline-none h-32 resize-none" /></div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Special Features (Bullet Points)</label>
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <input type="text" value={feature} onChange={e => handleFeatureChange(idx, e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 outline-none" />
                    <button type="button" onClick={() => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== idx) })} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })} className="text-xs font-bold flex items-center gap-2 mt-2"><PlusCircle size={14} /> Add Feature</button>
              </div>
            </div>

            {/* PRODUCT VARIANTS / FLAVORS */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div><h3 className="text-xs font-bold text-[#9e111a] uppercase tracking-widest">Product Variants & Flavors</h3></div>
                <button type="button" onClick={addVariant} className="bg-[#002147] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><PlusCircle size={14} /> Add Variant</button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {formData.variants.map((v, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative group">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      {/* --- NEW: FLAVOR AND GRAM INPUTS --- */}
                      <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Flavor (Optional)</label><input type="text" value={v.flavor || ''} onChange={e => handleVariantChange(idx, 'flavor', e.target.value)} placeholder="e.g. Mango" className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#002147]" /></div>
                      <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Size/Grams *</label><input type="text" required value={v.size_value || ''} onChange={e => handleVariantChange(idx, 'size_value', e.target.value)} placeholder="e.g. 200gm" className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#002147]" /></div>
                      <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Price (NPR)</label><input type="number" required value={v.price_npr} onChange={e => handleVariantChange(idx, 'price_npr', Number(e.target.value))} className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#002147]" /></div>
                      <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Stock Qty</label><input type="number" required value={v.stock_quantity} onChange={e => handleVariantChange(idx, 'stock_quantity', Number(e.target.value))} className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#002147]" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 relative overflow-hidden h-32">
                        {v.image ? <img src={fixImageUrl(v.image)} alt="Variant" className="w-full h-full object-contain p-2" /> : <div className="text-center p-2 text-gray-400"><UploadCloud size={24} className="mx-auto mb-1" /><span className="text-[10px] font-bold">Variant Image</span></div>}
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], false, idx)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Flavor Description Override (Optional)</label>
                        <textarea value={v.description || ''} onChange={e => handleVariantChange(idx, 'description', e.target.value)} placeholder="Enter unique description for this flavor. Leave blank to use base description." className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#002147] h-32 resize-none custom-scrollbar" />
                      </div>
                    </div>
                    {formData.variants.length > 1 && <button type="button" onClick={() => removeVariant(idx)} className="absolute -top-3 -right-3 bg-white border border-gray-200 text-red-500 rounded-full p-1.5 shadow-md"><Trash2 size={14} /></button>}
                  </div>
                ))}
              </div>
            </div>
            
          </form>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-4 shrink-0">
          <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50" disabled={isUploading}>Cancel</button>
          <button type="submit" form="productForm" className="px-8 py-3 rounded-xl font-black text-white bg-[#1A1A1A] hover:bg-[#9e111a] transition-colors shadow-lg disabled:opacity-50" disabled={isUploading}>
            {isUploading ? 'Uploading...' : (product ? 'Save Changes' : 'Publish to Store')}
          </button>
        </div>
      </div>
    </div>
  );
}