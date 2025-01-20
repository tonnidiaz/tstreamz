import {
    ensureDirExists,
    existsSync,
    readJson,
    writeJson,
} from "@cmn/utils/bend/funcs";
import { calcPerc, handleErrs, toFixed } from "@cmn/utils/funcs";
import { IObj } from "@cmn/utils/interfaces";
import { TestExness } from "@pkg/cmn/classes/test-exness";
import {
    klinesRootDir,
    MAKER_FEE_RATE,
    TAKER_FEE_RATE,
} from "@pkg/cmn/utils/constants";
import { getInterval, parseKlines, tuMacd } from "@pkg/cmn/utils/funcs2";
import { ICandle } from "@pkg/cmn/utils/interfaces";
import { tree } from "d3-hierarchy";
import { ema, rsi, sma } from "indicatorts";
import MetaApi from "metaapi.cloud-sdk";
import { model } from "mongoose";

const symbol = "USDZARm";
const exnessLinks = {
    real: "https://app.metaapi.cloud/configure-trading-account-credentials/c4df7945-cf63-4eca-8c57-8c23c6221cd4/7PghJFfXT95AbWaiSq4brcc11yTo3z9HALMo8yHCgGEWu4BjJ8r5Dz74MgHWLvAB",
};
const metaApiKey =
    "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzOTdjNzIyN2Q1YTZlODg4MzRiYjYxYzAxMjQzMTY1YyIsInBlcm1pc3Npb25zIjpbXSwiYWNjZXNzUnVsZXMiOlt7ImlkIjoidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJ0cmFkaW5nLWFjY291bnQtbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6NDBkNzBjNjMtMTliYS00MzZhLTllZmUtZTRlYjg1NGUzZTQ3Il19LHsiaWQiOiJtZXRhYXBpLXJlc3QtYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo0MGQ3MGM2My0xOWJhLTQzNmEtOWVmZS1lNGViODU0ZTNlNDciXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjQwZDcwYzYzLTE5YmEtNDM2YS05ZWZlLWU0ZWI4NTRlM2U0NyJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjQwZDcwYzYzLTE5YmEtNDM2YS05ZWZlLWU0ZWI4NTRlM2U0NyJdfSx7ImlkIjoibWV0YXN0YXRzLWFwaSIsIm1ldGhvZHMiOlsibWV0YXN0YXRzLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo0MGQ3MGM2My0xOWJhLTQzNmEtOWVmZS1lNGViODU0ZTNlNDciXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6NDBkNzBjNjMtMTliYS00MzZhLTllZmUtZTRlYjg1NGUzZTQ3Il19XSwiaWdub3JlUmF0ZUxpbWl0cyI6ZmFsc2UsInRva2VuSWQiOiIyMDIxMDIxMyIsImltcGVyc29uYXRlZCI6ZmFsc2UsInJlYWxVc2VySWQiOiIzOTdjNzIyN2Q1YTZlODg4MzRiYjYxYzAxMjQzMTY1YyIsImlhdCI6MTczNjk0NDE5NX0.awNp79g0CigWdLa4Ge2cehAjXVCSdnDSVoA8d6daiiy2LMo0eGRbH_Hcm71pwyHWsGCdkEnOEg3wJaDi4thArlNxz304kF2lVsWtl3857VR1X3hJ5kyzi-wePyfLKNgDPm-FU__e9b_s9gCTajVmCiR6BeqElOFJnCopYYxhLAXOksUJ-88KEOnmA4xTv3ob7X6p3wZL0OLneFvlSmIxFUOsp8TRMHQZGTFS8V5VBEUtbMdUF3q_3o1U_ufzk9V7b0B6JbbTv2mjSuu4yRXUA1BMJJB6YHUItBboY534TNf7GSWnW4wnKUUIQzGFgVWvIbuqCnJOmwC0qUAwAZUhDk7GPxG2LT55Ig-INI0APiDhqO-FR-at8JNxBCGyt4-QuThNU2nwFdKpE8MDaqxoFk3osJk3nV3yOQWXKBjWQ4ThqlUknaVaq4EE11wmznPPCKdQUgZdUlhh8kL3O5HNswpkGjWtJKq_ouHUqTzIMVBWodWLwdOZkoO2aYVJQYPU4MdkiPLdfbXtz3AQOfpykcDxAuwXlQzjZPebaRWp5vz2lMbwa0kTBMb0raivdsK3iXR4UmCZOlHSdx3W9YjLYn9tLMWSN8_j8t0lK4pbaHyTJjI_PKuAN8EJNZtfj2FO6zBTezkvncdsFkFgtN3eCh16j-XbStvd6DEV42xsY2U";
