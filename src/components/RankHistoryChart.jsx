import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { RankHistoryService } from '../services/rankHistoryService';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiCalendar, FiDownload, FiTrash2 } = FiIcons;

function RankHistoryChart({ keyword, domain }) {
  const [historyData, setHistoryData] = useState([]);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (keyword && domain) {
      loadHistoryData();
    }
  }, [keyword, domain, timeRange]);

  const loadHistoryData = () => {
    setLoading(true);
    const data = RankHistoryService.getHistoryForKeyword(keyword, domain, timeRange);
    
    // Transform data for chart
    const chartData = data.map(entry => ({
      date: format(parseISO(entry.timestamp), 'MMM dd'),
      position: entry.position || 101, // Use 101 for "not found"
      found: entry.found,
      url: entry.url,
      timestamp: entry.timestamp
    }));

    setHistoryData(chartData);
    setLoading(false);
  };

  const getPositionTrend = () => {
    if (historyData.length < 2) return null;
    
    const recent = historyData.slice(-2);
    const [previous, current] = recent;
    
    if (!previous.found || !current.found) return null;
    
    const change = previous.position - current.position;
    if (change > 0) return { type: 'up', value: change };
    if (change < 0) return { type: 'down', value: Math.abs(change) };
    return { type: 'same', value: 0 };
  };

  const getAveragePosition = () => {
    const validPositions = historyData.filter(d => d.found).map(d => d.position);
    if (validPositions.length === 0) return null;
    return Math.round(validPositions.reduce((a, b) => a + b, 0) / validPositions.length);
  };

  const getBestPosition = () => {
    const validPositions = historyData.filter(d => d.found).map(d => d.position);
    if (validPositions.length === 0) return null;
    return Math.min(...validPositions);
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Position: {data.found ? `#${data.position}` : 'Not found'}
          </p>
          {data.url && (
            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
              {data.url}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const trend = getPositionTrend();
  const avgPosition = getAveragePosition();
  const bestPosition = getBestPosition();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <SafeIcon icon={FiCalendar} className="mx-auto text-gray-400 text-3xl mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No History Available</h3>
        <p className="text-gray-500">Start tracking this keyword to see ranking history.</p>
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Ranking History</h3>
            <p className="text-sm text-gray-600">
              {keyword} on {domain}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Current Position</p>
                <p className="text-2xl font-bold text-blue-800">
                  {historyData[historyData.length - 1]?.found 
                    ? `#${historyData[historyData.length - 1]?.position}`
                    : 'Not found'
                  }
                </p>
              </div>
              {trend && (
                <SafeIcon
                  icon={trend.type === 'up' ? FiTrendingUp : trend.type === 'down' ? FiTrendingDown : FiMinus}
                  className={`text-2xl ${
                    trend.type === 'up' ? 'text-green-500' :
                    trend.type === 'down' ? 'text-red-500' :
                    'text-gray-500'
                  }`}
                />
              )}
            </div>
            {trend && trend.value > 0 && (
              <p className={`text-xs mt-1 ${
                trend.type === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.type === 'up' ? '+' : '-'}{trend.value} positions
              </p>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Best Position</p>
            <p className="text-2xl font-bold text-green-800">
              {bestPosition ? `#${bestPosition}` : 'N/A'}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Average Position</p>
            <p className="text-2xl font-bold text-purple-800">
              {avgPosition ? `#${avgPosition}` : 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Data Points</p>
            <p className="text-2xl font-bold text-gray-800">{historyData.length}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[1, 100]}
              reversed
              tick={{ fontSize: 12 }}
              label={{ value: 'Position', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={customTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="position"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              connectNulls={false}
              name="Ranking Position"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Last updated: {historyData.length > 0 ? format(parseISO(historyData[historyData.length - 1].timestamp), 'MMM dd, yyyy HH:mm') : 'Never'}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const data = RankHistoryService.getHistoryForKeyword(keyword, domain, 365);
                const csvContent = "data:text/csv;charset=utf-8," + 
                  "Date,Position,Found,URL\n" +
                  data.map(entry => 
                    `${format(parseISO(entry.timestamp), 'yyyy-MM-dd HH:mm')},${entry.position || 'Not found'},${entry.found},${entry.url || ''}`
                  ).join("\n");
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `${keyword}_${domain}_history.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <SafeIcon icon={FiDownload} />
              <span>Export</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all history for this keyword?')) {
                  RankHistoryService.deleteHistory(keyword, domain);
                  setHistoryData([]);
                }
              }}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <SafeIcon icon={FiTrash2} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RankHistoryChart;