const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const pairResult = await request('https://api.cointiger.com/exchange/trading/api/v2/currencys');
  const partitions = pairResult.data;
  const partitionNames = Object.keys(partitions);
  let pairs = [];
  partitionNames.forEach((name) => {
    pairs = pairs.concat(partitions[name]);
  });

  const tickers = await request('https://www.cointiger.com/exchange/api/public/market/detail');

  return pairs.map((pair) => {
    const base = pair.baseCurrency.toUpperCase();
    const quote = pair.quoteCurrency.toUpperCase();

    const ticker = tickers[`${base}${quote}`];
    if (!ticker) return undefined;

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.quoteVolume),
      baseVolume: parseToFloat(ticker.baseVolume),
      close: parseToFloat(ticker.last),
    });
  });
};
