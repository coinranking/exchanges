const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.coinone.co.kr/ticker?currency=all&format=json');
  const bases = Object.keys(tickers).filter((base) => (base !== 'timestamp' && base !== 'errorCode' && base !== 'result'));

  return bases.map((base) => {
    const quote = 'krw';
    const ticker = tickers[base];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
