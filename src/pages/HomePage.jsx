import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Hero from '../components/Hero';

const { FiSearch, FiCheckCircle, FiAlertCircle } = FiIcons;

function HomePage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResults({
        score: 85,
        title: 'Example Page Title',
        description: 'This is an example meta description.',
        issues: [
          { type: 'success', message: 'Title tag is well optimized' },
          { type: 'warning', message: 'Meta description could be improved' },
          { type: 'error', message: 'Missing alt tags on 2 images' }
        ]
      });
    } catch (err) {
      setError('Failed to analyze website. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      
      <div className="max-w-3xl mx-auto mt-12">
        {/* Analysis Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Website URL
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isAnalyzing}
              className={`w-full bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors
                ${isAnalyzing ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
            </button>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-8"
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertCircle} />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                <div className="text-4xl font-bold">{results.score}</div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Title Analysis */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Page Title</h3>
                  <p className="text-gray-600">{results.title}</p>
                </div>

                {/* Description Analysis */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Meta Description</h3>
                  <p className="text-gray-600">{results.description}</p>
                </div>

                {/* Issues */}
                <div className="space-y-3">
                  {results.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-lg ${
                        issue.type === 'success' ? 'bg-green-50 text-green-700' :
                        issue.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}
                    >
                      <SafeIcon 
                        icon={issue.type === 'success' ? FiCheckCircle : FiAlertCircle}
                        className="flex-shrink-0"
                      />
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HomePage;