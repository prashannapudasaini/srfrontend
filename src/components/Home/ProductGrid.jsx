// frontend/src/components/Home/ProductGrid.jsx
import ProductCard from '../Products/ProductCard';

export default function ProductGrid({ products }) {
  return (
    // Dense 5-column layout for large screens to match Daraz e-commerce efficiency
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {products?.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full py-20 text-center text-gray-500 font-medium">
          No products found in this category.
        </div>
      )}
    </div>
  );
}