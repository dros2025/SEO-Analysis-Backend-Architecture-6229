import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { AiSuggestionsService } from '../services/aiSuggestionsService';
import AiSuggestionsPanel from '../components/AiSuggestionsPanel';

const { 
  FiSearch, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown
} = FiIcons;

function RankTrackerPage() {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);

  // Load AI suggestions when results are available
  useEffect(() => {
    if (results) {
      loadAiSuggestions();
    }
  }, [results]);

  const loadAiSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);
    
    try {
      const suggestions = await AiSuggestionsService.getOptimizationSuggestions(
        results.keyword,
        results.domain,
        results.position,
        results.url
      );
      
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to load AI suggestions:', error);
      setSuggestionsError('Failed to generate AI suggestions. Using standard recommendations instead.');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    
    if (!keyword || !domain) {
      setError('Please enter both keyword and domain');
      return;
    }

    setIsChecking(true);
    setError(null);
    // Reset suggestions when starting a new check
    setAiSuggestions([]);

    try {
      // Simulate rank check
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const position = Math.floor(Math.random() * 30) + 1;
      setResults({
        keyword,
        domain,
        position,
        previousPosition: position + 2,
        url: `https://${domain}/page-about-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError('Failed to check rank position. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rank Tracker</h1>
          <p className="text-gray-600">
            Track your website's ranking position for specific keywords
          </p>
        </div>

        {/* Rank Check Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keyword to Track
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword (e.g. best seo tools)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain to Check
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain (e.g. example.com)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className={`w-full bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors
                ${isChecking ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isChecking ? 'Checking Rank...' : 'Check Rank Position'}
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
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
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

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-gray-600 text-sm">Current Position</h3>
                        <div className="text-4xl font-bold text-gray-800 mt-1">
                          #{results.position}
                        </div>
                      </div>
                      <SafeIcon
                        icon={results.previousPosition > results.position ? FiArrowUp : FiArrowDown}
                        className={`text-3xl ${
                          results.previousPosition > results.position ? 'text-green-500' : 'text-red-500'
                        }`}
                      />
                    </div>
                    <div className="text-sm mt-2">
                      <span className={results.previousPosition > results.position ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(results.previousPosition - results.position)} positions
                        {results.previousPosition > results.position ? ' up' : ' down'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-gray-600 text-sm">Ranking URL</h3>
                    <a
                      href={results.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all mt-2 block"
                    >
                      {results.url}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Suggestions Panel */}
            <AiSuggestionsPanel 
              suggestions={aiSuggestions}
              isLoading={isLoadingSuggestions}
              error={suggestionsError}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RankTrackerPage;