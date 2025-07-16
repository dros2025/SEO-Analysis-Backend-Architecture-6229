import { checkRobotsTxt, checkSitemap } from './htmlParser.js';

export const extractMetaData = (htmlData) => {
  const { $ } = htmlData;
  
  console.log('🔍 Extracting meta data...');

  // Basic meta information
  const title = $('title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
  
  // Open Graph meta tags
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDescription = $('meta[property="og:description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const ogUrl = $('meta[property="og:url"]').attr('content') || '';

  // Twitter Card meta tags
  const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';
  const twitterTitle = $('meta[name="twitter:title"]').attr('content') || '';
  const twitterDescription = $('meta[name="twitter:description"]').attr('content') || '';
  const twitterImage = $('meta[name="twitter:image"]').attr('content') || '';

  // Canonical URL
  const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';

  // Headings analysis
  const headings = {
    h1: $('h1').map((i, el) => $(el).text().trim()).get(),
    h2: $('h2').map((i, el) => $(el).text().trim()).get(),
    h3: $('h3').map((i, el) => $(el).text().trim()).get(),
    h4: $('h4').map((i, el) => $(el).text().trim()).get(),
    h5: $('h5').map((i, el) => $(el).text().trim()).get(),
    h6: $('h6').map((i, el) => $(el).text().trim()).get()
  };

  // Images analysis
  const images = {
    total: $('img').length,
    withAlt: $('img[alt]').length,
    withoutAlt: $('img').not('[alt]').length,
    details: $('img').map((i, el) => ({
      src: $(el).attr('src'),
      alt: $(el).attr('alt') || null,
      title: $(el).attr('title') || null
    })).get()
  };

  // Links analysis
  const links = {
    internal: 0,
    external: 0,
    nofollow: 0,
    details: []
  };

  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    const rel = $(el).attr('rel') || '';
    
    if (href) {
      const isExternal = href.startsWith('http') && !href.includes(htmlData.url);
      const isNofollow = rel.includes('nofollow');
      
      if (isExternal) {
        links.external++;
      } else {
        links.internal++;
      }
      
      if (isNofollow) {
        links.nofollow++;
      }

      links.details.push({
        href,
        text,
        rel,
        isExternal,
        isNofollow
      });
    }
  });

  // Technical SEO checks
  const technicalIssues = {
    missingTitle: !title,
    missingMetaDescription: !metaDescription,
    missingH1: headings.h1.length === 0,
    duplicateH1: headings.h1.length > 1,
    missingCanonical: !canonicalUrl,
    missingOgTags: !ogTitle || !ogDescription,
    largeTitle: title.length > 60,
    largeMetaDescription: metaDescription.length > 160,
    shortMetaDescription: metaDescription.length < 120 && metaDescription.length > 0
  };

  // Schema markup detection
  const schemaMarkup = {
    jsonLd: $('script[type="application/ld+json"]').length > 0,
    microdata: $('[itemscope]').length > 0,
    rdfa: $('[typeof]').length > 0,
    details: $('script[type="application/ld+json"]').map((i, el) => {
      try {
        return JSON.parse($(el).html());
      } catch (e) {
        return null;
      }
    }).get().filter(Boolean)
  };

  // Performance hints
  const performanceHints = {
    hasViewport: $('meta[name="viewport"]').length > 0,
    hasCharset: $('meta[charset]').length > 0,
    hasPreload: $('link[rel="preload"]').length > 0,
    hasPrefetch: $('link[rel="prefetch"]').length > 0,
    hasServiceWorker: $('script').text().includes('serviceWorker') || $('script').text().includes('sw.js')
  };

  console.log('✅ Meta data extraction complete');

  return {
    title,
    metaDescription,
    metaKeywords,
    canonicalUrl,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      image: ogImage,
      url: ogUrl
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      image: twitterImage
    },
    headings,
    images,
    links,
    technicalIssues,
    schemaMarkup,
    performanceHints
  };
};

export const analyzeTechnicalSEO = async (htmlData) => {
  const { url } = htmlData;
  
  console.log('🔧 Performing technical SEO analysis...');

  // Check robots.txt
  const robotsCheck = await checkRobotsTxt(url);
  
  // Check sitemap
  const sitemapCheck = await checkSitemap(url);

  // Check page speed hints
  const speedHints = analyzeSpeedHints(htmlData);

  // Check mobile friendliness
  const mobileCheck = analyzeMobileFriendliness(htmlData);

  return {
    robots: robotsCheck,
    sitemap: sitemapCheck,
    speed: speedHints,
    mobile: mobileCheck
  };
};

function analyzeSpeedHints(htmlData) {
  const { $ } = htmlData;
  
  return {
    totalImages: $('img').length,
    imagesWithoutOptimization: $('img').not('[loading="lazy"]').length,
    inlineStyles: $('style').length,
    inlineScripts: $('script').not('[src]').length,
    externalScripts: $('script[src]').length,
    externalStylesheets: $('link[rel="stylesheet"]').length,
    hasMinifiedAssets: $('script[src*=".min."]').length + $('link[href*=".min."]').length > 0
  };
}

function analyzeMobileFriendliness(htmlData) {
  const { $ } = htmlData;
  
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const hasViewport = viewport.length > 0;
  const hasResponsiveViewport = viewport.includes('width=device-width');
  
  return {
    hasViewport,
    hasResponsiveViewport,
    viewportContent: viewport,
    hasMediaQueries: $('style, link[rel="stylesheet"]').text().includes('@media'),
    hasTouchIcons: $('link[rel*="icon"]').length > 0
  };
}