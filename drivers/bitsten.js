const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const { result: markets } = await request(
    'https://api.bitsten.com/api/v1/public/getticker/all',
  );

  return Object.keys(markets).map((market) => {
    const ticker = markets[market];
    const [base, quote] = market.split('_');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.basevolume),
      quoteVolume: parseToFloat(ticker.btcvolume),
    });
  });
};
