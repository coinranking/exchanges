const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request(
    'https://marketcap.backend.currency.com/api/v1/token_crypto/ticker',
  );

  return Object.values(tickers).map((ticker) => new Ticker({
    base: ticker.base_currency,
    quote: ticker.quote_currency,
    high: parseFloat(ticker.past_24hrs_high_price),
    low: parseFloat(ticker.past_24hrs_low_price),
    close: parseToFloat(ticker.last_price),
    bid: parseFloat(ticker.highest_bid_price),
    ask: parseFloat(ticker.lowest_ask_price),
    baseVolume: parseToFloat(ticker.base_volume),
    quoteVolume: parseToFloat(ticker.quote_volume),
  }));
};
