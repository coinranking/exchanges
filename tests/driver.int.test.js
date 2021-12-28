const fs = require('fs');
const path = require('path');
const { nock } = require('./helpers/nock');
const { isUndefined, isGreaterThanZero } = require('../lib/utils');
const drivers = require('../drivers');

// Same timeout as Lambda
jest.setTimeout(60 * 1000);

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
    let tickersWithVolume = [];
    let btcTickers = [];

    beforeAll(async () => {
      const rawTickers = await getTickers(driverName);
      // Filter tickers that are undefined
      tickers = rawTickers.filter((ticker) => typeof ticker !== 'undefined');

      tickersWithVolume = tickers
        // Filter tickers that have no close
        .filter((ticker) => isGreaterThanZero(ticker.close))
        // Filter tickers that have no volume
        .filter((ticker) => (
          isGreaterThanZero(ticker.baseVolume)
          || isGreaterThanZero(ticker.quoteVolume)
        ));
      // Filter tickers that have either BTC as base or BTC as quote
      btcTickers = tickersWithVolume.filter((ticker) => (
        ticker.base === 'BTC'
        || ticker.quote === 'BTC'
      ));
    });

    test('Tickers should have base and quote set', () => {
      tickersWithVolume
        .forEach((ticker) => {
          expect(ticker).toHaveProperty('base');
          expect(ticker).toHaveProperty('quote');
        });
    });

    test('Has atleast one valid ticker with volume', () => {
      expect(tickersWithVolume).not.toBe([]);
    });

    test('Ask should be greater than or equal to bid', () => {
      tickersWithVolume
        .filter((ticker) => !isUndefined(ticker.bid) && !isUndefined(ticker.ask))
        .forEach((ticker) => {
          expect(ticker.ask).toBeGreaterThanOrEqual(ticker.bid);
        });
    });

    test('Probably nothing is worth 10x BTC', () => {
      btcTickers.forEach((ticker) => {
        if (ticker.quote === 'BTC') {
          expect(ticker.close).toBeLessThan(10);
        }

        if (ticker.base === 'BTC') {
          expect(ticker.close).toBeGreaterThan(0.1);
        }
      });
    });

    test('Quote volume and base volume are in the correct order', () => {
      const whitelist = ['USD', 'USDT', 'EUR', 'USDC', 'GUSD', 'BTC', 'ETH', 'PAX', 'BUSD', 'TUSD', 'HUSD', 'DAI'];
      tickersWithVolume
        .filter((ticker) => (
          whitelist.includes(ticker.base)
          || whitelist.includes(ticker.quote)
        ))
        // Tickers that have both base and quote volume
        .filter((ticker) => (
          isGreaterThanZero(ticker.baseVolume)
          && isGreaterThanZero(ticker.quoteVolume)
        ))
        .forEach((ticker) => {
          let price = ticker.close;
          if (!isUndefined(ticker.vwap)) {
            price = ticker.vwap;
          }

          // Price close to the 1 fails alot,
          // because a lot of times the open would be oposite of the close.
          if (price > 1.2) {
            expect(ticker.baseVolume).toBeLessThanOrEqual(ticker.quoteVolume);
          }

          if (price < 0.8) {
            expect(ticker.baseVolume).toBeGreaterThanOrEqual(ticker.quoteVolume);
          }
        });
    });

    test('Volume is probably less than 10 billion', () => {
      const whitelist = ['USD', 'USDT', 'EUR', 'USDC', 'GUSD', 'PAX', 'BUSD', 'TUSD', 'HUSD', 'DAI'];
      tickersWithVolume
        .filter((ticker) => (
          whitelist.includes(ticker.base)
          || whitelist.includes(ticker.quote)
        ))
        .forEach((ticker) => {
          const tenBillion = 10000000000;

          if (!isUndefined(ticker.baseVolume)) {
            if (whitelist.includes(ticker.base)) {
              expect(ticker.baseVolume).toBeLessThanOrEqual(tenBillion);
            }

            if (whitelist.includes(ticker.quote)) {
              expect(ticker.baseVolume * ticker.close).toBeLessThanOrEqual(tenBillion);
            }
          }

          if (!isUndefined(ticker.quoteVolume)) {
            if (whitelist.includes(ticker.base)) {
              expect(ticker.quoteVolume / ticker.close).toBeLessThanOrEqual(tenBillion);
            }

            if (whitelist.includes(ticker.quote)) {
              expect(ticker.quoteVolume).toBeLessThanOrEqual(tenBillion);
            }
          }
        });
    });
  });
});
