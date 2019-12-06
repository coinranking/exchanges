const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data } = await request('https://www.cbx.one/api/v2/tickers');
  const tickers = Object.values(data);

  return tickers.map((ticker) => {
    const [base, quote] = ticker.market_id.split('-');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.close),
      bid: ticker.bid ? parseToFloat(ticker.bid.price) : undefined,
      ask: ticker.ask ? parseToFloat(ticker.ask.price) : undefined,
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
