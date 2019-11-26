const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://bx.in.th/api/');
  const tickers = Object.values(data);

  return tickers.map((ticker) => {
    const base = ticker.secondary_currency;
    const quote = ticker.primary_currency;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume_24hours),
      close: parseToFloat(ticker.last_price),
    });
  });
};
