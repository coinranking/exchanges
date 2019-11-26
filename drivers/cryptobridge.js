const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://api.crypto-bridge.org/api/v1/ticker');

  return data.map((ticker) => {
    const [base, quote] = ticker.id.split('_');

    const close = parseToFloat(ticker.last);
    const quoteVolume = parseToFloat(ticker.volume);

    return new Ticker({
      base,
      quote,
      close,
      quoteVolume,
      baseVolume: parseToFloat(quoteVolume / close),
    });
  });
};
