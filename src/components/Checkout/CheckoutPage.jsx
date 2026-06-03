import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../services/api'; 

export default function CheckoutComponent({ cartTotal, transactionUuid }) {
  // 1. Add these states at the top of your component
  const [esewaPayload, setEsewaPayload] = useState(null);
  const [isEsewaLoading, setIsEsewaLoading] = useState(true);

  // 2. Fetch the secure signature from your PHP backend
  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await api.post('/orders/init_esewa.php', {
          amount: cartTotal,
          purchase_id: transactionUuid
        });

        if (response.data.status === 'success') {
          setEsewaPayload(response.data.esewa_payload);
        }
      } catch (err) {
        console.error("eSewa Init Error:", err);
      } finally {
        setIsEsewaLoading(false);
      }
    };

    if (cartTotal > 0) {
      initializePayment();
    }
  }, [cartTotal, transactionUuid]);

  // 3. The function to trigger the hidden form
  const handleEsewaPayment = (e) => {
    e.preventDefault();
    document.getElementById('esewa-form').submit();
  };

  return (
    <div>
      {/* ... YOUR EXISTING CHECKOUT FORM FIELDS (Name, Address, etc.) GO HERE ... */}

      {/* 4. The eSewa Button and Hidden Form (Put this at the bottom of your form) */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        {isEsewaLoading ? (
          <div className="flex justify-center items-center gap-2 text-gray-500 font-bold text-sm">
            <Loader2 className="animate-spin" size={16} /> Connecting to eSewa...
          </div>
        ) : esewaPayload ? (
          <form id="esewa-form" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <input type="hidden" name="amount" value={esewaPayload.amount} />
            <input type="hidden" name="tax_amount" value={esewaPayload.tax_amount} />
            <input type="hidden" name="total_amount" value={esewaPayload.total_amount} />
            <input type="hidden" name="transaction_uuid" value={esewaPayload.transaction_uuid} />
            <input type="hidden" name="product_code" value={esewaPayload.product_code} />
            <input type="hidden" name="product_service_charge" value={esewaPayload.product_service_charge} />
            <input type="hidden" name="product_delivery_charge" value={esewaPayload.product_delivery_charge} />
            <input type="hidden" name="success_url" value={esewaPayload.success_url} />
            <input type="hidden" name="failure_url" value={esewaPayload.failure_url} />
            <input type="hidden" name="signed_field_names" value={esewaPayload.signed_field_names} />
            <input type="hidden" name="signature" value={esewaPayload.signature} />

            <button 
              type="button" 
              onClick={handleEsewaPayment} 
              className="w-full bg-[#60A839] hover:bg-[#4d872d] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg"
            >
              Pay NPR {cartTotal} with eSewa
            </button>
          </form>
        ) : (
          <p className="text-red-500 text-center font-bold">Payment gateway unavailable.</p>
        )}
      </div>
    </div>
  );
}