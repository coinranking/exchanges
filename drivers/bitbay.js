const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { items } = await request('https://api.bitbay.net/rest/trading/ticker');
  const markets = Object.keys(items);

  const tickers = markets.map(async (market) => {
    const [base, quote] = market.split('-');
    const ticker = await request(`https://bitbay.net/API/Public/${base}${quote}/ticker.json`);

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.max),
      low: parseToFloat(ticker.min),
      vwap: parseToFloat(ticker.vwap),
    });
  });

  return Promise.all(tickers);
};
