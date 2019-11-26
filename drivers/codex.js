const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const result = await request('https://api.codex.one/tickers');
  const tickers = Object.values(result.data);

  return tickers.map((ticker) => {
    const base = ticker.base_unit;
    const quote = ticker.quote_unit;

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.quote_volume),
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.last),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
