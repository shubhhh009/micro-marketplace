import React, { useState, useEffect } from 'react';
import { productService, favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
    if (user) fetchFavorites();
  }, [page, search, user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getProducts({ search, page, limit: 8 });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data } = await favoriteService.getFavorites();
      setFavorites(data.map(f => f.id));
    } catch (error) {
      console.error('Error fetching favorites', error);
    }
  };

  const toggleFavorite = async (productId) => {
    if (!user) return; // Should already be handled by UI
    try {
      let data;
      if (favorites.includes(productId)) {
        const res = await favoriteService.removeFavorite(productId);
        data = res.data;
      } else {
        const res = await favoriteService.addFavorite(productId);
        data = res.data;
      }
      // Update with server's source of truth
      setFavorites(data.map(f => f.id || f._id));
    } catch (error) {
      console.error('Favorite action failed', error);
      alert('Failed to update favorites. Please check your connection.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Products</h1>
          <p className="text-gray-500 mt-2">Discover the best deals on premium electronics</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 bg-white shadow-sm transition-all outline-none"
            />
          </div>
          <button className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-primary-500 transition-colors shadow-sm">
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-[380px] animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-center items-center space-x-4 mt-12 bg-white w-fit mx-auto p-2 rounded-2xl shadow-sm border">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <span className="font-bold text-gray-700 mx-4">
               {page} <span className="text-gray-400 font-normal">of</span> {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900">No products found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
