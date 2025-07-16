import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const TABLE_NAME = 'ai_suggestions_abcd123';

export class AiSuggestionsService {
  static async getOptimizationSuggestions(keyword, domain, position, url) {
    try {
      console.log('Fetching AI suggestions for:', keyword, domain, position);
      
      // Check cache first
      const { data: cachedSuggestions, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('keyword', keyword)
        .eq('domain', domain)
        .order('created_at', { ascending: false })
        .limit(1);
      
      console.log('Supabase response:', { data: cachedSuggestions, error });
      
      // If we have cached suggestions that are recent (last 24 hours), return them
      if (cachedSuggestions && cachedSuggestions.length > 0) {
        const cached = cachedSuggestions[0];
        console.log('Found cached suggestions:', cached);
        
        return cached.suggestions;
      }
      
      // If no cache hit, try to get from API
      try {
        const suggestions = await this.generateAiSuggestions(keyword, domain, position, url);
        
        // Cache the results
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .insert([{
            keyword,
            domain,
            position,
            url,
            suggestions
          }]);
          
        if (error) console.error('Failed to cache suggestions:', error);
        
        return suggestions;
      } catch (apiError) {
        console.error('Error from AI API:', apiError);
        return this.getFallbackSuggestions(keyword, position);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return this.getFallbackSuggestions(keyword, position);
    }
  }

  static async generateAiSuggestions(keyword, domain, position, url) {
    try {
      // For demo purposes, we'll simulate API response
      console.log('Generating AI suggestions for:', keyword, domain, position);
      
      // Wait for 1 second to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock suggestions
      const { FiFileText, FiExternalLink, FiSearch, FiTag, FiLink, FiZap } = FiIcons;
      
      // Generate suggestions based on position
      if (position < 5) {
        return [
          {
            title: "Enhance Content Authority",
            description: `Make your content about "${keyword}" more authoritative with expert quotes and statistics.`,
            icon: "FiFileText",
            priority: "medium"
          },
          {
            title: "Improve Internal Linking",
            description: "Create a stronger internal linking structure to distribute page authority and help search engines understand your site hierarchy.",
            icon: "FiLink",
            priority: "medium"
          },
          {
            title: "Optimize for Featured Snippets",
            description: `Structure your content with clear Q&A formats to target featured snippets for "${keyword}" searches.`,
            icon: "FiZap",
            priority: "high"
          }
        ];
      } else if (position < 10) {
        return [
          {
            title: "Content Gap Analysis",
            description: `Analyze top 3 competitors for "${keyword}" and identify content gaps you can fill to improve rankings.`,
            icon: "FiFileText",
            priority: "high"
          },
          {
            title: "Boost Page Speed",
            description: "Improve loading times by optimizing images and implementing browser caching for better user experience.",
            icon: "FiZap",
            priority: "medium"
          },
          {
            title: "Expand Keyword Coverage",
            description: `Include more related terms to "${keyword}" to improve semantic relevance and topic authority.`,
            icon: "FiTag",
            priority: "medium"
          }
        ];
      } else {
        return [
          {
            title: "Keyword Optimization",
            description: `Ensure "${keyword}" appears in your title, meta description, headings, and naturally throughout your content.`,
            icon: "FiTag",
            priority: "high"
          },
          {
            title: "Build Quality Backlinks",
            description: "Increase your domain authority by acquiring relevant backlinks from reputable websites in your industry.",
            icon: "FiExternalLink",
            priority: "high"
          },
          {
            title: "Improve Content Quality",
            description: `Create more comprehensive content about "${keyword}" with detailed information, examples, and visuals.`,
            icon: "FiFileText",
            priority: "medium"
          }
        ];
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return this.getFallbackSuggestions(keyword, position);
    }
  }

  static getFallbackSuggestions(keyword, position) {
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
}