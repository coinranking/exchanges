const tls = require('tls');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

// Solves HTTPS errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// Solves EPROTO errors in some SSL requests
tls.DEFAULT_ECDH_CURVE = 'auto';

module.exports = async () => {
  const ticker = await request('https://bitonic.nl/api/price');

  const base = 'BTC';
  const quote = 'EUR';

  return [new Ticker({
    base,
    quote,
    baseVolume: parseToFloat(ticker.volume),
    close: parseToFloat(ticker.price),
  })];
};
