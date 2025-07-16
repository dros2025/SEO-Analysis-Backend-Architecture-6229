import { parseHTML } from '../utils/htmlParser.js';
import { analyzeKeywords } from '../utils/keywordAnalyzer.js';
import { extractMetaData } from '../utils/metaExtractor.js';
import { generateContentSuggestions } from '../services/aiContentHelper.js';
import validator from 'validator';

// In-memory storage for demo (replace with database in production)
const scanHistory = new Map();

export const scanWebsite = async (req, res) => {
  try {
    const { url, depth = 'basic', targetKeywords = [] } = req.body;

    // Validate URL
    if (!url || !validator.isURL(url)) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide a valid URL'
      });
    }

    // Validate depth
    const validDepths = ['basic', 'advanced', 'full'];
    if (!validDepths.includes(depth)) {
      return res.status(400).json({
        error: 'Invalid depth',
        message: 'Depth must be one of: basic, advanced, full'
      });
    }

    console.log(`🔍 Starting ${depth} scan for: ${url}`);

    // Step 1: Parse HTML
    const htmlData = await parseHTML(url);
    
    // Step 2: Extract meta data
    const metaData = extractMetaData(htmlData);

    // Step 3: Basic analysis results
    let analysisResults = {
      url,
      depth,
      timestamp: new Date().toISOString(),
      basic: {
        title: metaData.title,
        metaDescription: metaData.metaDescription,
        headings: metaData.headings,
        images: metaData.images,
        links: metaData.links,
        technicalIssues: metaData.technicalIssues
      }
    };

    // Step 4: Advanced analysis (keyword density)
    if (depth === 'advanced' || depth === 'full') {
      const keywordAnalysis = analyzeKeywords(htmlData, targetKeywords);
      analysisResults.advanced = {
        keywordDensity: keywordAnalysis.density,
        keywordPositions: keywordAnalysis.positions,
        contentLength: keywordAnalysis.contentLength,
        readabilityScore: keywordAnalysis.readabilityScore
      };
    }

    // Step 5: Full analysis (AI suggestions)
    if (depth === 'full') {
      try {
        const aiSuggestions = await generateContentSuggestions(
          htmlData,
          metaData,
          targetKeywords
        );
        analysisResults.full = {
          aiSuggestions,
          optimizationScore: calculateOptimizationScore(analysisResults),
          recommendations: generateRecommendations(analysisResults)
        };
      } catch (aiError) {
        console.warn('AI suggestions failed:', aiError.message);
        analysisResults.full = {
          aiSuggestions: 'AI suggestions temporarily unavailable',
          optimizationScore: calculateOptimizationScore(analysisResults),
          recommendations: generateRecommendations(analysisResults)
        };
      }
    }

    // Store in history
    const scanId = Date.now().toString();
    scanHistory.set(scanId, analysisResults);

    // Add scan ID to response
    analysisResults.scanId = scanId;

    console.log(`✅ Scan completed for: ${url}`);
    res.json(analysisResults);

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      error: 'Scan failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getScanHistory = (req, res) => {
  const history = Array.from(scanHistory.entries()).map(([id, data]) => ({
    id,
    url: data.url,
    depth: data.depth,
    timestamp: data.timestamp
  }));

  res.json({
    total: history.length,
    scans: history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  });
};

export const getScanDetails = (req, res) => {
  const { id } = req.params;
  const scanData = scanHistory.get(id);

  if (!scanData) {
    return res.status(404).json({
      error: 'Scan not found',
      message: 'The requested scan ID does not exist'
    });
  }

  res.json(scanData);
};

// Helper functions
function calculateOptimizationScore(results) {
  let score = 0;
  let maxScore = 100;

  // Title optimization (20 points)
  if (results.basic.title) {
    if (results.basic.title.length >= 30 && results.basic.title.length <= 60) {
      score += 20;
    } else if (results.basic.title.length > 0) {
      score += 10;
    }
  }

  // Meta description (20 points)
  if (results.basic.metaDescription) {
    if (results.basic.metaDescription.length >= 120 && results.basic.metaDescription.length <= 160) {
      score += 20;
    } else if (results.basic.metaDescription.length > 0) {
      score += 10;
    }
  }

  // Headings structure (20 points)
  if (results.basic.headings.h1 && results.basic.headings.h1.length === 1) {
    score += 10;
  }
  if (results.basic.headings.h2 && results.basic.headings.h2.length > 0) {
    score += 10;
  }

  // Images optimization (20 points)
  const totalImages = results.basic.images.total;
  const imagesWithAlt = results.basic.images.withAlt;
  if (totalImages > 0) {
    score += Math.round((imagesWithAlt / totalImages) * 20);
  } else {
    score += 20; // No images is also fine
  }

  // Technical issues (20 points)
  const issues = results.basic.technicalIssues;
  let technicalScore = 20;
  if (issues.missingTitle) technicalScore -= 5;
  if (issues.missingMetaDescription) technicalScore -= 5;
  if (issues.missingH1) technicalScore -= 5;
  if (issues.duplicateH1) technicalScore -= 5;
  score += Math.max(0, technicalScore);

  return Math.round((score / maxScore) * 100);
}

function generateRecommendations(results) {
  const recommendations = [];

  // Title recommendations
  if (!results.basic.title) {
    recommendations.push({
      type: 'critical',
      category: 'title',
      message: 'Add a title tag to your page',
      priority: 'high'
    });
  } else if (results.basic.title.length < 30) {
    recommendations.push({
      type: 'warning',
      category: 'title',
      message: 'Title is too short. Consider expanding it to 30-60 characters',
      priority: 'medium'
    });
  } else if (results.basic.title.length > 60) {
    recommendations.push({
      type: 'warning',
      category: 'title',
      message: 'Title is too long. Consider shortening it to under 60 characters',
      priority: 'medium'
    });
  }

  // Meta description recommendations
  if (!results.basic.metaDescription) {
    recommendations.push({
      type: 'critical',
      category: 'meta',
      message: 'Add a meta description to your page',
      priority: 'high'
    });
  } else if (results.basic.metaDescription.length < 120) {
    recommendations.push({
      type: 'info',
      category: 'meta',
      message: 'Meta description could be longer (120-160 characters recommended)',
      priority: 'low'
    });
  }

  // Heading recommendations
  if (!results.basic.headings.h1 || results.basic.headings.h1.length === 0) {
    recommendations.push({
      type: 'critical',
      category: 'headings',
      message: 'Add an H1 heading to your page',
      priority: 'high'
    });
  } else if (results.basic.headings.h1.length > 1) {
    recommendations.push({
      type: 'warning',
      category: 'headings',
      message: 'Multiple H1 tags found. Use only one H1 per page',
      priority: 'medium'
    });
  }

  // Image recommendations
  if (results.basic.images.total > 0 && results.basic.images.withAlt < results.basic.images.total) {
    recommendations.push({
      type: 'warning',
      category: 'images',
      message: `${results.basic.images.total - results.basic.images.withAlt} images missing alt text`,
      priority: 'medium'
    });
  }

  return recommendations;
}