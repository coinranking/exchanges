const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://europe1.coindeal.com/api/v1/markets/list');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.coin.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.lastPrice),
    });
  });
};
