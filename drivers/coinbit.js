const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://coinmarketcapapi.coinbit.co.kr/marketPrice');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    // Quote and base are inverted
    const [quote, base] = market.split('_');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      // Yes the quoto typo is on purpose haha
      quoteVolume: parseToFloat(ticker.quotoVolume),
      baseVolume: parseToFloat(ticker.baseVolume),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
    });
  });
};
