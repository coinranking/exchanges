const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { flatMap, parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request(
    'https://fanaticoscriptos.exchange/api/v1/markets',
  );

  return flatMap(markets, (market) => {
    const { baseCoin } = market;
    const tickers = market.coins;

    return tickers.map(
      (ticker) => new Ticker({
        base: ticker.symbol, // reversed
        baseName: ticker.name, // reversed
        quote: baseCoin.symbol, // reversed
        quoteName: baseCoin.name, // reversed
        high: parseToFloat(ticker.info.high),
        low: parseToFloat(ticker.info.low),
        close: parseToFloat(ticker.info.lastPrice),
        quoteVolume: parseToFloat(ticker.info.amount),
      }),
    );
  });
};
