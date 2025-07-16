import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import WhiteLabelSettings from './WhiteLabelSettings';

const { FiDownload, FiLoader, FiCheckCircle, FiAlertCircle, FiSettings } = FiIcons;

function ExportPdfButton({ onClick, type = 'primary', label = 'Export PDF', className = '', showSettings = true }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [showWhiteLabelSettings, setShowWhiteLabelSettings] = useState(false);
  
  const handleClick = async () => {
    if (status === 'loading') return;
    
    setStatus('loading');
    try {
      // Get white-label settings from localStorage
      const whiteLabelSettings = localStorage.getItem('whiteLabel')
        ? JSON.parse(localStorage.getItem('whiteLabel'))
        : null;
      
      // Pass settings to the export function
      await onClick(whiteLabelSettings);
      setStatus('success');
      // Reset after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('PDF export error:', error);
      setStatus('error');
      // Reset after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    }
  };
  
  const handleSettingsSave = (settings) => {
    setShowWhiteLabelSettings(false);
  };
  
  // Button style variants
  const buttonStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50'
  };
  
  // Status icons and colors
  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <SafeIcon icon={FiLoader} className="animate-spin" />;
      case 'success':
        return <SafeIcon icon={FiCheckCircle} className="text-green-500" />;
      case 'error':
        return <SafeIcon icon={FiAlertCircle} className="text-red-500" />;
      default:
        return <SafeIcon icon={FiDownload} />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Generating PDF...';
      case 'success':
        return 'PDF Generated!';
      case 'error':
        return 'Export Failed';
      default:
        return label;
    }
  };
  
  return (
    <>
      <div className="flex items-center space-x-2">
        <motion.button
          onClick={handleClick}
          whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
          whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${buttonStyles[type]} ${className}`}
          disabled={status === 'loading'}
        >
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </motion.button>
        
        {showSettings && (
          <motion.button
            onClick={() => setShowWhiteLabelSettings(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full"
            title="White Label Settings"
          >
            <SafeIcon icon={FiSettings} />
          </motion.button>
        )}
      </div>
      
      {/* White Label Settings Modal */}
      <AnimatePresence>
        {showWhiteLabelSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <WhiteLabelSettings
              onSave={handleSettingsSave}
              onClose={() => setShowWhiteLabelSettings(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ExportPdfButton;