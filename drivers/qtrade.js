const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: { markets: tickers } } = await request('https://api.qtrade.io/v1/tickers');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.id_hr.split('_');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.day_high),
      low: parseToFloat(ticker.day_low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.day_volume_market), // reversed
      quoteVolume: parseToFloat(ticker.day_volume_base),
    });
  });
};
