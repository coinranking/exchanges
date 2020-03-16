const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request(
    'https://nami.exchange/api/v1.0/market/summaries',
  );

  return tickers.map((ticker) => {
    const { exchange_currency: base, base_currency: quote } = ticker;

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high_24h),
      low: parseToFloat(ticker.low_24h),
      close: parseToFloat(ticker.last_price),
      baseVolume: parseToFloat(ticker.total_exchange_volume),
      quoteVolume: parseToFloat(ticker.total_base_volume),
    });
  });
};
