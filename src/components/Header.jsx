import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiBarChart3 } = FiIcons;

function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-lg border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <SafeIcon icon={FiSearch} className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SEO Analyzer Pro
                </h1>
                <p className="text-gray-600 text-sm">Advanced Website Analysis</p>
              </div>
            </motion.div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/rank-tracker" className="text-gray-600 hover:text-blue-600 transition-colors">
              Rank Tracker
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;