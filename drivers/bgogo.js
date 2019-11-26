const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request({
    url: 'https://bgogo.com/api/tickers',
    headers: { Accept: 'application/json' },
  });
  const pairs = Object.keys(tickers);

  return pairs
    .filter((pair) => pair !== 'status')
    .map((pair) => {
      const [base, quote] = pair.split('/');
      const ticker = tickers[pair];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.past_24hrs_base_volume),
        close: parseToFloat(ticker.last_price),
        high: parseToFloat(ticker.past_24hrs_low_price),
        low: parseToFloat(ticker.past_24hrs_high_price),
      });
    });
};
