const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://api.vinex.network/api/v2/markets');

  return tickers.map((ticker) => {
    // base and quote are switched !
    const [base, quote] = ticker.symbol.split('_').reverse();

    return new Ticker({
      base,
      baseName: ticker.tokenInfo2.name,
      quote,
      quoteName: ticker.tokenInfo1.name,
      high: parseToFloat(ticker.high24h),
      low: parseToFloat(ticker.low24h),
      close: parseToFloat(ticker.lastPrice),
      baseVolume: parseToFloat(ticker.asset2Volume24h),
      quoteVolume: parseToFloat(ticker.volume24h),
    });
  });
};
