module.exports = class Exchange {
  constructor(
    id,
    createdAt,
    updatedAt,
    active,
    coinrankingToken,
    exchangeToken,
    name,
    driver,
    markets,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.active = active;
    this.coinrankingToken = coinrankingToken;
    this.exchangeToken = exchangeToken;
    this.name = name;
    this.driver = driver;
    this.markets = markets;
  }
};