const metaApiKey2 = "";
const accId = "";
const metaApiConfig = {
    apiKey: metaApiKey2,
    id: accId,
    state: "DEPLOYED",
    magic: 0,
    connectionStatus: "CONNECTED",
    quoteStreamingIntervalInSeconds: 2.5,
    symbol: "EURUSDm",
    reliability: "high",
    tags: [],
    resourceSlots: 1,
    copyFactoryResourceSlots: 1,
    region: "london",
    name: "StandardDemo",
    login: "208037782",
    server: "Exness-MT5Trial9",
    type: "cloud-g2",
    version: 5,
    hash: 12208,
    userId: "397c7227d5a6e88834bb61c01243165c",
    copyFactoryRoles: [],
    metastatsApiEnabled: false,
    riskManagementApiEnabled: false,
    accountReplicas: [],
    application: "MetaApi",
    createdAt: "2025-01-15T12:27:16.461Z",
    primaryReplica: true,
    connections: [
        {
            application: "MetaApi",
            region: "london",
            zone: "a",
        },
        {
            application: "MetaApi",
            region: "london",
            zone: "b",
        },
    ],
};

const metaApiConfig2 = {
    id: "",
    apiKey: "",
    state: "DEPLOYED",
    magic: 0,
    connectionStatus: "DISCONNECTED",
    quoteStreamingIntervalInSeconds: 2.5,
    symbol: "EURUSDm",
    reliability: "high",
    tags: [],
    resourceSlots: 1,
    copyFactoryResourceSlots: 1,
    region: "london",
    name: "ExnessStandard",
    login: "408522507",
    server: "Exness-MT5Real10",
    type: "cloud-g2",
    version: 5,
    hash: 38379,
    userId: "397c7227d5a6e88834bb61c01243165c",
    copyFactoryRoles: [],
    metastatsApiEnabled: false,
    riskManagementApiEnabled: false,
    accountReplicas: [],
    application: "MetaApi",
    createdAt: "2025-01-15T13:16:09.117Z",
    primaryReplica: true,
    connections: [],
};

const main = async (symbol: string, config: IObj, interval: number) => {
    const api = new MetaApi(config.apiKey);

    try {
        // Add an account to MetaApi
        // const account = await api.metatraderAccountApi.createAccount({
        //   name: metaApiConfig.name,
        //   type: metaApiConfig.type as any,
        //   login: metaApiConfig.login,
        //   password: "Baseline@072",
        //   server: metaApiConfig.server,
        //   platform: 'mt5', // or 'mt4'
        //   magic: metaApiConfig.magic,
        //   region: metaApiConfig.region
        // });
        const account = await api.metatraderAccountApi.getAccount(config.id);
        if (!account) return console.log("Account not found", { account });
        console.log({ status: account.state });
        // Wait for the account to synchronize
        console.log("Waiting for account synchronization...");
        // await account.waitConnected();

        console.log("Fetching candlestick data...");
        const _interval = getInterval(interval, "forex");
        const history = await account.getHistoricalCandles(
            symbol, // Symbol (currency pair)
            _interval, // Timeframe (e.g., '1m', '5m', '1h', '1d')
            new Date("2024-01-01 00:00:00+02:00"), // Start date
            1000 // End date
        );

        const savePath = `${klinesRootDir}/forex/exness/2024/demo/${symbol}_${_interval}.json`;
        ensureDirExists(savePath);
        writeJson(savePath, history);
        console.log("Candlestick data:", savePath);
    } catch (err) {
        console.error("Error:");
        handleErrs(err);
    } finally {
        api.close();
    }
};

// { profit: -996.68, tradeCnt: 2339 }

