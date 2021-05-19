const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Sushiswap extends Driver {
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
      timestampYesterdayInSeconds = 1600085471;
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
    // Request the current top 200 markets with the highest volume.
    // The base and quote volume is a total volume of the markets existance,
    // so we need to subtract the volume that was reported 24 hours ago.
    const { data: { pairs } } = await request({
      method: 'POST',
      url: 'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork',
      json: {
        query: `
        {
          pairs(
            first: 200,
            orderBy: volumeUSD,
            orderDirection: desc
          ) {
            id,
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
            close: token1Price,
            baseVolume: volumeToken0,
            quoteVolume: volumeToken1
          }
        }
        `,
      },
    });

    const blockNumber = await this.blockNumber24hAgo(isMocked);

    const tickers = throttleMap(pairs, async (pair) => {
      try {
        // Fetch the market again, but then with the data 24 hour ago and subtract
        // this from the current data to get the 24 hour moving average.
        // We don't batch this because it would not return all data.
        const { data: { pair: volume24hAgo } } = await request({
          method: 'POST',
          url: 'https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork',
          json: {
            query: `
            {
              pair(
                id: "${pair.id}",
                block: { number: ${blockNumber} }
              ) {
                baseVolume: volumeToken0,
                quoteVolume: volumeToken1
              }
            }
            `,
          },
        });

        // Return undefined if the market didn't exist 24 hours ago
        if (!volume24hAgo) return undefined;

        return new Ticker({
          base: pair.base.symbol,
          baseName: pair.base.name,
          baseReference: pair.base.id,
          quote: pair.quote.symbol,
          quoteName: pair.quote.name,
          quoteReference: pair.quote.id,
          close: parseToFloat(pair.close),
          baseVolume: parseToFloat(pair.baseVolume) - parseToFloat(volume24hAgo.baseVolume),
          quoteVolume: parseToFloat(pair.quoteVolume) - parseToFloat(volume24hAgo.quoteVolume),
        });
      } catch (error) {
        return undefined;
      }
    }, isMocked ? 0 : 20); // Do batches of 50 a second

    return Promise.all(tickers);
  }
}

module.exports = Sushiswap;
