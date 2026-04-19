import { useState, useEffect } from 'react';
import api from '../services/api';
import HeroSlider from '../components/Home/HeroSlider';
import HeroProductGrid from '../components/Home/HeroProductGrid';
import ProductImageShowcase from '../components/Home/ProductImageShowcase';
import OurCollection from '../components/Home/OurCollection';
import DetailedProductCards from '../components/Home/DetailedProductCards';
import FloatingTypography from '../components/Home/FloatingTypography';
import FeaturedCarousel from '../components/Home/FeaturedCarousel';

export default function HomePage() {
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [essentialProducts, setEssentialProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live products and filter them based on Admin checkboxes
  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await api.get('/products/index.php');
        if (res.data.status === 'success') {
          const allProducts = res.data.data;
          setPremiumProducts(allProducts.filter(p => p.is_premium));
          setEssentialProducts(allProducts.filter(p => p.is_essential));
        }
      } catch (error) {
        console.error("Failed to load home products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  return (
    <main className="overflow-hidden bg-[#FDF8E7]">
      <HeroSlider />
      <HeroProductGrid />
      <ProductImageShowcase />
      
      {/* Pass the dynamic data into your existing components */}
      <OurCollection products={premiumProducts} loading={loading} />
      <DetailedProductCards products={essentialProducts} loading={loading} />
      
      <FloatingTypography />
      <FeaturedCarousel />
    </main>
  );
}