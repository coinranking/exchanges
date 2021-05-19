/* eslint-disable camelcase */
const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Nash extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { listTickers: tickers } } = await request({
      method: 'POST',
      url: 'https://app.nash.io/api/graphql',
      json: {
        query: `
          query Ticker {
            listTickers {
              id,
              volume_24h {amount}
              bestAskPrice {amount},
              bestBidPrice {amount},
              lastPrice {amount},
              highPrice_24h {amount},
              lowPrice_24h {amount},
              market {
                aUnit,
                aAsset {name},
                bAsset {name},
                bUnit
              }
            }
          }
        `,
      },
    });

    return tickers.map((ticker) => {
      const {
        market: {
          aUnit: baseName,
          aAsset: { name: base },
          bUnit: quoteName,
          bAsset: { name: quote },
        },
        bestBidPrice,
        bestAskPrice,
        lastPrice,
        highPrice_24h,
        lowPrice_24h,
        volume_24h,
      } = ticker;

      return new Ticker({
        base,
        baseName,
        quote,
        quoteName,
        bid: parseToFloat(bestBidPrice ? bestBidPrice.amount : null),
        ask: parseToFloat(bestAskPrice ? bestAskPrice.amount : null),
        close: parseToFloat(lastPrice ? lastPrice.amount : null),
        high: parseToFloat(highPrice_24h ? highPrice_24h.amount : null),
        low: parseToFloat(lowPrice_24h ? lowPrice_24h.amount : null),
        quoteVolume: parseToFloat(volume_24h ? volume_24h.amount : null),
      });
    });
  }
}

module.exports = Nash;
