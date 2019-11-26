const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { result: markets } = await request('https://www.coinexchange.io/api/v1/getmarkets');
  const { result: tickers } = await request('https://www.coinexchange.io/api/v1/getmarketsummaries');

  return markets
    .filter((market) => (market.Active === true))
    .map((market) => {
      const base = market.MarketAssetCode;
      const baseName = market.MarketAssetName;
      const quote = market.BaseCurrencyCode;
      const quoteName = market.BaseCurrency;

      const ticker = tickers.find((item) => (item.MarketID === market.MarketID));

      if (!ticker) return undefined;

      return new Ticker({
        base,
        baseName,
        quote,
        quoteName,
        quoteVolume: parseToFloat(ticker.Volume),
        high: parseToFloat(ticker.HighPrice),
        low: parseToFloat(ticker.LowPrice),
        close: parseToFloat(ticker.LastPrice),
      });
    });
};
