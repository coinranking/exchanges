const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Compound extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const tickersPromise = request('https://api.compound.finance/api/v2/ctoken');

    const timestampInSeconds = Math.round(Date.now() / 1000);
    const oneDayInSeconds = 24 * 60 * 60;
    let timestamp24hAgoInSeconds = timestampInSeconds - oneDayInSeconds;

    if (isMocked) {
      // Dirty fix for testing. The fixture has a timestamp in the query.
      // Because of that the test could not find the fixture.
      timestamp24hAgoInSeconds = 1620755693;
    }

    const previousTickersPromise = request(`https://api.compound.finance/api/v2/ctoken?block_timestamp=${timestamp24hAgoInSeconds}`);

    const [{ cToken: tickers }, { cToken: previousTickers }] = await Promise.all([
      tickersPromise,
      previousTickersPromise,
    ]);

    const indexedPreviousTickers = [];
    previousTickers.forEach((ticker) => {
      indexedPreviousTickers[`${ticker.symbol}_${ticker.underlying_symbol}`] = ticker;
    });

    return tickers.map((ticker) => {
      const previousTicker = indexedPreviousTickers[`${ticker.symbol}_${ticker.underlying_symbol}`];
      const previousVolume = previousTicker ? parseToFloat(previousTicker.total_supply.value) : 0;

      return new Ticker({
        base: ticker.symbol,
        baseName: ticker.name,
        baseReference: ticker.token_address,
        quote: ticker.underlying_symbol,
        quoteName: ticker.underlying_name,
        quoteReference: ticker.underlying_address,
        close: parseToFloat(ticker.exchange_rate.value),
        baseVolume: Math.abs(parseToFloat(ticker.total_supply.value) - previousVolume),
      });
    });
  }
}

module.exports = Compound;
