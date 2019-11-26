const request = require('../../lib/request');
const Ticker = require('../../models/ticker');
const mapping = require('./mapping');
const { parseToFloat } = require('../../lib/utils.js');

module.exports = async () => {
  const { data: markets } = await request('https://api.wavesplatform.com/v0/pairs?limit=1000');
  const { data: assets } = await request('https://api.wavesplatform.com/v0/assets?ticker=*');

  let currencies = assets.map((asset) => ({
    symbol: asset.data.ticker.trim(),
    name: asset.data.name,
    address: asset.data.id,
  }));

  currencies = currencies.concat(mapping);

  return markets.map((market) => {
    const baseCurrency = currencies.find((currency) => (market.amountAsset === currency.address));
    const quoteCurrency = currencies.find((currency) => (market.priceAsset === currency.address));

    if (!baseCurrency || !quoteCurrency) return undefined;

    const ticker = market.data;

    return new Ticker({
      base: baseCurrency.symbol,
      baseName: baseCurrency.name,
      baseReference: baseCurrency.address,
      quote: quoteCurrency.symbol,
      quoteName: quoteCurrency.name,
      quoteReference: quoteCurrency.address,
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
