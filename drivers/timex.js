const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, flatMap } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request(
    'https://plasma-relay-backend.timex.io/public/tickers?period=H1',
  );
  const markets = await request(
    'https://plasma-relay-backend.timex.io/public/markets',
  );

  const pairs = {};

  markets.forEach((el) => {
    const [base, quote] = el.name.split('/');
    pairs[el.symbol] = {
      base,
      baseReference: el.baseTokenAddress,
      quote,
      quoteReference: el.quoteTokenAddress,
    };
  });

  return flatMap(tickers, (ticker) => {
    const {
      base, baseReference, quote, quoteReference,
    } = pairs[ticker.market];

    return new Ticker({
      base,
      baseReference,
      quote,
      quoteReference,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.volumeQuote), // reversed with quote volume
      quoteVolume: parseToFloat(ticker.volume),
    });
  });
};
