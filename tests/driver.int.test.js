const fs = require('fs');
const path = require('path');
const { nock } = require('./helpers/nock.js');
const { isUndefined, isGreaterThanZero } = require('../lib/utils');
const drivers = require('../drivers');

jest.setTimeout(60 * 1000); // Same timeout as Lambda

// Disable all network requests.
// All requests should be mocked at this point.
nock.back.setMode('lockdown');

const driverNames = Object.keys(drivers);
const driversDir = path.join(__dirname, '..', 'drivers');

const getTickers = async (driverName) => {
  const driver = new drivers[driverName]();

  // Set a key to avoid an error from being thrown while testing
  if (driver.requires.key) {
    driver.key = 'maskedSecret';
  }

  await nock.back(`${driverName}.json`.toLowerCase());

  return driver.fetchTickers(true);
};

test('All drivers are added to the index.js file in alphabetical order', () => {
  const files = fs.readdirSync(driversDir);

  const driverFiles = files
    .filter((file) => file.substr(-3) === '.js')
    .filter((file) => file !== 'index.js')
    .map((file) => file.replace('_', ''))
    .map((file) => file.charAt(0).toUpperCase() + file.slice(1))
    .map((file) => file.replace('.js', ''))
    .sort();

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
      let valid = false;
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

          valid = true;
          return true;
        });

      if (!valid) {
        console.log(`${driverName} is not valid`);
        tickers
        // Check if  valid
          .map((ticker) => {
            if (!ticker.base || !ticker.quote) {
              console.log('base and quote is not defined');
              return false;
            }

            if (isUndefined(ticker.baseVolume) && isUndefined(ticker.quoteVolume)) {
              console.log('base and quote volume is not defined');
              return false;
            }

            if (!isGreaterThanZero(ticker.close)) {
              console.log('price is not greater then 0');
              return false;
            }

            return true;
          });
      }

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
