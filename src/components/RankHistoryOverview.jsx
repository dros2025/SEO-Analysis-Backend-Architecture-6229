import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { RankHistoryService } from '../services/rankHistoryService';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiEye, FiTrash2, FiDownload, FiUpload } = FiIcons;

function RankHistoryOverview({ onSelectKeyword }) {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = () => {
    setLoading(true);
    const uniqueKeywords = RankHistoryService.getUniqueKeywords();
    setKeywords(uniqueKeywords);
    setLoading(false);
  };

  const handleDelete = (keyword, domain) => {
    if (confirm(`Delete all history for "${keyword}" on ${domain}?`)) {
      RankHistoryService.deleteHistory(keyword, domain);
      loadKeywords();
    }
  };

  const handleExport = () => {
    RankHistoryService.exportHistory();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = RankHistoryService.importHistory(e.target.result);
          if (result) {
            alert('History imported successfully!');
            loadKeywords();
          } else {
            alert('Failed to import history. Please check the file format.');
          }
        } catch (error) {
          alert('Error importing history: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const getPositionTrend = (keyword, domain) => {
    const history = RankHistoryService.getHistoryForKeyword(keyword, domain, 30);
    if (history.length < 2) return null;
    
    const recent = history.slice(-2);
    const [previous, current] = recent;
    
    if (!previous.found || !current.found) return null;
    
    const change = previous.position - current.position;
    if (change > 0) return { type: 'up', value: change };
    if (change < 0) return { type: 'down', value: Math.abs(change) };
    return { type: 'same', value: 0 };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Tracked Keywords</h3>
            <p className="text-sm text-gray-600">
              {keywords.length} keywords being tracked
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1 px-3 py-2 text-sm text-green-600 hover:text-green-800 border border-green-300 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
              <SafeIcon icon={FiUpload} />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleExport}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <SafeIcon icon={FiDownload} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Keywords List */}
      <div className="divide-y divide-gray-200">
        {keywords.length === 0 ? (
          <div className="p-8 text-center">
            <SafeIcon icon={FiTrendingUp} className="mx-auto text-gray-400 text-3xl mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Keywords Tracked</h3>
            <p className="text-gray-500">Start tracking keywords to see their ranking history.</p>
          </div>
        ) : (
          keywords.map((item, index) => {
            const trend = getPositionTrend(item.keyword, item.domain);
            
            return (
              <motion.div
                key={`${item.keyword}-${item.domain}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.keyword}</h4>
                        <p className="text-sm text-gray-600">{item.domain}</p>
                      </div>
                      {trend && (
                        <div className="flex items-center space-x-1">
                          <SafeIcon
                            icon={trend.type === 'up' ? FiTrendingUp : trend.type === 'down' ? FiTrendingDown : FiMinus}
                            className={`text-sm ${
                              trend.type === 'up' ? 'text-green-500' :
                              trend.type === 'down' ? 'text-red-500' :
                              'text-gray-500'
                            }`}
                          />
                          {trend.value > 0 && (
                            <span className={`text-xs ${
                              trend.type === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {trend.value}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {item.lastPosition ? `#${item.lastPosition}` : 'Not found'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(item.lastChecked), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectKeyword(item.keyword, item.domain)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View History"
                      >
                        <SafeIcon icon={FiEye} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.keyword, item.domain)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete History"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

export default RankHistoryOverview;