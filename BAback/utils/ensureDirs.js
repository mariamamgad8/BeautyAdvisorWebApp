/**
 * ensureDirs.js - Utility to ensure required directories exist
 */
const fs = require('fs');
const path = require('path');

// Define directories that need to exist
const requiredDirs = [
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../models/outputs')
];

// Create directories if they don't exist
const ensureDirectories = () => {
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  console.log('Directory structure verified');
};

module.exports = {
  ensureDirectories
};
