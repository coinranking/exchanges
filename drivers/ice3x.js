const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { response } = await request('https://ice3x.com/api/v1/stats/marketdepthfull');
  const { entities: tickers } = response;

  return tickers.map((ticker) => {
    const [base, quote] = ticker.pair_name.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      high: parseToFloat(ticker.max),
      low: parseToFloat(ticker.min),
      close: parseToFloat(ticker.last_price),
    });
  });
};
