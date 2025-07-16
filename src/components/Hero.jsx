import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiZap, FiTarget, FiTrendingUp, FiShield } = FiIcons;

function Hero() {
  const features = [
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Get comprehensive SEO analysis in seconds'
    },
    {
      icon: FiTarget,
      title: 'Precise Analysis',
      description: 'Detailed insights with actionable recommendations'
    },
    {
      icon: FiTrendingUp,
      title: 'Performance Boost',
      description: 'Optimize your website for better rankings'
    },
    {
      icon: FiShield,
      title: 'Technical Audit',
      description: 'Complete technical SEO health check'
    }
  ];

  return (
    <section className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
          Unlock Your Website's SEO Potential
        </h2>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          Get comprehensive SEO analysis with AI-powered insights to boost your search rankings and drive more traffic
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={feature.icon} className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;