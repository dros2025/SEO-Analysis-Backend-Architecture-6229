import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTarget, FiBookOpen, FiTrendingUp, FiBarChart } = FiIcons;

function AdvancedResults({ data }) {
  const getKeywordStatus = (percentage) => {
    const num = parseFloat(percentage);
    if (num === 0) return 'error';
    if (num < 0.5) return 'warning';
    if (num <= 2.5) return 'good';
    return 'warning';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getReadabilityLevel = (score) => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };

  return (
    <div className="space-y-6">
      {/* Content Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <SafeIcon icon={FiBookOpen} className="text-blue-600" />
            <h3 className="font-semibold text-blue-800">Content Length</h3>
          </div>
          <div className="text-2xl font-bold text-blue-900">{data.contentLength}</div>
          <div className="text-sm text-blue-700">words</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <SafeIcon icon={FiTrendingUp} className="text-green-600" />
            <h3 className="font-semibold text-green-800">Readability</h3>
          </div>
          <div className="text-2xl font-bold text-green-900">{data.readabilityScore}</div>
          <div className="text-sm text-green-700">{getReadabilityLevel(data.readabilityScore)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-50 border border-purple-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <SafeIcon icon={FiTarget} className="text-purple-600" />
            <h3 className="font-semibold text-purple-800">Keywords</h3>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {Object.keys(data.keywordDensity).length}
          </div>
          <div className="text-sm text-purple-700">analyzed</div>
        </motion.div>
      </div>

      {/* Keyword Density */}
      {Object.keys(data.keywordDensity).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-xl p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiBarChart} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Keyword Density Analysis</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(data.keywordDensity).map(([keyword, info]) => (
              <div key={keyword} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{keyword}</span>
                  <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(getKeywordStatus(info.percentage))}`}>
                    {info.percentage}%
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Count: {info.count}</span>
                  <span>•</span>
                  <span>{info.recommendation}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getKeywordStatus(info.percentage) === 'good' ? 'bg-green-500' :
                      getKeywordStatus(info.percentage) === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(parseFloat(info.percentage) * 20, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Keyword Positions */}
      {Object.keys(data.keywordPositions).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-xl p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiTarget} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Keyword Positions</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(data.keywordPositions).map(([keyword, positions]) => (
              <div key={keyword}>
                <h4 className="font-medium text-gray-700 mb-2">{keyword}</h4>
                <div className="flex flex-wrap gap-2">
                  {positions.slice(0, 10).map((pos, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                    >
                      {pos.percentage}%
                    </span>
                  ))}
                  {positions.length > 10 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{positions.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AdvancedResults;