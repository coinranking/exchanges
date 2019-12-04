const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const currencies = await request('https://api.tokens.net/public/trading-pairs/get/all/');
  const data = await request('https://api.tokens.net/public/ticker/all/');
  const markets = Object.keys(data).filter((item) => item !== 'timestamp' && item !== 'status');
  const pairs = Object.values(markets);

  return pairs.map((pair) => {
    const ticker = data[pair];

    return new Ticker({
      base: currencies[pair].baseCurrency,
      quote: currencies[pair].counterCurrency,
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      vwap: parseToFloat(ticker.vwap),
      baseVolume: parseToFloat(ticker.volume),
      quoteVolume: parseToFloat(ticker[`volume_${ticker.counterCurrency}`]),
    });
  });
};
