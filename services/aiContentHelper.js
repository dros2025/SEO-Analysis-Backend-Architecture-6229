import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateContentSuggestions = async (htmlData, metaData, targetKeywords = []) => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OpenAI API key not configured');
    return {
      available: false,
      message: 'AI suggestions require OpenAI API key configuration'
    };
  }

  try {
    console.log('🤖 Generating AI content suggestions...');

    const prompt = createOptimizationPrompt(htmlData, metaData, targetKeywords);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO consultant. Provide specific, actionable recommendations for improving website SEO based on the provided analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const suggestions = completion.choices[0].message.content;
    
    console.log('✅ AI suggestions generated successfully');
    
    return {
      available: true,
      suggestions,
      model: "gpt-3.5-turbo",
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ AI suggestion generation failed:', error.message);
    
    return {
      available: false,
      error: error.message,
      fallbackSuggestions: generateFallbackSuggestions(metaData, targetKeywords)
    };
  }
};

function createOptimizationPrompt(htmlData, metaData, targetKeywords) {
  const keywordList = targetKeywords.length > 0 ? targetKeywords.join(', ') : 'not specified';
  
  return `
Analyze this webpage and provide SEO optimization recommendations:

**Current SEO Status:**
- Title: "${metaData.title}" (${metaData.title?.length || 0} characters)
- Meta Description: "${metaData.metaDescription}" (${metaData.metaDescription?.length || 0} characters)
- H1 Tags: ${metaData.headings.h1.length} found
- H2 Tags: ${metaData.headings.h2.length} found
- Images: ${metaData.images.total} total, ${metaData.images.withAlt} with alt text
- Internal Links: ${metaData.links.internal}
- External Links: ${metaData.links.external}

**Target Keywords:** ${keywordList}

**Technical Issues Found:**
${Object.entries(metaData.technicalIssues)
  .filter(([key, value]) => value)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Please provide:
1. **Title Optimization:** Specific suggestions for improving the title tag
2. **Meta Description:** Recommendations for the meta description
3. **Content Structure:** Heading hierarchy and content organization advice
4. **Keyword Integration:** How to better integrate target keywords naturally
5. **Technical Fixes:** Priority technical issues to address
6. **Content Recommendations:** Specific content improvements

Format your response as actionable bullet points with clear priorities (High/Medium/Low).
`;
}

function generateFallbackSuggestions(metaData, targetKeywords) {
  const suggestions = [];

  // Title suggestions
  if (!metaData.title) {
    suggestions.push({
      type: 'title',
      priority: 'high',
      suggestion: 'Add a compelling title tag that includes your primary keyword'
    });
  } else if (metaData.title.length < 30) {
    suggestions.push({
      type: 'title',
      priority: 'medium',
      suggestion: 'Expand your title tag to 30-60 characters for better visibility'
    });
  } else if (metaData.title.length > 60) {
    suggestions.push({
      type: 'title',
      priority: 'medium',
      suggestion: 'Shorten your title tag to under 60 characters to prevent truncation'
    });
  }

  // Meta description suggestions
  if (!metaData.metaDescription) {
    suggestions.push({
      type: 'meta',
      priority: 'high',
      suggestion: 'Add a compelling meta description that summarizes your page content'
    });
  } else if (metaData.metaDescription.length < 120) {
    suggestions.push({
      type: 'meta',
      priority: 'low',
      suggestion: 'Consider expanding your meta description to 120-160 characters'
    });
  }

  // Heading suggestions
  if (metaData.headings.h1.length === 0) {
    suggestions.push({
      type: 'headings',
      priority: 'high',
      suggestion: 'Add an H1 tag that clearly describes your page topic'
    });
  } else if (metaData.headings.h1.length > 1) {
    suggestions.push({
      type: 'headings',
      priority: 'medium',
      suggestion: 'Use only one H1 tag per page for better SEO structure'
    });
  }

  // Image suggestions
  if (metaData.images.total > 0 && metaData.images.withAlt < metaData.images.total) {
    suggestions.push({
      type: 'images',
      priority: 'medium',
      suggestion: `Add alt text to ${metaData.images.total - metaData.images.withAlt} images for better accessibility and SEO`
    });
  }

  // Keyword suggestions
  if (targetKeywords.length > 0) {
    suggestions.push({
      type: 'keywords',
      priority: 'medium',
      suggestion: `Ensure your target keywords (${targetKeywords.join(', ')}) appear naturally in your title, headings, and content`
    });
  }

  return suggestions;
}

export const generateMetaTagSuggestions = async (content, targetKeywords = []) => {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackMetaTags(content, targetKeywords);
  }

  try {
    const prompt = `
Based on this webpage content, generate optimized meta tags:

Content: "${content.substring(0, 1000)}..."
Target Keywords: ${targetKeywords.join(', ')}

Please provide:
1. An optimized title tag (50-60 characters)
2. An optimized meta description (120-160 characters)
3. Suggested H1 tag
4. 3-5 relevant keywords

Format as JSON with keys: title, description, h1, keywords
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate optimized meta tags in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.5
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);

  } catch (error) {
    console.error('Meta tag generation failed:', error.message);
    return generateFallbackMetaTags(content, targetKeywords);
  }
};

function generateFallbackMetaTags(content, targetKeywords) {
  const firstKeyword = targetKeywords[0] || 'Your Business';
  
  return {
    title: `${firstKeyword} - Professional Services & Solutions`,
    description: `Discover ${firstKeyword} services and solutions. Get expert advice and professional results for your business needs.`,
    h1: `Professional ${firstKeyword} Services`,
    keywords: targetKeywords.length > 0 ? targetKeywords : ['business', 'services', 'professional', 'solutions', 'expert']
  };
}