const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { tickers } = await request('https://api.mybitx.com/api/1/tickers');

  return tickers
    .filter((ticker) => (ticker.status === 'ACTIVE'))
    .map((ticker) => {
      const pairs = /^([A-Z]*)(MYR|NGN|ZMW|XBT|ZAR|EUR|IDR)$/.exec(ticker.pair);
      if (!pairs) return undefined;
      const [, base, quote] = pairs;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.rolling_24_hour_volume),
        close: parseToFloat(ticker.last_trade),
      });
    });
};
