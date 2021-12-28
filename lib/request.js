const cloudscraper = require('cloudscraper');

// Set json to true
const request = cloudscraper.defaults({
  timeout: 60000,
  pool: {
    maxSockets: 50,
  },
  json: true,
});

module.exports = request;
