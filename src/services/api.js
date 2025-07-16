import axios from 'axios';

// API base URL - adjust if needed based on your environment
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Mock API responses for demonstration purposes
// In a real implementation, these would make actual API calls

export const scanWebsite = async (data) => {
  try {
    // For demo purposes, we'll simulate an API call with mock data
    console.log('Scanning website:', data.url);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on scan depth
    const mockResponse = {
      url: data.url,
      depth: data.depth,
      timestamp: new Date().toISOString(),
      scanId: Date.now().toString(),
      basic: {
        title: 'Example Page Title',
        metaDescription: 'This is an example meta description for the page.',
        headings: {
          h1: ['Main Heading'],
          h2: ['Section 1', 'Section 2', 'Section 3'],
          h3: ['Subsection 1', 'Subsection 2'],
          h4: [],
          h5: [],
          h6: []
        },
        images: {
          total: 12,
          withAlt: 8,
          withoutAlt: 4
        },
        links: {
          internal: 15,
          external: 7,
          nofollow: 3
        },
        technicalIssues: {
          missingTitle: false,
          missingMetaDescription: false,
          missingH1: false,
          duplicateH1: false,
          missingCanonical: true,
          missingOgTags: true
        }
      }
    };

    // Add advanced data if requested
    if (data.depth === 'advanced' || data.depth === 'full') {
      mockResponse.advanced = {
        contentLength: 1547,
        readabilityScore: 68,
        keywordDensity: {
          'seo': {
            count: 12,
            percentage: '0.78',
            recommendation: 'Good keyword density. Well optimized.'
          },
          'analysis': {
            count: 8,
            percentage: '0.52',
            recommendation: 'Good keyword density. Well optimized.'
          },
          'website': {
            count: 15,
            percentage: '0.97',
            recommendation: 'Good keyword density. Well optimized.'
          }
        },
        keywordPositions: {
          'seo': [
            { position: 12, percentage: '0.8' },
            { position: 45, percentage: '2.9' },
            { position: 78, percentage: '5.0' },
            { position: 120, percentage: '7.8' }
          ],
          'analysis': [
            { position: 15, percentage: '1.0' },
            { position: 67, percentage: '4.3' },
            { position: 98, percentage: '6.3' }
          ]
        }
      };
    }

    // Add full data if requested
    if (data.depth === 'full') {
      mockResponse.full = {
        optimizationScore: 74,
        aiSuggestions: {
          available: true,
          suggestions: "1. Title Optimization: The title is good but could be more compelling. Consider adding power words.\n\n2. Meta Description: Good length but could include a stronger call to action.\n\n3. Content Structure: Add more H2 headings to break up content sections better.\n\n4. Keyword Integration: Good keyword density, but try to include more long-tail variations.\n\n5. Technical Fixes: Add canonical tags and Open Graph meta tags for better social sharing.",
          model: "gpt-3.5-turbo",
          timestamp: new Date().toISOString()
        },
        recommendations: [
          {
            type: 'warning',
            category: 'meta',
            message: 'Missing canonical tag may cause duplicate content issues',
            priority: 'medium'
          },
          {
            type: 'warning',
            category: 'social',
            message: 'Missing Open Graph tags reduces social media visibility',
            priority: 'medium'
          },
          {
            type: 'info',
            category: 'images',
            message: '4 images missing alt text',
            priority: 'low'
          }
        ]
      };
    }

    return mockResponse;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to scan website');
  }
};

export const getScanHistory = async () => {
  try {
    // Mock scan history
    return {
      total: 3,
      scans: [
        {
          id: '1',
          url: 'https://example.com',
          depth: 'full',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          url: 'https://another-site.com',
          depth: 'basic',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          url: 'https://test-domain.org',
          depth: 'advanced',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get scan history');
  }
};

export const getScanDetails = async (id) => {
  try {
    // Mock scan details
    return {
      scanId: id,
      url: 'https://example.com',
      depth: 'full',
      timestamp: new Date().toISOString(),
      // Include the same mock data structure as in scanWebsite
      basic: {
        title: 'Example Page Title',
        metaDescription: 'This is an example meta description for the page.',
        // ... other basic fields
      },
      // Include advanced and full data as needed
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get scan details');
  }
};

export const checkRankPosition = async (data) => {
  try {
    console.log('Checking rank position for:', data.keyword, 'on domain:', data.domain);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response - simulate finding the domain at a random position
    const position = Math.floor(Math.random() * 30) + 1; // Random position between 1-30
    
    const mockResponse = {
      keyword: data.keyword,
      domain: data.domain,
      position: position,
      url: `https://${data.domain}/page-about-${data.keyword.replace(/\s+/g, '-').toLowerCase()}`,
      timestamp: new Date().toISOString(),
      found: true,
      searchEngine: data.searchEngine || 'google',
      
      // Add mock history data
      history: [
        {
          timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
          position: position + 2
        },
        {
          timestamp: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
          position: position + 5
        }
      ]
    };
    
    // Simulate "not found" for some queries
    if (data.keyword.includes('nonexistent')) {
      mockResponse.position = null;
      mockResponse.url = null;
      mockResponse.found = false;
    }

    return mockResponse;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check rank position');
  }
};

export default api;