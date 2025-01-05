import { MAKER_FEE_RATE, TAKER_FEE_RATE } from "@pkg/cmn/utils/constants";
import { getInterval } from "@pkg/cmn/utils/funcs2";
import { botLog, readJson, writeJson, ensureDirExists } from "@pkg/cmn/utils/bend/functions";
import {  getSymbol, } from "@pkg/cmn/utils/functions";
import crypto from "crypto";

import { writeFileSync } from "node:fs";
import {
    RestClientV5,
    KlineIntervalV3,
    APIResponseV3WithTime,
    CategorySymbolListV5,
    OHLCVKlineV5,
    CoinInfoV5,
} from "bybit-api";
import { Candle, RestClient, Trade } from "okx-api";
import dotenv from "dotenv";
import { ICoinNets, IOrderbook, ITrade, TPlatName } from "@pkg/cmn/utils/interfaces";
import { existsSync } from "node:fs";
import { netsRootDir } from "@pkg/cmn/utils/consts2";
import { safeJsonParse } from "@pkg/cmn/utils/funcs3";
import { handleErrs, parseDate, sleep } from "@cmn/utils/funcs";

dotenv.config();

export class TestPlatform {
    name: TPlatName;
    maker: number = MAKER_FEE_RATE;
    taker: number = TAKER_FEE_RATE;
    tickersPath: string;
    netsPath: string;

    demo: boolean;

    constructor({ demo = false, name }: { demo?: boolean; name?: TPlatName }) {
        this.demo = demo;
        this.name = name ?? "binance";
        this.netsPath = `${netsRootDir}/${this.name}/nets.json`;
        this.tickersPath = `${netsRootDir}/${this.name}/tickers.json`;
    }
    async getTicker(pair: string[]): Promise<number> {
        this._log("GETTING TICKER FOR", pair);
        return 0;
    }
    async getBook(
        pair: string[]
    ): Promise<IOrderbook  | null | undefined> {
        this._log("GETTING BOOK FOR", pair);
        return
    }
    async getNets(
        coin?: string,
        offline?: boolean
    ): Promise<ICoinNets[]  | null | undefined> {
       return this._log("GETTING NETS FOR", coin ?? "ALL", {dir: this.netsPath});
    }
    async getKlines({
        start,
        end,
        savePath,
        interval,
        symbol,
    }: {
        end?: number;
        start?: number;
        interval: number;
        symbol: string;
        savePath?: string;
    }): Promise<any[] | undefined > {
        console.log(
            `[${this.constructor.name}] GETTING KLINES FOR`,
            { symbol, interval },
            "\n"
        );
        return;
    }
    _log(...args) {
        console.log(`[${this.constructor.name}]`, ...args, "\n");
        return undefined
    }

    _err(err: any){
        this._log(handleErrs(err))
        return undefined
    }
    async getTrades({
        start,
        end,
        savePath,
        symbol,
    }: {
        end?: number;
        start?: number;
        symbol: string;
        savePath?: string;
    }): Promise<ITrade[] | undefined> {
        console.log(`\nGETTING TRADES FOR ${symbol}...\n`);
        if (savePath) {
            ensureDirExists(savePath);
        }
        return;
    }

    _getSymbo(pair: string[]) {
        return getSymbol(pair, this.name);
    }
}

export class TestOKX extends TestPlatform {
    maker: number = 0.08 / 100;
    taker: number = 0.1 / 100;
    client: RestClient;
    flag: "1" | "0";
    apiKey: string;
    apiSecret: string;
    passphrase: string;

    constructor({ demo = false }: { demo?: boolean }) {
        super({ demo, name: "okx" });
        this.flag = demo ? "1" : "0";
        this.apiKey = demo
            ? process.env.OKX_API_KEY_DEMO!
            : process.env.OKX_API_KEY!;
        this.apiSecret = demo
            ? process.env.OKX_API_SECRET_DEMO!
            : process.env.OKX_API_SECRET!;
        this.passphrase = process.env.OKX_PASSPHRASE!;
        this.client = new RestClient(
            {
                apiKey: this.apiKey,
                apiSecret: this.apiSecret,
                apiPass: this.passphrase,
            },
            demo ? "demo" : "prod"
        );
    }

