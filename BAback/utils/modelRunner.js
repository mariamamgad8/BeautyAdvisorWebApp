/**
 * modelRunner.js - Utility to run the Beauty Advisor Python model 
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Run the Beauty Advisor model on an image file
 * @param {string} imagePath - Full path to the image file
 * @returns {Promise<Object>} - Model prediction results
 */
const runBeautyAdvisorModel = (imagePath) => {
  return new Promise((resolve, reject) => {
    // Generate a unique output file path for this request
    const outputPath = path.join(
      __dirname, 
      '../models/outputs', 
      `features_${uuidv4()}.json`
    );
    
    // Ensure the outputs directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Set path to Python script
    const pythonScriptPath = path.join(
      __dirname,
      '../models/beauty_advisor_model.py'
    );

    // Spawn Python process
    const pythonProcess = spawn('python', [pythonScriptPath, imagePath, outputPath]);
    
    let dataString = '';
    let errorString = '';

    // Collect data from stdout
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    // Collect any errors
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(`Error: ${errorString}`);
        return reject(new Error(`Model execution failed: ${errorString}`));
      }
      
      try {
        // Try reading the result from JSON file first
        if (fs.existsSync(outputPath)) {
          const resultJson = fs.readFileSync(outputPath, 'utf8');
          const result = JSON.parse(resultJson);
          
          // Clean up the temp file
          fs.unlinkSync(outputPath);
          
          resolve(result);
        } 
        // Fall back to stdout if file doesn't exist
        else if (dataString) {
          const result = JSON.parse(dataString);
          resolve(result);
        } 
        else {
          reject(new Error('No output from model'));
        }
      } catch (error) {
        reject(new Error(`Failed to parse model output: ${error.message}`));
      }
    });

    // Handle process errors
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
};

module.exports = {
  runBeautyAdvisorModel
};
