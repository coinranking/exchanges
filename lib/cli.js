const program = require('commander');
const { nock, defaultOptions } = require('../tests/helpers/nock.js');
const exchanges = require('./exchanges');

program
  .command('list')
  .action(async () => {
    console.log(exchanges.list());
  });

program
  .command('tickers <driverName>')
  .option('-R, --record', 'Record the requests, and save them as fixtures')
  .action(async (driverName, options) => {
    let nockDone;
    if (options.record) {
      ({ nockDone } = await nock.back(
        `${driverName}.json`,
        defaultOptions,
      ));
    }

    const tickers = await exchanges.tickers(driverName);

    if (options.record) {
      nockDone();
    }

    console.log(tickers);
  });

program.parse(process.argv);
