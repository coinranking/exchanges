const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Pancakeswap2 extends Driver {
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
    const date = new Date();
    let now = date.toISOString();
    let twentyFourHoursAgo = (new Date(date - (24 * 3600 * 1000))).toISOString();
    const minimumVolumeInUsd = 5000;

    if (isMocked) {
      now = '2022-11-15T14:50:57.756Z';
      twentyFourHoursAgo = '2022-11-14T14:50:57.756Z';
    }

    const result = await request({
      method: 'POST',
      url: 'https://graphql.bitquery.io',
      headers: {
        'X-API-KEY': this.key,
      },
      json: {
        query: `
          query fetchTickers($twentyFourHoursAgo: ISO8601DateTime, $now: ISO8601DateTime) {
            exchange: ethereum(network: bsc) {
              tickers: dexTrades(
                exchangeName: {in: ["Pancake v2"]}
                tradeAmountUsd: {gt: ${minimumVolumeInUsd}}
                time: {since: $twentyFourHoursAgo, till: $now}
              ) {
                baseCurrency {
                  symbol
                  address
                  name
                }
                quoteCurrency {
                  symbol
                  address
                  name
                }
                baseVolume: baseAmount
                quoteVolume: quoteAmount
                open: minimum(of: time, get: quote_price)
                high: maximum(of: quote_price, get: quote_price)
                low: minimum(of: quote_price, get: quote_price)
                close: maximum(of: time, get: quote_price)
              }
            }
          }
        `,
        variables: {
          now,
          twentyFourHoursAgo,
        },
      },
    });

    const tickers = result.data.exchange.tickers.map((ticker) => ({
      base: ticker.baseCurrency.symbol,
      baseName: ticker.baseCurrency.name,
      baseReference: ticker.baseCurrency.address,
      quote: ticker.quoteCurrency.symbol,
      quoteName: ticker.quoteCurrency.name,
      quoteReference: ticker.quoteCurrency.address,
      baseVolume: parseToFloat(ticker.baseVolume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.close),
    }));

    return tickers;
  }
}

module.exports = Pancakeswap2;
