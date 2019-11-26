const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { result: symbols } = await request('https://api.go.exchange/exchange/symbols');
  const { result: tickers } = await request('https://api.go.exchange/exchange/ticker');

  return symbols.map((symbol) => {
    const base = symbol.base_currency_code;
    const quote = symbol.quote_currency_code;
    const ticker = tickers.find((item) => (item.symbol === symbol.name));

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.volume_24h),
      close: parseToFloat(ticker.last_price),
    });
  });
};
