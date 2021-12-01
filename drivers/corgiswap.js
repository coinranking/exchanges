const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { arrayToChunks, throttleFlatMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Corgiswap extends Driver {
  constructor() {
    super({
      supports: {
        specificMarkets: true,
      },
    });
  }

  /**
   * @param {Array} ids IDs of the pairs to retrieve
   * @param {number|null} blockNumber Block number on which the pair data should be based
   * @returns {Promise.Array} Array with the requested pairs
   */
  async getPairs(ids, blockNumber = null) {
    // By default request the current top 1000 markets with the highest volume.
    const selectQuery = ids ? `first: ${ids.length} where: {id_in: ["${ids.join('", "')}"]}` : 'first: 1000 where: {volumeUSD_gt: 0}';
    const blockQuery = blockNumber ? `block: {number: ${blockNumber}}` : '';

    const { data: { pairs } } = await request({
      method: 'POST',
      url: 'https://api.thegraph.com/subgraphs/name/corgiswap/exchange',
      json: {
        query: `
          {
            pairs(${selectQuery} ${blockQuery} orderBy: volumeUSD orderDirection: desc) {
                id
                token0 {id symbol name}
                token1 {id symbol name}
                token1Price volumeToken0 volumeToken1
            }
          }
        `,
      },
    });

    return pairs;
  }

  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @returns {Promise.Number}
   *   Returns a number that should be a blocknumber of
   *   Corgiswap that was mined 24 hours ago
   */
  async blockNumber24hAgo(isMocked) {
    const timestampInSeconds = Math.round(Date.now() / 1000);
    const oneDayInSeconds = 24 * 60 * 60;
    let timestampYesterdayInSeconds = timestampInSeconds - oneDayInSeconds;

    if (isMocked) {
      // Dirty fix for testing. The fixture has a timestamp in the query.
      // Because of that the test could not find the fixture.
      timestampYesterdayInSeconds = 1627380191;
    }

    const { data: { blocks } } = await request({
      method: 'POST',
      url: 'https://api.thegraph.com/subgraphs/name/corgiswap/blocks',
      json: {
        query: `
        {
          blocks(
            first: 1,
            orderBy: timestamp,
            orderDirection: desc,
            where: {
              timestamp_gt: ${timestampYesterdayInSeconds},
              timestamp_lt: ${timestampYesterdayInSeconds + 600}
            }
          ) {
            number
          }
        }
        `,
      },
    });

    const [block] = blocks;

    return block.number;
  }

  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const pairs = await this.getPairs(this.markets);

    // The base and quote volumes are total volumes of the market's existence,
    // so we need to subtract the volumes that were reported 24 hours ago.
    const blockNumber = await this.blockNumber24hAgo(isMocked);
    const idsToRetrieve = pairs.map((pair) => pair.id);

    // Split to multiple calls as otherwise the request times out.
    const idsChunks = arrayToChunks(idsToRetrieve, 300);

    const pairs24hAgo = await throttleFlatMap(idsChunks,
      (idsChunk) => this.getPairs(idsChunk, blockNumber),
      isMocked ? 0 : 200); // Batches of 5 requests per second

    const indexedPairs24hAgo = [];

    pairs24hAgo.forEach((pair) => {
      indexedPairs24hAgo[pair.id] = pair;
    });

    return pairs.map((pair) => {
      const pair24hAgo = indexedPairs24hAgo[pair.id];

      const baseVolume24hAgo = pair24hAgo ? parseToFloat(pair24hAgo.volumeToken0) : 0;
      const baseVolume = parseToFloat(pair.volumeToken0) - baseVolume24hAgo;
      const quoteVolume24hAgo = pair24hAgo ? parseToFloat(pair24hAgo.volumeToken1) : 0;
      const quoteVolume = parseToFloat(pair.volumeToken1) - quoteVolume24hAgo;

      return new Ticker({
        base: pair.token0.symbol,
        baseName: pair.token0.name,
        baseReference: pair.token0.id,
        quote: pair.token1.symbol,
        quoteName: pair.token1.name,
        quoteReference: pair.token1.id,
        close: parseToFloat(pair.token1Price),
        baseVolume,
        quoteVolume,
      });
    });
  }
}

module.exports = Corgiswap;
