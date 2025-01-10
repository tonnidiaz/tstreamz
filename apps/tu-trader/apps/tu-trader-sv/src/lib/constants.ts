import { dev } from "$app/environment";
import {
    binanceInstrus,
    bitgetInstrus,
    bybitInstrus,
    gateioInstrus,
    kucoinInstrus,
    mexcInstrus,
    okxInstrus,
} from "@pkg/cmn/utils/data/instrus";
import { Socket, io } from "socket.io-client";

export const SITE = "TuTrader";
const __DEV__ = dev;

export { __DEV__ };

export const pagesWithLayout: string[] = [
    "/auth/login",
    "/auth/logout",
    "/auth/signup",
];

const useBybit = true;

export let symbols: string[][] = [];

const use_bybit = false,
    use_bitget = false,
    use_binance = false,
    use_okx = false,
    use_gateio = false,
    use_mexc = false,
    use_kucoin = true;

export const alphabets = ["A", "B", "C"];
const populateSymbols = () => {
    if (use_okx)
        for (let el of okxInstrus) {
            if (el.instType == "SPOT" && el.state == "live") {
                symbols.push([el.baseCcy, el.quoteCcy]);
            }
        }

    if (use_bybit)
        for (let el of bybitInstrus) {
            symbols.push([el.baseCoin, el.quoteCoin]);
        }

    if (use_binance)
        for (let el of binanceInstrus) {
            if (el.isSpotTradingAllowed && el.status == "TRADING")
                symbols.push([el.baseAsset, el.quoteAsset]);
        }

    if (use_gateio)
        for (let el of gateioInstrus) {
            if (el.trade_status == "tradable")
                symbols.push([el.base, el.quote]);
        }

    if (use_bitget)
        for (let el of bitgetInstrus) {
            if (el.status == "online")
                symbols.push([el.baseCoin, el.quoteCoin]);
        }
    if (use_kucoin)
        for (let el of kucoinInstrus) {
            if (el.enableTrading)
                symbols.push([el.baseCurrency, el.quoteCurrency]);
        }

    if (use_mexc)
        for (let el of mexcInstrus) {
            if (
                el.isSpotTradingAllowed &&
                el.status == "1" &&
                el.isSpotTradingAllowed
            )
                symbols.push([el.baseAsset, el.quoteAsset]);
        }
    symbols = Array.from(new Set(symbols.map((el) => el.join("-")))).map((el) =>
        el.split("-")
    );
};

populateSymbols();

export const intervals = [1, 2, 3, 5, 15, 30, 60, 120];
export const selectIntervals = intervals.map((e) => ({
    label: `${e}m`,
    value: e,
}));

export const selectSymbols = symbols.sort().map((e) => ({
    label: e.join("/"),
    value: e.toString(),
}));

export let socket: Socket | null = null;
export const setSocket = (val: Socket) => (socket = val);

export const selectPlatforms = (lst: string[]) =>
    lst.map((el, i) => ({ label: el.toUpperCase(), value: el.toLowerCase() }));
export const selectParents = (p: string[]) =>
    p.map((e) => ({ label: e.toUpperCase(), value: e.toLowerCase() }));

export const botTypes = ["normal", "arbitrage"];
export const arbitTypes = ["tri", "cross"];

export const ROOT = __DEV__
    ? "http://localhost:3000"
    : "https://tu-trader.vercel.app";
const heroku = false,
    koyeb = true;
export const BEND_URL = __DEV__
    ? "http://localhost:8000"
    : "https://tu-trader.koyeb.app";
export const API_URL = "/api";


export const SITE_SLOGAN = "A Tunedbass site";
