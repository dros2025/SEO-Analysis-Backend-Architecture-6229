import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTag, FiCopy, FiTrendingUp, FiLoader, FiCheckCircle } = FiIcons;

function KeywordSuggestionsPanel({ keyword, domain, onTrackKeyword }) {
  const [copiedKeyword, setCopiedKeyword] = useState(null);

  const handleCopy = (keyword) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handleTrack = (keyword) => {
    if (onTrackKeyword) {
      onTrackKeyword(keyword, domain);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiTag} className="text-xl" />
          <h2 className="text-2xl font-bold">Keyword Suggestions</h2>
        </div>
        <p className="text-teal-100 mt-1">
          Related long-tail keywords to expand your tracking
        </p>
      </div>

      {/* Loading State */}
      {keyword.isLoading && (
        <div className="flex flex-col items-center justify-center p-12">
          <SafeIcon
            icon={FiLoader}
            className="text-teal-600 text-3xl animate-spin mb-4"
          />
          <p className="text-gray-600">Generating keyword suggestions...</p>
        </div>
      )}

      {/* Error State */}
      {keyword.error && (
        <div className="p-6">
          <div className="bg-red-50 text-red-600 rounded-lg p-4 text-center">
            {keyword.error}
          </div>
        </div>
      )}

      {/* Suggestions List */}
      {keyword.suggestions && (
        <div className="p-6">
          <div className="space-y-4">
            {keyword.suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{suggestion.keyword}</h3>
                  <p className="text-sm text-gray-600 mt-1">{suggestion.intent}</p>
                  {suggestion.volume && (
                    <div className="flex items-center space-x-2 mt-2">
                      <SafeIcon icon={FiTrendingUp} className="text-teal-600" />
                      <span className="text-sm text-teal-600">
                        ~{suggestion.volume} monthly searches
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(suggestion.keyword)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy keyword"
                  >
                    <SafeIcon
                      icon={copiedKeyword === suggestion.keyword ? FiCheckCircle : FiCopy}
                      className={copiedKeyword === suggestion.keyword ? 'text-green-500' : ''}
                    />
                  </button>
                  <button
                    onClick={() => handleTrack(suggestion.keyword)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                  >
                    Track
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default KeywordSuggestionsPanel;