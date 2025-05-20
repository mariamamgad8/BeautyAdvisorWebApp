# Beauty Advisor Setup Guide

This guide will walk you through setting up and running the Beauty Advisor application on your local machine.

## Prerequisites

- Node.js v14 or higher
- Python 3.8 or higher
- PostgreSQL database
- npm or yarn package manager

## Step 1: Set Up the Database

1. Create a PostgreSQL database for the application:
   ```sql
   CREATE DATABASE beauty_advisor_db;
   ```

2. Update the `DATABASE_URL` in `BAback/.env` with your PostgreSQL connection string.

## Step 2: Set Up the Backend

1. Navigate to the backend directory:
   ```
   cd BAback
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Install Python dependencies:
   ```
   pip install -r models/requirements.txt
   ```

4. Run Prisma migrations to set up the database schema:
   ```
   npx prisma migrate deploy
   ```

5. Run the test script to verify the model integration:
   ```
   node test-integration.js
   ```

6. Start the backend server:
   ```
   npm start
   ```

## Step 3: Set Up the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```
   cd BAfront
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

4. The application should now be running and accessible at `http://localhost:3000`

## Step 4: Using the Application

1. Register a new user account
2. Upload a photo on the Upload page
3. After upload, you'll be redirected to generate recommendations
4. View your personalized beauty recommendations

## Troubleshooting

- If the model fails to run, ensure Python and required libraries (OpenCV, MediaPipe, NumPy) are correctly installed
- If images aren't displaying, check that the REACT_APP_API_URL in `BAfront/.env` is set correctly
- For database issues, verify your PostgreSQL connection string and database permissions

## Additional Information

- Backend API is available at `http://localhost:3000/api`
- Frontend development server runs on `http://localhost:3001`
