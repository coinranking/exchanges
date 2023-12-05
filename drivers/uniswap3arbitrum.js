const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Uniswap3arbitrum extends Driver {
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
    const network = 'arbitrum';
    const protocol = 'uniswap_v3';

    if (isMocked) {
      now = '2022-11-18T08:54:31.046Z';
      twentyFourHoursAgo = '2022-11-17T08:54:31.046Z';
    }

    const result = await request({
      method: 'POST',
      url: 'https://streaming.bitquery.io/graphql',
      headers: {
        'X-API-KEY': this.key,
      },
      json: {
        query: `
          query fetchTickers(
            $network: evm_network,
            $twentyFourHoursAgo: DateTime,
            $now: DateTime,
            $protocol: String
          ) {
            EVM(dataset: archive, network: $network) {
              DEXTrades(
                orderBy: {descending: Block_Time}
                where: {
                  Block: {
                    Time: {
                      since: $twentyFourHoursAgo,
                      till: $now
                    }
                  },
                  Trade: {
                    Dex: {
                      ProtocolName: {
                        is: $protocol
                      }
                    }
                  }
                }
              ) {
                Trade {
                  Dex {
                    OwnerAddress
                    SmartContract
                    Pair {
                      SmartContract
                    }
                  }
                  Buy {
                    Currency {
                      SmartContract
                      Symbol
                      Name
                      ProtocolName
                    }
                    Open: Price(minimum: Block_Number)
                    High: Price(maximum: Trade_Buy_Price)
                    Low: Price(minimum: Trade_Buy_Price)
                    Close: Price(maximum: Block_Number)
                    baseVolume: Amount
                  }
                  Sell {
                    Currency {
                      SmartContract
                      Symbol
                      Name
                      ProtocolName
                    }
                    quoteVolume: Amount
                  }
                }
              }
            }
          }
        `,
        variables: {
          now,
          twentyFourHoursAgo,
          network,
          protocol,
        },
      },
    });

    const tickers = result.data.EVM.DEXTrades.map((ticker) => ({
      base: ticker.Trade.Buy.Currency.Symbol,
      baseName: ticker.Trade.Buy.Currency.Name,
      baseReference: ticker.Trade.Buy.Currency.SmartContract,
      quote: ticker.Trade.Sell.Currency.Symbol,
      quoteName: ticker.Trade.Sell.Currency.Name,
      quoteReference: ticker.Trade.Sell.Currency.SmartContract,
      baseVolume: parseToFloat(ticker.Trade.Buy.baseVolume),
      quoteVolume: parseToFloat(ticker.Trade.Sell.quoteVolume),
      open: parseToFloat(ticker.Trade.Buy.Open),
      high: parseToFloat(ticker.Trade.Buy.High),
      low: parseToFloat(ticker.Trade.Buy.Low),
      close: parseToFloat(ticker.Trade.Buy.Close),
    }));

    return tickers;
  }
}

module.exports = Uniswap3arbitrum;
