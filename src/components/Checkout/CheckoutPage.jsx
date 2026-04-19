// frontend/src/components/Checkout/CheckoutPage.jsx
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function CheckoutComponent({ cartTotal, handleEsewaPayment, transactionUuid }) {
  return (
    <div className="w-full">
      <div className="bg-[#F9F6F0] p-6 rounded-2xl mb-8 border border-gray-200 flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount Due</p>
          <p className="text-3xl text-[#002147] font-bold">Rs. {cartTotal}</p>
        </div>
        <ShieldCheck size={40} className="text-[#E2B254]" />
      </div>

      <div className="mb-8 p-6 border border-gray-100 rounded-2xl">
        <h3 className="font-bold text-[#002147] mb-4 text-lg">Transaction Information</h3>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500">Order ID:</span>
          <span className="font-mono font-bold text-[#002147]">{transactionUuid}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500">Gateway:</span>
          <span className="font-bold text-[#60bb46]">eSewa Digital Wallet</span>
        </div>
      </div>

      {/* Hidden Form for eSewa Test Environment */}
      <form id="esewa-form" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
          <input type="hidden" id="amount" name="amount" value={cartTotal} required />
          <input type="hidden" id="tax_amount" name="tax_amount" value="0" required />
          <input type="hidden" id="total_amount" name="total_amount" value={cartTotal} required />
          <input type="hidden" id="transaction_uuid" name="transaction_uuid" value={transactionUuid} required />
          <input type="hidden" id="product_code" name="product_code" value="EPAYTEST" required />
          <input type="hidden" id="product_delivery_charge" name="product_delivery_charge" value="0" required />
          <input type="hidden" id="success_url" name="success_url" value="http://localhost:5173/checkout/success" required />
          <input type="hidden" id="failure_url" name="failure_url" value="http://localhost:5173/checkout/failure" required />
          <input type="hidden" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required />
          <input type="hidden" id="signature" name="signature" value="SIMULATED_HMAC_SHA256_STRING" required />
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEsewaPayment}
            className="w-full bg-[#60bb46] text-white font-bold text-lg py-5 rounded-xl hover:bg-[#509f39] transition-colors shadow-[0_10px_20px_rgba(96,187,70,0.3)] flex items-center justify-center gap-3"
          >
            Pay Securely with eSewa
          </motion.button>
      </form>
    </div>
  );
}