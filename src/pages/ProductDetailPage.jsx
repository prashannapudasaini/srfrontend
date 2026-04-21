import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import ProductDetail from '../components/Products/ProductDetail';
import api from '../services/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // FIX: Instead of holding the whole object in state, hold the index.
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchSingleProduct = async () => {
      try {
        const res = await api.get('/products/index.php');
        if (res.data.status === 'success') {
          const foundProduct = res.data.data.find(p => p.id === parseInt(id));
          if (foundProduct) {
            setProduct(foundProduct);
            setSelectedIndex(0); // Reset to first variant
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [id]);

  const handleAddToCart = () => {
    const currentVariant = product?.variants?.[selectedIndex];
    if (product && currentVariant) {
      const cartItem = {
        ...product, 
        cartItemId: `${product.id}-${currentVariant.size}`, 
        selectedSize: currentVariant.size, 
        price_npr: currentVariant.price_npr, 
        image: currentVariant.image || product.image || '/logo.png'
      };
      addToCart(cartItem, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] pt-40 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#002147]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] pt-40 flex flex-col items-center">
        <h2 className="text-3xl font-serif font-bold text-[#002147] mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">This item may be out of stock or removed.</p>
        <button onClick={() => navigate('/products')} className="px-8 py-3 bg-[#002147] text-white rounded-xl font-bold">
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F6F0] min-h-screen pt-32 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-4 shadow-xl border border-white/60">
          <ProductDetail 
            product={product} 
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            quantity={quantity} 
            setQuantity={setQuantity} 
            handleAddToCart={handleAddToCart}
            onBack={() => navigate('/products')}
          />
        </div>
      </div>
    </div>
  );
}