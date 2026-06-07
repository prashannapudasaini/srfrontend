import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../services/api'; 

// Notice we removed transactionUuid from the props, we don't need it anymore!
export default function CheckoutComponent({ cartTotal }) {
  // 1. State for the checkout form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. The main checkout function triggered when the form is submitted
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // STEP 1: Create the order in the database FIRST
      const orderRes = await api.post('/orders/verify.php', {
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        total_amount: cartTotal,
        payment_method: 'esewa'
      });

      if (orderRes.data.status === 'success') {
        // STEP 2: Capture the real database integer ID (e.g., 15)
        const realOrderId = orderRes.data.order_id; 

        // STEP 3: Initialize eSewa using that exact integer
        const esewaRes = await api.post('/orders/init_esewa.php', {
          amount: cartTotal,
          purchase_id: realOrderId 
        });

        if (esewaRes.data.status === 'success') {
          // STEP 4: Build and submit the hidden form dynamically
          submitEsewaForm(esewaRes.data.esewa_payload);
        } else {
          alert("Failed to initialize eSewa payment.");
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

  // Helper function to dynamically create and submit the eSewa form
  const submitEsewaForm = (payload) => {
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

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
      {/* 3. The Checkout Form */}
      <form onSubmit={handleCheckoutSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})} 
            className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#60A839] font-bold text-sm" 
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
          <input 
            type="text" 
            required 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#60A839] font-bold text-sm" 
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Delivery Address</label>
          <textarea 
            required 
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})} 
            className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#60A839] font-bold text-sm" 
            rows="3"
          ></textarea>
        </div>

        {/* 4. The Submit Button */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <button 
            type="submit" 
            disabled={isProcessing || cartTotal <= 0}
            className="w-full bg-[#60A839] hover:bg-[#4d872d] disabled:opacity-50 disabled:hover:bg-[#60A839] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <><Loader2 className="animate-spin" size={18} /> Processing...</>
            ) : (
              `Pay NPR ${cartTotal} with eSewa`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}