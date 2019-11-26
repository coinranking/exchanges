const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { ticker: tickers } = await request('https://openapi.digifinex.vip/v3/ticker');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('_');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      // Yes, Digifinex inverts base and quote
      quoteVolume: parseToFloat(ticker.base_vol),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
