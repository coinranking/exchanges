const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data } = await request('https://api.bitmesh.com/?api=market.ticker');
  const tickers = Object.values(data);

  return tickers.map((ticker) => {
    // Bitmesh inverts the base and quote!
    const [quote, base] = ticker.name.split('_');

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.value),
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.price),
      high: parseToFloat(ticker.max),
      low: parseToFloat(ticker.min),
    });
  });
};
