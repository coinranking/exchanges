const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { result } = await request('https://api.cobinhood.com/v1/market/tickers');
  const { tickers } = result;

  return tickers.map((ticker) => {
    const [base, quote] = ticker.trading_pair_id.split('-');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker['24h_volume']),
      open: parseToFloat(ticker['24h_open']),
      high: parseToFloat(ticker['24h_high']),
      low: parseToFloat(ticker['24h_low']),
      close: parseToFloat(ticker.last_trade_price),
    });
  });
};
