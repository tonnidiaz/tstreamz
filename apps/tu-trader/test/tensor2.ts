import { readJson } from "@cmn/utils/bend/funcs";
import { calcPerc, sleep, toFixed } from "@cmn/utils/funcs";
import { parseKlines, tuMacd } from "@pkg/cmn/utils/funcs2";
import { ICandle } from "@pkg/cmn/utils/interfaces";
import * as tf from "@tensorflow/tfjs-node";
import { macd, rsi } from "indicatorts";


const interval = 15

const fetchCandlestickData = () => {
    const klinesPath =
        `/media/tonni/win/src/Mint/Documents/RF/Web/turbo-wp/turbo-two/apps/tu-trader/packages/common/src/data/klines/bitget/2024/live/AITECHUSDT_${interval}m-live.json`;
    const ohlcv = readJson(klinesPath);
    if (!ohlcv) {
        throw new Error("Klines not found");
    }

    let klines = parseKlines(ohlcv);
    const _macd = tuMacd(klines,);
    const closings = klines.map((el) => el.c);
    const _rsi = rsi(closings, { period: 14 });

    klines = klines.map((el, i) => ({
        ...el,
        macd: _macd.macdLine[i],
        macdSignal: _macd.signalLine[i],
        macdHistogram: _macd.histogram[i],
        rsi: _rsi[i]
    }));
    return klines;
};
// Simulated historical candlestick data (replace with real data)
const candlestickData: ICandle[] = fetchCandlestickData();
// Prepare training and testing data
const lookback = Math.round(candlestickData.length * (0.090383225/100)); // Number of candles to look back for features
const trainingRequired = true; // Set to false to load a previously saved model


const MAX_TEST_CANDLES = Math.round(candlestickData.length * (0.903832249/100));
console.log({MAX_TEST_CANDLES, lookback}, '\n');

function normalizeData(data: number[][]) {
    const normalized = data.map(row => {
        const max = Math.max(...row);
        const min = Math.min(...row);
        return row.map(value => (max - min === 0 ? 0 : (value - min) / (max - min)));
    });
    return normalized;
}



// Extract features and labels for training
function prepareData(data: ICandle[], lookback: number) {
    const features: number[][] = [];
    const labels: number[] = []; // 0 for hold, 1 for buy, -1 for sell

    for (let i = lookback; i < data.length; i++) {
        const window = data.slice(i - lookback, i);
        const feature = window.flatMap((candle) => {
            const v = Object.values(candle).slice(1);
            return v;
        });

        features.push(feature);

        const current = data[i];
        const prevClose = data[i - 1].c;

        const change = calcPerc(prevClose, current.c)// (current.c - prevClose) / prevClose;
        const perc = .5
        // console.log({change});
        if (change >= perc)
            labels.push(1); // Buy
        else if (change < -perc)
            labels.push(-1); // Sell
        else labels.push(0);

        // Example labeling logic: Buy if price is rising, Sell if falling
        // if (current.c > prevClose * 1.01) {
        //     labels.push(1); // Buy
        // } else if (current.c < prevClose * 0.99) {
        //     labels.push(-1); // Sell
        // } else {
        //     labels.push(0); // Hold
        // }
    }
    // console.log({labels}, "\n");

    return { features, labels };
}

const numFeatures = Object.values(candlestickData[0]).slice(1).length; //8; // open, high, low, close, volume, sma20, sma50, rsi

const trainingSize = MAX_TEST_CANDLES;
let { features, labels } = prepareData(candlestickData, lookback);
// features = normalizeData(features);
const trainFeatures = features.slice(0, trainingSize);
const trainLabels = labels.slice(0, trainingSize);
const testFeatures = features.slice(trainingSize);
const testLabels = labels.slice(trainingSize);

// Convert data to tensors
const xs = tf.tensor2d(trainFeatures);
const ys = tf.tensor1d(trainLabels, "float32");


// Train the model
const main = async () => {
    // Define the model
const model = tf.sequential();
model.add(
    tf.layers.dense({
        units: 64,
        activation: "relu",
        inputShape: [lookback * numFeatures],
    })
);
model.add(tf.layers.dense({ units: 32, activation: "relu" }));
model.add(tf.layers.dense({ units: 3, activation: "softmax" })); // 3 outputs: hold, buy, sell


    model.compile({
        optimizer: tf.train.adam(),
        loss: "sparseCategoricalCrossentropy",
        metrics: ["accuracy"],
    });
    
    
    let finalModel: tf.LayersModel;
    const modelPath = `file://my-winning-model-${interval}m`
    if (trainingRequired) {
        console.log('Training model...');
        await model.fit(xs, ys, {
            epochs: 20,
            batchSize: 16,//16,
            verbose: 1,
        });

        console.log('Training completed.');

        // Evaluate the model
        const testXs = tf.tensor2d(testFeatures);
        const evaluation = model.evaluate(testXs, tf.tensor1d(testLabels, 'float32'));
        console.log('Test accuracy:', (await evaluation[1].data())[0]);

        // Save the model
        console.log('\nSaving the model...');
        await model.save(modelPath);
        console.log('Model saved.\n');

        finalModel = model;
    } else {
        // Load the model
        console.log('\nLoading the model...');
        finalModel = (await tf.loadLayersModel(modelPath));
        console.log('Model loaded.\n');
    }

    // Predict on test data
    const testXs = tf.tensor2d(testFeatures);
    const predictions = model.predict(testXs) as tf.Tensor;
    const predictedClasses = predictions.argMax(-1);

    // Simulate trades based on predictions
    const predictedValues = await predictedClasses.array();
    let balance = 1000; // Initial balance in USD
    const START_BAL = balance
    let position = 0; // Current position in asset

    testLabels.forEach((label, i) => {
        const prediction = predictedValues[i];
        const row = candlestickData[i + trainingSize];
        const { ts } = row;
        console.log("\n", { ts });
        if (prediction === 1 && position === 0) {
            // Buy signal
            position = balance / candlestickData[trainingSize + i].c;
            balance = 0;
            console.log(`Bought at ${candlestickData[trainingSize + i].c}`);
        } else if (prediction === 2 && position > 0) {
            // Sell signal
            balance = position * candlestickData[trainingSize + i].c;
            position = 0;
            console.log(`Sold at ${candlestickData[trainingSize + i].c}`);
        }
    });
    const profit = toFixed(balance - START_BAL, 2)
    const profitPerc = toFixed(calcPerc(START_BAL, balance), 2)
    console.log(`\nFinal balance: USDT ${balance}`);
    console.log(`Profit: USDT ${profit}\n\t${profitPerc}%`);
    // return
    if (profitPerc < 100) {
        // Re-call tge function
        await sleep(1000)
        return await main()}
    console.log("\nDONE\n");
};

main()
