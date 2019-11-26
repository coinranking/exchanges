const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://www.southxchange.com/api/prices');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.Market.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.Volume24Hr),
      close: parseToFloat(ticker.Last),
    });
  });
};
