import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart } = FiIcons;

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="bg-gray-900 text-white py-12"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="flex items-center justify-center space-x-2">
          <span>Made with</span>
          <SafeIcon icon={FiHeart} className="text-red-500" />
          <span>by SEO Analyzer Pro</span>
        </p>
        <p className="text-gray-400 mt-2">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

export default Footer;