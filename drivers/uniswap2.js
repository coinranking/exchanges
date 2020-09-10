const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Uniswap2 extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { pairs } } = await request({
      method: 'POST',
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      json: {
        query: `
          {
            pairs {
              base: token0 {
                id
                symbol
                name
              }
              quote: token1 {
                id
                symbol,
                name
              }
              last: token1Price
              volume: volumeToken1
            }
            pairs {
              qoute: token0 {
                id
                symbol
                name
              }
              base: token1 {
                id
                symbol
                name
              }
              last: token0Price
              volume: volumeToken0
            }
          }
        `,
      },
    });

    return pairs.map((ticker) => new Ticker({
      base: ticker.base.symbol,
      baseName: ticker.base.name,
      baseReference: ticker.base.id,
      quote: ticker.quote.symbol,
      quoteName: ticker.quote.name,
      quoteReference: ticker.quote.id,
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.volume),
    }));
  }
}

module.exports = Uniswap2;
