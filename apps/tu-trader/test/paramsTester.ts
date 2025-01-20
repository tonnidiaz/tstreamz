import {
    ensureDirExists,
    existsSync,
    readJson,
    writeJson,
} from "@cmn/utils/bend/funcs";
import { toFixed } from "@cmn/utils/funcs";
import { IObj } from "@cmn/utils/interfaces";
import {
    klinesRootDir,
    MAKER_FEE_RATE,
    TAKER_FEE_RATE,
} from "@pkg/cmn/utils/constants";
import { parseKlines, tuPath } from "@pkg/cmn/utils/funcs2";
import { getSymbol } from "@pkg/cmn/utils/functions";
import { ICandle, TPlatName } from "@pkg/cmn/utils/interfaces";
import { macd } from "indicatorts";

class ParamsTester {
    pair: string[];
    platName: TPlatName;
    start: string;
    end: string;
    bal: number;
    START_BAL: number;
    demo = false;
    savePath: string;
    interval: number;
    symbol: string;
    klinesPath: string;
    constructor({
        demo = false,
        platName,
        start = "2024-01-01 00:00:00+02:00",
        end = "2024-10-28 23:59:00+02:00",
        bal,
        pair,
        prefix,
        interval,
    }: {
        demo?: boolean;
        platName: TPlatName;
        start?: string;
        end?: string;
        bal: number;
        pair: string[];
        prefix?: string;
        interval: number;
    }) {
        this.interval = interval;
        this.demo = demo;
        this.platName = platName;
        this.start = start;
        this.end = end;
        this.START_BAL = bal;
        this.bal = bal;
        this.pair = pair;
        prefix = prefix ? prefix + "_" : "";

        const year = this.start.split("-")[0];
        const subPath = this.demo ? "demo" : "live";
        this.savePath = `_data/rf/params/${year}/${subPath}/${prefix}${this.platName}_${this.interval}m-${subPath}.json`;
        ensureDirExists(this.savePath);

        this.symbol = getSymbol(this.pair, this.platName);
        this.klinesPath = tuPath(
            `${klinesRootDir}/${this.platName.toLowerCase()}/${year}/${subPath}/${this.symbol}_${this.interval}m-${subPath}.json`
        );
    }

    getKlines() {
        const startTs = Date.parse(this.start);
        const endTs = Date.parse(this.end);

        let klines = readJson(this.klinesPath);

        if (!klines) throw new Error(`${this.klinesPath} not found`);
        klines = klines.filter(
            (el) => startTs <= Number(el[0]) && Number(el[0]) <= endTs
        );
        return parseKlines(klines);
    }

    private trade({ df, params }: { df: ICandle[]; params: IObj }) {
        let quote = this.START_BAL;
        let base = 0;
        let tradeCnt = 0;
        let buyPx: number | undefined;
        let entryPx: number | undefined;
        let sellPx: number | undefined;
        let pos = false;

        const symbol = getSymbol(this.pair, this.platName);

        const fillBuy = ({ px, amt }: { px: number; amt: number }) => {
            quote -= amt;
            base += amt / px;
            base *= 1 - TAKER_FEE_RATE;
            buyPx = undefined;
            pos = true;
            entryPx = px;
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
            const calcBuyPx = () => prevRow.c * (1 - (true ? 0.1 : 0.1) / 100);
            const calcSellPx = () => prevRow.c * (1 + (true ? 5 : 0.15) / 100);
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
                } else {
                    // Adjust price
                    console.log(`Adjusting sell price...\n`);
                    sellPx = calcSellPx();
                }
            }

            if (!pos && prevRow.buySignal) {
                console.log(`\nHas buy signal...`);
                buyPx = calcBuyPx();
            } else if (pos && prevRow.sellSignal) {
                console.log(`\nHas sell signal...`);
                sellPx = calcSellPx();
            }
        }

        console.log(`\n`, { base, quote });
        const finalBalance = toFixed(quote + base * df[df.length - 1].o, 2);
        const profit = toFixed(finalBalance - this.START_BAL, 2);
        const dt = { pair: symbol, profit, trades: tradeCnt, params };
        this.finalData.push(dt);
        this.updateFinalData();
        console.log(
            `[${this.pair}] PROFIT: $${profit.toFixed(2)}, TRADES: ${tradeCnt}`
        );
    }

    finalData: { trades: number; profit: number; params: IObj }[] = [];
    updateFinalData() {
        this.finalData = this.finalData.sort((a, b) => b.profit - a.profit);
        writeJson(this.savePath, this.finalData);
    }
    macd() {
        let df = this.getKlines();
        const max = 50;
        const closings = df.map((el) => el.c);
        let _slow = 2,
            _fast = 1,
            _signal = 1;

        if (existsSync(this.savePath)) {
            this.finalData = readJson(this.savePath);
            const lastData = this.finalData
                .filter(
                    (el, i, data) =>
                        el.params.slow ==
                        Math.max(...data.map((e) => e.params.slow))
                )
                .filter(
                    (el, i, data) =>
                        el.params.fast ==
                        Math.max(...data.map((e) => e.params.fast))
                )
                .filter(
                    (el, i, data) =>
                        el.params.signal ==
                        Math.max(...data.map((e) => e.params.signal))
                )[0];

            if (lastData) {
                _slow = lastData.params.slow;
                _fast = lastData.params.fast;
                _signal = lastData.params.signal;
            }
        }
        console.log(`\nSTARTING AT`, { _slow, _fast, _signal });

        for (let slow = _slow; slow <= max; slow++) {
            for (let fast = _fast; fast < slow; fast++) {
                for (let signal = _signal; signal <= max; signal++) {
                    console.log("\n", { slow, fast, signal }, "\n");
                    const _macd = macd(closings, { slow, fast, signal });
                    df = df.map((el, i) => ({
                        ...el,
                        buySignal:
                            _macd.macdLine[i] > _macd.signalLine[i] &&
                            el.c > el.o,
                        sellSignal:
                            _macd.macdLine[i] < _macd.signalLine[i] &&
                            el.c < el.o,
                    }));
                    this.trade({ df, params: { slow, fast, signal } });
                }
            }
        }
    }
}

const main = () => {
    const interval = 5,
        platName: TPlatName = "bitget";
    const bal = 50;
    const pair = ["AITECH", "USDT"];
    const start = "2024-05-01 00:00:00+02:00";
    const paramsTester = new ParamsTester({
        platName,
        interval,
        bal,
        start,
        demo: false,
        pair,
        prefix: `${pair[0]}-macd-MAY`,
    });
    paramsTester.macd();
};

main();
