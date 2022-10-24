[![code-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=shield)](https://github.com/airbnb/javascript)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=shield)](http://commitizen.github.io/cz-cli/)
[![npm (scoped)](https://img.shields.io/npm/v/@coinranking/exchanges)](https://www.npmjs.com/package/@coinranking/exchanges)
[![codecov](https://img.shields.io/codecov/c/github/coinranking/exchanges/master.svg?style=shield)](https://codecov.io/gh/coinranking/exchanges)

# Exchanges 📉📈

A JavaScript library for getting up to date cryptocurrency exchange tickers.

![](exchange.webp)

## Getting started

1. Node.js 14.0 or higher is required
2. Install using [NPM](https://www.npmjs.com/package/@coinranking/exchanges)

## Installation

Coinranking Exchanges is a [Node.js](https://nodejs.org/) module available through the [npm registry](https://www.npmjs.com/package/@coinranking/exchanges).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 14.0 or higher is required.

Installation is done using the npm install command:

```shell
npm i @coinranking/exchanges
```

## Usage

List all supported drivers

```JavaScript
const exchanges = require('@coinranking/exchanges');

console.log(exchanges.list());
```

Get the tickers of a specific exchange

```JavaScript
const { Binance } = require('@coinranking/exchanges');

const driver = new Binance();

driver
  .fetchTickers()
  .then((tickers) => {
    console.log(tickers);
  });
```

## Development

### Getting started

Install dependencies

```shell
npm install
```

### Usage

#### List all supported drivers

```shell
node lib/cli.js list
```

#### Get the tickers of a specific exchange

```shell
node lib/cli.js tickers [name of the exchange]
```

##### Flags

| Name      | Flag                    | Description
| ----------| ------------------------| ---
| Record    | `-R`, `--record`        | Record the requests, and save them as fixtures.
| API Key   | `-k`, `--key`           | For passing down an API key when the driver requires one. When used in combination with the `-R` flag the key will be masked in the fixtures.

### Documentation

See the [documentation](DOCUMENTATION.md) for more information.

## Contributing

Bug reports and pull requests are welcome. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

### Adding an exchange

1. Add a new driver (see the [examples](#examples))
2. Add the driver alphabetically to drivers/index.js
3. Add a new fixture (use the record option of the CLI 'tickers' command)

Single API calls are highly preferred.
When adding an exchange be aware of the base and quote.
A driver should at least support `base`, `quote`, `close` and `baseVolume` or `quoteVolume`. And optionally `open`, `high`, `low`, `ask`, `bid`, `baseName`, `baseReference`, `quoteName` and `quoteReference`.

### Listing requirements

Before we approve your pull request, we’d like to review the exchange and check if it meets our [listing requirements](https://support.coinranking.com/article/71-what-are-the-requirements-for-listing-an-exchange).

Ticking off all the boxes? Cool! Send us your listing request at [info@coinranking.com](mailto:info@coinranking.com) and include your daily trading volume + a link to your platform. We will then review your exchange ASAP.

### Examples
- [Driver basis:](examples/basicdriver.js) Shows the basic setup of a driver, which can be used as the starting point
for new ones.
- [Driver with API key:](examples/apikeydriver.js) Shows how to set up a driver that uses an API which requires a key.

### Conventions

1. [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
2. [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)

## Links

### Reach out to us

- [Telegram](https://t.me/CoinrankingOfficial)
- [Forum](https://community.coinranking.com/c/developers/20)
- [Twitter](https://twitter.com/coinranking)
- [info@coinranking.com](mailto:info@coinranking.com)

### Other

- [Coinranking API](https://coinranking.com/page/cryptocurrency-api)
- [API docs](https://docs.coinranking.com/)
- [Supplies library](https://github.com/coinranking/supplies)


## License

[MIT](LICENSE)
