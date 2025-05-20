# Beauty Advisor Model

This directory contains the Python-based machine learning model for the Beauty Advisor application.

## Setup

1. Make sure you have Python installed (Python 3.8+ recommended)

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Model Description

The beauty_advisor_model.py file contains a machine learning model that:

1. Extracts facial features from uploaded images
2. Detects face shape, skin tone, eye color, and hair characteristics
3. Generates personalized beauty recommendations based on these features

## Integration with Node.js

The model is called from the Node.js backend using the child_process module to spawn a Python process.
Results are returned as JSON and saved to the database.
