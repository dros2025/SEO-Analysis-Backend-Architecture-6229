import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import BasicResults from './results/BasicResults';
import AdvancedResults from './results/AdvancedResults';
import FullResults from './results/FullResults';

const { FiBarChart, FiTrendingUp, FiZap } = FiIcons;

function Results({ data }) {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Analysis', icon: FiBarChart },
    ...(data.advanced ? [{ id: 'advanced', label: 'Advanced', icon: FiTrendingUp }] : []),
    ...(data.full ? [{ id: 'full', label: 'Full Report', icon: FiZap }] : [])
  ];

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
            <h2 className="text-2xl font-bold">SEO Analysis Results</h2>
            <p className="text-blue-100 mt-1">{data.url}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Analyzed on</div>
            <div className="text-lg font-medium">
              {new Date(data.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'basic' && <BasicResults data={data.basic} />}
        {activeTab === 'advanced' && data.advanced && <AdvancedResults data={data.advanced} />}
        {activeTab === 'full' && data.full && <FullResults data={data.full} />}
      </div>
    </motion.div>
  );
}

export default Results;