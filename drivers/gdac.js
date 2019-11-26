const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://partner.gdac.com/v0.4/public/tickers');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.pair.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
