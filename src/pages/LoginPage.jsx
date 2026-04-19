// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // IMPORT GLOBAL CONTEXT

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect'); 
  
  // GRAB GLOBAL FUNCTIONS
  const { login, register } = useAuth(); 

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    name: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    if (isLogin) {
      // Trigger Global Context Login
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Route based on role
        const defaultRoute = result.role === 'admin' ? '/admin' : '/';
        navigate(redirectParam || defaultRoute);
      } else {
        setError(result.error);
      }
    } else {
      // Trigger Global Context Register
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setSuccessMsg(result.message || 'Account created! Please sign in.');
        setIsLogin(true); 
        setFormData({ ...formData, password: '' }); 
      } else {
        setError(result.error);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF8E7] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#9e111a]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#1A1A1A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#9e111a] mx-auto rounded-full flex items-center justify-center mb-4 shadow-xl">
             <span className="text-white font-serif font-bold text-2xl">SR</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-[#1A1A1A]">Welcome Back</h1>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9e111a] mt-2">Organic Dairy Heritage</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-colors ${
                isLogin ? 'text-[#9e111a] border-b-2 border-[#9e111a] bg-white' : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-colors ${
                !isLogin ? 'text-[#9e111a] border-b-2 border-[#9e111a] bg-white' : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-xs font-bold rounded-xl text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        Full Legal Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Ram Bahadur"
                          className="w-full pl-12 pr-4 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Email Identifier
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Security Key
                  </label>
                  {isLogin && (
                    <button type="button" className="text-[10px] font-black text-[#9e111a] hover:text-[#1A1A1A] transition-colors uppercase">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9e111a] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#9e111a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1A1A1A] transition-all duration-500 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>
                    {isLogin ? 'Access Account' : 'Establish Account'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-600" />
              <span>AES-256 Encrypted Connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}