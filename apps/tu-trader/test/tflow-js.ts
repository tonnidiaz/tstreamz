import { handleErrs } from '@cmn/utils/funcs';
import * as tf from '@tensorflow/tfjs-node';
(async ()=>{
try{
// Define the model architecture
const model = tf.sequential();
model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] })); // 4 features: Open, High, Low, Close
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: 2 })); // 2 outputs: Next High, Next Low

// Compile the model
model.compile({
  optimizer: 'adam',
  loss: 'meanSquaredError',
});

// Prepare the data
const trainingData = [
  // Example data (replace with your actual candlestick data)
  [[100, 105, 98, 102], [107, 97]], // [Open, High, Low, Close], [Next High, Next Low]
  [[102, 104, 100, 101], [103, 99]],
  [[101, 103, 99, 102], [105, 98]],
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

// Make predictions
const newCandle = [102, 105, 99, 104]; // New candlestick data
const newCandleTensor = tf.tensor2d([newCandle]);
const predictions = model.predict(newCandleTensor);

// Get the predicted values
const [nextHigh, nextLow] = (predictions as tf.Tensor).dataSync();
console.log('Predicted Next High:', nextHigh);
console.log('Predicted Next Low:', nextLow);
}
catch(err){
    handleErrs(err)
}})()