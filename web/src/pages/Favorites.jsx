import React, { useState, useEffect } from 'react';
import { favoriteService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await favoriteService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await favoriteService.removeFavorite(productId);
      setFavorites(favorites.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Remove favorite failed', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Favorites</h1>
        <p className="text-gray-500 mt-2">Products you've saved for later</p>
      </div>

      {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="bg-white rounded-2xl h-[380px] animate-pulse border border-gray-100" />
           ))}
         </div>
      ) : favorites.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={true}
                onToggleFavorite={removeFavorite}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-100">
          <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No favorites yet</h3>
          <p className="text-gray-500 mb-8">Start exploring and save items you love!</p>
          <Link 
            to="/" 
            className="inline-flex bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
          >
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
