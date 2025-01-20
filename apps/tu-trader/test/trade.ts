import { writeJson, ensureDirExists, readJson } from "@cmn/utils/bend/funcs";
import { toFixed } from "@cmn/utils/funcs";
import {
    klinesRootDir,
    MAKER_FEE_RATE,
    TAKER_FEE_RATE,
} from "@pkg/cmn/utils/constants";
import { tuPath, parseKlines, tuCE, tuCE1 } from "@pkg/cmn/utils/funcs2";
import { getInstrus, getSymbol } from "@pkg/cmn/utils/functions";
import { ICandle, TPlatName } from "@pkg/cmn/utils/interfaces";
import { existsSync } from "fs";
import { bollingerBands, chandelierExit, ema, macd, sma } from "indicatorts";

class TuTrader {
    df: ICandle[] = [];
    START_BAL: number;
    interval: number;
    platName: TPlatName;
    start: string;
    end: string;
    demo: boolean;
    pair?: string[];
    prefix = "";
    entryPx = 0;
    constructor({
        platName,
        interval,
        bal,
        start = "2024-01-01 00:00:00+02:00",
        end = "2024-10-28 23:59:00+02:00",
        demo = false,
        pair,
        prefix,
    }: {
        bal: number;
        interval: number;
        platName: TPlatName;
        start?: string;
        end?: string;
        prefix?: string;
        demo?: boolean;
        pair?: string[];
    }) {
        this.START_BAL = bal;
        this.platName = platName;
        this.interval = interval;
        this.start = start;
        this.end = end;
        this.demo = demo;
        this.pair = pair;
        if (prefix) {
            this.prefix = prefix + "_";
        }
    }
    private startTrading({ df, pair }: { df: ICandle[]; pair: string[] }) {
        let quote = this.START_BAL;
        let base = 0;
        let tradeCnt = 0;
        let buyPx: number | undefined;
        let sellPx: number | undefined;
        let pos = false;

        const symbol = getSymbol(pair, this.platName);

        const fillBuy = ({ px, amt }: { px: number; amt: number }) => {
            quote -= amt;
            base += amt / px;
            base *= 1 - TAKER_FEE_RATE;
            buyPx = undefined;
            pos = true;
            this.entryPx = px;
        };
        const fillSell = ({ px, amt }: { px: number; amt: number }) => {
            base -= amt;
            quote += amt * px;
            quote *= 1 - MAKER_FEE_RATE;
            sellPx = undefined;
            pos = false;
            tradeCnt += 1;
        };

        for (let i = 1; i < df.length; i++) {
            const row = df[i],
                prevRow = df[i - 1];
            console.log(`\n[${row.ts}]`);
            const calcBuyPx = () => prevRow.c * (1 - (true ? .1 : 0.1) / 100);
            const calcSellPx = () => prevRow.c * (1 + (true ? 5 : .15) / 100);
            const buySignal = (row: ICandle) =>
                row.macd > row.macdSignal && row.c > row.o;
            const sellSignal = (row: ICandle) =>
                row.macd < row.macdSignal && row.c < row.o;
            
            if (!pos && buyPx) {
                console.log(`Has buy order at ${buyPx}...`);
                if (prevRow.l <= buyPx) {
                    console.log(`BUY FILLED AT ${buyPx}`);
                    fillBuy({ px: buyPx, amt: quote });
                } else {
                    // Adjust price
                    console.log(`Adjusting buy price...\n`);
                    buyPx = calcBuyPx();
                }
            } else if (pos && sellPx) {
                console.log(`Has sell order at ${sellPx}...`);
                if (prevRow.h >= sellPx) {
                    console.log(`SELL FILLED AT ${sellPx}`);
                    fillSell({ px: sellPx, amt: base });
                } 
                else {
                    // Adjust price
                    console.log(`Adjusting sell price...\n`);
                    sellPx = calcSellPx();
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

        console.log(`\n`, { base, quote });
        const finalBalance = toFixed(quote + base * df[df.length - 1].o, 2);
        const profit = toFixed(finalBalance - this.START_BAL, 2);
        const dt = { pair: symbol, profit, trades: tradeCnt };
        this.finalData.push(dt);
        this.updateFinalData();
        console.log(
            `[${pair}] PROFIT: $${profit.toFixed(2)}, TRADES: ${tradeCnt}`
        );

        console.log(`\n[${pair}] DONE...\n`);
    }

    finalData: { profit: number; trades: number; pair: string }[] = [];
    savePath: string = "";

    updateFinalData() {
        this.finalData = this.finalData.sort((a, b) => b.profit - a.profit);
        writeJson(this.savePath, this.finalData);
    }

    async main() {
        {
            const startTs = Date.parse(this.start);
            const endTs = Date.parse(this.end);
            const year = this.start.split("-")[0];
            const subPath = this.demo ? "demo" : "live";
            this.savePath = `_data/rf/coins/${year}/${subPath}/${this.prefix}${this.platName}_${this.interval}m-${subPath}.json`;
            ensureDirExists(this.savePath);
            const instrus = this.pair
                ? [this.pair]
                : getInstrus(this.platName)
                      .filter((el) => el[1] == "USDT")
                      .sort();

            for (let pair of instrus) {
                console.log(`\n[${pair}] STARTING...`);
                const symbol = getSymbol(pair, this.platName);
                const klinesPath = tuPath(
                    `${klinesRootDir}/${this.platName.toLowerCase()}/${year}/${subPath}/${symbol}_${this.interval}m-${subPath}.json`
                );

                if (!existsSync(klinesPath)) continue;

                let ohlc = readJson(klinesPath); //await plat.getKlines({start: startTs, end: endTs, symbol, interval})
                ohlc = ohlc.filter(
                    (el) => startTs <= Number(el[0]) && Number(el[0]) <= endTs
                );
                const klines = parseKlines(ohlc);

                if (!klines) continue;
                const data = preprocessData(klines);

                this.startTrading({ df: data, pair });
            }

            this.updateFinalData();
        }
    }
}

function preprocessData(klines: ICandle[]) {
    const closes = klines.map((el) => el.c),
        highs = klines.map((el) => el.h),
        lows = klines.map((el) => el.l);

    const short = 20,
        long = 50;
    const _sma20 = sma(closes, { period: short });
    const _sma50 = sma(closes, { period: long });

    const _ema20 = ema(closes, { period: short });
    const _ema50 = ema(closes, { period: long });
    const _macd = macd(closes, { slow: 12, signal: 39, fast: 8 });
    klines = tuCE1(klines, { atrLen: 3, mult: 0.5 });
    return klines.map((el, i) => ({
        ...el,
        macdSignal: _macd.signalLine[i],
        macd: _macd.macdLine[i],
        sma20: _sma20[i],
        sma50: _sma50[i],
        ema20: _ema20[i],
        ema50: _ema50[i],
    }));
}

const main = async () => {
    const interval = 5,
        platName: TPlatName = "bitget";
    const bal = 50;
    const pair = false ? undefined : ["AITECH", "USDT"];
    const start = "2024-01-01 00:00:00+02:00";
    const tuTrader = new TuTrader({
        platName,
        interval,
        bal,
        demo: false,
        pair,
        prefix: pair ? pair[0] : "",
        start,
    });
    await tuTrader.main();
};

main();
