import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService, favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Heart, ShieldCheck, Truck } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const productRes = await productService.getProduct(id);
        setProduct(productRes.data);
        if (user) {
          const favoritesRes = await favoriteService.getFavorites();
          setIsFavorite(favoritesRes.data.some(f => f.id === id));
        }
      } catch (error) {
        console.error('Error initializing product details', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) return navigate('/login');
    try {
      let data;
      if (isFavorite) {
        const res = await favoriteService.removeFavorite(id);
        data = res.data;
      } else {
        const res = await favoriteService.addFavorite(id);
        data = res.data;
      }
      // Update with server's source of truth
      const isInFavorites = data.some(f => (f.id || f._id) === id);
      setIsFavorite(isInFavorites);
    } catch (error) {
      console.error('Favorite action failed', error);
      alert('Failed to update favorites.');
    }
  };

  if (loading) return <div className="animate-pulse flex flex-col items-center py-20"><div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div><div className="w-40 h-6 bg-gray-200 rounded"></div></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Results
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-white rounded-3xl overflow-hidden shadow-2xl p-4 lg:p-8"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto object-contain rounded-2xl"
          />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex flex-col"
        >
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">{product.title}</h1>
            <p className="text-2xl font-bold text-primary-600 mb-6">${product.price}</p>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-4 mb-10">
            <button className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
              Buy Now
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-4 rounded-2xl border-2 transition-all ${
                isFavorite 
                  ? 'bg-red-50 border-red-200 text-red-500' 
                  : 'bg-white border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100'
              }`}
            >
              <Heart className={`h-7 w-7 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="p-4 rounded-2xl border-2 border-gray-100 text-gray-400 bg-white hover:border-primary-100 hover:text-primary-500 transition-all">
              <Share2 className="h-7 w-7" />
            </button>
            {user && user.role === 'admin' && (
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this product?')) {
                    try {
                      await productService.deleteProduct(id);
                      navigate('/');
                    } catch (error) {
                      console.error('Delete failed', error);
                      alert('Failed to delete product');
                    }
                  }
                }}
                className="p-4 rounded-2xl border-2 border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-all"
                title="Delete Product"
              >
                <div className="h-7 w-7 flex items-center justify-center font-bold">🗑️</div>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 border-t pt-8">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Free Delivery</p>
                <p className="text-sm text-gray-500">Free shipping on all orders over $99</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <ShieldCheck className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">2 Year Warranty</p>
                <p className="text-sm text-gray-500">Full accidental damage protection package</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
