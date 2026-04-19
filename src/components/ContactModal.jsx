// frontend/src/components/Modals/ContactModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, User, Phone, Mail, MessageSquare, Clock } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    // Reset form after 2 seconds and close
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full transition-all duration-200"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="bg-red-700 px-6 py-8 text-center">
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
              <p className="text-red-100 text-sm mt-1">We'd love to hear from you</p>
            </div>

            {/* Form Body */}
            <div className="p-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Phone Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors text-sm"
                          /* UPDATED: Informative instruction placeholder */
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors text-sm"
                          placeholder="+977..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors text-sm"
                        /* UPDATED: Informative instruction placeholder */
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400" size={16} />
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors text-sm resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    className="w-full bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-red-800 transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    Send Message
                    <Send size={16} />
                  </button>

                  {/* Response Time Note */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Clock size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Usually responds within 4 hours</p>
                  </div>
                </form>
              ) : (
                /* Success State */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500">Our team will get back to you shortly.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}