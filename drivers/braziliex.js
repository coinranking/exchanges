const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://braziliex.com/api/v1/public/ticker');
  const tickers = Object.values(markets);

  return tickers
    .filter((ticker) => (ticker.active === 1))
    .map((ticker) => {
      const [base, quote] = ticker.market.split('_');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.baseVolume),
        quoteVolume: parseToFloat(ticker.quoteVolume),
        close: parseToFloat(ticker.last),
      });
    });
};
