const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { combinations: tickers } = await request('https://api.instantbitex.com/tickers');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [base, quote] = market.split('_');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.volume24hr),
      close: parseToFloat(ticker.last),
    });
  });
};
