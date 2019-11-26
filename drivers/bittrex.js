const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { result: tickers } = await request('https://api.bittrex.com/api/v1.1/public/getmarketsummaries');

  return tickers.map((ticker) => {
    // Warning: Bittrex inverts base and quote!
    const [quote, base] = ticker.MarketName.split('-');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.QuoteVolume),
      quoteVolume: parseToFloat(ticker.BaseVolume),
      high: parseToFloat(ticker.High),
      low: parseToFloat(ticker.Low),
      close: parseToFloat(ticker.Last),
    });
  });
};
