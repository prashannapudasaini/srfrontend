import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchSingleProduct = async () => {
      try {
        // Fetching all products and finding the specific one by ID
        const res = await api.get('/products/index.php');
        if (res.data.status === 'success') {
          const foundProduct = res.data.data.find(p => p.id === parseInt(id));
          if (foundProduct) {
            setProduct(foundProduct);
            setSelectedVariant(foundProduct.variants[0]); // Select first variant by default
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
    if (product && selectedVariant) {
      const cartItem = {
        ...product, 
        cartItemId: `${product.id}-${selectedVariant.size}`, 
        selectedSize: selectedVariant.size, 
        price_npr: selectedVariant.price_npr, 
        image: selectedVariant.image || product.image
      };
      addToCart(cartItem, quantity);
      navigate('/cart');
    }
  };

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#002147]"></div></div>;
  if (!product) return <div className="min-h-screen pt-40 text-center text-2xl font-bold text-[#002147]">Product Not Found</div>;

  return (
    <div className="bg-[#F9F6F0] min-h-screen pt-32 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-4 shadow-xl border border-white/60">
          <ProductDetail 
            product={product} 
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
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