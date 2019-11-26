const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://dex.binance.org/api/v1/ticker/24hr');

  return tickers.map((ticker) => {
    const base = ticker.baseAssetName;
    const quote = ticker.quoteAssetName;

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.quoteVolume),
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.lastPrice),
      open: parseToFloat(ticker.openPrice),
      high: parseToFloat(ticker.highPrice),
      low: parseToFloat(ticker.lowPrice),
      vwap: parseToFloat(ticker.weightedAvgPrice),
    });
  });
};
