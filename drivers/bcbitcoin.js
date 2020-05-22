const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://www.bcbitcoin.co.uk/api/products/');
  const { Trades: trades } = await request('https://www.bcbitcoin.co.uk/api/trades/?today=24');

  return markets.map((market) => {
    const [base, quote] = market.id.split('-');

    const tradesInLast24h = trades
      .filter((trade) => trade.pair === market.id);

    if (!tradesInLast24h.length) return undefined;

    const high = tradesInLast24h
      .reduce((acc, value) => Math.max(acc, parseToFloat(value.price)), -Infinity);
    const low = tradesInLast24h
      .reduce((acc, value) => Math.min(acc, parseToFloat(value.price)), Infinity);
    const close = parseToFloat(tradesInLast24h[tradesInLast24h.length - 1].price);
    const baseVolume = tradesInLast24h.reduce((acc, value) => acc + parseToFloat(value.amount), 0);

    return new Ticker({
      base,
      quote,
      high,
      low,
      close,
      baseVolume,
    });
  });
};
