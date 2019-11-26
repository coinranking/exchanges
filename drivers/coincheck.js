const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const ticker = await request('https://coincheck.com/api/ticker');

  const base = 'BTC';
  const quote = 'JPY';

  return [new Ticker({
    base,
    quote,
    baseVolume: parseToFloat(ticker.volume),
    high: parseToFloat(ticker.high),
    low: parseToFloat(ticker.low),
    close: parseToFloat(ticker.last),
  })];
};
