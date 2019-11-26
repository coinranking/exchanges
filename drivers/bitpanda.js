const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.exchange.bitpanda.com/public/v1/market-ticker');

  return tickers
    .filter((ticker) => (ticker.state === 'ACTIVE'))
    .map((ticker) => {
      const [base, quote] = ticker.instrument_code.split('_');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.quote_volume),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last_price),
      });
    });
};
