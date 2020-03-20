const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://app.trexexchange.io/api/v2/peatio/public/markets');
  const pairs = await request('https://app.trexexchange.io/api/v2/peatio/public/markets/tickers');

  return markets.map((market) => {
    const [base, quote] = market.name.split('/');
    const { ticker } = pairs[market.id];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.buy),
      ask: parseToFloat(ticker.sell),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
