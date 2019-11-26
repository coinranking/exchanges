const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const pairs = ['BTC_JPY', 'ETH_BTC', 'BCH_BTC'];

  const tickers = pairs.map(async (pair) => {
    const ticker = await request(`https://api.bitflyer.com/v1/ticker?product_code=${pair}`);

    const [base, quote] = pair.split('_');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume_by_product),
      close: parseToFloat(ticker.ltp),
    });
  });

  return Promise.all(tickers);
};
