const program = require('commander');

const exchanges = require('./exchanges');

program
  .command('list')
  .action(async () => {
    console.log(exchanges.list());
  });

program
  .command('tickers <driver>')
  .action(async (driver) => {
    console.log(await exchanges.tickers(driver));
  });

program.parse(process.argv);
