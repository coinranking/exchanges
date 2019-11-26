const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://coinfalcon.com/api/v1/markets');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.name.split('-');

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.last_price),
    });
  });
};
