// frontend/src/components/Auth/Register.jsx
import { motion } from 'framer-motion';

export default function Register({ handleSubmit, formData, setFormData, error }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl mb-6 text-sm font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
          <input 
            type="text" required 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E2B254] focus:ring-2 focus:ring-[#E2B254]/20 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
          <input 
            type="email" required 
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E2B254] focus:ring-2 focus:ring-[#E2B254]/20 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
          <input 
            type="password" required 
            onChange={e => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E2B254] focus:ring-2 focus:ring-[#E2B254]/20 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
          <input 
            type="password" required 
            onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E2B254] focus:ring-2 focus:ring-[#E2B254]/20 outline-none transition-all" 
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex justify-center py-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-[#002147] hover:bg-[#E2B254] hover:text-[#002147] transition-colors mt-4"
        >
          Create Account
        </motion.button>
      </form>
    </motion.div>
  );
}