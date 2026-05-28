import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // State for bot memory
  const [fallbackCount, setFallbackCount] = useState(0);

  const messagesEndRef = useRef(null);
  const WHATSAPP_NUMBER = "9779767663024";

  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      text: "Namaste! 🙏 Welcome to Sita Ram Dairy.",
      sender: "bot",
    },
    {
      id: "welcome-2",
      text: "How can I help you today?",
      sender: "bot",
      action: "quick_replies", // Triggers suggestion chips
      options: ["Our Products", "Delivery Info", "Contact Support"]
    }
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleWhatsAppRedirect = (customText) => {
    const message = encodeURIComponent(customText || "Hello Sita Ram Dairy! I need some help.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  // 🧠 ADVANCED CORE: Intent Dictionary using Regex Boundaries
  const BOT_INTENTS = [
    {
      intent: "greeting",
      pattern: /\b(hi|hello|hey|namaste|morning|evening|howdy)\b/i,
      responses: [
        { text: "Hello there! 👋", action: null },
        { text: "Are you looking for our fresh dairy products, or do you need help with an order?", action: "quick_replies", options: ["Products", "Track Order"] }
      ]
    },
    {
      intent: "products",
      pattern: /\b(milk|ghee|paneer|curd|product|products|items|price|buy|catalog)\b/i,
      responses: [
        { text: "We take pride in our premium farm-fresh products! 🥛", action: null },
        { text: "We currently offer Fresh A2 Cow Milk, Pure Desi Ghee, Soft Paneer, and Probiotic Curd.", action: null },
        { text: "You can easily add them to your cart directly from our app.", action: null }
      ]
    },
    {
      intent: "features_delivery",
      pattern: /\b(delivery|wallet|order|location|payment|map|feature|pay|cash|track)\b/i,
      responses: [
        { text: "Our platform makes ordering super easy! 🚚", action: null },
        { text: "You can pin your exact delivery location on our interactive map.", action: null },
        { text: "We also offer a Sitaram Wallet—load Rs. 2000+ to get a 2% bonus! 💰 You can pay securely via Wallet or Cash on Delivery.", action: null }
      ]
    },
    {
      intent: "support",
      pattern: /\b(help|support|human|agent|call|whatsapp|contact|issue|problem|wrong)\b/i,
      responses: [
        { text: "I understand you need assistance. Let me connect you directly to our human support team! 🎧", action: "whatsapp" }
      ]
    }
  ];

  // 🧠 ADVANCED CORE: Intent Matcher & Escalation Protocol
  const generateBotResponse = (userInput) => {
    // 1. Scan user input against all regex patterns
    for (const intentObj of BOT_INTENTS) {
      if (intentObj.pattern.test(userInput)) {
        setFallbackCount(0); // Reset memory on successful understanding
        return intentObj.responses;
      }
    }

    // 2. Escalation Protocol: If bot fails twice, force WhatsApp redirect
    const newCount = fallbackCount + 1;
    setFallbackCount(newCount);

    if (newCount >= 2) {
      setFallbackCount(0); // Reset after triggering
      return [
        { text: "It seems I'm having trouble understanding exactly what you need. 🤔", action: null },
        { text: "To make sure you get the right help, I'll provide a direct link to our support team.", action: "whatsapp" }
      ];
    }

    // 3. Standard Fallback
    return [
      { text: "I'm sorry, I didn't quite catch that. Could you rephrase it?", action: null },
      { text: "You can ask me about our products, delivery, or simply request human support.", action: null }
    ];
  };

  // ⏱️ ADVANCED CORE: Dynamic Typing Simulation
  const calculateTypingDelay = (text) => {
    // 20ms per character, minimum 600ms, maximum 2000ms
    const delay = Math.max(600, Math.min(2000, text.length * 20));
    return delay;
  };

  const processMessage = async (userText) => {
    if (!userText.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now().toString(), text: userText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    
    // 2. Generate Intelligent Response Array
    const responses = generateBotResponse(userText);

    // 3. Inject Responses Sequentially with Dynamic Delays
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

  const handleQuickReply = (optionText) => {
    processMessage(optionText); // Treats the button click exactly like a typed message
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-red-700 p-4 text-white flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center p-1 shadow-inner">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">Sita Ram Assistant</p>
                  <p className="text-[10px] text-red-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Automated Support
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-red-800 p-1.5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-gray-50 h-[380px] overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col max-w-[88%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div 
                    className={`p-3 rounded-2xl shadow-sm text-[13px] leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-red-700 text-white rounded-br-sm" 
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  {/* Action UI: WhatsApp Button */}
                  {msg.action === "whatsapp" && (
                    <button
                      onClick={() => handleWhatsAppRedirect()} 
                      className="mt-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 px-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 text-xs w-full justify-center"
                    >
                      <Send size={14} /> Contact Human Support
                    </button>
                  )}

                  {/* Action UI: Quick Replies */}
                  {msg.action === "quick_replies" && msg.options && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickReply(opt)}
                          disabled={isTyping}
                          className="bg-white border border-red-200 text-red-700 hover:bg-red-50 py-1.5 px-3 rounded-full text-[11px] font-semibold shadow-sm transition-colors disabled:opacity-50"
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
                <div className="self-start bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1 w-14 h-10">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-700/20 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-red-700 disabled:bg-gray-300 text-white p-2.5 rounded-full transition-colors"
              >
                <Send size={16} className={inputText.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-red-700 hover:bg-red-800 text-white px-6 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group"
      >
        <span className="font-bold text-sm">{isOpen ? "Close Chat" : "Help & Support"}</span>
        <div className="relative">
            {!isOpen && (
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping"></span>
            )}
            {isOpen ? <X className="relative z-10" size={22} /> : <MessageCircle className="relative z-10" size={22} />}
        </div>
      </button>
    </div>
  );
};

export default FloatingChat;