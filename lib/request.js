const cloudscraper = require('cloudscraper');

let userAgent = `coinranking/exchanges (https://github.com/coinranking/exchanges) Node.js/${process.version} (JavaScript)`;
if (process.env.USER_AGENT) userAgent = process.env.USER_AGENT;

// Set json to true
const request = cloudscraper.defaults({
  timeout: 20000,
  pool: {
    maxSockets: 50,
  },
  headers: {
    'User-Agent': userAgent,
  },
  json: true,
});

module.exports = request;