    async getKlines({
        start,
        end,
        savePath,
        interval,
        symbol,
        isBybit,
    }: {
        end?: number | undefined;
        start?: number | undefined;
        interval: number;
        symbol: string;
        savePath?: string | undefined;
        isBybit?: boolean;
    }) {
        try {
            const bybit_apiKey = this.demo
                ? process.env.BYBIT_API_KEY_DEMO!
                : process.env.BYBIT_API_KEY!;
            const bybit_apiSecret = this.demo
                ? process.env.BYBIT_API_SECRET_DEMO!
                : process.env.BYBIT_API_SECRET!;
            const bybit_passphrase = process.env.BYBIT_PASSPHRASE!;
            const client = new RestClientV5({
                demoTrading: this.demo,
                testnet: this.demo,
                key: bybit_apiKey,
                secret: bybit_apiSecret,
            });
            console.log({ client: "client", demo: this.demo }, "\n");
            end = end ?? Date.now();
            let klines: any[] = [];
            let cnt = 0;
            console.log(
                `[ ${
                    isBybit ? "ByBit" : this.name
                } ] \t GETTING KLINES.. FOR ` + symbol
            );

            if (start) {
                start =
                    (isBybit ? start : start) /* - interval * 60 * 1000 */ -
                    20 * interval * 60000; /* ACCORDING TO RETURNED DATA */
            }

            if (start) {
                //2024-04-23 05:50:00+02:00
                let firstTs = start;
                if (savePath && existsSync(savePath)) {
                    // const savedKlines = await readJson(savePath)
                    // if (savedKlines?.length){
                    //     const lastSaved = savedKlines[savedKlines.length - 1]
                    //     const lastTsMs = Number(lastSaved[0])
                    //     const lastTs = parseDate(lastTsMs)
                    //     console.log({lastTs})
                    //     firstTs = lastTsMs//Math.max(start, lastTsMs)
                    // }
                }

                while (firstTs <= end) {
                    const limit = isBybit ? 1000 : 100;
                    console.log(`GETTING ${cnt + 1} KLINES LIMIT: ${limit}`);
                    const after = firstTs + (limit - 1) * interval * 60 * 1000;
                    console.log(
                        `Before: ${parseDate(
                            new Date(firstTs)
                        )} \t After: ${parseDate(new Date(after))}`
                    );
                    console.log("GETTING MARK PRICE");
                    const res = isBybit
                        ? await client.getKline({
                              category: "spot",
                              symbol,
                              interval: interval as any,
                              start: firstTs + interval * 60 * 1000,
                              limit,
                          })
                        : await this.client.getHistoricCandles(
                              symbol,
                              getInterval(interval, "okx"),
                              {
                                  before: `${firstTs}`,
                                  after: `${after}`,
                                  limit: `${limit}`,
                              }
                          );
                    const data = isBybit
                        ? (res as any).result.list
                        : (res as Candle[]);
                    if (!data?.length) break;
                    klines.push(...[...data].reverse());

                    firstTs = Number(data[0][0]);
                    console.log({
                        last_kline: parseDate(
                            new Date(Number(klines[klines.length - 1][0]))
                        ),
                        first_ts: parseDate(new Date(firstTs)),
                    });
                    if (savePath) {
                        ensureDirExists(savePath);
                        writeFileSync(savePath, JSON.stringify(klines));
                        console.log("Saved");
                    }
                    //if (cnt > 0) break
                    cnt += 1;
                }
            } else {
                const res = await (isBybit
                    ? client.getKline({
                          category: "spot",
                          symbol,
                          interval: interval as any,
                          start,
                          end,
                      })
                    : this.client.getHistoricCandles(
                          symbol,
                          getInterval(interval, "okx"),
                          {
                              before: start ? `${start}` : undefined,
                              after: end ? `${end}` : undefined,
                          }
                      ));
                const data = isBybit
                    ? (res as any).result.list
                    : (res as Candle[]);
                klines = [...data].reverse();
            }

            let d = [...klines];
            console.log(d[d.length - 1]);
            return d;
        } catch (e) {
            console.log(e);
        }
    }
    async getTrades({
        start,
        end,
        savePath,
        symbol,
        isBybit,
    }: {
        end?: number | undefined;
        start?: number | undefined;
        symbol: string;
        savePath?: string | undefined;
        isBybit?: boolean;
    }) {
        try {
            end = end ?? Date.now();
            let trades: any[] = [];
            let cnt = 0;
            const interval = 1 / 100;
            console.log(
                `[ ${
                    isBybit ? "ByBit" : this.name
                } ] \t GETTING TRADES.. FOR ` + symbol
            );

            if (start) {
                let endTs = end;
                console.log(endTs, end);
                while (endTs > start) {
                    console.log(`GETTING ${cnt + 1} TRADES...`);
                    const limit = 100;
                    //const after = firstTs + (limit - 1) * interval * 60 * 1000;
                    console.log(
                        `Before: ${parseDate(
                            new Date(start)
                        )} \t After: ${parseDate(new Date(endTs))}`
                    );
                    const res = await this.client.getHistoricTrades(symbol, {
                        //before: `${firstTs}`,
                        after: `${endTs}`,
                        limit: `${limit}`,
                        type: "2",
                    });
                    const data = isBybit
                        ? (res as any).result.list
                        : (res as Trade[]);
                    console.log(data);
                    if (!data.length) break;
                    trades = [...trades, ...data];

                    endTs = Number(data[data.length - 1].ts);
                    console.log("END_TS:");
                    console.log(new Date(endTs).toISOString());
                    if (savePath) {
                        ensureDirExists(savePath);
                        writeFileSync(savePath, JSON.stringify(trades));
                        console.log("Saved");
                    }
                    console.log(`DONE ${cnt}`);
                    cnt += 1;
                }
            }
            console.log("\nDONE GETTING ALL TRADES\n");
            let d = [...trades.reverse()];
            if (trades.length)
                console.log({
                    trades: {
                        ...trades[0],
                        ts: parseDate(new Date(Number(trades[0].ts))),
                    },
                });
            return d.sort((a, b) => Number(a.ts) - Number(b.ts));
        } catch (e) {
            console.log(e);
        }
    }
    async getTicker(pair: string[]): Promise<number> {
        super.getTicker(pair);
        try {
            const symbo = getSymbol(pair, "okx");
            const r = await this.client.getTicker(symbo);
            return Number(r[0].last);
        } catch (e) {
            this._log("FAILED TO GET TICKER", e);
            return 0;
        }
    }

