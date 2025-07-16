import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAward, FiLink, FiCalendar, FiTrendingUp, FiTrendingDown } = FiIcons;

function RankResultsPanel({ results }) {
  if (!results) return null;

  const getRankChangeIcon = (change) => {
    if (change > 0) return FiTrendingUp;
    if (change < 0) return FiTrendingDown;
    return null;
  };

  const getRankChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Rank Position Results</h2>
            <p className="text-blue-100 mt-1">{results.domain}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Checked on</div>
            <div className="text-lg font-medium">
              {new Date(results.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rank Position */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <SafeIcon icon={FiAward} className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold">Current Position</h3>
                <p className="text-gray-600 text-sm">for "{results.keyword}"</p>
              </div>
            </div>
            <div className="text-right">
              {results.position ? (
                <div className="text-4xl font-bold text-blue-600">#{results.position}</div>
              ) : (
                <div className="text-lg font-medium text-gray-600">Not in Top 100</div>
              )}
              {results.previousPosition && (
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <SafeIcon
                    icon={getRankChangeIcon(results.previousPosition - results.position)}
                    className={getRankChangeColor(results.previousPosition - results.position)}
                  />
                  <span className={`text-sm ${getRankChangeColor(results.previousPosition - results.position)}`}>
                    {Math.abs(results.previousPosition - results.position)} positions
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* URL Details */}
        {results.url && (
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiLink} className="text-gray-600" />
              <h3 className="font-semibold text-gray-800">Ranking Page</h3>
            </div>
            <a
              href={results.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {results.url}
            </a>
          </div>
        )}

        {/* Historical Data */}
        {results.history && results.history.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiCalendar} className="text-gray-600" />
              <h3 className="font-semibold text-gray-800">Rank History</h3>
            </div>
            <div className="space-y-3">
              {results.history.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-sm text-gray-600">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </div>
                  <div className="font-medium">
                    {entry.position ? `#${entry.position}` : 'Not found'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default RankResultsPanel;