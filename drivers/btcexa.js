const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { result: tickers } = await request('https://www.btcexa.com/api/market/ticker?format=json');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.trading_pair.split('_');

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.quote_asset_vol),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.price),
    });
  });
};