    async getNets(
        ccy?: string,
        offline?: boolean
    ): Promise<ICoinNets[]  | null | undefined> {
        try {
            const res =
                offline && existsSync(this.netsPath)
                    ? await readJson(this.netsPath)
                    : await readJson("_data/currencies/okx.json");
            await writeJson(this.netsPath, res);
            const data = res;

            const coins: string[] = Array.from(
                new Set(data.map((el) => el.ccy))
            );
            const nets: ICoinNets[] = coins.map((el) => ({
                coin: el,
                name: el,
                nets: data
                    .filter((el2) => el2.ccy == el)
                    .map((el) => ({
                        name: el.name,
                        coin: el.ccy,
                        chain: el.chain,
                        contractAddr: "",
                        minComfirm: Number(el.minDepArrivalConfirm),
                        minWd: Number(el.minWd),
                        maxWd: Number(el.maxWd),
                        minDp: 0,
                        maxDp: Infinity,
                        wdFee: Number(el.maxFee),
                        canDep: el.canDep,
                        canWd: el.canWd,
                    })),
            }));
            return nets.filter((el) => !ccy || el.coin == ccy);
        } catch (e) {}
    }

    async getBook(
        pair: string[]
    ): Promise<IOrderbook  | null | undefined> {
        const ts = parseDate(new Date());
        try {
            super.getBook(pair);
            const r = await this.client.getOrderBook(this._getSymbo(pair), "5");
            const data = r[0];
            const ob: IOrderbook = {
                ts,
                asks: data.asks.map((el) => ({
                    px: Number(el[0]),
                    amt: Number(el[1]),
                })),
                bids: data.bids.map((el) => ({
                    px: Number(el[0]),
                    amt: Number(el[1]),
                })),
            };
            return ob;
        } catch (err) {
            this._log("FAILED TO GET BOOK FOR", pair);
            this._err(err)
        }
    }
}

