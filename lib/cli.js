const program = require('commander');
const { nock, defaultOptions } = require('../tests/helpers/nock');
const exchanges = require('./exchanges');

program
  .command('list')
  .action(async () => {
    console.log(exchanges.list());
  });

program
  .command('tickers <driverName>')
  .option('-R, --record', 'Record the requests, and save them as fixtures')
  .option('-m, --market [markets...]', 'Filter on specific markets. Pass an id or multiple ids to only get those markets')
  .option('-k, --key <type>', 'APIkey when required')
  .action(async (driverName, options) => {
    let nockDone;
    if (options.record) {
      ({ nockDone } = await nock.back(
        `${driverName}.json`.toLowerCase(),
        defaultOptions(options.key),
      ));
    }

    const driver = new exchanges[driverName]();

    if (options.key) {
      driver.key = options.key;
    }

    if (options.market) {
      driver.markets = options.market;
    }

    const tickers = await driver.fetchTickers();

    if (options.record) {
      nockDone();
    }

    console.log(tickers);
  });

program.parse(process.argv);
