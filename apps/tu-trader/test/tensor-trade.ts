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
import * as tf from "@tensorflow/tfjs-node";

class TuTrader {
    df: ICandle[] = [];
    START_BAL: number;
    interval: number;
    platName: TPlatName;
    start: string;
    end: string;
    demo: boolean;
    save: boolean;
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
        save = true,
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
        save?: boolean;
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

    private async initTensor(_trainingData: ICandle[]) {
        // Define the model architecture
        const model = tf.sequential();
        model.add(
            tf.layers.dense({ units: 64, activation: "relu", inputShape: [4] })
        ); // 4 features: Open, High, Low, Close
        model.add(tf.layers.dense({ units: 32, activation: "relu" }));
        model.add(tf.layers.dense({ units: 2 })); // 2 outputs: Next High, Next Low

        // Compile the model
        model.compile({
            optimizer: "adam",
            loss: "meanSquaredError",
        });

        // Prepare the data
        const trainingData = true
            ? _trainingData.map((el, i, data) => [
                  [el.o, el.h, el.l, el.c],
                  [(data[i + 1] || el).h, (data[i + 1] || el).l],
              ])
            : [
                  // Example data (replace with your actual candlestick data)
                  [
                      [100, 105, 98, 102],
                      [107, 97],
                  ], // [Open, High, Low, Close], [Next High, Next Low]
                  [
                      [102, 104, 100, 101],
                      [103, 99],
                  ],
                  [
                      [101, 103, 99, 102],
                      [105, 98],
                  ],
                  // ... more data points
              ];

        const inputs = [];
        const outputs = [];
        for (const [input, output] of trainingData) {
            inputs.push(input);
            outputs.push(output);
        }

        const inputTensor = tf.tensor2d(inputs);
        const outputTensor = tf.tensor2d(outputs);

        // Train the model
        await model.fit(inputTensor, outputTensor, { epochs: 100 });
        return model;
    }
    private async startTrading({
        df,
        pair,
    }: {
        df: ICandle[];
        pair: string[];
    }) {
        let quote = this.START_BAL;
        let base = 0;
        let tradeCnt = 0;
        let buyPx: number | undefined;
        let sellPx: number | undefined;
        let pos = false;
        let nextHigh = 0, nextLow = 0;

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

        /**
         * Take out N number of candles to train mode
         * Use prevRow to feed to model and predict next h and l
         */
        const MAX_TEST_CANDLES = 10;
        const testCandles = df.slice(0, MAX_TEST_CANDLES);
        df = df.slice(MAX_TEST_CANDLES);

        /* Train model */
        console.log(`\n[${pair}] TRAIN MODEL...`);
        const model = await this.initTensor(testCandles);
        console.log(`[${pair}] DONE TRAINING MODEL...\n`);
        for (let i = 1; i < df.length; i++) {
            const row = df[i],
                prevRow = df[i - 1];
            console.log(`\n[${row.ts}]`);

            // Make predictions
            const candle = [prevRow.o, prevRow.h, prevRow.l, prevRow.c]
            console.log({candle});
            const newCandleTensor = tf.tensor2d([
                candle
            ]);
            const predictions = model.predict(newCandleTensor);

            // Get the predicted values
            [nextHigh, nextLow] = (predictions as tf.Tensor).dataSync();
            console.log("Predicted Next High:", nextHigh);
            console.log("Predicted Next Low:", nextLow);

            const calcBuyPx = () => nextLow;
            const calcSellPx = () => nextHigh;
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

            const buySignal = (row: ICandle) =>
                row.macd > row.macdSignal && row.c > row.o;
            const sellSignal = (row: ICandle) => true ||
                row.macd < row.macdSignal && row.c < row.o;

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
        if (this.save)
        writeJson(this.savePath, this.finalData);
    }

    async main() {
        {
            const startTs = Date.parse(this.start);
            const endTs = Date.parse(this.end);
            const year = this.start.split("-")[0];
            const subPath = this.demo ? "demo" : "live";
            this.savePath = `_data/rf/coins/${year}/${subPath}/tensor_${this.prefix}${this.platName}_${this.interval}m-${subPath}.json`;
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
                const data = this.preprocessData(klines);

               await this.startTrading({ df: data, pair });
            }

            this.updateFinalData();
        }
    }
    preprocessData(klines: ICandle[]) {
        return klines
    }
}

const main = async () => {
    const interval = 60,
        platName: TPlatName = "bitget";
    const bal = 50;
    const pair = ["TURBO", "USDT"]
    const save = false
    const tuTrader = new TuTrader({ platName, interval, bal, demo: false, pair, prefix: pair ? pair[0] : "", save });
    await tuTrader.main();
};

main()
