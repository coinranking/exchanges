const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data } = await request('https://a.dragonex.io/cct/list2/?zone_id=0');
  const tickers = data.list;

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('_');

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.total_amount),
      baseVolume: parseToFloat(ticker.total_volume),
      close: parseToFloat(ticker.close_price),
      open: parseToFloat(ticker.open_price),
      high: parseToFloat(ticker.max_price),
      low: parseToFloat(ticker.min_price),
    });
  });
};
