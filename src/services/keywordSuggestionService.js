import supabase from '../lib/supabase';

const CACHE_TABLE = 'keyword_suggestions_xyz123';

export class KeywordSuggestionService {
  static async getSuggestions(keyword, domain) {
    try {
      console.log('Fetching keyword suggestions for:', keyword);

      // Check cache first
      const { data: cachedSuggestions, error } = await supabase
        .from(CACHE_TABLE)
        .select('*')
        .eq('keyword', keyword)
        .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('created_at', { ascending: false })
        .limit(1);

      if (cachedSuggestions && cachedSuggestions.length > 0) {
        console.log('Found cached suggestions:', cachedSuggestions[0]);
        return cachedSuggestions[0].suggestions;
      }

      // Generate new suggestions
      const suggestions = await this.generateSuggestions(keyword, domain);

      // Cache the results
      const { data, error: insertError } = await supabase
        .from(CACHE_TABLE)
        .insert([{
          keyword,
          domain,
          suggestions,
          created_at: new Date().toISOString()
        }]);

      if (insertError) console.error('Failed to cache suggestions:', insertError);

      return suggestions;
    } catch (error) {
      console.error('Error getting keyword suggestions:', error);
      return this.getFallbackSuggestions(keyword);
    }
  }

  static async generateSuggestions(keyword, domain) {
    try {
      // For demo purposes, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate suggestions based on keyword patterns
      const suggestions = [];
      
      // Add "how to" variation
      suggestions.push({
        keyword: `how to ${keyword}`,
        intent: 'Informational intent',
        volume: Math.floor(Math.random() * 1000) + 100
      });

      // Add "best" variation
      suggestions.push({
        keyword: `best ${keyword}`,
        intent: 'Commercial intent',
        volume: Math.floor(Math.random() * 2000) + 500
      });

      // Add specific variation
      suggestions.push({
        keyword: `${keyword} for professionals`,
        intent: 'High-value commercial intent',
        volume: Math.floor(Math.random() * 500) + 50
      });

      // Add location-based variation
      suggestions.push({
        keyword: `${keyword} near me`,
        intent: 'Local intent',
        volume: Math.floor(Math.random() * 1500) + 200
      });

      // Add price-focused variation
      suggestions.push({
        keyword: `affordable ${keyword}`,
        intent: 'Price-sensitive commercial intent',
        volume: Math.floor(Math.random() * 800) + 100
      });

      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return this.getFallbackSuggestions(keyword);
    }
  }

  static getFallbackSuggestions(keyword) {
    return [
      {
        keyword: `best ${keyword}`,
        intent: 'Commercial intent',
        volume: null
      },
      {
        keyword: `${keyword} reviews`,
        intent: 'Research intent',
        volume: null
      },
      {
        keyword: `how to choose ${keyword}`,
        intent: 'Educational intent',
        volume: null
      }
    ];
  }
}