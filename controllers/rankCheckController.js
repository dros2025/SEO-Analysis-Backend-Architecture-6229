import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SERP_API_KEY = process.env.SERP_API_KEY;
const SERP_API_URL = 'https://serpapi.com/search.json';

export const checkRankPosition = async (req, res) => {
  try {
    const { keyword, domain, searchEngine = 'google' } = req.body;

    if (!keyword || !domain) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Both keyword and domain are required'
      });
    }

    if (!SERP_API_KEY) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'SERP API key is not configured'
      });
    }

    // Call SERP API
    const response = await axios.get(SERP_API_URL, {
      params: {
        api_key: SERP_API_KEY,
        q: keyword,
        num: 100,
        engine: searchEngine
      }
    });

    // Process the results
    const organicResults = response.data.organic_results || [];
    let position = null;
    let url = null;

    for (let i = 0; i < organicResults.length; i++) {
      if (organicResults[i].link.includes(domain)) {
        position = i + 1;
        url = organicResults[i].link;
        break;
      }
    }

    // Prepare the response
    const result = {
      keyword,
      domain,
      position,
      url,
      timestamp: new Date().toISOString(),
      found: position !== null
    };

    // Store in database
    try {
      const { data: rankHistory } = await supabase
        .from('rank_history_xyz123')
        .insert([result])
        .select();

      if (rankHistory) {
        result.id = rankHistory[0].id;
      }
    } catch (dbError) {
      console.error('Failed to store rank history:', dbError);
    }

    res.json(result);
  } catch (error) {
    console.error('Rank check error:', error);
    res.status(500).json({
      error: 'Rank check failed',
      message: error.message
    });
  }
};