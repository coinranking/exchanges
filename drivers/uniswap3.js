const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Uniswap3 extends Driver {
  constructor() {
    super({
      supports: {
        specificMarkets: true,
      },
    });
  }

  /**
   * @param {Array} ids IDs of the pools to retrieve
   * @param {number|null} blockNumber Block number on which the pool data should be based
   * @returns {Promise.Array} Array with the requested pools
   */
  async getPools(ids, blockNumber = null) {
    // By default request the current top 1000 markets with the highest volume.
    const selectQuery = ids ? `where: {id_in: ["${ids.join('", "')}"]}` : 'where: {liquidity_gt: 0 volumeUSD_gt: 0}';
    const blockQuery = blockNumber ? `block: {number: ${blockNumber}}` : '';

    const { data: { bundles, pools } } = await request({
      method: 'POST',
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
      json: {
        query: `
          {
            bundles(first: 1  where:{id: 1}) {
              ethPriceUSD
            }
            pools(first: 1000 ${selectQuery} ${blockQuery} orderBy: volumeUSD orderDirection: desc) {
                id
                token0 {id symbol name derivedETH}
                token1 {id symbol name derivedETH}
                token1Price volumeUSD
            }
          }
        `,
      },
    });

    const ethPriceUsd = parseToFloat(bundles[0].ethPriceUSD);

    return pools.map((pool) => {
      const token0 = {
        ...pool.token0,
        derivedUSD: parseToFloat(pool.token0.derivedETH) * ethPriceUsd,
      };

      const token1 = {
        ...pool.token1,
        derivedUSD: parseToFloat(pool.token1.derivedETH) * ethPriceUsd,
      };

      return {
        ...pool,
        token0,
        token1,
      };
    });
  }

  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @returns {Promise.Number}
   *   Returns a number that should be a blocknumber of
   *   Ethereum that was mined 24 hours ago
   */
  async blockNumber24hAgo(isMocked) {
    const timestampInSeconds = Math.round(Date.now() / 1000);
    const oneDayInSeconds = 24 * 60 * 60;
    let timestampYesterdayInSeconds = timestampInSeconds - oneDayInSeconds;

    if (isMocked) {
      // Dirty fix for testing. The fixture has a timestamp in the query.
      // Because of that the test could not find the fixture.
      timestampYesterdayInSeconds = 1627204350;
    }

    const { data: { blocks } } = await request({
      method: 'POST',
      url: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
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
            number,
            timestamp
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
    const pools = await this.getPools(this.markets);

    // The usd volume is a total volume of the market's existence,
    // so we need to subtract the volume that was reported 24 hours ago.
    const blockNumber = await this.blockNumber24hAgo(isMocked);
    const idsToRetrieve = pools.map((pool) => pool.id);
    const pools24hAgo = await this.getPools(idsToRetrieve, blockNumber);

    const indexedPools24hAgo = [];

    pools24hAgo.forEach((pool) => {
      indexedPools24hAgo[pool.id] = pool;
    });

    return pools.map((pool) => {
      const pool24hAgo = indexedPools24hAgo[pool.id];

      const usdVolume24hAgo = pool24hAgo ? parseToFloat(pool24hAgo.volumeUSD) : 0;
      const usdVolume24h = parseToFloat(pool.volumeUSD) - usdVolume24hAgo;
      if (!usdVolume24h
        || pool.token0.derivedUSD === 0 || pool.token1.derivedUSD === 0) return undefined;

      const baseVolume = usdVolume24h / pool.token0.derivedUSD;
      const quoteVolume = usdVolume24h / pool.token1.derivedUSD;

      return new Ticker({
        base: pool.token0.symbol,
        baseName: pool.token0.name,
        baseReference: pool.token0.id,
        quote: pool.token1.symbol,
        quoteName: pool.token1.name,
        quoteReference: pool.token1.id,
        close: parseToFloat(pool.token1Price),
        baseVolume,
        quoteVolume,
      });
    });
  }
}

module.exports = Uniswap3;
