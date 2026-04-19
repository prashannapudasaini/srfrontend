// frontend/src/components/Products/FilterSidebar.jsx
import { Filter, ChevronRight } from 'lucide-react';

export default function FilterSidebar({ activeCategory, setActiveCategory, categories }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32">
      <div className="flex items-center gap-3 mb-8">
        <Filter className="text-[#E2B254]" size={24} />
        <h3 className="font-serif font-bold text-2xl text-[#002147]">Categories</h3>
      </div>
      
      <ul className="space-y-3">
        {categories.map(category => (
          <li key={category}>
            <button
              onClick={() => setActiveCategory(category)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-[#002147] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-[#F9F6F0] hover:text-[#002147]'
              }`}
            >
              <span className="font-bold text-sm uppercase tracking-wider">{category}</span>
              {activeCategory === category && <ChevronRight size={16} className="text-[#E2B254]" />}
            </button>
          </li>
        ))}
      </ul>
      
      <div className="mt-10 pt-8 border-t border-gray-100">
        <h3 className="font-serif font-bold text-xl text-[#002147] mb-6">Price Range</h3>
        <input type="range" min="50" max="2000" className="w-full accent-[#E2B254] cursor-pointer" />
        <div className="flex justify-between text-sm font-bold text-gray-400 mt-4">
          <span>Rs. 50</span>
          <span>Rs. 2000+</span>
        </div>
      </div>
    </div>
  );
}