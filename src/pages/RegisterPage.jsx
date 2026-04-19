// frontend/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Register from '../components/Auth/Register';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    // Simulate successful registration
    navigate(`/login?redirect=${redirect}`);
  };

  return (
    <main className="min-h-screen bg-[#F9F6F0] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Luxury Liquid Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#E2B254]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#002147]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Pass props to the inner Register component. 
            Ensure your inner Register component removes its own red borders! */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-[#002147] p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <h1 className="text-3xl font-serif font-bold text-white relative z-10">Join Sita Ram</h1>
            <p className="text-[#E2B254] text-sm mt-2 relative z-10">Start your premium organic journey</p>
          </div>
          <div className="p-8">
            <Register 
              handleSubmit={handleSubmit} 
              formData={formData} 
              setFormData={setFormData} 
              error={error} 
              redirect={redirect} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}