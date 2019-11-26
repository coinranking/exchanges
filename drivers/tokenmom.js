const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { tickers } = await request('https://api.tokenmom.com/market/get_tickers');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.market_id.split('-');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.price),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
