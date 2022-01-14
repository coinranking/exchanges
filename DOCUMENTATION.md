## Classes

<dl>
<dt><a href="#Driver">Driver</a></dt>
<dd></dd>
<dt><a href="#Ticker">Ticker</a></dt>
<dd></dd>
</dl>

<a name="Driver"></a>

## Driver
**Kind**: global class  

* [Driver](#Driver)
    * [new Driver(config)](#new_Driver_new)
    * _instance_
        * [.key](#Driver+key) ⇒ <code>string</code>
        * [.key](#Driver+key)
        * [.markets](#Driver+markets) ⇒ <code>Array.&lt;string&gt;</code>
        * [.markets](#Driver+markets)
    * _static_
        * [.fetchTickers](#Driver.fetchTickers) ⇒ [<code>Promise.Array.&lt;Ticker&gt;</code>](#Ticker)

<a name="new_Driver_new"></a>

### new Driver(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | An object holding the configuration |
| config.requires | <code>object</code> | An object with settings that a driver requires |
| config.requires.key | <code>boolean</code> | Set to true if the driver requires an API key; default: false |
| config.supports | <code>object</code> | An object with settings that a driver supports |
| config.supports.specificMarkets | <code>boolean</code> | Set to true if the driver supports getting specific markets; default: false |

**Example**  
```js
// An example of a driver with an API key
class ApiKeyDriver extends Driver {
  // Indicate that this driver requires an API key.
  constructor() {
    super({
      requires: {
        key: true,
      },
    });
  }

  async fetchTickers() {
    // The API key can now be accessed through this.key.
    const tickers = await request(`http://api.example.com/tickers?key=${this.key}`);
    return tickers.map((ticker) => {
      const {
        base, quote, close, baseVolume,
      } = ticker;

      return new Ticker({
        base,
        quote,
        close,
        baseVolume,
      });
    });
  }
}

// An example of a driver without an API key
class BasicDriver extends Driver {
  async fetchTickers() {
    // Perform an API request to get the data of the exchange.
    const tickers = await request('http://api.example.com/tickers');

    // Return the data mapped to instances of the Ticker model,
    // the exact way will differ for every exchange.
    return tickers.map((ticker) => {
      const {
        base, quote, close, baseVolume,
      } = ticker;

      return new Ticker({
        base,
        quote,
        close,
        baseVolume,
      });
    });
  }
}
```
<a name="Driver+key"></a>

### driver.key ⇒ <code>string</code>
Get the API key if it is set

**Kind**: instance property of [<code>Driver</code>](#Driver)  
**Returns**: <code>string</code> - API Key  
<a name="Driver+key"></a>

### driver.key
Set the API key

**Kind**: instance property of [<code>Driver</code>](#Driver)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | API Key |

<a name="Driver+markets"></a>

### driver.markets ⇒ <code>Array.&lt;string&gt;</code>
Get the specific markets filter

**Kind**: instance property of [<code>Driver</code>](#Driver)  
**Returns**: <code>Array.&lt;string&gt;</code> - ids An array of market ids  
<a name="Driver+markets"></a>

### driver.markets
Set the specific markets filter

**Kind**: instance property of [<code>Driver</code>](#Driver)  

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>Array.&lt;string&gt;</code> | An array of market ids |

<a name="Driver.fetchTickers"></a>

### Driver.fetchTickers ⇒ [<code>Promise.Array.&lt;Ticker&gt;</code>](#Ticker)
Drivers must include a fetchTickers method.

**Kind**: static namespace of [<code>Driver</code>](#Driver)  
**Returns**: [<code>Promise.Array.&lt;Ticker&gt;</code>](#Ticker) - Returns a promise of an array with tickers.  
<a name="Ticker"></a>

## Ticker
**Kind**: global class  
<a name="new_Ticker_new"></a>

### new Ticker(params)
Ticker class


| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The params |
| params.base | <code>string</code> | Base |
| [params.baseName] | <code>string</code> | The name of the base currency e.g. Ethereum. |
| [params.baseReference] | <code>string</code> | A unique indentifier of the base currency on a particular blockchain. For example: on the Ethereum blockchain this would be the smart contract address, on EOS this would be the token name together with the account name and on Waves this should be the AssetId. e.g. 0x0000000000000000000000000000000000000000. |
| params.quote | <code>string</code> | Quote |
| [params.quoteName] | <code>string</code> | The name of the quote currency e.g. Tether. |
| [params.quoteReference] | <code>string</code> | A unique indentifier of the quote currency on a particular blockchain. For example: on the Ethereum blockchain this would be the smart contract address, on EOS this would be the token name together with the account name and on Waves this should be the AssetId. e.g. 0xdac17f958d2ee523a2206206994597c13d831ec7. |
| [params.open] | <code>number</code> | The price of the market 24 hours ago |
| [params.high] | <code>number</code> | The highest price of the market in the last 24 hours |
| [params.low] | <code>number</code> | The lowest price of the market in the last 24 hours |
| params.close | <code>number</code> | The last price of the market |
| [params.bid] | <code>number</code> | Current highest bid of the market. The bid is the buyer of the base currency and should always be lower than or equal to the ask. |
| [params.ask] | <code>number</code> | Current lowest ask of the market. The ask is the seller of the base currency and should always be higher than or equal to the bid. |
| [params.vwap] | <code>number</code> | Volume weighted Average Price of the last 24 hours |
| [params.baseVolume] | <code>number</code> | The volume traded in the last 24 hours in the base currency. Which is ETH in the ETH_BTC pair for example. Base volume is only optional if quote volume is provided. |
| [params.quoteVolume] | <code>number</code> | The volume traded in the last 24 hours in the quote currency. Which is BTC in the ETH_BTC pair for example. Quote volume is only optional if base volume is provided. |

**Example**  
```js
const ticker = new Ticker({
  base: 'ETH',
  quote: 'BTC',
  baseName: 'Ethereum',
  quoteName: 'Bitcoin',
  open: 0.033633,
  high: 0.033890,
  low: 0.033622,
  close: 0.033721,
  bid: 0.033701,
  ask: 0.033732,
  baseVolume: 488239,
  quoteVolume: 16463.91,
});
```
