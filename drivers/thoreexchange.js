const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://thoreexchange.com/api/public/tradeInstruments');

  return tickers
    .filter((ticker) => (ticker.state === 'active'))
    .map((ticker) => {
      const [base, quote] = ticker.symbol.split('-');
      const volume = ticker['Volume (24H)'].replace(',', '');
      const price = ticker.Lastprice.replace(',', '');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(volume),
        close: parseToFloat(price),
      });
    });
};
