import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiBarChart, FiTrendingUp, FiZap } = FiIcons;

function LoadingSpinner() {
  const steps = [
    { icon: FiSearch, label: 'Fetching website content' },
    { icon: FiBarChart, label: 'Analyzing SEO elements' },
    { icon: FiTrendingUp, label: 'Calculating metrics' },
    { icon: FiZap, label: 'Generating insights' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mb-6"
        >
          <SafeIcon icon={FiSearch} className="text-white text-3xl" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Website</h3>
        <p className="text-gray-600 mb-8">This may take a few moments...</p>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.5, duration: 0.5 }}
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: index * 0.5 }}
                className="flex-shrink-0"
              >
                <SafeIcon icon={step.icon} className="text-blue-600 text-xl" />
              </motion.div>
              <span className="text-gray-700 font-medium">{step.label}</span>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.5 }}
                className="flex space-x-1 ml-auto"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;