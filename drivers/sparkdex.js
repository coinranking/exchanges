const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://pricing.bitspark.io/api/v1/asset-pairs');

  return tickers.map((ticker) => {
    const tickerMarket = Object.keys(ticker)[0];
    const tickerDetails = ticker[tickerMarket];

    return new Ticker({
      base: tickerDetails.baseName,
      quote: tickerDetails.quoteName,
      close: parseToFloat(tickerDetails.last),
      baseVolume: parseToFloat(tickerDetails.baseVolume),
      quoteVolume: parseToFloat(tickerDetails.quoteVolume),
    });
  });
};
