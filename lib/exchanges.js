const drivers = require('../drivers');

const list = () => Object.keys(drivers);

module.exports = {
  list,
  ...drivers,
};
