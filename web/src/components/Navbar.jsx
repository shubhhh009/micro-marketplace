import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glassmorphism mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600">
              MicroMarket
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                  Products
                </Link>
                {user.role === 'admin' && (
                  <Link to="/add-product" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                    Sell
                  </Link>
                )}
                <Link to="/favorites" className="relative text-gray-600 hover:text-primary-600 transition-colors">
                  <Heart className="h-6 w-6" />
                </Link>
                <div className="flex items-center space-x-4 pl-4 border-l">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {user.email.split('@')[0]}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-md shadow-primary-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
