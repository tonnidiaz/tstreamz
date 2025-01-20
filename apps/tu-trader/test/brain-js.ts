import { test_platforms } from "@pkg/cmn/utils/consts";
import { getInterval, parseKlines, tuPath } from "@pkg/cmn/utils/funcs2";
import { getInstrus, getSymbol } from "@pkg/cmn/utils/functions";
import { ICandle, TPlatName } from "@pkg/cmn/utils/interfaces";
import { rsi, sma } from "indicatorts";
import * as tf from "@tensorflow/tfjs-node";
import { klinesRootDir } from "@pkg/cmn/utils/constants";
import { ensureDirExists, existsSync, readJson, writeJson } from "@cmn/utils/bend/funcs";
// Parameters
const platName: TPlatName = "kucoin";
const interval = 60;
const LOOKBACK = 100; // Number of candles to fetch
const INITIAL_BALANCE = 1000; // USD
let savePath = ""
// Fetch kline data
// async function fetchKlines(
//     symbol: string,
//     interval: number,
//     demo: boolean = false,
//     prefix  = ""
// ) {
//     const plat = new test_platforms[platName]({ demo: false });
    
//     return klines;
// }
// Preprocess Data
function preprocessData(klines: ICandle[]) {
    const closes = klines.map((el) => el.c);

    // Calculate indicators
    const _sma = sma(closes, { period: 20 });
    const _rsi = rsi(closes, { period: 14 });

    // Align data to remove undefined indicators
    const alignedData = klines.slice(14).map((k, index) => ({
        ...k,
        sma: _sma[index],
        rsi: _rsi[index],
    }));

    return alignedData;
}

// Build TensorFlow.js Model
function buildModel() {
    const model = tf.sequential();
    model.add(
        tf.layers.dense({ inputShape: [3], units: 10, activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 10, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
    model.compile({
        optimizer: "adam",
        loss: "binaryCrossentropy",
        metrics: ["accuracy"],
    });
    return model;
}

// Train TensorFlow.js Model
async function trainModel(model: tf.Sequential, trainingData) {
    const inputs = trainingData.map((d) => [
        d.c / 10000,
        d.sma / 10000,
        d.rsi / 100,
    ]);
    const outputs = trainingData.map((d) =>
        d.rsi > 70 ? 0 : d.rsi < 30 ? 1 : 0.5
    );

    const inputTensor = tf.tensor2d(inputs);
    const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

    await model.fit(inputTensor, outputTensor, {
        epochs: 5,
        batchSize: 5,
        verbose: 1,
    });

    inputTensor.dispose();
    outputTensor.dispose();
}

// Predict using TensorFlow.js Model
function predict(model, data: ICandle) {
    const inputTensor = tf.tensor2d([
        [data.c / 10000, data.sma / 10000, data.rsi / 100],
    ]);
    const prediction = model.predict(inputTensor).dataSync()[0];
    inputTensor.dispose();
    return prediction > 0.6 ? "buy" : prediction < 0.4 ? "sell" : "hold";
}

// Main Function
const main = async ({interval, demo, prefix = "", pair: _pair}: {demo?: boolean; interval: number; prefix?: string; pair?: string[]}) => {
    const start = "2024-01-01 00:00:00+02:00";
    const end = "2024-10-28 23:59:00+02:00";
    const startTs = Date.parse(start);
    const endTs = Date.parse(end);

    const subPath = demo ? "demo" : "live";
    let finalData: {profit: number, trades: number, pair: string}[] = [] 
    const updateFinalData = () =>{
        finalData = finalData.sort((a,b) => b.profit - a.profit)
        writeJson(savePath, finalData)
    }
    const year = start.split("-")[0];
    savePath = `_data/rf/coins/${year}/${subPath}/${prefix}${platName}_${interval}m-${subPath}.json`
    ensureDirExists(savePath)
    const instrus = _pair ?  [_pair] :  getInstrus(platName).filter(el=> el[1] == "USDT").sort()
    for (let pair of instrus){
        console.log(`\n[${pair}] STARTING...`);
        const symbol = getSymbol(pair, platName)
        const klinesPath = tuPath(
            `${klinesRootDir}/${platName.toLowerCase()}/${year}/${subPath}/${symbol}_${interval}m-${subPath}.json`
        );
    
        if (!existsSync(klinesPath)) continue;
    
        let ohlc = readJson(klinesPath); //await plat.getKlines({start: startTs, end: endTs, symbol, interval})
        ohlc = ohlc.filter(
            (el) => startTs <= Number(el[0]) && Number(el[0]) <= endTs
        );
        const klines = parseKlines(ohlc);
    
        if (!klines) continue;
        const data = preprocessData(klines);
    
        console.log("Building model...");
        const model = buildModel();
    
        console.log("Training model...");
        await trainModel(model, data);
    
        console.log("Simulating trades...");
        let balanceUSD = 1000;
        const START_BAL = balanceUSD
        let balanceBTC = 0;
        let trades = 0
    
        for (let i = 1; i < data.length; i++){
            const row = data[i], prevRow = data[i - 1]
            const action = predict(model, prevRow);
            const px = row.o
            if (action === "buy" && balanceUSD > 0) {
                balanceBTC = balanceUSD / px;
                balanceUSD = 0;
                console.log(`Buy at ${px}`);
            } else if (action === "sell" && balanceBTC > 0) {
                balanceUSD = balanceBTC * px;
                balanceBTC = 0;
                trades += 1
                console.log(`Sell at ${px}`);
            }
        }
    
        const finalBalance = balanceUSD + balanceBTC * data[data.length - 1].o;
        const profit =finalBalance - START_BAL
        const dt = {pair: symbol, profit, trades}
        finalData.push(dt)
        updateFinalData()
        console.log(`[${pair}] Final Balance: $${finalBalance.toFixed(2)}`);

        console.log(`\n[${pair}] DONE...\n`);
    }

    updateFinalData()
    
};


const pair = ["OM", "USDT"]
main({interval, demo: false, pair, prefix: pair ? pair[0] : ''})