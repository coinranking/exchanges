const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: markets } = await request('https://api.bitoffer.com/v1/api/cash/instrument');
  const { data: tickers } = await request('https://api.bitoffer.com/v1/api/quot/market');

  return markets.map((market) => {
    const [base, quote] = market.symbol.split('-');

    const ticker = tickers.find((item) => (item.instrumentId === market.instrumentId));

    if (!ticker) return undefined;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
