const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const bases = ['BTC', 'LTC', 'BCH', 'XRP', 'ETH'];

  const tickers = bases.map(async (base) => {
    const { ticker } = await request(`https://www.mercadobitcoin.net/api/${base}/ticker/`);
    const quote = 'BRL';

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });

  return Promise.all(tickers);
};
