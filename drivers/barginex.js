const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://www.barginex.com/api/public/v1/markets/crypto');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.name.split('-');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.price),
    });
  });
};
