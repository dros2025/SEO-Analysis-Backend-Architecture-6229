import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiType, FiFileText, FiImage, FiLink, FiAlertTriangle, FiCheck, FiAlertCircle } = FiIcons;

function BasicResults({ data }) {
  const getTitleLengthStatus = (title) => {
    const length = title?.length || 0;
    if (length === 0) return { status: 'error', message: 'Missing title tag' };
    if (length < 40) return { status: 'warning', message: 'Title is too short (ideal: 50-60 characters)' };
    if (length > 60) return { status: 'warning', message: 'Title is too long (ideal: 50-60 characters)' };
    return { status: 'good', message: 'Title length is optimal' };
  };

  const getImageAltStatus = (images) => {
    if (images.withoutAlt === 0) return { status: 'good', message: 'All images have alt text' };
    return {
      status: 'warning',
      message: `${images.withoutAlt} images missing alt text. All images should have descriptive alt text for SEO and accessibility.`
    };
  };

  const titleStatus = getTitleLengthStatus(data.title);
  const imageStatus = getImageAltStatus(data.images);

  // Critical technical issues
  const criticalIssues = [
    { id: 'canonical', label: 'Missing Canonical Tag', present: data.technicalIssues.missingCanonical },
    { id: 'ogTags', label: 'Missing Open Graph Tags', present: data.technicalIssues.missingOgTags }
  ].filter(issue => issue.present);

  // Inject meta tags if allowed
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      // Remove existing tags
      document.querySelector('link[rel="canonical"]')?.remove();
      document.querySelectorAll('meta[property^="og:"]').forEach(el => el.remove());

      // Add canonical tag
      if (data.technicalIssues.missingCanonical) {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = window.location.href;
        document.head.appendChild(canonical);
      }

      // Add OG tags
      if (data.technicalIssues.missingOgTags) {
        const ogTags = [
          { property: 'og:title', content: data.title || document.title },
          { property: 'og:description', content: data.metaDescription || '' },
          { property: 'og:url', content: window.location.href }
        ];

        ogTags.forEach(tag => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', tag.property);
          meta.setAttribute('content', tag.content);
          document.head.appendChild(meta);
        });
      }
    }
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Critical Technical Issues */}
      {criticalIssues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiAlertTriangle} className="text-red-600 text-xl" />
            <h3 className="text-lg font-semibold text-red-800">Critical Technical Issues Found</h3>
          </div>
          <div className="space-y-3">
            {criticalIssues.map(issue => (
              <div key={issue.id} className="flex items-start space-x-3">
                <SafeIcon icon={FiAlertCircle} className="text-red-500 mt-1" />
                <div>
                  <p className="font-medium text-red-700">{issue.label}</p>
                  <p className="text-sm text-red-600 mt-1">
                    {issue.id === 'canonical' 
                      ? 'Add a canonical tag to prevent duplicate content issues'
                      : 'Add Open Graph tags to improve social media sharing'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Title Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white border-2 rounded-xl p-6 ${
          titleStatus.status === 'error' ? 'border-red-200' :
          titleStatus.status === 'warning' ? 'border-yellow-200' :
          'border-green-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiType} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Title Tag Analysis</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            titleStatus.status === 'error' ? 'bg-red-100 text-red-700' :
            titleStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {data.title?.length || 0} characters
          </span>
        </div>
        <p className="text-sm text-gray-600">{titleStatus.message}</p>
        {data.title && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-800">{data.title}</p>
          </div>
        )}
      </motion.div>

      {/* Image Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white border-2 rounded-xl p-6 ${
          imageStatus.status === 'warning' ? 'border-yellow-200' : 'border-green-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiImage} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Image Optimization</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Total Images:</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              {data.images.total}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Images with alt text</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {data.images.withAlt}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Images missing alt text</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {data.images.withoutAlt}
            </span>
          </div>
          {imageStatus.status === 'warning' && (
            <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg mt-3">
              {imageStatus.message}
            </p>
          )}
        </div>
      </motion.div>

      {/* Other Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Meta Description */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiFileText} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Meta Description</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Length</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                !data.metaDescription ? 'bg-red-100 text-red-700' :
                data.metaDescription.length < 120 ? 'bg-yellow-100 text-yellow-700' :
                data.metaDescription.length > 160 ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {data.metaDescription?.length || 0} characters
              </span>
            </div>
            {data.metaDescription && (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {data.metaDescription}
              </p>
            )}
          </div>
        </div>

        {/* Links Analysis */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiLink} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Links Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Internal Links</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {data.links.internal}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">External Links</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {data.links.external}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BasicResults;