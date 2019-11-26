const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const bases = ['BTC', 'LTC'];

  const tickers = bases.map(async (base) => {
    const ticker = await request(`https://api.bl3p.eu/1/${base}EUR/ticker`);
    const quote = 'EUR';

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume['24h']),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });

  return Promise.all(tickers);
};
