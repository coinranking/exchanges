const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { marketdetails: tickers } = await request('https://api.indoex.io/getMarketDetails/');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.pair.split('_');

    return new Ticker({
      base,
      quote,
      // Yes, Indoex confuses Base and Quote
      quoteVolume: parseToFloat(ticker.baseVolume),
      close: parseToFloat(ticker.last),
    });
  });
};
