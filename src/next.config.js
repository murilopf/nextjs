/* eslint-disable */
const withOffline = require('next-offline');
const withManifest = require('next-manifest');
const compose = require('lodash/fp/compose');
const glob = require('glob');

const defaults = {
  // next-manifest options
  output: './static/',
  // manifest options
  name: 'Fake Dashboard',
  short_name: 'fake',
  description: 'teste dashboard',
  display: 'standalone',
  orientation: 'natural',
  background_color: '#ED4C00',
  theme_color: '#ED4C00',
};

module.exports = compose([withManifest, withOffline])({
  manifest: {
    ...defaults,
  },
  // target: 'serverless',
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  webpack: (config) => {
    config.node = {
      fs: 'empty',
    };
    return config;
  },
  exportPathMap: function () {
    const pathMap = {
      '/': { page: '/' },
      '/api': { page: '/api' },
    };
    return pathMap;
  },
});
