const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request({
    url: 'https://api.bitasset.com/spot/v2/public/AllTicker',
    headers: { Accept: 'application/json' },
  });

  return tickers.map((ticker) => {
    const [base, quote] = ticker.pair.split('-');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.lastPrice),
      baseVolume: parseToFloat(ticker.volume24hr),
    });
  });
};
