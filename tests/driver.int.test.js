const { nock, defaultOptions } = require('./helpers/nock.js');
const drivers = require('../drivers');

jest.setTimeout(60 * 1000); // Same timeout as Lambda

const driverNames = Object.keys(drivers);

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
