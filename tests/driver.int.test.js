const fs = require('fs');
const path = require('path');
const { nock, defaultOptions } = require('./helpers/nock.js');
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
      tickers = await getTickers(driverName);
    });

    test('Has atleast one valid ticker', () => {
      const validatedTickers = tickers
        .filter((ticker) => typeof ticker !== 'undefined')
        .map((ticker) => ticker.isValid());

      expect(validatedTickers).toContain(true);
    });

    test('Ask should be greater than or equal to bid', () => {
      tickers
        .filter((ticker) => typeof ticker !== 'undefined')
        .filter((ticker) => typeof ticker.bid !== 'undefined' && typeof ticker.ask !== 'undefined')
        .forEach((ticker) => {
          if (typeof ticker.bid !== 'undefined'
           && typeof ticker.ask !== 'undefined') {
            expect(ticker.ask).toBeGreaterThanOrEqual(ticker.bid);
          }
        });
    });
  });
});
