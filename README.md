[![code-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=shield)](https://github.com/airbnb/javascript)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=shield)](http://commitizen.github.io/cz-cli/)
[![npm (scoped)](https://img.shields.io/npm/v/@coinranking/exchanges)](https://www.npmjs.com/package/@coinranking/exchanges)

# Exchanges 📉📈

A Javascript library for getting up to date cryptocurrency exchange tickers.

![](exchange.webp)

## Getting started

1. Node.js 12.13 or higher is required

## Installation

Coinranking Exchanges is a [Node.js](https://nodejs.org/) module.

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 12.13 or higher is required.

## Usage

List all supported drivers

```Javascript
const exchanges = require('exchanges');

console.log(exchanges.list());
```

Get the tickers of a specific exchange

```Javascript
const exchanges = require('exchanges');

exchanges
  .tickers('binance')
  .then((tickers) => {
    console.log(tickers);
  })
```

## Development

### Getting started

Install dependencies

    $ npm run install

### Usage

List all supported drivers

    $ npm run list

Get the tickers of a specific exchange

    $ npm run tickers [name of the exchange]

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

## License

[MIT](LICENSE)
