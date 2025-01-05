
const instru = {
    "symbol": "ETHBTC",
    "status": "TRADING",
    "baseAsset": "ETH",
    "baseAssetPrecision": 8,
    "quoteAsset": "BTC",
    "quotePrecision": 8,
    "quoteAssetPrecision": 8,
    "baseCommissionPrecision": 8,
    "quoteCommissionPrecision": 8,
    "orderTypes": [
        "LIMIT",
        "LIMIT_MAKER",
        "MARKET",
        "STOP_LOSS",
        "STOP_LOSS_LIMIT",
        "TAKE_PROFIT",
        "TAKE_PROFIT_LIMIT"
    ],
    "icebergAllowed": true,
    "ocoAllowed": true,
    "otoAllowed": true,
    "quoteOrderQtyMarketAllowed": true,
    "allowTrailingStop": true,
    "cancelReplaceAllowed": true,
    "isSpotTradingAllowed": true,
    "isMarginTradingAllowed": true,
    "filters": [
        {
            "filterType": "PRICE_FILTER",
            "minPrice": "0.00001000",
            "maxPrice": "922327.00000000",
            "tickSize": "0.00001000"
        },
        {
            "filterType": "LOT_SIZE",
            "minQty": "0.00010000",
            "maxQty": "100000.00000000",
            "stepSize": "0.00010000"
        },
        {
            "filterType": "ICEBERG_PARTS",
            "limit": 10
        },
        {
            "filterType": "MARKET_LOT_SIZE",
            "minQty": "0.00000000",
            "maxQty": "2264.38593305",
            "stepSize": "0.00000000"
        },
        {
            "filterType": "TRAILING_DELTA",
            "minTrailingAboveDelta": 10,
            "maxTrailingAboveDelta": 2000,
            "minTrailingBelowDelta": 10,
            "maxTrailingBelowDelta": 2000
        },
        {
            "filterType": "PERCENT_PRICE_BY_SIDE",
            "bidMultiplierUp": "5",
            "bidMultiplierDown": "0.2",
            "askMultiplierUp": "5",
            "askMultiplierDown": "0.2",
            "avgPriceMins": 5
        },
        {
            "filterType": "NOTIONAL",
            "minNotional": "0.00010000",
            "applyMinToMarket": true,
            "maxNotional": "9000000.00000000",
            "applyMaxToMarket": false,
            "avgPriceMins": 5
        },
        {
            "filterType": "MAX_NUM_ORDERS",
            "maxNumOrders": 200
        },
        {
            "filterType": "MAX_NUM_ALGO_ORDERS",
            "maxNumAlgoOrders": 5
        }
    ],
    "permissions": [],
    "permissionSets": [],
    "defaultSelfTradePreventionMode": "EXPIRE_MAKER",
    "allowedSelfTradePreventionModes": [
        "EXPIRE_TAKER",
        "EXPIRE_MAKER",
        "EXPIRE_BOTH"
    ]
}

type Instru = typeof instru

import instrus from "./binance-instrus.json"
export const binanceInstrus: Instru[] =  instrus as any
