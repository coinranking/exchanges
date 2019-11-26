const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const markets = [
    { base: 'btc', quote: 'jpy' },
    { base: 'eth', quote: 'jpy' },
    { base: 'ltc', quote: 'jpy' },
    { base: 'bch', quote: 'jpy' },
  ];

  const tickers = markets.map(async (market) => {
    const { base, quote } = market;
    const ticker = await request(`https://www.btcbox.co.jp/api/v1/ticker/?coin=${base}`);

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
