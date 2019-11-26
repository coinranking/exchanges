const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.icoinbay.com/api/v2/tickers');
  const pairs = Object.keys(tickers);

  return pairs.map((pair) => {
    const [base, quote] = pair.split('_');
    const ticker = tickers[pair];

    if (ticker.isFrozen !== '1') return undefined;

    // Warning: iCoinbay inverts base and quote
    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.baseVolume),
      baseVolume: parseToFloat(ticker.quoteVolume),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high24h),
      low: parseToFloat(ticker.low24h),
    });
  });
};
