import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const getAiOptimizationSuggestions = async (req, res) => {
  try {
    const { keyword, domain, position, url } = req.body;

    if (!keyword || !domain || !position) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Keyword, domain, and position are required'
      });
    }

    if (!OPENAI_API_KEY) {
      // Return fallback suggestions if API key is not configured
      return res.json({
        suggestions: getFallbackSuggestions(keyword, position),
        source: 'fallback'
      });
    }

    // Create prompt for the AI
    const prompt = `
    As an SEO expert, provide 3 specific, actionable suggestions to improve the ranking for this page:
    
    Keyword: "${keyword}"
    Current position: ${position}
    Domain: ${domain}
    Page URL: ${url || 'Not available'}
    
    For each suggestion:
    1. Provide a clear, concise title (5-7 words)
    2. Write a detailed explanation (30-50 words)
    3. Assign a priority (high, medium, or low)
    
    Format your response as a JSON array with objects containing "title", "description", and "priority" fields.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO consultant providing actionable recommendations to improve search rankings."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Parse and format the AI response
    const aiResponse = JSON.parse(completion.choices[0].message.content);
    
    // Map icon names to suggestions based on content
    const suggestionsWithIcons = aiResponse.suggestions.map(suggestion => {
      return {
        ...suggestion,
        icon: getIconForSuggestion(suggestion.title)
      };
    });

    return res.json({
      suggestions: suggestionsWithIcons,
      source: 'openai'
    });

  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({
      error: 'AI suggestions failed',
      message: error.message,
      suggestions: getFallbackSuggestions(req.body.keyword, req.body.position)
    });
  }
};

// Helper function to determine appropriate icon based on suggestion content
function getIconForSuggestion(title) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('content') || titleLower.includes('article') || titleLower.includes('text')) {
    return 'FiFileText';
  }
  if (titleLower.includes('link') || titleLower.includes('backlink')) {
    return 'FiLink';
  }
  if (titleLower.includes('keyword') || titleLower.includes('term')) {
    return 'FiTag';
  }
  if (titleLower.includes('meta') || titleLower.includes('title') || titleLower.includes('description')) {
    return 'FiEdit3';
  }
  if (titleLower.includes('speed') || titleLower.includes('performance')) {
    return 'FiZap';
  }
  if (titleLower.includes('mobile') || titleLower.includes('responsive')) {
    return 'FiSmartphone';
  }
  if (titleLower.includes('social') || titleLower.includes('share')) {
    return 'FiShare2';
  }
  if (titleLower.includes('image') || titleLower.includes('alt')) {
    return 'FiImage';
  }
  
  // Default icon
  return 'FiTrendingUp';
}

// Fallback suggestions if AI is not available
function getFallbackSuggestions(keyword, position) {
  // Base suggestions for any position
  const suggestions = [
    {
      title: "Improve Content Quality",
      description: `Enhance your content about "${keyword}" with more detailed information, examples, and helpful resources.`,
      icon: "FiFileText",
      priority: "high"
    },
    {
      title: "Build Quality Backlinks",
      description: "Increase your domain authority by acquiring relevant backlinks from reputable websites in your industry.",
      icon: "FiExternalLink",
      priority: "medium"
    }
  ];

  // Position-specific suggestions
  if (position > 20) {
    suggestions.push({
      title: "Keyword Optimization",
      description: `Make sure "${keyword}" appears in your title, meta description, headings, and naturally throughout your content.`,
      icon: "FiTag",
      priority: "high"
    });
  } else if (position > 10) {
    suggestions.push({
      title: "Related Keywords",
      description: `Add related terms to "${keyword}" to improve topic coverage and semantic relevance.`,
      icon: "FiSearch",
      priority: "medium"
    });
  } else {
    suggestions.push({
      title: "Internal Linking",
      description: "Create a strong internal linking structure to distribute page authority and help search engines understand your site hierarchy.",
      icon: "FiLink",
      priority: "medium"
    });
  }

  return suggestions;
}