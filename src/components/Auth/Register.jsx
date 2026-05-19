import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Register({ handleSubmit, formData, setFormData, error }) {
  const [localError, setLocalError] = useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLocalError(""); // Clear previous errors

    // 1. Phone Validation (Nepal: 10 digits starting with 98 or 97)
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setLocalError("Please enter a valid 10-digit Nepalese mobile number (e.g., 98XXXXXXXX).");
      return;
    }

    // 2. Password Length Validation
    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }

    // 3. Password Match Validation
    if (formData.password !== formData.password_confirmation) {
      setLocalError("Passwords do not match.");
      return;
    }

    // If all validations pass, call the parent's handleSubmit
    handleSubmit(e);
  };

  const displayError = localError || error;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      {displayError && (
        <div className="bg-red-50 text-[#9e111a] border border-red-200 p-4 rounded-xl mb-6 text-sm font-bold text-center">
          {displayError}
        </div>
      )}

      <form onSubmit={onFormSubmit} className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
            <input 
              type="tel" required 
              placeholder="98XXXXXXXX"
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E2B254] focus:ring-2 focus:ring-[#E2B254]/20 outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Address</label>
            <input 
              type="text" required 
              placeholder="e.g., Sanepa, Lalitpur"
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E2B254] focus:ring-2 focus:ring-[#E2B254]/20 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex justify-center py-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-[#002147] hover:bg-[#E2B254] hover:text-[#002147] transition-colors mt-6"
        >
          Create Account
        </motion.button>
      </form>
    </motion.div>
  );
}