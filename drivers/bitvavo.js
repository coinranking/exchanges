const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.bitvavo.com/v2/ticker/24h');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.market.split('-');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      quoteVolume: parseToFloat(ticker.volumeQuote),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
