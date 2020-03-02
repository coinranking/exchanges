const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://api.altcointrader.co.za/v3/live-stats');

  return Object.keys(markets).map((market) => {
    const ticker = markets[market];

    return new Ticker({
      base: market,
      quote: 'ZAR',
      high: parseToFloat(ticker.High),
      low: parseToFloat(ticker.Low),
      close: parseToFloat(ticker.Close),
      bid: parseToFloat(ticker.Buy), // reversed with Sell
      ask: parseToFloat(ticker.Sell),
      baseVolume: parseToFloat(ticker.Volume),
    });
  });
};
