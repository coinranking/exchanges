const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://api.litebit.eu/markets');
  const tickers = Object.values(data.result);

  return tickers.map((ticker) => {
    const base = ticker.abbr.toUpperCase();
    const quote = 'EUR';

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.buy),
    });
  });
};
