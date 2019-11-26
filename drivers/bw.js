const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://www.bw.com/api/data/v1/tickers?isUseMarketName=true');
  const tickers = data.datas;
  const pairs = Object.keys(tickers);

  return pairs.map((pair) => {
    const [base, quote] = pair.split('_');
    const ticker = tickers[pair];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker[4]),
      close: parseToFloat(ticker[1]),
      high: parseToFloat(ticker[2]),
      low: parseToFloat(ticker[3]),
    });
  });
};
