const drivers = require('../drivers');

// Driver names are lower cased to maintain backwards compatibility.
const list = () => Object.keys(drivers).map((driverName) => driverName.toLowerCase());

const tickers = (driverName) => {
  // The first letter of the driver name is upper cased to maintain backwards compatibility.
  driverName = driverName.charAt(0).toUpperCase() + driverName.slice(1);

  if (typeof drivers[driverName] === 'undefined') {
    throw new Error('Exchange is not yet supported');
  }

  const driver = new drivers[driverName]();
  return driver.fetchTickers();
};

module.exports = {
  list,
  tickers,
  ...drivers,
};
