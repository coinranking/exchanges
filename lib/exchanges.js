const drivers = require('../drivers');

const list = () => Object.keys(drivers);

const tickers = (driver) => {
  if (typeof drivers[driver] === 'undefined') {
    throw new Error('Exchange is not yet supported');
  }
  return drivers[driver]();
};

module.exports = {
  list,
  tickers,
};
