const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const pairs = await request('https://api.prizmbit.com/api/po/MarketData/GetMarketPrices');

  const tickers = throttleMap(pairs, async (pair) => {
    try {
      const ticker = await request(`https://api.prizmbit.com/api/po/MarketData/GetTicker?market=${pair.marketName}`);
      const [base, quote] = pair.marketName ? pair.marketName.split('/') : '';

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.closePrice),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.volume),
      });
    } catch (error) {
      return undefined;
    }
  }, isMocked ? 0 : 200); // Batches of 5 requests per second

  return Promise.all(tickers);
};
