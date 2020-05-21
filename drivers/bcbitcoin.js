const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://www.bcbitcoin.co.uk/api/products/');
  const { Trades: trades } = await request('https://www.bcbitcoin.co.uk/api/trades/');

  return markets.map((market) => {
    const [base, quote] = market.id.split('-');

    const twentyFourHoursAgoInSeconds = (Date.now() / 1000) - (24 * 60 * 60);
    const tradesInLast24h = trades
      .filter((trade) => trade.pair === market.id)
      .filter((trade) => trade.timestamp >= twentyFourHoursAgoInSeconds);

    let high;
    let low;
    let close;
    let baseVolume;

    if (tradesInLast24h.length) {
      high = tradesInLast24h
        .reduce((acc, value) => Math.max(acc, parseToFloat(value.price)), -Infinity);
      low = tradesInLast24h
        .reduce((acc, value) => Math.min(acc, parseToFloat(value.price)), Infinity);
      close = parseToFloat(tradesInLast24h[tradesInLast24h.length - 1].price);
      baseVolume = tradesInLast24h.reduce((acc, value) => acc + parseToFloat(value.amount), 0);
    }

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
