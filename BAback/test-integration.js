/**
 * Test script for the beauty advisor model integration
 * 
 * To run this test:
 * 1. Ensure Python and all dependencies are installed (pip install -r models/requirements.txt)
 * 2. Run: node test-integration.js
 */
require('dotenv').config();
const path = require('path');
const { runBeautyAdvisorModel } = require('./utils/modelRunner');

// Define test images
const testImages = [
  path.join(__dirname, 'uploads', 'sample_photo_1.jpeg'),
  "C:\\Users\\roaaa\\Downloads\\images.jpeg",
  // Add more test images here if available
];

// Test each image
async function testModel() {
  console.log('==== Beauty Advisor Model Integration Test ====\n');
  
  for (let i = 0; i < testImages.length; i++) {
    const imagePath = testImages[i];
    console.log(`Testing image ${i + 1}: ${imagePath}`);
      try {
      const startTime = Date.now();
      const result = await runBeautyAdvisorModel(imagePath);
      const endTime = Date.now();
      
      console.log(`\n✓ Model successfully processed image in ${(endTime - startTime) / 1000} seconds`);
      console.log('\nModel output:');
      console.log(JSON.stringify(result, null, 2));
      
      if (result.error) {
        console.log(`\n✗ Model error: ${result.error}`);
      } else if (result.features) {
        console.log('\nFeatures detected:');
        console.log(`- Face Shape: ${result.features.face_shape}`);
        console.log(`- Hair Texture: ${result.features.hair_texture}`);
        
        console.log('\nRecommendations:');
        console.log(`- Makeup: ${result.recommendations.makeup}`);
        console.log(`- Hair Style: ${result.recommendations.hair_style}`);
      } else {
        // Direct features (not wrapped in 'features' object)
        console.log('\nFeatures detected:');
        console.log(`- Face Shape: ${result.face_shape}`);
        console.log(`- Hair Texture: ${result.hair_texture}`);
          // Create recommendations if they don't exist
        if (!result.recommendations) {
          console.log('Generating recommendations based on detected features...');
          
          // Example of properly formatted recommendations
          let makeupRec = 'No makeup recommendations available';
          if (result.face_shape && result.skin_tone_rgb) {
            const skinBrightness = (result.skin_tone_rgb[0] + result.skin_tone_rgb[1] + result.skin_tone_rgb[2]) / 3;
            
            if (result.face_shape === 'Oval') {
              makeupRec = `For your oval face, most makeup styles work well. ${skinBrightness < 150 ? 
                'Use warm foundation shades and peach or coral blush.' : 
                'Try neutral or cool-toned foundation and rose or pink blush.'}`;
            } else if (result.face_shape === 'Round') {
              makeupRec = `For your round face, use contouring to define cheekbones. ${skinBrightness < 150 ? 
                'Warm brown and bronze tones will complement your skin.' : 
                'Taupe and cooler tones for contouring will work well.'}`;
            } else if (result.face_shape === 'Square') {
              makeupRec = `For your square face, soften angles with rounded contouring. ${skinBrightness < 150 ? 
                'Warm bronzer applied in circular motions works well.' : 
                'Rose-toned blush applied in circular motions works well.'}`;
            }
          }
          
          let hairRec = 'No hairstyle recommendations available';
          if (result.face_shape && result.hair_texture) {
            if (result.face_shape === 'Oval') {
              hairRec = `With your oval face shape, most styles work well. ${result.hair_texture.includes('Curly') ? 
                'Embrace your natural curls with a layered cut that adds volume.' : 
                'Try waves, layered bobs, or curtain bangs to enhance your natural texture.'}`;
            } else if (result.face_shape === 'Round') {
              hairRec = `For your round face, styles that add length work best. ${result.hair_texture.includes('Curly') ? 
                'A longer curly shag with layers will elongate your face.' : 
                'Long layers or volume at the crown will create more definition.'}`;
            } else if (result.face_shape === 'Square') {
              hairRec = `For your square face, styles that soften your jawline are ideal. ${result.hair_texture.includes('Curly') ? 
                'Soft curly layers around the face will balance your features.' : 
                'Soft layers and waves will complement your face shape.'}`;
            }
          }
          
          const recommendations = {
            makeup: makeupRec,
            hair_style: hairRec
          };
          result.recommendations = recommendations;
        }
        
        console.log('\nRecommendations:');
        console.log(`- Makeup: ${result.recommendations.makeup}`);
        console.log(`- Hair Style: ${result.recommendations.hair_style}`);
      }
      console.log('\n---------------------------------------\n');
    } catch (error) {
      console.error(`✗ Error processing image ${i + 1}:`, error.message);
      console.error('Stack trace:', error.stack);
      console.error('\n---------------------------------------\n');
    }
  }
  
  console.log('Test completed!');
}

// Run tests
testModel().catch(err => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
