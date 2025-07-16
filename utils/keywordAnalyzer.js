export const analyzeKeywords = (htmlData, targetKeywords = []) => {
  const { bodyText } = htmlData;
  
  if (!bodyText) {
    return {
      density: {},
      positions: {},
      contentLength: 0,
      readabilityScore: 0
    };
  }

  const words = bodyText.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;
  
  console.log(`📊 Analyzing ${totalWords} words for keyword density`);

  // Calculate keyword density
  const density = {};
  const positions = {};

  targetKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const matches = words.filter(word => word.includes(keywordLower));
    const count = matches.length;
    
    density[keyword] = {
      count,
      percentage: totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) : 0,
      recommendation: getKeywordRecommendation(count, totalWords)
    };

    // Find positions of keywords
    positions[keyword] = [];
    words.forEach((word, index) => {
      if (word.includes(keywordLower)) {
        positions[keyword].push({
          position: index,
          percentage: ((index / totalWords) * 100).toFixed(2)
        });
      }
    });
  });

  // Calculate readability score (simplified Flesch Reading Ease)
  const readabilityScore = calculateReadabilityScore(bodyText);

  return {
    density,
    positions,
    contentLength: totalWords,
    readabilityScore,
    wordCount: totalWords,
    characterCount: bodyText.length
  };
};

function getKeywordRecommendation(count, totalWords) {
  if (totalWords === 0) return 'No content to analyze';
  
  const percentage = (count / totalWords) * 100;
  
  if (percentage === 0) {
    return 'Keyword not found. Consider adding it to your content.';
  } else if (percentage < 0.5) {
    return 'Low keyword density. Consider using the keyword more frequently.';
  } else if (percentage <= 2.5) {
    return 'Good keyword density. Well optimized.';
  } else if (percentage <= 4) {
    return 'High keyword density. Consider reducing usage to avoid keyword stuffing.';
  } else {
    return 'Very high keyword density. This may be considered keyword stuffing.';
  }
}

function calculateReadabilityScore(text) {
  if (!text || text.length === 0) return 0;

  // Count sentences (simplified)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  // Count words
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  
  // Count syllables (simplified approximation)
  const syllables = countSyllables(text);

  if (sentences === 0 || words === 0) return 0;

  // Flesch Reading Ease Score
  const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(text) {
  // Simplified syllable counting
  const words = text.toLowerCase().split(/\s+/);
  let syllableCount = 0;

  words.forEach(word => {
    // Remove punctuation
    word = word.replace(/[^a-z]/g, '');
    
    if (word.length === 0) return;
    
    // Count vowel groups
    const vowelGroups = word.match(/[aeiouy]+/g);
    let syllables = vowelGroups ? vowelGroups.length : 1;
    
    // Adjust for silent e
    if (word.endsWith('e')) {
      syllables--;
    }
    
    // Minimum of 1 syllable per word
    syllables = Math.max(1, syllables);
    
    syllableCount += syllables;
  });

  return syllableCount;
}

export const analyzeContentStructure = (htmlData) => {
  const { $ } = htmlData;
  
  // Analyze heading hierarchy
  const headingStructure = [];
  $('h1, h2, h3, h4, h5, h6').each((index, element) => {
    const level = parseInt(element.tagName.charAt(1));
    const text = $(element).text().trim();
    headingStructure.push({
      level,
      text,
      length: text.length
    });
  });

  // Check for proper heading hierarchy
  const hierarchyIssues = [];
  for (let i = 1; i < headingStructure.length; i++) {
    const current = headingStructure[i];
    const previous = headingStructure[i - 1];
    
    if (current.level > previous.level + 1) {
      hierarchyIssues.push({
        position: i,
        issue: `H${current.level} follows H${previous.level} - skipped heading level`
      });
    }
  }

  return {
    headingStructure,
    hierarchyIssues,
    totalHeadings: headingStructure.length
  };
};