import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { EmailScheduler } from '../services/emailScheduler';

const { 
  FiClock, FiMail, FiCalendar, FiAlertCircle, FiX, 
  FiCheck, FiToggleLeft, FiToggleRight 
} = FiIcons;

function ScheduleReportsModal({ onClose }) {
  const [schedule, setSchedule] = useState({
    enabled: false,
    day: 'monday',
    time: '09:00',
    recipients: '',
    includeRankTracker: true,
    includeSeoReport: true
  });
  
  const [loading, setLoading] = useState(true);
  const [testStatus, setTestStatus] = useState(null);
  
  useEffect(() => {
    // Load saved schedule from localStorage
    const savedSchedule = localStorage.getItem('reportSchedule');
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
    setLoading(false);
  }, []);
  
  const handleChange = (field, value) => {
    const newSchedule = { ...schedule, [field]: value };
    setSchedule(newSchedule);
    localStorage.setItem('reportSchedule', JSON.stringify(newSchedule));
  };
  
  const handleTestEmail = async () => {
    setTestStatus('sending');
    try {
      await EmailScheduler.sendTestEmail(schedule);
      setTestStatus('success');
      setTimeout(() => setTestStatus(null), 3000);
    } catch (error) {
      setTestStatus('error');
      setTimeout(() => setTestStatus(null), 3000);
    }
  };
  
  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];
  
  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });
  
  if (loading) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Schedule Weekly Reports</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <SafeIcon icon={FiX} />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800">Automated Weekly Reports</h3>
            <p className="text-sm text-gray-600">Send reports automatically every week</p>
          </div>
          <button
            onClick={() => handleChange('enabled', !schedule.enabled)}
            className="relative"
          >
            <SafeIcon
              icon={schedule.enabled ? FiToggleRight : FiToggleLeft}
              className={`text-3xl ${schedule.enabled ? 'text-blue-600' : 'text-gray-400'}`}
            />
          </button>
        </div>
        
        <AnimatePresence>
          {schedule.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Schedule Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <div className="relative">
                    <SafeIcon
                      icon={FiCalendar}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={schedule.day}
                      onChange={(e) => handleChange('day', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {days.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <SafeIcon
                      icon={FiClock}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={schedule.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {times.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="relative">
                  <SafeIcon
                    icon={FiMail}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={schedule.recipients}
                    onChange={(e) => handleChange('recipients', e.target.value)}
                    placeholder="email@example.com, another@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Separate multiple email addresses with commas
                </p>
              </div>
              
              {/* Report Types */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Include in Report
                </label>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={schedule.includeSeoReport}
                      onChange={(e) => handleChange('includeSeoReport', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">SEO Analysis</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={schedule.includeRankTracker}
                      onChange={(e) => handleChange('includeRankTracker', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Rank Tracking</span>
                  </label>
                </div>
              </div>
              
              {/* Test Email */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Next report will be sent on{' '}
                  <span className="font-medium">
                    {EmailScheduler.getNextScheduledDate(schedule)}
                  </span>
                </div>
                
                <button
                  onClick={handleTestEmail}
                  disabled={testStatus === 'sending'}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    testStatus === 'sending'
                      ? 'bg-gray-100 text-gray-500 border-gray-200'
                      : testStatus === 'success'
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : testStatus === 'error'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <SafeIcon
                    icon={
                      testStatus === 'sending'
                        ? FiClock
                        : testStatus === 'success'
                        ? FiCheck
                        : testStatus === 'error'
                        ? FiAlertCircle
                        : FiMail
                    }
                    className={
                      testStatus === 'sending' ? 'animate-spin' : ''
                    }
                  />
                  <span>
                    {testStatus === 'sending'
                      ? 'Sending...'
                      : testStatus === 'success'
                      ? 'Sent!'
                      : testStatus === 'error'
                      ? 'Failed'
                      : 'Send Test Email'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default ScheduleReportsModal;