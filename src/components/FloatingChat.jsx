import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// SMART CATALOG
const LOCAL_CATALOG = {
  milk: {
    pattern: /\b(milk|standard|cow milk|low fat|tea|coffee milk)\b/i,
    title: "Farm Fresh Milk 🥛",
    info: "• **Standard Milk:** NPR 50 (500 ml)\n• **Cow Milk:** NPR 50 (500 ml)\n• **Low Fat Milk:** NPR 48 (500 ml)\n• **Tea & Coffee Milk:** NPR 90 (1000 ml)"
  },
  dahi: {
    pattern: /\b(curd|dahi|yogurt|cup dahi)\b/i,
    title: "Curd / Dahi 🥣",
    info: "• **Sugar Dahi:** NPR 100 (500 gm) | NPR 190 (1000 gm)\n• **Dahi Sugar Free:** NPR 100 (500 gm)\n• **Cup Dahi:** NPR 45 (200 gm)"
  },
  ghee: {
    pattern: /\b(ghee|premium ghee)\b/i,
    title: "Pure Desi Ghee 🍯",
    info: "• **Ghee:** NPR 660 (500 gm) | NPR 1300 (1000 ml)\n• **Premium Ghee:** NPR 685 (500 ml)"
  },
  paneer: {
    pattern: /\b(paneer)\b/i,
    title: "Soft Paneer 🧀",
    info: "• **Paneer:** NPR 195 (180 gm) | NPR 460 (450 gm)"
  },
  cheese: {
    pattern: /\b(cheese|mozarella)\b/i,
    title: "Mozarella Cheese 🧀",
    info: "• **Mozarella Cheese:** NPR 230 (180 gm) | NPR 530 (450 gm)"
  },
  butter: {
    pattern: /\b(butter)\b/i,
    title: "Fresh Butter 🧈",
    info: "• **Butter:** NPR 145 (100 gm) | NPR 635 (500 gm)"
  },
  lassi: {
    pattern: /\b(lassi|strawberry|plain lassi)\b/i,
    title: "Refreshing Lassi 🥤",
    info: "• **Plain Lassi:** NPR 65 (200 ml)\n• **Strawberry Lassi:** NPR 70 (200 ml)"
  },
  beverages: {
    pattern: /\b(beverage|beverages|energy|energy fresh|chillax|mohi|drink)\b/i,
    title: "Beverages & Drinks 🧃",
    info: "• **Energy Fresh (200 ml):** NPR 80\n  *(Flavors: Keshar, Coffee, Cardamom, Chocolate, Butterscotch)*\n\n• **Chillax (180 ml):** NPR 100\n  *(Flavors: Hazelnuts & Coffee, Dry Fruits)*\n\n• **Mohi (250 ml):** NPR 30"
  }
};

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [fallbackCount, setFallbackCount] = useState(0);
  
  const messagesEndRef = useRef(null);
  const WHATSAPP_NUMBER = "9779767663024";

  // Active Route Tracker: Ensures the button collapses instantly when leaving the home page
  useEffect(() => {
    const checkRoute = () => {
      setIsHomePage(window.location.pathname === "/");
    };
    
    checkRoute();
    window.addEventListener("popstate", checkRoute);
    
    // Fallback interval for Single Page Applications (React/Next.js)
    const interval = setInterval(checkRoute, 500);
    
    return () => {
      window.removeEventListener("popstate", checkRoute);
      clearInterval(interval);
    };
  }, []);

  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      text: "Namaste! 🙏 Welcome to Sita Ram Gokul Milks.",
      sender: "bot",
    },
    {
      id: "welcome-2",
      text: "I'm your virtual assistant. I can help you with product prices, subscriptions, and delivery. What would you like to know?",
      sender: "bot",
      action: "quick_replies",
      options: ["View Menu", "How to Subscribe", "Contact Support"]
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleWhatsAppRedirect = (customText) => {
    const message = encodeURIComponent(customText || "Hello Sita Ram Dairy! I need some help with my order.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const generateBotResponse = (userInput) => {
    const text = userInput.toLowerCase();

    // 1. SHOW FULL CATALOG MENU
    if (/\b(menu|products|catalog|items|buy|list)\b/i.test(text)) {
      setFallbackCount(0);
      return [
        { text: "Here is our complete farm-fresh menu: 🐄", action: null },
        { text: "• **Milk** (Standard, Cow, Low Fat, Tea/Coffee)\n• **Curd/Dahi** (Sugar, Sugar-Free, Cup)\n• **Ghee** (Regular & Premium)\n• **Paneer** (180g & 450g)\n• **Mozarella Cheese**\n• **Butter**\n• **Lassi & Beverages** (Energy Fresh, Chillax, Mohi)", action: null },
        { text: "Type the name of any product (e.g., 'Ghee' or 'Paneer') to see its sizes and prices!", action: "quick_replies", options: ["Ghee", "Paneer", "Milk"] }
      ];
    }

    // 2. SPECIFIC PRODUCT INQUIRY
    for (const key in LOCAL_CATALOG) {
      if (LOCAL_CATALOG[key].pattern.test(text)) {
        setFallbackCount(0);
        return [
          { text: `Here are the details for our **${LOCAL_CATALOG[key].title}**:`, action: null },
          { text: LOCAL_CATALOG[key].info, action: null },
          { text: "You can add these to your cart or set up a daily subscription! 🛒", action: "quick_replies", options: ["How to Subscribe", "View Menu"] }
        ];
      }
    }

    // 3. SUBSCRIPTIONS
    if (/\b(subscribe|subscription|daily|morning|everyday|routine)\b/i.test(text)) {
      setFallbackCount(0);
      return [
        { text: "We offer hassle-free Daily Subscriptions! 🌅", action: null },
        { text: "You can choose your preferred delivery time (Morning/Evening) and we will deliver fresh dairy right to your doorstep every day.", action: null },
        { text: "Just go to any product page and click 'Subscribe' instead of 'Add to Cart'.", action: null }
      ];
    }

    // 4. DELIVERY & WALLET
    if (/\b(delivery|wallet|pay|payment|cash|cod|track|location)\b/i.test(text)) {
      setFallbackCount(0);
      return [
        { text: "🚚 We deliver across the Kathmandu valley. You can pin your exact location on our map during checkout.", action: null },
        { text: "💰 Payment is easy: We accept Cash on Delivery (COD), ConnectIPS, and our native Sitaram Wallet.", action: null },
        { text: "Pro Tip: Loading Rs. 2000 or more into your wallet instantly gives you a 10% bonus! 🎉", action: null }
      ];
    }

    // 5. GREETINGS
    if (/\b(hi|hello|hey|namaste|morning|evening|howdy)\b/i.test(text)) {
      setFallbackCount(0);
      return [
        { text: "Hello there! 👋 Always great to see you.", action: null },
        { text: "Are you looking for something specific today?", action: "quick_replies", options: ["View Menu", "How to Subscribe"] }
      ];
    }

    // 6. SUPPORT/HUMAN
    if (/\b(help|support|human|agent|call|whatsapp|contact|issue|problem|wrong)\b/i.test(text)) {
      setFallbackCount(0);
      return [
        { text: "I understand you need assistance. Let me connect you directly to our human support team! 🎧", action: "whatsapp" }
      ];
    }

    // 7. FALLBACK LOGIC
    const newCount = fallbackCount + 1;
    setFallbackCount(newCount);

    if (newCount >= 2) {
      setFallbackCount(0);
      return [
        { text: "I'm having a bit of trouble understanding. To make sure you get the right help, I'll provide a direct link to our support team! 🧑‍💻", action: "whatsapp" }
      ];
    }

    return [
      { text: "I'm sorry, I didn't quite catch that. Could you rephrase?", action: null },
      { text: "You can ask me about specific products (like 'Paneer' or 'Milk'), delivery, or simply request human support.", action: "quick_replies", options: ["View Menu", "Contact Support"] }
    ];
  };

  const calculateTypingDelay = (text) => {
    return Math.max(700, Math.min(2000, text.length * 15));
  };

  const processMessage = async (userText) => {
    if (!userText.trim()) return;

    const userMsg = { id: Date.now().toString(), text: userText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    
    const responses = generateBotResponse(userText);

    for (let i = 0; i < responses.length; i++) {
      setIsTyping(true);
      const typingTime = calculateTypingDelay(responses[i].text);
      await new Promise((resolve) => setTimeout(resolve, typingTime)); 

      const botMsg = {
        id: Date.now().toString() + "-" + i,
        text: responses[i].text,
        sender: "bot",
        action: responses[i].action,
        options: responses[i].options
      };
      
      setMessages((prev) => [...prev, botMsg]);
    }
    
    setIsTyping(false);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    processMessage(inputText);
  };

  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => 
      part.startsWith('**') && part.endsWith('**') 
        ? <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
        : part
    );
  };

  return (
    // 🔥 FIX: Lowered z-index to 40 so the Cart Drawer (usually 50+) gracefully overlays the chat button
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[40] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[360px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#002147] to-[#003B7D] p-5 text-white flex justify-between items-center shadow-md z-10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-black text-sm tracking-wide">Sita Ram Assistant</p>
                  <p className="text-[11px] text-blue-200 flex items-center gap-1.5 font-medium mt-0.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    Online & Ready
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-5 bg-[#F9FAFB] flex-1 overflow-y-auto flex flex-col gap-4 scroll-smooth min-h-[300px]">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col max-w-[88%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div 
                    className={`p-3.5 rounded-2xl shadow-sm text-[13px] leading-relaxed whitespace-pre-line ${
                      msg.sender === "user" 
                        ? "bg-[#002147] text-white rounded-br-sm" 
                        : "bg-white text-gray-700 rounded-bl-sm border border-gray-200"
                    }`}
                  >
                    {formatText(msg.text)}
                  </div>
                  
                  {msg.action === "whatsapp" && (
                    <button
                      onClick={() => handleWhatsAppRedirect()} 
                      className="mt-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 text-xs w-full justify-center"
                    >
                      <PhoneCall size={16} /> Connect to Human Support
                    </button>
                  )}

                  {msg.action === "quick_replies" && msg.options && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => processMessage(opt)}
                          disabled={isTyping}
                          className="bg-white border border-[#E2B254] text-[#B8860B] hover:bg-[#FFF8DC] py-1.5 px-3.5 rounded-full text-[11px] font-bold shadow-sm transition-colors disabled:opacity-50"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="self-start bg-white border border-gray-200 p-3.5 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 w-16 h-11">
                  <span className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-[#002147] rounded-full animate-bounce delay-200"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isTyping}
                className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-full px-4 py-3 outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147] transition-all disabled:opacity-50 text-gray-800 min-w-0"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-[#002147] disabled:bg-gray-300 text-[#E2B254] p-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md flex-shrink-0"
              >
                <Send size={18} className={inputText.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        // 🔥 FIX: Strictly applies circle styling when NOT on the home page or when chat is open
        className={`flex items-center justify-center bg-[#002147] hover:bg-[#001733] text-[#E2B254] rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group 
          ${(!isHomePage || isOpen) ? "w-14 h-14 md:w-16 md:h-16" : "px-5 py-3.5 gap-3 md:px-6 md:py-4 md:gap-3"}
        `}
      >
        {/* Only render text if on home page AND chat is closed */}
        {(isHomePage && !isOpen) && (
          <span className="font-black text-sm whitespace-nowrap tracking-wide uppercase">
            Help & Support
          </span>
        )}
        
        <div className="relative flex items-center justify-center">
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping"></span>
          )}
          {isOpen ? <X className="relative z-10" size={24} color="#FFF" /> : <MessageCircle className="relative z-10" size={24} />}
        </div>
      </button>
    </div>
  );
};

export default FloatingChat;