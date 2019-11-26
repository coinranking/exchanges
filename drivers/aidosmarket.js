const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { stats: ticker } = await request('https://aidosmarket.com/api/stats');

  const base = 'ADK';
  const quote = 'BTC';

  return [new Ticker({
    base,
    quote,
    quoteVolume: parseToFloat(ticker['24h_volume']),
    close: parseToFloat(ticker.last_price),
  })];
};
