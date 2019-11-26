const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://simex.global/api/cmc');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.name.split('_');

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.quote_volume),
      baseVolume: parseToFloat(ticker.base_volume),
      close: parseToFloat(ticker.last_price),
      high: parseToFloat(ticker.high_price),
      low: parseToFloat(ticker.low_price),
      bid: parseToFloat(ticker.buy_price),
      ask: parseToFloat(ticker.sell_price),
    });
  });
};
