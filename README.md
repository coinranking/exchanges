[![code-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=shield)](https://github.com/airbnb/javascript)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=shield)](http://commitizen.github.io/cz-cli/)
[![npm (scoped)](https://img.shields.io/npm/v/@coinranking/exchanges)](https://www.npmjs.com/package/@coinranking/exchanges)
[![codecov](https://img.shields.io/codecov/c/github/coinranking/exchanges/master.svg?style=shield)](https://codecov.io/gh/coinranking/exchanges)

# Exchanges 📉📈

A JavaScript library for getting up to date cryptocurrency exchange tickers.

![](exchange.webp)

## Getting started

1. Node.js 12.13 or higher is required
2. Install using [NPM](https://www.npmjs.com/package/@coinranking/exchanges)

## Installation

Coinranking Exchanges is a [Node.js](https://nodejs.org/) module available through the [npm registry](https://www.npmjs.com/package/@coinranking/exchanges).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 12.13 or higher is required.

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
const exchanges = require('@coinranking/exchanges');

exchanges
  .tickers('binance')
  .then((tickers) => {
    console.log(tickers);
  })
```

## Development

### Getting started

Install dependencies

```shell
npm run install
```

### Usage

List all supported drivers

```shell
npm run list
```

Get the tickers of a specific exchange

```shell
npm run tickers [name of the exchange]
```

## Contributing

Bug reports and pull requests are welcome. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

### Adding an exchange

1. Add a new driver
2. Add a new fixture

Single API calls are highly preferred.
When adding an exchange be aware of the base and quote.
A driver should at least support `base`, `quote`, `close` and `baseVolume` or `quoteVolume`. And optionally `open`, `high`, `low`, `ask`, `bid`, `baseName`, `baseReference`, `quoteName` and `quoteReference`.

### Conventions

1. [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
2. [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)

## Reach out to us

- [Telegram](https://t.me/CoinrankingOfficial)
- [Forum](https://community.coinranking.com/c/developers/20)
- [Twitter](https://twitter.com/coinranking)
- [info@coinranking.com](mailto:info@coinranking.com)

## License

[MIT](LICENSE)