export class TestBybit extends TestPlatform {
    client: RestClientV5;
    constructor({ demo = false }: { demo?: boolean }) {
        super({ demo, name: "bybit" });
        const apiKey = demo
            ? process.env.BYBIT_API_KEY_DEMO!
            : process.env.BYBIT_API_KEY!;
        const apiSecret = demo
            ? process.env.BYBIT_API_SECRET_DEMO!
            : process.env.BYBIT_API_SECRET!;

        this.client = new RestClientV5({
            key: apiKey,
            secret: apiSecret,
            demoTrading: demo,
            //testnet: demo,
        });
    }
    async getKlines({
        start,
        end,
        savePath,
        interval,
        symbol,
    }: {
        end?: number | undefined;
        start?: number | undefined;
        interval: number;
        symbol: string;
        savePath?: string | undefined;
    }): Promise<any[] | undefined> {
        return await TestOKX.prototype.getKlines({
            start,
            end,
            savePath,
            interval,
            symbol,
            isBybit: true,
        });
    }
    createSignature(apiKey, apiSecret, params) {
        const paramString = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join("&");

        const timestamp = Date.now().toString();
        const prehashString = `${timestamp}${apiKey}${paramString}`;
        const signature = crypto
            .createHmac("sha256", apiSecret)
            .update(prehashString)
            .digest("hex");
        const headers = {
            "X-BYBIT-API-KEY": apiKey,
            "X-BYBIT-SIGNATURE": signature,
            "X-BYBIT-TIMESTAMP": timestamp,
            "Content-Type": "application/json",
        };
        return headers;
    }
    async getTrades({
        start,
        end,
        savePath,
        symbol,
    }: {
        end?: number | undefined;
        start?: number | undefined;
        symbol: string;
        savePath?: string | undefined;
    }) {
        try {
            end = end ?? Date.now();
            let trades: any[] = [];
            let cnt = 0;
            const interval = 1 / 100;
            console.log(`[ ${this.name} ] \t GETTING TRADES.. FOR ` + symbol);
            console.log(symbol);
            if (start) {
                let endTs = end;
                console.log(endTs, start);
                while (endTs > start) {
                    console.log(`GETTING ${cnt + 1} TRADES...`);
                    const limit = 100;
                    //const after = firstTs + (limit - 1) * interval * 60 * 1000;
                    console.log(
                        `START: ${parseDate(
                            new Date(start)
                        )} \t END: ${parseDate(new Date(endTs))}`
                    );
                    const res = await this.client.getPublicTradingHistory({
                        category: "spot",
                        symbol,

                        limit: 10,
                    });
                    if (res.retCode == 0) {
                        console.log(res.result.list);
                    } else {
                        console.log(res);
                    }

                    const data = res.result.list;

                    if (!data.length) break;
                    trades = [
                        ...trades,
                        ...data.map((el) => ({
                            ts: el.time,
                            px: Number(el.price),
                            sz: Number(el.price),
                            side: el.side,
                            symbol: el.symbol,
                        })),
                    ];

                    endTs = Number(data[data.length - 1].time);
                    console.log("START_TS:");
                    console.log(new Date(endTs).toISOString());
                    if (savePath) {
                        ensureDirExists(savePath);
                        writeFileSync(savePath, JSON.stringify(trades));
                        console.log("Saved");
                    }
                    console.log(`DONE ${cnt}`);
                    cnt += 1;
                }
            }
            console.log("\nDONE GETTING ALL TRADES\n");
            let d = [...trades.reverse()];
            if (trades.length)
                console.log({
                    trades: {
                        ...trades[0],
                        ts: parseDate(new Date(Number(trades[0].ts))),
                    },
                });
            return d.sort((a, b) => Number(a.ts) - Number(b.ts));
        } catch (e) {
            console.log(e);
        }
    }

    async getOBData() {
        //const res = await this.client.getOrderbook({symbol: 'ETHUSDT',})
    }
    async getNets(coin?: string, offline?: boolean): Promise<ICoinNets[]  | null | undefined> {
        super.getNets(coin, offline);
        try {
            console.log({ offline });
            let res = safeJsonParse(
                offline && existsSync(this.netsPath)
                    ? await readJson(this.netsPath)
                    : (await this.client.getCoinInfo())
            );
            if (res.result?.rows) res = res.result.rows;
            else{
                return this._log("FAILED TO GET NETS", res)
            }
            writeJson(
                this.netsPath,
                res.sort((a, b) => a.coin.localeCompare(b.coin))
            );
          
            const data: CoinInfoV5[] = res;
            let coins: string[] = Array.from(
                new Set(data.map((el) => el.coin))
            );

            coins = coins
                .filter((el) => data.find((el2) => el2.coin == el)?.chains)
                .sort((a, b) => a.localeCompare(b));

            const tickers: { coin: string; ticker: number }[] = [];

            if (offline && existsSync(this.tickersPath))
                tickers.push(...(await readJson(this.tickersPath)));
            else {
                for (let el of coins) {
                    let ticker = 0;
                    if (el == "USDT" || el == "USDC" || true) {
                        ticker = 1;
                    } else {
                        try {
                            ticker = await this.getTicker([el, "USDT"]);

                            await sleep(100);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    tickers.push({ coin: el, ticker });
                    writeJson(this.tickersPath, tickers);
                }
            }

            writeJson(this.tickersPath, tickers);
            const nets: ICoinNets[] = coins.map((el) => {
                const net = data.find((el2) => el2.coin == el);
                const ticker = tickers.find((el2) => el2.coin == el)!.ticker;
                return {
                    coin: net!.coin,
                    name: net!.coin,
                    ticker,
                    nets: net!.chains.map((el) => ({
                        name: el.chain,
                        coin: net!.coin,
                        chain: el.chain,
                        contractAddr: "",
                        minComfirm: Number(el.confirmation),
                        minWd: Number(el.withdrawMin),
                        maxWd: Infinity,
                        minDp: Number(el.depositMin),
                        maxDp: Infinity,
                        wdFee: Number(el.withdrawFee),
                        wdFeeUSDT: Number(el.withdrawFee) * ticker,
                        canDep: el.chainDeposit == '1',
                        canWd: el.chainWithdraw == '1',
                    })),
                };
            });

            return nets.filter((el) => !coin || el.coin == coin);
        } catch (e) {
            this._log("FAILED TO GET NETS");
            this._err(e)
        }
    }
} 
