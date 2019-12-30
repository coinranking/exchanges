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

describe('Drivers', () => {
  driverNames.forEach((driverName) => {
    test(`${driverName} has atleast one valid ticker`, async () => {
      const tickers = await getTickers(driverName);
      const validatedTickers = tickers
        .filter((ticker) => typeof ticker !== 'undefined')
        .map((ticker) => ticker.isValid());

      expect(validatedTickers).toContain(true);
    });
  });
});
