const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.unnamed.exchange/v1/Public/Ticker');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.market.split('_');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.close),
      bid: parseToFloat(ticker.highestBuy),
      ask: parseToFloat(ticker.lowestSell),
      // Warning: they've reversed base and quote volume
      baseVolume: parseToFloat(ticker.volume),
      quoteVolume: parseToFloat(ticker.baseVolume),
    });
  });
};
