const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://indodax.com/api/webdata');
  const volumes = Object.values(data.volumes);
  const markets = volumes.map((volume) => {
    const [quote, base] = Object.keys(volume);
    return { base, quote };
  });

  return markets.map((market) => {
    const { base, quote } = market;
    const volume = data.volumes[`${base}${quote}`];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(volume[base]),
      quoteVolume: parseToFloat(volume[quote]),
      close: parseToFloat(data.prices[`${base}${quote}`], (number) => {
        // Convert from SATOSHI to btc
        if (market.quote === 'btc') number /= 1e8;
        return number;
      }),
    });
  });
};
