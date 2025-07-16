import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

function AiSuggestionsPanel({ suggestions, isLoading, error }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  // Map from string icon names to actual icon components
  const getIconFromName = (iconName) => {
    if (!iconName || typeof iconName !== 'string') return FiIcons.FiTrendingUp;
    return FiIcons[iconName] || FiIcons.FiTrendingUp;
  };

  console.log('AiSuggestionsPanel received:', { suggestions, isLoading, error });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiIcons.FiZap} className="text-xl" />
          <h2 className="text-2xl font-bold">AI Optimization Tips</h2>
        </div>
        <p className="text-purple-100 mt-1">
          Smart recommendations to boost your ranking
        </p>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <SafeIcon icon={FiIcons.FiLoader} className="text-blue-600 text-3xl animate-spin mb-4" />
            <p className="text-gray-600">Generating AI-powered suggestions...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 rounded-lg text-red-600 text-center">
            <p>{error}</p>
          </div>
        ) : !suggestions || !Array.isArray(suggestions) || suggestions.length === 0 ? (
          <div className="p-4 bg-yellow-50 rounded-lg text-yellow-600 text-center">
            <p>No optimization suggestions available for this keyword yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`flex items-start space-x-4 p-4 rounded-xl border ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <SafeIcon 
                    icon={typeof suggestion.icon === 'string' ? getIconFromName(suggestion.icon) : suggestion.icon} 
                    className="text-xl" 
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{suggestion.title}</h3>
                  <p className="text-sm">{suggestion.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default AiSuggestionsPanel;