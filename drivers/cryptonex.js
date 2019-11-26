const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { rates: tickers } = await request('https://stats.cryptonex.org/get_rate_list');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.alias.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.value_last_24h),
      close: parseToFloat(ticker.last_price),
    });
  });
};
