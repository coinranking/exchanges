const exchanges = require('./exchanges');

const list = () => {
  console.log(exchanges.list());
};

const tickers = async () => {
  const driver = process.argv.pop();
  console.log(await exchanges.tickers(driver));
};

module.exports = {
  list,
  tickers,
};
