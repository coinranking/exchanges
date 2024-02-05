const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Asteroidprotocol extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const result = await request({
      method: 'POST',
      url: 'https://api.asteroidprotocol.io/v1/graphql',
      json: {
        query: `
          query  {
            token(offset: 0, limit: 100, order_by: [{ volume_24_base: desc }], where: { volume_24_base: { _gt: 1000000 }})  {
              transaction {
                hash
              }
              name
              ticker
              last_price_base
              volume_24_base
            }
          }
        `,
      },
    });

    return result.data.token.map((ticker) => new Ticker(({
      base: ticker.ticker,
      baseName: ticker.name,
      baseReference: ticker.transaction.hash,
      quote: 'ATOM',
      quoteVolume: parseToFloat(ticker.volume_24_base) / 1000000,
      close: parseToFloat(ticker.last_price_base) / 1000000,
    })));
  }
}

module.exports = Asteroidprotocol;
