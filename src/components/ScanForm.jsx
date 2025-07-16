import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { scanWebsite } from '../services/api';

const { FiSearch, FiSettings, FiPlus, FiX } = FiIcons;

function ScanForm({ onScanStart, onScanComplete, onScanError }) {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState('basic');
  const [keywords, setKeywords] = useState(['']);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const addKeyword = () => {
    setKeywords([...keywords, '']);
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const updateKeyword = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) return;

    const cleanKeywords = keywords.filter(k => k.trim() !== '');
    
    onScanStart();
    
    try {
      const result = await scanWebsite({
        url,
        depth,
        targetKeywords: cleanKeywords
      });
      
      onScanComplete(result);
    } catch (error) {
      console.error('Scan failed:', error);
      onScanError();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Analysis Depth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Analysis Depth
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'basic', label: 'Basic', desc: 'Quick overview' },
              { value: 'advanced', label: 'Advanced', desc: 'Detailed analysis' },
              { value: 'full', label: 'Full', desc: 'AI-powered insights' }
            ].map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  depth === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="depth"
                  value={option.value}
                  checked={depth === option.value}
                  onChange={(e) => setDepth(e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <motion.button
            type="button"
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <SafeIcon icon={FiSettings} />
            <span className="text-sm font-medium">Advanced Options</span>
          </motion.button>

          {isAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Keywords
                </label>
                <div className="space-y-2">
                  {keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => updateKeyword(index, e.target.value)}
                        placeholder="Enter keyword"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {keywords.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <SafeIcon icon={FiX} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                    <span className="text-sm">Add keyword</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiSearch} />
            <span>Analyze Website</span>
          </div>
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ScanForm;