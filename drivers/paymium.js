const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const ticker = await request('https://paymium.com/api/v1/data/eur/ticker');

  const base = 'BTC';
  const quote = 'EUR';

  return [new Ticker({
    base,
    quote,
    baseVolume: parseToFloat(ticker.volume),
    high: parseToFloat(ticker.high),
    low: parseToFloat(ticker.low),
    close: parseToFloat(ticker.price),
  })];
};
