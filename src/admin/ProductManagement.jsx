import React, { useState, useEffect, useMemo } from 'react';
import { Edit, Trash2, Plus, Package, Search, X, PlusCircle, AlertCircle, UploadCloud, Settings } from 'lucide-react';
import api from '../services/api';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Category Manager Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --- API: FETCH PRODUCTS ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/index.php');
      if (res.data.status === 'success') {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- API: FETCH CATEGORIES ---
  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories.php');
      if (res.data.status === 'success') {
        setCategories(res.data.data);
      }
    } catch (error) { 
      console.error("Error fetching categories", error); 
    }
  };

  // --- API: ADD CATEGORY ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if(!newCategoryName.trim()) return;
    try {
      const res = await api.post('/admin/categories.php', { name: newCategoryName });
      if (res.data.status === 'success') {
        setNewCategoryName("");
        fetchCategories();
      }
    } catch (error) { 
      alert("Failed to add category"); 
    }
  };

  // --- API: DELETE CATEGORY ---
  const handleDeleteCategory = async (id) => {
    if(window.confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await api.post('/admin/categories.php', { _method: 'DELETE', id }, { 
          headers: { 'Content-Type': 'application/json' } 
        });
        if (res.data.status === 'success') {
          fetchCategories();
          // Reset active category if we deleted the one we are viewing
          setActiveCategory("All");
        }
      } catch (error) { 
        alert("Failed to delete category"); 
      }
    }
  };

  // --- API: DELETE PRODUCT ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        const res = await api.post('/admin/products/delete.php', { id });
        if (res.data.status === 'success') {
          setProducts(products.filter(p => p.id !== id));
        } else {
          alert(res.data.message || "Failed to delete.");
        }
      } catch (error) {
        console.error(error);
        alert("Error connecting to server.");
      }
    }
  };

  // --- API: SAVE PRODUCT ---
  const handleSaveProduct = async (savedProduct) => {
    try {
      const res = await api.post('/admin/products/update.php', savedProduct);
      if (res.data.status === 'success') {
        fetchProducts(); // Refresh the list from DB
        setIsModalOpen(false);
      } else {
        alert(res.data.error || res.data.message || "Failed to save.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server.");
    }
  };

  // --- FILTER LOGIC ---
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

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#1A1A1A] p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#9e111a] rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Package size={24}/>
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">Product Catalog</h2>
            <p className="text-[10px] font-bold text-[#9e111a] uppercase tracking-widest mt-1">
              Managing {products.length} Live Products
            </p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#9e111a] w-full md:w-auto text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#1A1A1A] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Toolbar: Search & Categories */}
      <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-[#9e111a]/5 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 gap-2 custom-scrollbar items-center">
          <button 
            onClick={() => setActiveCategory("All")} 
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === "All" ? 'bg-[#1A1A1A] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            All
          </button>
          
          {categoryNames.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#1A1A1A] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {cat}
            </button>
          ))}
          
          {/* Manage Categories Button */}
          <button 
            onClick={() => setIsCategoryModalOpen(true)} 
            className="ml-2 px-3 py-2 bg-[#9e111a]/10 text-[#9e111a] hover:bg-[#9e111a] hover:text-white rounded-xl transition-colors flex items-center gap-1 text-xs font-bold whitespace-nowrap"
          >
            <Settings size={14} /> Manage Categories
          </button>
        </div>
        
        <div className="relative w-full lg:w-72 shrink-0">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#9e111a] transition-all"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-sm border border-[#9e111a]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-[#FDF8E7]/50 border-b border-[#9e111a]/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="p-6 lg:p-8">Product</th>
                <th className="p-6 lg:p-8">Variants</th>
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
                        <img src={p.image || p.variants?.[0]?.image || '/logo.png'} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-serif font-black text-sm lg:text-lg text-[#1A1A1A] line-clamp-1">
                          {p.name}
                          {(p.is_premium || p.is_essential) && <span className="ml-2 text-[8px] bg-[#9e111a] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Home Page</span>}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 lg:p-6">
                      <div className="flex flex-wrap gap-1">
                        {p.variants?.slice(0, 2).map((v, i) => (
                          <span key={i} className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-lg">
                            {v.size}
                          </span>
                        ))}
                        {p.variants?.length > 2 && (
                          <span className="text-[10px] font-bold bg-gray-50 border border-gray-200 text-gray-400 px-2 py-1 rounded-lg">
                            +{p.variants.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 lg:p-6 font-black text-[#1A1A1A]">
                      NPR {getLowestPrice(p.variants)}
                    </td>
                    <td className="p-4 lg:p-6">
                      <div className="flex items-center gap-2">
                        <p className={`font-black ${totalStock === 0 ? 'text-red-500' : totalStock < 20 ? 'text-orange-500' : 'text-green-600'}`}>
                          {totalStock} Units
                        </p>
                        {hasLowStock && <AlertCircle size={14} className="text-orange-500" title="A variant is low on stock!" />}
                      </div>
                    </td>
                    <td className="p-4 lg:p-6 text-right space-x-2">
                      <button onClick={() => openEditModal(p)} className="p-2 lg:p-3 text-gray-400 hover:text-[#002147] bg-white border border-gray-100 hover:border-[#002147]/20 shadow-sm rounded-xl transition-all"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 lg:p-3 text-gray-400 hover:text-red-600 bg-white border border-gray-100 hover:border-red-200 shadow-sm rounded-xl transition-all"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductFormModal 
          closeModal={() => setIsModalOpen(false)} 
          product={editingProduct} 
          categories={categoryNames}
          onSave={handleSaveProduct}
        />
      )}

      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-black text-[#1A1A1A]">Manage Categories</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
              <input 
                type="text" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                placeholder="New Category Name" 
                className="flex-grow p-3 rounded-xl border border-gray-200 outline-none focus:border-[#9e111a]" 
                required 
              />
              <button type="submit" className="bg-[#1A1A1A] text-white px-6 rounded-xl font-bold text-sm hover:bg-[#9e111a] transition-colors">Add</button>
            </form>

            <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar pr-2">
              {categories.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">No categories found.</p>
              ) : (
                categories.map(c => (
                  <div key={c.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-700">{c.name}</span>
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
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

function ProductFormModal({ closeModal, product, categories, onSave }) {
  // Determine initial state
  const [formData, setFormData] = useState(product || {
    name: '', 
    category: categories.length > 0 ? categories[0] : '', 
    image: '', 
    badge: '',
    is_premium: false, 
    is_essential: false,
    variants: [{ size: '', price_npr: '', stock_quantity: '', description: '', image: '' }]
  });
  
  const [isUploading, setIsUploading] = useState(false);

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  // API Call to upload image (Main image or Variant image)
  const handleImageUpload = async (file, isMain = false, variantIndex = null) => {
    if (!file) return;
    setIsUploading(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await api.post('/products/upload.php', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.status === 'success') {
        const url = `http://localhost/sita-ram-dairy/backend${res.data.url}`;
        
        if (isMain) {
          setFormData({ ...formData, image: url });
        } else if (variantIndex !== null) {
          handleVariantChange(variantIndex, 'image', url);
        }
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const addVariant = () => {
    setFormData({ 
      ...formData, 
      variants: [...formData.variants, { size: '', price_npr: '', stock_quantity: '', description: '', image: '' }] 
    });
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categories.length === 0) {
      alert("Please create at least one category first.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      <div className="bg-[#F9F6F0] w-full max-w-5xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 lg:p-8 bg-white border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-black text-[#1A1A1A]">
              {product ? 'Edit Product' : 'Create New Product'}
            </h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Include variant details</p>
          </div>
          <button onClick={closeModal} className="p-2 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar flex-grow">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Global Product Info */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#9e111a] uppercase tracking-widest flex items-center gap-2">
                <Package size={16}/> Base Product Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Main Product Image Upload */}
                <div className="md:col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden h-32 md:h-full">
                  {formData.image ? (
                    <img src={formData.image} alt="Main" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center p-2 text-gray-400">
                      <UploadCloud size={24} className="mx-auto mb-1" />
                      <span className="text-[10px] font-bold">Main Image</span>
                    </div>
                  )}
                  <input 
                    type="file" accept="image/*" 
                    onChange={(e) => handleImageUpload(e.target.files[0], true, null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {isUploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#9e111a]"></div></div>}
                </div>

                <div className="md:col-span-3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">Product Name</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#9e111a] outline-none" placeholder="e.g. Fresh A2 Milk" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">Category</label>
                      {categories.length === 0 ? (
                        <select disabled className="w-full p-3 rounded-xl border border-gray-200 text-gray-400 bg-gray-50 outline-none">
                          <option>Create a category first</option>
                        </select>
                      ) : (
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#9e111a] outline-none bg-white">
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">Badge / Tag (Optional)</label>
                      <input type="text" value={formData.badge || ''} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#9e111a] outline-none" placeholder="e.g. BESTSELLER, SUGAR FREE" />
                    </div>
                    
                    {/* HOME PAGE CHECKBOXES */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">Home Page Display Options</label>
                      <div className="flex flex-col gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={formData.is_premium} onChange={e => setFormData({...formData, is_premium: e.target.checked})} className="w-4 h-4 text-[#9e111a] rounded cursor-pointer" />
                          <span className="text-xs font-bold text-gray-700 cursor-pointer">Show in "Premium Selection"</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={formData.is_essential} onChange={e => setFormData({...formData, is_essential: e.target.checked})} className="w-4 h-4 text-[#9e111a] rounded cursor-pointer" />
                          <span className="text-xs font-bold text-gray-700 cursor-pointer">Show in "Dairy Essentials"</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Variants Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xs font-bold text-[#9e111a] uppercase tracking-widest">Product Variants</h3>
                  <p className="text-[10px] text-gray-500 mt-1">Set individual prices, stock, descriptions, and images per size/flavor.</p>
                </div>
                <button type="button" onClick={addVariant} className="bg-[#002147] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#E2B254] hover:text-[#002147] transition-all">
                  <PlusCircle size={14} /> Add Variant
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {formData.variants.map((v, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative group">
                    
                    {/* Core Variant Data */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Variant Name</label>
                        <input type="text" required placeholder="e.g. 500ml (Strawberry)" value={v.size} onChange={e => handleVariantChange(idx, 'size', e.target.value)} className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-[#002147]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price (NPR)</label>
                        <input type="number" required placeholder="Price" value={v.price_npr} onChange={e => handleVariantChange(idx, 'price_npr', Number(e.target.value))} className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-[#002147]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock Quantity</label>
                        <input type="number" required placeholder="Stock" value={v.stock_quantity} onChange={e => handleVariantChange(idx, 'stock_quantity', Number(e.target.value))} className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-[#002147]" />
                      </div>
                    </div>

                    {/* Variant Image & Description */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Image Upload Box */}
                      <div className="md:col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden h-32">
                        {v.image ? (
                          <img src={v.image} alt="Variant" className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="text-center p-2 text-gray-400">
                            <UploadCloud size={24} className="mx-auto mb-1" />
                            <span className="text-[10px] font-bold">Variant Image</span>
                          </div>
                        )}
                        <input 
                          type="file" accept="image/*" 
                          onChange={(e) => handleImageUpload(e.target.files[0], false, idx)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {isUploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#002147]"></div></div>}
                      </div>

                      {/* Description Box */}
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Variant Description</label>
                        <textarea 
                          placeholder="Specific details about this variant..." 
                          value={v.description || ''} 
                          onChange={e => handleVariantChange(idx, 'description', e.target.value)} 
                          className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-[#002147] h-32 resize-none custom-scrollbar" 
                        />
                      </div>
                    </div>

                    {/* Delete Variant Button */}
                    {formData.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(idx)} className="absolute -top-3 -right-3 bg-white border border-gray-200 text-red-500 hover:text-white hover:bg-red-500 rounded-full p-1.5 shadow-md transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-4 shrink-0">
          <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50" disabled={isUploading}>
            Cancel
          </button>
          <button type="submit" form="productForm" className="px-8 py-3 rounded-xl font-black text-white bg-[#1A1A1A] hover:bg-[#9e111a] transition-colors shadow-lg disabled:opacity-50" disabled={isUploading}>
            {isUploading ? 'Uploading...' : (product ? 'Save Changes' : 'Publish to Store')}
          </button>
        </div>

      </div>
    </div>
  );
}