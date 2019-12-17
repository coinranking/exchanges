const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://api.btse.com/spot/v2/market_summary');
  const pairs = Object.keys(data);

  return pairs.map((pair) => {
    const ticker = data[pair];
    const [base, quote] = pair.split('-');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.highest_bid),
      ask: parseToFloat(ticker.lowest_ask),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
