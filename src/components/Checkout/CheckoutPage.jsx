import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../services/api'; 

export default function CheckoutComponent({ cartTotal }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // STEP 1: Create the order in the database FIRST (Keep this exactly as you had it!)
      const orderRes = await api.post('/orders/verify.php', {
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        total_amount: cartTotal,
        payment_method: 'connectips' // Changed from esewa
      });

      if (orderRes.data.status === 'success') {
        const realOrderId = orderRes.data.order_id; 

        // STEP 2: Initialize connectIPS using that exact integer
        const connectIpsRes = await api.post('/orders/init_connectips.php', {
          amount: cartTotal,
          purchase_id: realOrderId 
        });

        if (connectIpsRes.data.success) {
          // STEP 3: Build and submit the hidden form dynamically to connectIPS
          submitConnectIPSForm(connectIpsRes.data.gatewayUrl, connectIpsRes.data.payload);
        } else {
          alert("Failed to initialize connectIPS payment: " + connectIpsRes.data.message);
          setIsProcessing(false);
        }
      } else {
        alert("Failed to create order in the database.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  // Helper function to dynamically create and submit the connectIPS form
  const submitConnectIPSForm = (gatewayUrl, payload) => {
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", gatewayUrl);

    for (const key in payload) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", payload[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div>
      <form onSubmit={handleCheckoutSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})} 
            className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#00519E] font-bold text-sm" 
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
          <input 
            type="text" 
            required 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#00519E] font-bold text-sm" 
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Delivery Address</label>
          <textarea 
            required 
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})} 
            className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#00519E] font-bold text-sm" 
            rows="3"
          ></textarea>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <button 
            type="submit" 
            disabled={isProcessing || cartTotal <= 0}
            className="w-full bg-[#00519E] hover:bg-[#003B73] disabled:opacity-50 disabled:hover:bg-[#00519E] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <><Loader2 className="animate-spin" size={18} /> Processing...</>
            ) : (
              `Pay NPR ${cartTotal} with connectIPS`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}