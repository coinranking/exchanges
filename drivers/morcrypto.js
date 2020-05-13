const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const { result } = await request('https://beta.morcrypto-exchange.com/getmarkets');
  const markets = result.map((el) => el.MarketName);

  const tickers = throttleMap(markets, async (market) => {
    const [base, quote] = market.split('-');
    const { result: ticker } = await request(`https://beta.morcrypto-exchange.com/getmarketsummary?market=${market}`);

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.High),
      low: parseToFloat(ticker.Low),
      close: parseToFloat(ticker.Last),
      bid: parseToFloat(ticker.Bid),
      ask: parseToFloat(ticker.Ask),
      baseVolume: parseToFloat(ticker.Volume),
    });
  }, isMocked ? 0 : 50); // Limited to 20 requests a second

  return Promise.all(tickers);
};
