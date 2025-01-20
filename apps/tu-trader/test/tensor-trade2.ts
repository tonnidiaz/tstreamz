import * as tf from '@tensorflow/tfjs-node';
import { testCandles } from './utils/conts';

// Load and preprocess candlestick data
const loadCandlestickData = async () => {
  // Replace this with actual candlestick data loading logic
  // Each row: [open, high, low, close, volume]
  const data = testCandles

  // Normalize the data
  const normalize = (arr) => {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    return arr.map((val) => (val - min) / (max - min));
  };

  const normalizedData = data.map((row) => normalize(row));
  return data;
};

// Create training data using a sliding window
const createTrainingData = (data, windowSize) => {
  const inputs = [];
  const targets = [];
  console.log({dataLen: data.length});

  for (let i = 0; i < data.length - windowSize; i++) {
    const input = data.slice(i, i + windowSize);
    const target = data[i + windowSize];
    inputs.push(input);
    targets.push([target[1], target[2]]); // Predict high and low
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
  const inputTensor = tf.tensor3d(inputs);
  const targetTensor = tf.tensor2d(targets);

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
  const candlestickData = await loadCandlestickData();
  console.log(candlestickData[0]);
  const { inputs, targets } = createTrainingData(candlestickData, 5); // Window size of 5
  
  const model = buildModel([5, 5]); // 5 timesteps, 5 features
  await trainModel(model, inputs, targets);

  const recentData = candlestickData.slice(-5); // Last 5 candlesticks
  const [nextHigh, nextLow] = predictNext(model, recentData);
    const lastCandle = [...recentData].pop()
    console.log({lastCandle});
  console.log(`High: ${lastCandle[1]},Low: ${lastCandle[2]}`);
  console.log(`Next High: ${nextHigh}, Next Low: ${nextLow}`);
})();
