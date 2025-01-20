import * as tf from '@tensorflow/tfjs-node';
import { testCandles } from './utils/conts';

// Function to calculate EMA
const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);
  let ema = [data[0]]; // Start with the first value
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
};

// Function to calculate MACD
const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  const closePrices = data.map((row) => row[3]); // Extract close prices
  const fastEMA = calculateEMA(closePrices, fastPeriod);
  const slowEMA = calculateEMA(closePrices, slowPeriod);

  const macdLine = fastEMA.map((val, idx) => val - (slowEMA[idx] || 0));
  const signalLine = calculateEMA(macdLine.slice(slowPeriod - 1), signalPeriod);

  // Add MACD values to data
  for (let i = 0; i < data.length; i++) {
    data[i][5] = macdLine[i] || 0; // Append MACD as the 6th feature
  }

  return data;
};

// Load and preprocess candlestick data
const loadCandlestickData = async () => {
  // Example candlestick data: [open, high, low, close, volume]
  const rawData = testCandles;

  // Add MACD as the 6th feature
  const dataWithMACD = calculateMACD(rawData);

  return dataWithMACD;
};

// Create training data using a sliding window
const createTrainingData = (data, windowSize) => {
  const inputs = [];
  const targets = [];

  for (let i = 0; i < data.length - windowSize; i++) {
    const input = data.slice(i, i + windowSize); // [timesteps, features]
    const target = data[i + windowSize]; // Next candlestick
    inputs.push(input); // Input: 2D array
    targets.push([target[1], target[2]]); // Target: next high and low
  }

  return { inputs, targets };
};

// Build the model
const buildModel = (inputShape) => {
  const model = tf.sequential();

  model.add(tf.layers.lstm({ units: 50, returnSequences: false, inputShape }));
  model.add(tf.layers.dense({ units: 25, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 2 })); // Output: [next_high, next_low]

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'meanSquaredError',
  });

  return model;
};

// Train the model
const trainModel = async (model, inputs, targets) => {
  console.log(`Inputs Shape: ${inputs.length} x ${inputs[0].length} x ${inputs[0][0].length}`);
  console.log(`Targets Shape: ${targets.length} x ${targets[0].length}`);

  const inputTensor = tf.tensor3d(inputs); // Shape: [number_of_samples, timesteps, features]
  const targetTensor = tf.tensor2d(targets); // Shape: [number_of_samples, 2]

  await model.fit(inputTensor, targetTensor, {
    epochs: 20,
    batchSize: 32,
    validationSplit: 0.2,
  });
};

// Predict the next high and low
const predictNext = (model, recentData) => {
  const inputTensor = tf.tensor3d([recentData]);
  const prediction = model.predict(inputTensor);
  return prediction.arraySync()[0];
};

// Main function
(async () => {
  const candlestickData = await loadCandlestickData(); // Load candlestick data with MACD
  const { inputs, targets } = createTrainingData(candlestickData, 5); // Window size of 5

  const model = buildModel([5, 6]); // 5 timesteps, 6 features
  await trainModel(model, inputs, targets);

  const recentData = candlestickData.slice(-5); // Last 5 candlesticks
  const [nextHigh, nextLow] = predictNext(model, recentData);

  console.log(`Next High: ${nextHigh}, Next Low: ${nextLow}`);
})();
