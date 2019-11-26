const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://bot.blackturtle.eu/api/tickers');

  return tickers.map((ticker) => {
    if (!ticker.symbol) return undefined;

    const [base, quote] = ticker.symbol.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker['24h_volume']),
      quoteVolume: parseToFloat(ticker['24h_priceVolume']),
      open: parseToFloat(ticker['24h_open']),
      high: parseToFloat(ticker['24h_high']),
      low: parseToFloat(ticker['24h_low']),
      close: parseToFloat(ticker['24h_close']),
      vwap: parseToFloat(ticker['24h_vwap']),
    });
  });
};
