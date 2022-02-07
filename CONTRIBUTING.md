# Contributing

Bug reports and pull requests are welcome. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

## Adding an exchange

1. Add a new driver
2. Add a new fixture

Single API calls are highly preferred.
When adding an exchange be aware of the base and quote.
A driver should at least support `base`, `quote`, `close` and `baseVolume` or `quoteVolume`. And optionally `open`, `high`, `low`, `ask`, `bid`, `baseName`, `baseReference`, `quoteName` and `quoteReference`.

### Listing requirements

Note that all exchanges will be reviewed by our team to see if it meets our standards before we merge a pull request. We'll evaluate several aspects, including trading volume, web and social presence, traffic, and reviews.
(Spot trading and trading activity are required; futures and derivatives are not supported yet.)

Please send your listing request to [info@coinranking.com](mailto:info@coinranking.com), and include your daily trading volume and a link to your platform. We will then review your exchange ASAP.

## Conventions

1. [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
2. [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
