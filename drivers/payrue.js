const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { pairs: tickers } = await request(
    'https://payrue.com:8090/api/v1/public/volumes',
  );

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('/').reverse();

    return new Ticker({
      base,
      quote,
      close: parseToFloat(ticker.price),
      baseVolume: parseToFloat(ticker.quote_volume), // reversed with base volume
      quoteVolume: parseToFloat(ticker.base_volume),
    });
  });
};
