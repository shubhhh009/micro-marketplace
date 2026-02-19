import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  const { user } = useAuth();

  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
    >
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          {user && (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(product.id);
              }}
              className={`p-2 rounded-full shadow-lg backdrop-blur-md transition-colors ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/products/${product.id}`}>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <span className="text-xl font-bold text-primary-600">${product.price}</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <Link
            to={`/products/${product.id}`}
            className="text-primary-600 font-semibold text-sm hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
