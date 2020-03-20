const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request({
    url: 'https://virtuse.exchange/api/v1',
    method: 'post',
    form: {
      method: 'public/get_ticker',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return Object.values(tickers).map((ticker) => {
    const { base: baseVolume, quote: quoteVolume } = ticker.volume;

    return new Ticker({
      base: ticker.base,
      quote: ticker.quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(baseVolume),
      quoteVolume: parseToFloat(quoteVolume),
    });
  });
};
