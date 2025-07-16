import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RankTrackerForm from '../components/RankTrackerForm';
import RankResultsPanel from '../components/RankResultsPanel';
import AiSuggestionsPanel from '../components/AiSuggestionsPanel';
import KeywordSuggestionsPanel from '../components/KeywordSuggestionsPanel';
import RankHistoryOverview from '../components/RankHistoryOverview';
import RankHistoryChart from '../components/RankHistoryChart';
import { RankHistoryService } from '../services/rankHistoryService';
import { AiSuggestionsService } from '../services/aiSuggestionsService';
import { KeywordSuggestionService } from '../services/keywordSuggestionService';
import { checkRankPosition } from '../services/api';

const { FiTarget, FiTrendingUp, FiBarChart3, FiClock } = FiIcons;

function RankTracker() {
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  
  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);

  // Keyword suggestions state
  const [keywordSuggestions, setKeywordSuggestions] = useState({
    isLoading: false,
    suggestions: null,
    error: null
  });

  // Load AI suggestions when results are available
  useEffect(() => {
    if (results) {
      loadAiSuggestions(results);
    }
  }, [results]);

  const loadAiSuggestions = async (data) => {
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);

    try {
      const suggestions = await AiSuggestionsService.getOptimizationSuggestions(
        data.keyword,
        data.domain,
        data.position,
        data.url
      );
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to load AI suggestions:', error);
      setSuggestionsError('Failed to generate AI suggestions. Using standard recommendations instead.');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Load keyword suggestions
  const loadKeywordSuggestions = async (keyword, domain) => {
    setKeywordSuggestions({
      isLoading: true,
      suggestions: null,
      error: null
    });

    try {
      const suggestions = await KeywordSuggestionService.getSuggestions(keyword, domain);
      setKeywordSuggestions({
        isLoading: false,
        suggestions,
        error: null
      });
    } catch (error) {
      setKeywordSuggestions({
        isLoading: false,
        suggestions: null,
        error: 'Failed to load keyword suggestions'
      });
    }
  };

  const handleStartCheck = () => {
    setIsChecking(true);
    setError(null);
    setResults(null);
    setAiSuggestions([]);
    setKeywordSuggestions({
      isLoading: false,
      suggestions: null,
      error: null
    });
  };

  const handleResults = async (data) => {
    setResults(data);
    setIsChecking(false);
    
    // Save to history
    RankHistoryService.saveRankCheck(data);
    
    // Load keyword suggestions
    await loadKeywordSuggestions(data.keyword, data.domain);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsChecking(false);
  };

  // Handler for tracking new keywords from suggestions
  const handleTrackKeyword = async (newKeyword, domain) => {
    try {
      setIsChecking(true);
      setError(null);
      
      const newResults = await checkRankPosition({
        keyword: newKeyword,
        domain,
        searchEngine: 'google'
      });
      
      await handleResults(newResults);
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleSelectKeyword = (keyword, domain) => {
    setSelectedKeyword({ keyword, domain });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Rank Tracker Pro
            </h1>
            <p className="text-gray-600 text-lg">
              Track your website's ranking position for specific keywords and get AI-powered optimization suggestions
            </p>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <SafeIcon icon={FiTarget} className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Keywords Tracked</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {RankHistoryService.getUniqueKeywords().length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <SafeIcon icon={FiTrendingUp} className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Avg Position</h3>
                <p className="text-2xl font-bold text-green-600">#12</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <SafeIcon icon={FiBarChart3} className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Checks Today</h3>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form and History */}
          <div className="lg:col-span-1 space-y-6">
            <RankTrackerForm
              onStartCheck={handleStartCheck}
              onResultsReceived={handleResults}
              onError={handleError}
            />
            
            <RankHistoryOverview onSelectKeyword={handleSelectKeyword} />
          </div>

          {/* Right Column - Results and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Show history chart if keyword selected */}
            {selectedKeyword && (
              <div className="space-y-6">
                <RankHistoryChart
                  keyword={selectedKeyword.keyword}
                  domain={selectedKeyword.domain}
                />
              </div>
            )}

            {/* Show results if checking or have results */}
            {(isChecking || results) && (
              <div className="space-y-6">
                {isChecking && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <SafeIcon icon={FiClock} className="text-blue-600 text-2xl animate-pulse" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Checking Rank Position
                      </h3>
                      <p className="text-gray-600 text-center">
                        Analyzing search results for your keyword...
                      </p>
                    </div>
                  </motion.div>
                )}

                {results && !isChecking && (
                  <>
                    <RankResultsPanel results={results} />
                    
                    <AiSuggestionsPanel
                      suggestions={aiSuggestions}
                      isLoading={isLoadingSuggestions}
                      error={suggestionsError}
                    />
                    
                    <KeywordSuggestionsPanel
                      keyword={keywordSuggestions}
                      domain={results.domain}
                      onTrackKeyword={handleTrackKeyword}
                    />
                  </>
                )}
              </div>
            )}

            {/* Error State */}
            {error && !isChecking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiTarget} className="text-red-600 text-xl" />
                  <div>
                    <h3 className="font-semibold text-red-800">Error</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RankTracker;