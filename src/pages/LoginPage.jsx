import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { login, register, setAuthData } = useAuth(); 

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 2FA specific states
  const [show2FA, setShow2FA] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [tempUserId, setTempUserId] = useState(null);

  // 🔥 FIX: Added 'address' to field errors state
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    loginId: '',
    address: '' 
  });

  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
    phone: '',
    name: '',
    address: '', 
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  // ---------- Frontend Validation Functions ----------
  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Phone number must be 10 digits';
    return '';
  };

  // 🔥 FIX: Strict Address Validation function
  const validateAddress = (address) => {
    if (!address.trim()) return 'Delivery address is required for checkout';
    if (address.trim().length < 4) return 'Please provide a more detailed delivery location';
    return '';
  };

  const validatePassword = (password, isLoginMode) => {
    if (!password) return isLoginMode ? 'Password is required' : 'Please create a password';
    if (!isLoginMode && password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateLoginId = (loginId) => {
    if (!loginId.trim()) return 'Email or phone number is required';
    return '';
  };

  const validateRegistrationForm = () => {
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);
    const addressErr = validateAddress(formData.address); // 🔥 FIX: Validate Address
    const pwdErr = validatePassword(formData.password, false);

    setFieldErrors({ 
      name: nameErr, 
      email: emailErr, 
      phone: phoneErr, 
      address: addressErr, 
      password: pwdErr, 
      loginId: '' 
    });
    
    return !(nameErr || emailErr || phoneErr || addressErr || pwdErr);
  };

  const validateLoginForm = () => {
    const loginErr = validateLoginId(formData.loginId);
    const pwdErr = validatePassword(formData.password, true);
    setFieldErrors({ ...fieldErrors, loginId: loginErr, password: pwdErr });
    return !(loginErr || pwdErr);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    let isValid = false;
    if (isLogin) {
      isValid = validateLoginForm();
    } else {
      isValid = validateRegistrationForm();
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    if (isLogin) {
      const result = await login(formData.loginId, formData.password);
      
      if (result.success) {
        // 🔥 FIX: Explicit Role-Based Redirection
        let defaultRoute = '/';
        
        if (result.role === 'admin') {
          defaultRoute = '/admin';
        } else if (result.role === 'delivery') {
          defaultRoute = '/delivery'; // Routes to your DeliveryDashboard
        } else {
          defaultRoute = '/'; // Regular customer
        }

        navigate(redirectParam || defaultRoute);
      } 
      else if (result.requires2FA) {
        setShow2FA(true);
        setTempUserId(result.userId);
        setSuccessMsg(result.message || 'Security code sent to your email.');
      } 
      else {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } else {
      // Registration flow...
      const result = await register({
        name: formData.name, email: formData.email, phone: formData.phone, address: formData.address, password: formData.password
      });

      if (result.success) {
        setSuccessMsg(result.message || 'Account created successfully! Please sign in.');
        setIsLogin(true);
        setFormData({ ...formData, password: '', loginId: formData.email });
      } else {
        if (result.fieldErrors) setFieldErrors(prev => ({ ...prev, ...result.fieldErrors }));
        setError(result.error || 'Registration failed.');
      }
    }
    setIsLoading(false);
  };

  // OTP Submission Handler
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('auth/verify_2fa.php', { 
        user_id: tempUserId, 
        otp_code: otpCode 
      });
      
      if (res.data.status === 'success') {
        if(setAuthData) setAuthData(res.data.data.user, res.data.data.token);
        navigate(redirectParam || '/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLoginIcon = () => {
    if (/^\+?\d/.test(formData.loginId) && !formData.loginId.includes('@')) {
      return <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />;
    }
    return <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />;
  };

  return (
    <div className="min-h-screen bg-[#FDF8E7] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#9e111a]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#1A1A1A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#9e111a] mx-auto rounded-full flex items-center justify-center mb-4 shadow-xl">
            {show2FA ? <ShieldCheck size={32} className="text-white" /> : <span className="text-white font-serif font-bold text-2xl">SR</span>}
          </div>
          <h1 className="text-3xl font-serif font-black text-[#1A1A1A]">
            {show2FA ? 'Admin Security' : isLogin ? 'Welcome Back' : 'Join Sitaram'}
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9e111a] mt-2">
            {show2FA ? 'Two-Factor Authentication' : 'Organic Dairy Heritage'}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          
          {!show2FA && (
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); setFieldErrors({}); }}
                className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-colors ${
                  isLogin ? 'text-[#9e111a] border-b-2 border-[#9e111a] bg-white' : 'text-gray-400 hover:text-[#1A1A1A]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); setFieldErrors({}); }}
                className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-colors ${
                  !isLogin ? 'text-[#9e111a] border-b-2 border-[#9e111a] bg-white' : 'text-gray-400 hover:text-[#1A1A1A]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

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

            {show2FA ? (
              <motion.form 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                onSubmit={handleVerify2FA} className="space-y-6"
              >
                <div className="text-center mb-6">
                  <p className="text-sm font-bold text-gray-500">
                    To protect the administration panel, please enter the 6-digit code sent to your registered email address.
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="w-full text-center tracking-[1em] text-2xl py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors font-black text-[#1A1A1A]"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setShow2FA(false)} className="px-6 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <ArrowLeft size={18} />
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 bg-[#9e111a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1A1A1A] transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify Securely'}
                  </button>
                </div>
              </motion.form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="register-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-4"
                    >
                      {/* Name field */}
                      <div>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Legal Name *"
                            className="w-full pl-12 pr-4 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                          />
                        </div>
                        {fieldErrors.name && <p className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.name}</p>}
                      </div>

                      {/* Email field */}
                      <div>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address *"
                            className="w-full pl-12 pr-4 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                          />
                        </div>
                        {fieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.email}</p>}
                      </div>

                      {/* Phone field */}
                      <div>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number *"
                            className="w-full pl-12 pr-4 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                          />
                        </div>
                        {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.phone}</p>}
                      </div>

                      {/* 🔥 FIX: Address field strictly required */}
                      <div>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Delivery Address *"
                            className="w-full pl-12 pr-4 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                          />
                        </div>
                        {fieldErrors.address && <p className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.address}</p>}
                      </div>
                    </motion.div>
                  )}

                  {isLogin && (
                    <motion.div
                      key="login-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div>
                        <div className="relative">
                          {getLoginIcon()}
                          <input
                            type="text"
                            name="loginId"
                            value={formData.loginId}
                            onChange={handleChange}
                            placeholder="Email Address or Phone Number"
                            className="w-full pl-12 pr-4 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                          />
                        </div>
                        {fieldErrors.loginId && <p className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.loginId}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shared Password Field */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e111a]" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={isLogin ? 'Enter your password' : 'Create a password *'}
                      className="w-full pl-12 pr-12 py-4 bg-[#FDF8E7]/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#9e111a]/30 focus:bg-white transition-colors text-sm font-bold text-[#1A1A1A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9e111a] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-red-500 text-xs mt-1 ml-2">{fieldErrors.password}</p>}
                  {isLogin && (
                    <div className="text-right mt-2">
                      <button type="button" className="text-[10px] font-black text-[#9e111a] hover:text-[#1A1A1A] transition-colors uppercase">
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#9e111a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1A1A1A] transition-all duration-500 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      {isLogin ? 'Access Account' : 'Establish Account'}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

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