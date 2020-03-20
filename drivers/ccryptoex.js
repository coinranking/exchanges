const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const markets = await request('https://ccryptoex.com/api/tickers');

  return Object.keys(markets).map((market) => {
    const { ticker } = markets[market];
    const [base, quote] = market.split('_');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.buy), // reversed with sell
      ask: parseToFloat(ticker.sell),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
