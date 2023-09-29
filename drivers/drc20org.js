const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleFlatMap, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Drc20org extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const response = await request('https://marketplace-api.dogeord.io/drc20/list?offset=0&limit=20');
    let { list: rawTickers } = response;
    const { total } = response;

    const maxPages = 20;
    const pages = Math.min(Math.ceil(total / 20), maxPages);
    const pageNumbers = Array.from(Array(pages).keys()).slice(1);
    const pageTickers = await throttleFlatMap(pageNumbers, async (pageNumber) => {
      const pageResponse = await request(`https://marketplace-api.dogeord.io/drc20/list?offset=${pageNumber * 20}&limit=20`);
      return pageResponse.list || [];
    }, isMocked ? 0 : 200); // 5 a second
    rawTickers = rawTickers.concat(pageTickers);

    // Filter tickers that have no volume, so we don't have to fetch all details
    rawTickers = rawTickers.filter((ticker) => ticker.twentyFourHourVolume > 0);

    const tickers = throttleMap(rawTickers, async (ticker) => {
      const base = ticker.tick;
      const quote = 'DOGE';

      const baseDetailResponse = await request(`https://d20-api2.dogeord.io/ticks/list/verified/?filterByTick=${base}`);
      const baseDetail = baseDetailResponse.data.length ? baseDetailResponse.data[0] : {};

      return new Ticker({
        base,
        baseReference: baseDetail.deploymentShibescription,
        quote,
        quoteVolume: parseToFloat(ticker.twentyFourHourVolume / 100000000),
        open: parseToFloat(ticker.firstPrice / 100000000),
        close: parseToFloat(ticker.lastPrice / 100000000),
      });
    }, isMocked ? 0 : 200); // 5 a second

    return Promise.all(tickers);
  }
}

module.exports = Drc20org;
