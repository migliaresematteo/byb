// This file helps set up a local backend for Netlify CMS during development
const proxy = require('netlify-cms-proxy-server');

// Start the proxy server
proxy.start({
  // Optional: Specify a custom port
  port: 8081
});
