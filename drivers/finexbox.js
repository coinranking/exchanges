const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://xapi.finexbox.com/v1/cmcpublicticker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [base, quote] = market.split('_');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      // Warning: Finexbox inverts base and quote
      baseVolume: parseToFloat(ticker.quoteVolume),
      quoteVolume: parseToFloat(ticker.baseVolume),
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.highestBid),
      ask: parseToFloat(ticker.lowestAsk),
    });
  });
};
