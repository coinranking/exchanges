const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: markets } = await request('https://extstock.com/api/v2/ticker');

  return Object.keys(markets).map((market) => {
    const [base, quote] = market.split('_');
    const ticker = markets[market];

    return new Ticker({
      base,
      quote,
      close: parseToFloat(ticker.last_price),
      ask: parseToFloat(ticker.high),
      bid: parseToFloat(ticker.low),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.quote_volume),
    });
  });
};
