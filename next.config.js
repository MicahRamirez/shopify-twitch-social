require("dotenv").config();
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');

const skipAuth = JSON.stringify(process.env.SKIP_AUTH);
console.log(skipAuth);

// next.config.js
module.exports = withCSS({
  target: 'serverless',
  webpack: (config) => {
    const env = {
      SKIP_AUTH: skipAuth,
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
})