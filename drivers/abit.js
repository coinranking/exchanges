const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, flatMap } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://api.abit.com/v1/ifmarket/spotTickers');

  return flatMap(tickers, (ticker) => {
    const [base, quote] = ticker.stock_code.split('/');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last_price),
      baseVolume: parseToFloat(ticker.total_volume),
    });
  });
};
