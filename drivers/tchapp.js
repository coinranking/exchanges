const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.thorecash.app/api/public/tradeInstruments');

  return tickers.map((ticker) => {
    const base = ticker.baseCurrency;
    const quote = ticker.quoteCurrency;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker['Volume (24H)'].replace(',', '')),
      close: parseToFloat(ticker.Lastprice.replace(',', '')),
    });
  });
};
