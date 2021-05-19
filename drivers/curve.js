const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Curve extends Driver {
  constructor() {
    super({
      requires: {
        key: true,
      },
    });
  }

  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    // Get the market pairs
    const { results: markets } = await request(`https://api.blocklytics.org/pools/v1/pairs?platform=Curve&key=${this.key}`);

    // Gat all the tokens so we can add the names to the tickers
    const { data: { tokens } } = await request({
      method: 'POST',
      url: 'https://api.thegraph.com/subgraphs/name/blocklytics/curve',
      json: {
        query: `
        {
          tokens {
            id,
            name,
            symbol
          }
        }
        `,
      },
    });

    const timestampInSeconds = Math.round(Date.now() / 1000);
    const oneDayInSeconds = 24 * 60 * 60;
    let timestamp24hAgoInSeconds = timestampInSeconds - oneDayInSeconds;

    if (isMocked) {
      // Dirty fix for testing. The fixture has a timestamp in the query.
      // Because of that the test could not find the fixture.
      timestamp24hAgoInSeconds = 1600090566;
    }

    const tickers = throttleMap(markets, async (market) => {
      try {
        const baseToken = tokens.find((token) => token.id === market.base.address);
        const quoteToken = tokens.find((token) => token.id === market.quote.address);

        const { data: { swaps } } = await request({
          method: 'POST',
          url: 'https://api.thegraph.com/subgraphs/name/blocklytics/curve',
          json: {
            query: `
            {
              swaps (
                orderBy: timestamp,
                orderDirection: desc,
                first: 1000,
                where: {
                  fromToken: "${baseToken.id}",
                  toToken: "${quoteToken.id}",
                  timestamp_gte: ${timestamp24hAgoInSeconds}
                }
              ) {
                fromTokenAmountDecimal,
                toTokenAmountDecimal,
                underlyingPrice
              }
            }
            `,
          },
        });

        // Send undefined if there where no trades
        if (!swaps.length) return undefined;

        // Get the last swap for the last price
        const [lastSwap] = swaps;
        // Sum all the from token amounts for the base volume
        const baseVolume = swaps
          .reduce((curr, acc) => curr
            + parseToFloat(acc.fromTokenAmountDecimal), 0);

        // Sum all the to token amounts for the quote volume
        const quoteVolume = swaps
          .reduce((curr, acc) => curr
            + parseToFloat(acc.toTokenAmountDecimal), 0);

        return new Ticker({
          base: baseToken.symbol,
          baseName: baseToken.name,
          baseReference: baseToken.id,
          quote: quoteToken.symbol,
          quoteName: quoteToken.name,
          quoteReference: quoteToken.id,
          close: 1 / parseToFloat(lastSwap.underlyingPrice),
          baseVolume,
          quoteVolume,
        });
      } catch (error) {
        return undefined;
      }
    }, isMocked ? 0 : 20); // Do batches of 50 a second

    return Promise.all(tickers);
  }
}

module.exports = Curve;
