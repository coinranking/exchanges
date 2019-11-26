const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://stellar.api.stellarport.io/Ticker');
  const pairs = Object.keys(data);

  return pairs.map((pair) => {
    const [base, quote] = pair.split('_');
    const ticker = data[pair];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.close),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
