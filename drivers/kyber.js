const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.kyber.network/market');
  const markets = tickers.data;

  return markets.map((ticker) => {
    const [base, quote] = ticker.pair.split('_');

    return new Ticker({
      base,
      baseName: ticker.base_name,
      quote,
      quoteName: ticker.quote_name,
      high: parseToFloat(ticker.past_24h_high),
      low: parseToFloat(ticker.past_24h_low),
      close: parseToFloat(ticker.last_traded),
      bid: parseToFloat(ticker.current_bid),
      ask: parseToFloat(ticker.current_ask),
      baseVolume: parseToFloat(ticker.token_24h_volume),
      quoteVolume: parseToFloat(ticker.eth_24h_volume),
    });
  });
};
