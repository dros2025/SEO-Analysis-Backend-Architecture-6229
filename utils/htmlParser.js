import axios from 'axios';
import * as cheerio from 'cheerio';

export const parseHTML = async (url) => {
  try {
    console.log(`📄 Fetching HTML from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      maxRedirects: 5
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract raw content for analysis
    const bodyText = $('body').text();
    const htmlContent = $.html();

    console.log(`✅ HTML parsed successfully. Content length: ${bodyText.length} characters`);

    return {
      $,
      html: htmlContent,
      bodyText,
      url,
      status: response.status,
      headers: response.headers
    };

  } catch (error) {
    console.error(`❌ Failed to fetch HTML from ${url}:`, error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - the website took too long to respond');
    } else if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('Website not found - please check the URL');
    } else {
      throw new Error(`Failed to fetch website: ${error.message}`);
    }
  }
};

export const checkRobotsTxt = async (url) => {
  try {
    const robotsUrl = new URL('/robots.txt', url).toString();
    const response = await axios.get(robotsUrl, {
      timeout: 5000,
      validateStatus: (status) => status < 500
    });

    return {
      exists: response.status === 200,
      content: response.status === 200 ? response.data : null,
      status: response.status
    };
  } catch (error) {
    return {
      exists: false,
      content: null,
      error: error.message
    };
  }
};

export const checkSitemap = async (url) => {
  try {
    const sitemapUrl = new URL('/sitemap.xml', url).toString();
    const response = await axios.get(sitemapUrl, {
      timeout: 5000,
      validateStatus: (status) => status < 500
    });

    return {
      exists: response.status === 200,
      url: sitemapUrl,
      status: response.status
    };
  } catch (error) {
    return {
      exists: false,
      url: null,
      error: error.message
    };
  }
};