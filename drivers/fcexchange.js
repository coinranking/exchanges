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
        base: baseCoin.symbol,
        baseName: baseCoin.name,
        quote: ticker.symbol,
        quoteName: ticker.name,
        high: parseToFloat(ticker.info.high),
        low: parseToFloat(ticker.info.low),
        close: parseToFloat(ticker.info.lastPrice),
        baseVolume: parseToFloat(ticker.info.amount),
      }),
    );
  });
};
