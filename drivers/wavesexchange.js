const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: markets } = await request('https://api.wavesplatform.com/v0/pairs?limit=1000&matcher=3PEjHv3JGjcWNpYEEkif2w8NXV4kbhnoGgu');
  const { data: assets } = await request('https://api.wavesplatform.com/v0/assets?ticker=*&matcher=3PEjHv3JGjcWNpYEEkif2w8NXV4kbhnoGgu');

  const currencies = assets.map((asset) => ({
    symbol: asset.data.ticker.trim(),
    name: asset.data.name,
    address: asset.data.id,
  }));

  return markets.map((market) => {
    const baseCurrency = currencies.find((currency) => (market.amountAsset === currency.address));
    const quoteCurrency = currencies.find((currency) => (market.priceAsset === currency.address));

    let base;
    let baseName;
    let baseReference;
    if (baseCurrency) {
      base = baseCurrency.symbol;
      baseName = baseCurrency.name;
      baseReference = baseCurrency.address;
    } else {
      base = market.amountAsset;
      baseReference = market.amountAsset;
    }

    let quote;
    let quoteName;
    let quoteReference;
    if (quoteCurrency) {
      quote = quoteCurrency.symbol;
      quoteName = quoteCurrency.name;
      quoteReference = quoteCurrency.address;
    } else {
      quote = market.priceAsset;
      quoteReference = market.priceAsset;
    }

    const ticker = market.data;

    return new Ticker({
      base,
      baseName,
      baseReference,
      quote,
      quoteName,
      quoteReference,
      open: parseToFloat(ticker.firstPrice),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.lastPrice),
      vwap: parseToFloat(ticker.weightedAveragePrice),
      baseVolume: parseToFloat(ticker.volume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
    });
  });
};