const parseDf = (_klines: any[][]) => {
    let klines = parseKlines(_klines, true, true);
    const _macd = tuMacd(klines, 20, 8, 50);
    const closings = klines.map((el) => el.c);
    const _rsi = rsi(closings, { period: 14 });
    const _ema20 = ema(closings, { period: 20 });
    const _ema50 = ema(closings, { period: 50 });
    const _sma20 = sma(closings, { period: 20 });
    const _sma50 = sma(closings, { period: 50 });

    klines = klines.map((el, i) => ({
        ...el,
        macd: _macd.macdLine[i],
        macdSignal: _macd.signalLine[i],
        macdHistogram: _macd.histogram[i],
        rsi: _rsi[i],
        ema20: _ema20[i],
        ema50: _ema50[i],
        sma20: _sma20[i],
        sma50: _sma50[i],
    }));

    return klines;
};
const trade = async (
    symbol: string,
    interval: number,
    start: string,
    end: string,
    demo: boolean
) => {
    const plat = new TestExness({ demo });
    try {
        // const pth =
        //     "/media/tonni/win/src/Mint/Documents/RF/Web/turbo-wp/turbo-two/apps/tu-trader/packages/common/src/data/klines/forex/exness/2024/demo/USDZARm_5m.json";
        const year = start.split("-")[0];
        const subPath = demo ? "demo" : "live";
        const startTs = Date.parse(start);
        const endTs = Date.parse(end);
        const platName = "exness";

        const testPth =
            "/media/tonni/win/src/Mint/Documents/RF/Web/turbo-wp/turbo-two/apps/tu-trader/packages/common/src/data/klines/bitget/2024/live/TURBOUSDT_60m-live.json";
        const pth = false
            ? testPth
            : `${klinesRootDir}/${platName.toLowerCase()}/${year}/${subPath}/${symbol}_${interval}m-${subPath}.json`;
        ensureDirExists(pth);

        let klines = existsSync(pth)
            ? readJson(pth)
            : await plat.getKlines({
                  symbol,
                  interval,
                  limit: 1000,
                  start: startTs,
                  end: endTs,
                  savePath: pth,
              });

        klines = klines.filter(
            (el) => startTs <= Number(el[0]) && Number(el[0]) <= endTs
        );
        const df = parseDf(klines);
        let bal = 1000;
        const START_BAL = bal;
        let pos = false,
            base = 0,
            quote = bal,
            trades = 0,
            tradeCnt = 0,
            entryPx = 0;
        const percs: number[] = []
        let buyPx: number | undefined, sellPx: number | undefined;

        const fillBuy = ({ px, amt }: { px: number; amt: number }) => {
            quote -= amt;
            base += amt / px;
            // base *= 1 - TAKER_FEE_RATE;
            buyPx = undefined;
            pos = true;
            entryPx = px;
        };
        const fillSell = ({ px, amt }: { px: number; amt: number }) => {
            base -= amt;
            quote += amt * px;
            // quote *= 1 - MAKER_FEE_RATE;
            sellPx = undefined;
            pos = false;
            tradeCnt += 1;
        };

        for (let i = 1; i < df.length - 1; i++) {
            const row = df[i],
                prevRow = df[i - 1],
                nextRow = df[i + 1];
            console.log(
                `\n[${row.ts}]`
                //     [
                //     prevRow.o,
                //     prevRow.h,
                //     prevRow.l,
                //     prevRow.c,
                //     prevRow.macd,
                //     prevRow.macdSignal,
                // ]
            );
            const perc = calcPerc(prevRow.o, row.h), nextPerc = calcPerc(row.o, nextRow.h);
            // console.log({perc, nextPerc});
            percs.push(perc)
        
            const buySignal = (_row: ICandle) => true || _row.ema20 > _row.ema50
            && _row.macd > _row.macdSignal; //&& row.c > row.o;
            const sellSignal = (_row: ICandle) => true ||_row.ema20 < _row.ema50;
            // _row.macd < _row.macdSignal && _row.c < _row.o;

            const calcBuyPx = () => row.o; // * (1 - (true ? 0.1 : 0.1) / 100);
            const calcSellPx = () => entryPx * (1 + 0.01 / 100); // * (1 + (true ? .5 : 0.15) / 100);
            if (!pos && buyPx) {
                console.log(`Has buy order at ${buyPx}...`);
                if (prevRow.l <= buyPx) {
                    console.log(`BUY FILLED AT ${buyPx}`);
                    fillBuy({ px: buyPx, amt: quote });
                } else {
                    // Adjust price
                    console.log(`Adjusting buy price...\n`);
                    // buyPx = calcBuyPx();
                }
            } else if (pos && sellPx) {
                console.log(`Has sell order at ${sellPx}...`);
                if (prevRow.h >= sellPx) {
                    console.log(`SELL FILLED AT ${sellPx}`);
                    fillSell({ px: sellPx, amt: base });
                } else {
                    // Adjust price
                    console.log(`Adjusting sell price...\n`);
                    // sellPx = calcSellPx();
                }
            }

            if (!pos && buySignal(prevRow)) {
                console.log(`\nHas buy signal...`);
                buyPx = calcBuyPx();
            } else if (pos && sellSignal(prevRow)) {
                console.log(`\nHas sell signal...`);
                sellPx = calcSellPx();
            }
        }
        plat;

        quote += base * entryPx;
        const profit = toFixed(quote - START_BAL, 2);
        console.log("\nDONE", { profit, tradeCnt });
        writeJson(`data/fx-percs-${symbol}.json`, percs.sort((a, b) => b - a))
    } catch (err) {
        handleErrs(err);
    } finally {
        plat.metaApi.close();
    }
};
// main(symbol, metaApiConfig, 5);
// trade()
const link3 =
    "https://app.metaapi.cloud/configure-trading-account-credentials/ddb1b427-47fa-4fff-9efa-1fbfbe87e4ca/55j4DHwo6zB133UTMm5wmSZzat5adFTSZLScHt6FLa1SmGyy5JG3GybQqEdNEowg";
const interval = 5;
const start = "2024-01-01 00:00:00+02:00";
const end = "2024-10-28 23:59:00+02:00";
// 679470.12,
// R 175200037460113.3,
const getKlines = async (_get = true) => {
    const plat = new TestExness({ demo: true });

    const savePath = `data/exness/2024/${symbol}_${interval}m.json`;
    ensureDirExists(savePath);

    if (_get) {
        const r = await plat.getKlines({
            symbol,
            interval,
            savePath,
            start: Date.parse(start),
            end: Date.parse(end),
            limit: 1000,
        });
        console.log(r.length);
    } else {
        const df = parseKlines(readJson(savePath), true, true);
        console.log(df.length);
    }
};

// getKlines(false);
trade("USDZARm", interval, start, end, false);
