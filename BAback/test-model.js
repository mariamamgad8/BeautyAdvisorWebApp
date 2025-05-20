const path = require('path');
const { runBeautyAdvisorModel } = require('./utils/modelRunner');

// Test image path
const testImagePath = path.join(__dirname, 'uploads', 'sample_photo_1.jpeg');

// Test the model
console.log('Testing Beauty Advisor model...');
console.log('Using test image:', testImagePath);

runBeautyAdvisorModel(testImagePath)
  .then(result => {
    console.log('\nModel Output:');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('Error running model:', error);
  });
