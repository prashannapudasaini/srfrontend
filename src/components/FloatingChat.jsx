import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  // WhatsApp API works best with just digits (no +, no -)
  const WHATSAPP_NUMBER = "9779767663024"; 
  
  const MESSAGES = [
    {
      id: 1,
      text: "Namaste! Welcome to Sita Ram Dairy. How can we help you today?",
      delay: 0.2
    },
    {
      id: 2,
      text: "We take pride in our premium farm-fresh products: Fresh A2 Milk, Pure Desi Ghee, Paneer, and Probiotic Curd. 🥛✨ For bulk orders or home delivery, click below to chat with us!",
      delay: 0.8 // Appears shortly after the first one
    }
  ];

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent("Hello Sita Ram Dairy! I'm interested in your products and would like to know more.");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      
      {/* 1. Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-700 p-4 text-white flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center p-1 shadow-inner">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">Sita Ram Support</p>
                  <p className="text-[10px] text-red-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online • Replies instantly
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-red-800 p-1.5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-gray-50 h-[280px] overflow-y-auto flex flex-col gap-3">
              {MESSAGES.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: msg.delay }}
                  className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-xs md:text-sm text-gray-700 max-w-[90%] border border-gray-100"
                >
                  {msg.text}
                </motion.div>
              ))}
            </div>

            {/* Footer / Action Button */}
            <div className="p-4 bg-white border-t border-gray-50">
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Send size={18} />
                Contact on WhatsApp
              </button>
              <p className="text-center text-[9px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                Secure WhatsApp Redirect
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-red-700 hover:bg-red-800 text-white px-6 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group"
      >
        <span className="font-bold text-sm">Chat with us</span>
        <div className="relative">
            {!isOpen && (
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping"></span>
            )}
            <MessageCircle className="relative z-10" size={22} />
        </div>
      </button>
    </div>
  );
};

export default FloatingChat;