require("dotenv").config();
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');

const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const skipAuth = JSON.stringify(process.env.SKIP_AUTH);

// next.config.js
module.exports = withCSS({
  target: 'serverless',
  webpack: (config) => {
    const env = {
      API_KEY: apiKey,
      SKIP_AUTH: skipAuth,
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
})