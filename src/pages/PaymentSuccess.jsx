import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your secure transaction...');

  useEffect(() => {
    const verifyPayment = async () => {
      const data = searchParams.get('data');
      
      if (!data) {
        setStatus('failed');
        setMessage('No payment data found.');
        return;
      }

      try {
        // 1. Decode eSewa's response
        const decodedString = atob(data);
        const parsedData = JSON.parse(decodedString);

        if (parsedData.status === "COMPLETE") {
          // 2. Send the decoded data to your backend for final verification
          const response = await api.post('/orders/verify_esewa.php', {
            transaction_uuid: parsedData.transaction_uuid,
            transaction_code: parsedData.transaction_code, // eSewa's reference ID
            total_amount: parsedData.total_amount
          });

          if (response.data.status === 'success') {
            setStatus('success');
            clearCart(); // Empty the cart
          } else {
            setStatus('failed');
            setMessage(response.data.message || 'Verification failed on server.');
          }
        } else {
          setStatus('failed');
          setMessage('Payment was not completed.');
        }
      } catch (error) {
        setStatus('failed');
        setMessage('Failed to decode or verify payment.');
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF8E7] px-6">
      {status === 'processing' && (
        <div className="text-center">
          <Loader2 className="animate-spin text-[#9e111a] mx-auto mb-4" size={48} />
          <p className="font-bold text-[#002147] uppercase tracking-widest">{message}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-center">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-bold text-[#002147] mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-8 font-medium">Your order has been placed and is being prepared.</p>
          <button onClick={() => navigate('/')} className="bg-[#002147] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#E2B254] hover:text-[#002147] transition-all shadow-lg">
            Return Home
          </button>
        </div>
      )}

      {status === 'failed' && (
        <div className="text-center">
          <XCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-bold text-[#002147] mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-8 font-medium">{message}</p>
          <button onClick={() => navigate('/checkout')} className="bg-[#9e111a] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-lg">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}