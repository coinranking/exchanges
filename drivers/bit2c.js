const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const markets = [
    { base: 'Btc', quote: 'Nis' },
    { base: 'Eth', quote: 'Nis' },
    { base: 'Bchabc', quote: 'Nis' },
    { base: 'Ltc', quote: 'Nis' },
    { base: 'Etc', quote: 'Nis' },
    { base: 'Btg', quote: 'Nis' },
    { base: 'Bchsv', quote: 'Nis' },
    { base: 'Grin', quote: 'Nis' },
  ];

  const tickers = markets.map(async (market) => {
    const { base, quote } = market;
    const ticker = await request(`https://bit2c.co.il/Exchanges/${base}${quote}/Ticker.json`);

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.a),
      high: parseToFloat(ticker.h),
      low: parseToFloat(ticker.l),
      close: parseToFloat(ticker.ll),
    });
  });

  return Promise.all(tickers);
};
