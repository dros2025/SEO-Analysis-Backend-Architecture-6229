import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { checkRankPosition } from '../services/api';

const { FiSearch, FiGlobe, FiTrendingUp } = FiIcons;

function RankTrackerForm({ onStartCheck, onResultsReceived, onError }) {
  const [formData, setFormData] = useState({
    keyword: '',
    domain: '',
    searchEngine: 'google'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onStartCheck();

    try {
      const results = await checkRankPosition(formData);
      onResultsReceived(results);
    } catch (error) {
      onError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keyword to Track
          </label>
          <div className="relative">
            <SafeIcon
              icon={FiSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={formData.keyword}
              onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
              placeholder="Enter keyword (e.g., best seo tools)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain to Check
          </label>
          <div className="relative">
            <SafeIcon
              icon={FiGlobe}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="Enter domain (e.g., example.com)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Engine
          </label>
          <div className="relative">
            <select
              value={formData.searchEngine}
              onChange={(e) => setFormData({ ...formData, searchEngine: e.target.value })}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="google">Google</option>
              <option value="bing" disabled>Bing (Coming Soon)</option>
              <option value="yahoo" disabled>Yahoo (Coming Soon)</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <SafeIcon icon={FiTrendingUp} className="text-gray-400" />
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiSearch} />
            <span>{isSubmitting ? 'Checking Rank...' : 'Check Rank Position'}</span>
          </div>
        </motion.button>
      </form>
    </motion.div>
  );
}

export default RankTrackerForm;