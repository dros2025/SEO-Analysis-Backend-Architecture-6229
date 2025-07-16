import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUpload, FiImage, FiUser, FiX, FiSun, FiMoon, FiCheck, FiRefreshCw } = FiIcons;

function WhiteLabelSettings({ onSave, onClose }) {
  const [settings, setSettings] = useState({
    logoUrl: '',
    clientName: '',
    preparedBy: '',
    theme: 'light',
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [isLogoUploaded, setIsLogoUploaded] = useState(false);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('whiteLabel');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      setLogoPreview(parsedSettings.logoUrl || '');
      setIsLogoUploaded(!!parsedSettings.logoUrl);
    }
  }, []);
  
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert('Logo file size must be less than 1MB');
      return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, SVG)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const logoUrl = e.target.result;
      setLogoPreview(logoUrl);
      setSettings(prev => ({ ...prev, logoUrl }));
      setIsLogoUploaded(true);
    };
    reader.readAsDataURL(file);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleThemeToggle = () => {
    setSettings(prev => ({ 
      ...prev, 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    }));
  };
  
  const handleRemoveLogo = () => {
    setLogoPreview('');
    setSettings(prev => ({ ...prev, logoUrl: '' }));
    setIsLogoUploaded(false);
  };
  
  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('whiteLabel', JSON.stringify(settings));
    onSave(settings);
  };
  
  const handleReset = () => {
    const defaultSettings = {
      logoUrl: '',
      clientName: '',
      preparedBy: '',
      theme: 'light',
    };
    
    setSettings(defaultSettings);
    setLogoPreview('');
    setIsLogoUploaded(false);
    localStorage.removeItem('whiteLabel');
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">White Label Settings</h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <SafeIcon icon={FiX} />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          
          <div className="flex items-center space-x-4">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Company Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <SafeIcon icon={FiImage} className="text-gray-400 text-4xl" />
              )}
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer">
                <SafeIcon icon={FiUpload} />
                <span>{isLogoUploaded ? 'Change Logo' : 'Upload Logo'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  className="hidden"
                />
              </label>
              
              {isLogoUploaded && (
                <button 
                  onClick={handleRemoveLogo}
                  className="flex items-center space-x-2 text-sm px-4 py-2 text-red-600 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100"
                >
                  <SafeIcon icon={FiX} />
                  <span>Remove</span>
                </button>
              )}
              
              <p className="text-xs text-gray-500">
                Recommended: PNG or SVG with transparent background, max 1MB
              </p>
            </div>
          </div>
        </div>
        
        {/* Client Name */}
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
            Client Name
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={settings.clientName}
            onChange={handleInputChange}
            placeholder="Enter client name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Prepared By */}
        <div>
          <label htmlFor="preparedBy" className="block text-sm font-medium text-gray-700 mb-2">
            Prepared By
          </label>
          <input
            type="text"
            id="preparedBy"
            name="preparedBy"
            value={settings.preparedBy}
            onChange={handleInputChange}
            placeholder="Your name or company"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Theme Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF Theme
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleThemeToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                settings.theme === 'light'
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              <SafeIcon icon={FiSun} />
              <span>Light</span>
              {settings.theme === 'light' && (
                <SafeIcon icon={FiCheck} className="ml-1 text-blue-600" />
              )}
            </button>
            <button
              onClick={handleThemeToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                settings.theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              <SafeIcon icon={FiMoon} />
              <span>Dark</span>
              {settings.theme === 'dark' && (
                <SafeIcon icon={FiCheck} className="ml-1 text-white" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Choose how your exported PDFs will look
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200"
        >
          <SafeIcon icon={FiRefreshCw} />
          <span>Reset</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200"
          >
            Cancel
          </button>
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiCheck} />
            <span>Save Settings</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default WhiteLabelSettings;