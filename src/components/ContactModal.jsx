// frontend/src/components/Modals/ContactModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, User, Phone, Mail, MessageSquare, Clock, MapPin, PhoneCall, AtSign, Clock as ClockIcon } from 'lucide-react';

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
        setTimeout(() => {
            setSubmitted(false);
            onClose();
            setFormData({ name: '', phone: '', email: '', message: '' });
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                // Full-page overlay: fills entire viewport with scrolling
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-white overflow-y-auto"
                >
                    <div className="min-h-screen w-full max-w-4xl mx-auto px-6 py-8 md:py-12 relative">
                        {/* Close button - fixed top right */}
                        <button
                            onClick={onClose}
                            className="fixed top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full shadow-md transition-all duration-200"
                        >
                            <X size={22} />
                        </button>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-2xl px-6 py-10 text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                Contact Sita Ram Gokul Milk
                            </h2>
                            <p className="text-red-100 text-base mt-3 max-w-2xl mx-auto">
                                Questions about our dairy products, distribution, retail partnerships,
                                or customer support? Our team is here to help.
                            </p>
                        </div>

                        {/* Company Information - compact row */}
                        <div className="bg-red-50/70 rounded-xl border border-red-100 px-6 py-4 mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-red-600 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        <span className="font-medium">Factory Outlets:</span> Kuleshwor &amp; Jyatha
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PhoneCall size={16} className="text-red-600 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        <span className="font-medium">Phone:</span> 015213049
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AtSign size={16} className="text-red-600 flex-shrink-0" />
                                    <span className="text-gray-700 truncate">
                                        <span className="font-medium">Email:</span>{' '}
                                        <a href="mailto:sgokulmilk1@gmail.com" className="hover:underline text-red-700">
                                            sgokulmilk1@gmail.com
                                        </a>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClockIcon size={16} className="text-red-600 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        <span className="font-medium">Business Hours:</span> 6:00 AM – 8:00 PM
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name & Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-colors text-base"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-colors text-base"
                                                    placeholder="+977..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-colors text-base"
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Message *
                                        </label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows="5"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-colors text-base resize-none"
                                                placeholder="How can we help you?"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact categories */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                            Contact Us For
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="bg-white px-3 py-1.5 rounded-full border border-gray-200">🥛 Product Inquiries</span>
                                            <span className="bg-white px-3 py-1.5 rounded-full border border-gray-200">🏪 Retail Partnerships</span>
                                            <span className="bg-white px-3 py-1.5 rounded-full border border-gray-200">🚚 Distribution Support</span>
                                            <span className="bg-white px-3 py-1.5 rounded-full border border-gray-200">📦 Bulk Orders</span>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="w-full bg-red-700 text-white py-3.5 rounded-lg font-semibold text-base hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Send Message
                                        <Send size={18} />
                                    </button>

                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <Clock size={14} className="text-gray-400" />
                                        <p className="text-sm text-gray-400">Open daily from 6:00 AM – 8:00 PM</p>
                                    </div>
                                </form>
                            ) : (
                                /* Success */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-500">Our team will get back to you shortly.</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer note */}
                        <p className="text-center text-xs text-gray-400 mt-6">
                            Sita Ram Gokul Milk – Premium dairy since 1995
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}