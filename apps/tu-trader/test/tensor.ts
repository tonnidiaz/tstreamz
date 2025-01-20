import { readJson } from "@cmn/utils/bend/funcs";
import { parseKlines } from "@pkg/cmn/utils/funcs2";
import { ICandle } from "@pkg/cmn/utils/interfaces";
import * as tf from "@tensorflow/tfjs-node"
import { macd, rsi } from "indicatorts";

// Configuration
const CONFIG = {
  symbol: 'BTC/USDT',
  timeframe: '1h',
  lookback: 50, // Number of candles per input sequence
  epochs: 20,
  batchSize: 32,
};

// Fetch candlestick data
const fetchCandlestickData = async () => {
  const klinesPath = "/media/tonni/win/src/Mint/Documents/RF/Web/turbo-wp/turbo-two/apps/tu-trader/packages/common/src/data/klines/bitget/2024/live/AITECHUSDT_60m-live.json"
  const ohlcv = readJson(klinesPath)
  return parseKlines(ohlcv)
};

// Add MACD and RSI
const addIndicators = (data: ICandle[]) => {
  const closes = data.map((d) => d.c);

  const macdInput = {
    values: closes,
    fastPeriod: 8,
    slowPeriod: 12,
    signalPeriod: 39,
  };
  const _macd = macd(closes, {fast: macdInput.fastPeriod, slow: macdInput.slowPeriod, signal: macdInput.signalPeriod})

  const rsiInput = {
    values: closes,
    period: 14,
  };
  const _rsi = rsi(closes, {period: 14})

  // Add indicators to data
//   for (let i = 0; i < data.length; i++) {
//     data[i].macd = _macd[i - macdInput.slowPeriod]?.MACD || 0;
//     data[i].macdSignal = _macd[i - macdInput.slowPeriod]?.signal || 0;
//     data[i].rsi = _rsi[i - rsiInput.period] || 0;
//   }
  data = data.map((el, i)=> ({...el, rsi: _rsi[i], macd: _macd.macdLine[i], macdSignal: _macd.signalLine[i]}))
  return data.slice(Math.max(macdInput.slowPeriod, rsiInput.period));
};

// Label the data
const labelData = (data: ICandle[]) => {
  for (let i = 0; i < data.length - 1; i++) {
    const nextClose = data[i + 1].c;
    const currentClose = data[i].c;

    const change = (nextClose - currentClose) / currentClose;

    if (change > 0.01) data[i].label = 1; // Buy
    else if (change < -0.01) data[i].label = -1; // Sell
    else data[i].label = 0; // Hold
  }
  return data.slice(0, -1); // Remove last data point as it has no label
};

// Prepare input and output tensors
const prepareTensors = (data: ICandle[], lookback: number) => {
  const inputs = [];
  const outputs = [];

  for (let i = 0; i < data.length - lookback; i++) {
    const sequence = data.slice(i, i + lookback);
    inputs.push(sequence.map((d) => [d.c, d.macd, d.macdSignal, d.rsi]));
    outputs.push(sequence[lookback - 1].label + 1); // Shift labels to [0, 1, 2] for categorical output
  }

  return {
    inputs: tf.tensor3d(inputs),
    outputs: tf.tensor1d(outputs, 'float32'),
  };
};

// Build the TensorFlow.js model
const buildModel = (inputShape) => {
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 50, returnSequences: true, inputShape }));
  model.add(tf.layers.lstm({ units: 50 }));
  model.add(tf.layers.dense({ units: 25, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' })); // Buy, Sell, Hold

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
};

// Train the model
const trainModel = async (model, inputs, outputs) => {
  await model.fit(inputs, outputs, {
    epochs: CONFIG.epochs,
    batchSize: CONFIG.batchSize,
    validationSplit: 0.2,
    callbacks: tf.callbacks.earlyStopping({ patience: 5 }),
  });
};

// Predict signal
const predictSignal = (model, recentData, lookback) => {
  const inputTensor = tf.tensor3d([recentData.map((d) => [d.c, d.macd, d.macdSignal, d.rsi])]);
  const prediction = model.predict(inputTensor).argMax(-1).arraySync()[0];
  return ['Sell', 'Hold', 'Buy'][prediction];
};

// Execute trades
const executeTrade = async (signal) => {
  if (signal === 'Buy') {
    console.log('Executing Buy order...');
    // Integrate with exchange API to place buy order
  } else if (signal === 'Sell') {
    console.log('Executing Sell order...');
    // Integrate with exchange API to place sell order
  } else {
    console.log('Holding...');
  }
};

// Main function
const runBot = async () => {
    console.log('Fetching data...');
    let data = await fetchCandlestickData();
  
    console.log('Adding indicators...');
    data = addIndicators(data);
  
    console.log('Labelling data...');
    data = labelData(data);
  
    console.log('Preparing tensors...');
    const { inputs, outputs } = prepareTensors(data.slice(20), CONFIG.lookback);
  
    console.log('Building model...');
    const model = buildModel([CONFIG.lookback, 4]);
  
    console.log('Training model...');
    await trainModel(model, inputs, outputs);
  
    console.log('Backtesting...');
    // Simulated Portfolio
    let balanceUSD = 1000; // Initial balance in USD
    let balanceCrypto = 0; // Initial balance in cryptocurrency
    let initialBalance = balanceUSD;
  
    const fees = 0.001; // 0.1% trading fee
    let trades = 0;
  
    for (let i = CONFIG.lookback; i < data.length; i++) {
      const recentData = data.slice(i - CONFIG.lookback, i);
      const signal = predictSignal(model, recentData, CONFIG.lookback);
  
      const currentPrice = data[i].c;
    const row = data[i]
    console.log(`\n`, {ts: row.ts});
      if (signal === 'Buy' && balanceUSD > 0) {
        // Simulate buy
        const amountToBuy = balanceUSD / currentPrice;
        balanceCrypto += amountToBuy * (1 - fees); // Deduct fees
        balanceUSD = 0;
        trades++;
        console.log(`Buy at ${currentPrice} | Crypto: ${balanceCrypto.toFixed(4)} | USD: ${balanceUSD.toFixed(2)}`);
      } else if (signal === 'Sell' && balanceCrypto > 0) {
        // Simulate sell
        const amountToSell = balanceCrypto;
        balanceUSD += amountToSell * currentPrice * (1 - fees); // Deduct fees
        balanceCrypto = 0;
        trades++;
        console.log(`Sell at ${currentPrice} | Crypto: ${balanceCrypto.toFixed(4)} | USD: ${balanceUSD.toFixed(2)}`);
      } else {
        console.log(`Hold at ${currentPrice}`);
      }
    }
  
    // Final portfolio value
    const finalBalance = balanceUSD + balanceCrypto * data[data.length - 1].c;
  
    // Performance metrics
    const profit = finalBalance - initialBalance;
    const roi = (profit / initialBalance) * 100;
  
    console.log('\n--- Backtest Results ---');
    console.log(`Initial Balance: $${initialBalance.toFixed(2)}`);
    console.log(`Final Balance: $${finalBalance.toFixed(2)}`);
    console.log(`Profit: $${profit.toFixed(2)}`);
    console.log(`ROI: ${roi.toFixed(2)}%`);
    console.log(`Total Trades: ${trades}`);
  };
  
  runBot().catch(console.error);

