// frontend/src/admin/UserManagement.jsx
import { useState } from 'react';
import { Shield, Plus, User as UserIcon } from 'lucide-react';

export default function UserManagement() {
  const [users] = useState([
    { id: 1, name: "Prashant Admin", email: "adminsitaram@gmail.com", role: "admin", joined: "2024-01-15" },
    { id: 2, name: "Ram Bahadur", email: "ram@tokha.com", role: "customer", joined: "2026-04-01" },
    { id: 3, name: "Sita Sharma", email: "sita@lalitpur.com", role: "customer", joined: "2026-04-05" },
  ]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-[#9e111a]/5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-black text-[#1A1A1A]">Access Control</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage system security and customer base</p>
        </div>
        <button className="bg-[#1A1A1A] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#9e111a] transition-all flex items-center gap-2">
          <Plus size={18} /> Appoint Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(u => (
          <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border border-[#9e111a]/5 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#FDF8E7] rounded-2xl flex items-center justify-center text-[#9e111a] group-hover:bg-[#9e111a] group-hover:text-white transition-colors">
                <UserIcon size={24} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                u.role === 'admin' ? 'border-[#9e111a] text-[#9e111a] bg-red-50' : 'border-gray-200 text-gray-400'
              }`}>
                {u.role}
              </span>
            </div>
            <h4 className="text-xl font-serif font-black text-[#1A1A1A] mb-1">{u.name}</h4>
            <p className="text-xs font-bold text-gray-400 mb-6">{u.email}</p>
            <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
              <span>Joined: {u.joined}</span>
              {u.role === 'admin' && <Shield size={14} className="text-[#9e111a]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}