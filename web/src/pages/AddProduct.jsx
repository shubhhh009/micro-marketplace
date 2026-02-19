import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { motion } from 'framer-motion';
import { PackagePlus, Image as ImageIcon, IndianRupee, FileText, ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await productService.createProduct({
        ...formData,
        price: Number(formData.price),
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Marketplace
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        <div className="bg-primary-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold mb-2">Sell Your Item</h1>
            <p className="text-primary-100 italic">"Ghar ki purani chij, ab naye hatho me!"</p>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <PackagePlus size={200} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Product Title</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="What are you selling?"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Price</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="Set a price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    name="image"
                    required
                    placeholder="Paste image link"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Description</label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Tell buyers about your item..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Listing Item...</span>
              </>
            ) : (
              <>
                <PackagePlus className="h-6 w-6" />
                <span>List Product Now</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;
