const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Mandalaexchange extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const {
      data: { list: markets },
    } = await request('https://trade.mandala.exchange/open/v1/common/symbols');

    const tickers = throttleMap(
      markets,
      async (market) => {
        try {
          const base = market.baseAsset;
          const quote = market.quoteAsset;
          const details = await request(
            `https://trade.mandala.exchange/v1/market/trading-pairs?baseAsset=${base}&quoteAsset=${quote}`,
          );
          const [, , , , , , , , , , ,
            baseVolume, ,
            quoteVolume, ,
            low,
            high,
            open,
            close,
          ] = details.data.list[0];

          return new Ticker({
            base,
            quote,
            high: parseToFloat(high),
            low: parseToFloat(low),
            close: parseToFloat(close),
            open: parseToFloat(open),
            baseVolume: parseToFloat(baseVolume),
            quoteVolume: parseToFloat(quoteVolume),
          });
        } catch (e) {
          return undefined;
        }
      },
      isMocked ? 0 : 50,
    );

    return Promise.all(tickers);
  }
}

module.exports = Mandalaexchange;
