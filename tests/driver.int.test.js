const fs = require('fs');
const path = require('path');
const { nock, defaultOptions } = require('./helpers/nock.js');
const { isUndefined, isGreaterThanZero } = require('../lib/utils');
const drivers = require('../drivers');

jest.setTimeout(60 * 1000); // Same timeout as Lambda

const driverNames = Object.keys(drivers);
const driversDir = path.join(__dirname, '..', 'drivers');

const getTickers = async (driverName) => {
  const driver = drivers[driverName];

  const { nockDone, context } = await nock.back(
    `${driverName}.json`,
    defaultOptions,
  );

  const isMocked = context.isLoaded || false;

  const tickers = await driver(isMocked);

  nockDone();

  return tickers;
};

test('All drivers are added to the index.js file in alphabetical order', () => {
  const files = fs.readdirSync(driversDir);

  const driverFiles = files
    .filter((file) => file.substr(-3) === '.js')
    .filter((file) => file !== 'index.js')
    .map((file) => file.replace('.js', ''));

  expect(driverNames).toEqual(driverFiles);
});

driverNames.forEach((driverName) => {
  describe(driverName, () => {
    let tickers = [];

    beforeAll(async () => {
      const rawTickers = await getTickers(driverName);
      tickers = rawTickers.filter((ticker) => typeof ticker !== 'undefined');
    });

    test('Has atleast one valid ticker', () => {
      const validatedTickers = tickers
        // Check if  valid
        .map((ticker) => {
          if (!ticker.base || !ticker.quote) {
            return false;
          }

          if (isUndefined(ticker.baseVolume) && isUndefined(ticker.quoteVolume)) {
            return false;
          }

          if (!isGreaterThanZero(ticker.close)) {
            return false;
          }

          return true;
        });

      expect(validatedTickers).toContain(true);
    });

    test('Ask should be greater than or equal to bid', () => {
      tickers
        .filter((ticker) => typeof ticker.bid !== 'undefined' && typeof ticker.ask !== 'undefined')
        .forEach((ticker) => {
          expect(ticker.ask).toBeGreaterThanOrEqual(ticker.bid);
        });
    });
  });
});
